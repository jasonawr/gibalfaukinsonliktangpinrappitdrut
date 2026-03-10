import { Locale, RoleName } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

import { requireRole } from "@/lib/admin-api";
import { writeAuditLog } from "@/lib/audit";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const guard = requireRole(request, [RoleName.ADMIN, RoleName.EDITOR]);
  if (guard.error) return guard.error;

  const items = await prisma.industrySector.findMany({
    include: { translations: true },
    orderBy: { sortOrder: "asc" },
  });
  return NextResponse.json({ items });
}

export async function POST(request: NextRequest) {
  const guard = requireRole(request, [RoleName.ADMIN, RoleName.EDITOR]);
  if (guard.error) return guard.error;

  try {
    const body = (await request.json()) as {
      key?: string;
      sortOrder?: number;
      isActive?: boolean;
      nameEn?: string;
      nameId?: string;
      summaryEn?: string;
      summaryId?: string;
      contentEn?: unknown;
      contentId?: unknown;
    };

    if (!body.key || !body.nameEn || !body.nameId) {
      return NextResponse.json({ error: "key, nameEn, and nameId are required." }, { status: 422 });
    }

    const industry = await prisma.industrySector.create({
      data: {
        key: body.key,
        sortOrder: body.sortOrder ?? 999,
        isActive: body.isActive ?? true,
        translations: {
          create: [
            {
              locale: Locale.en,
              name: body.nameEn,
              summary: body.summaryEn || null,
              content: body.contentEn || {},
            },
            {
              locale: Locale.id,
              name: body.nameId,
              summary: body.summaryId || null,
              content: body.contentId || {},
            },
          ],
        },
      },
      include: { translations: true },
    });

    await writeAuditLog({
      actorUserId: guard.session?.userId,
      action: "CREATE",
      entityType: "IndustrySector",
      entityId: industry.id,
      afterJson: industry,
    });

    return NextResponse.json(industry, { status: 201 });
  } catch (error) {
    console.error("POST /api/admin/industries failed:", error);
    return NextResponse.json({ error: "Failed to create industry." }, { status: 500 });
  }
}
