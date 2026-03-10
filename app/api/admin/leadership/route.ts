import { Locale, QualificationType, RoleName } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

import { requireRole } from "@/lib/admin-api";
import { writeAuditLog } from "@/lib/audit";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const guard = requireRole(request, [RoleName.ADMIN, RoleName.EDITOR, RoleName.HR]);
  if (guard.error) return guard.error;

  const items = await prisma.leadershipProfile.findMany({
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
      slug?: string;
      sortOrder?: number;
      photoUrl?: string;
      qualificationType?: QualificationType;
      isActive?: boolean;
      fullNameEn?: string;
      fullNameId?: string;
      roleTitleEn?: string;
      roleTitleId?: string;
      bioEn?: string;
      bioId?: string;
    };

    if (!body.slug || !body.fullNameEn || !body.fullNameId || !body.roleTitleEn || !body.roleTitleId) {
      return NextResponse.json({ error: "slug, fullNameEn/fullNameId, roleTitleEn/roleTitleId are required." }, { status: 422 });
    }

    const profile = await prisma.leadershipProfile.create({
      data: {
        slug: body.slug,
        sortOrder: body.sortOrder ?? 999,
        photoUrl: body.photoUrl || null,
        qualificationType: body.qualificationType || QualificationType.ENGINEERING,
        isActive: body.isActive ?? true,
        translations: {
          create: [
            {
              locale: Locale.en,
              fullName: body.fullNameEn,
              roleTitle: body.roleTitleEn,
              bio: body.bioEn || null,
            },
            {
              locale: Locale.id,
              fullName: body.fullNameId,
              roleTitle: body.roleTitleId,
              bio: body.bioId || null,
            },
          ],
        },
      },
      include: { translations: true },
    });

    await writeAuditLog({
      actorUserId: guard.session?.userId,
      action: "CREATE",
      entityType: "LeadershipProfile",
      entityId: profile.id,
      afterJson: profile,
    });

    return NextResponse.json(profile, { status: 201 });
  } catch (error) {
    console.error("POST /api/admin/leadership failed:", error);
    return NextResponse.json({ error: "Failed to create leadership profile." }, { status: 500 });
  }
}
