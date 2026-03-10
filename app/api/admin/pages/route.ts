import { Locale, PublishStatus, RoleName } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

import { requireRole } from "@/lib/admin-api";
import { writeAuditLog } from "@/lib/audit";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const guard = requireRole(request, [RoleName.ADMIN, RoleName.EDITOR]);
  if (guard.error) return guard.error;

  const items = await prisma.page.findMany({
    include: { translations: true },
    orderBy: { updatedAt: "desc" },
  });
  return NextResponse.json({ items });
}

export async function POST(request: NextRequest) {
  const guard = requireRole(request, [RoleName.ADMIN, RoleName.EDITOR]);
  if (guard.error) return guard.error;

  try {
    const body = (await request.json()) as {
      slug?: string;
      status?: PublishStatus;
      titleEn?: string;
      titleId?: string;
      bodyEn?: unknown;
      bodyId?: unknown;
    };

    if (!body.slug || !body.titleEn || !body.titleId) {
      return NextResponse.json({ error: "slug, titleEn, and titleId are required." }, { status: 422 });
    }

    const page = await prisma.page.create({
      data: {
        slug: body.slug,
        status: body.status || PublishStatus.DRAFT,
        createdBy: guard.session?.userId,
        updatedBy: guard.session?.userId,
        translations: {
          create: [
            {
              locale: Locale.en,
              title: body.titleEn,
              body: body.bodyEn || {},
            },
            {
              locale: Locale.id,
              title: body.titleId,
              body: body.bodyId || {},
            },
          ],
        },
      },
      include: { translations: true },
    });

    await writeAuditLog({
      actorUserId: guard.session?.userId,
      action: "CREATE",
      entityType: "Page",
      entityId: page.id,
      afterJson: page,
    });

    return NextResponse.json(page, { status: 201 });
  } catch (error) {
    console.error("POST /api/admin/pages failed:", error);
    return NextResponse.json({ error: "Failed to create page." }, { status: 500 });
  }
}
