import { Locale, QualificationType, RoleName } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

import { requireRole } from "@/lib/admin-api";
import { writeAuditLog } from "@/lib/audit";
import { prisma } from "@/lib/prisma";

type Params = {
  params: Promise<{ id: string }>;
};

export async function PUT(request: NextRequest, context: Params) {
  const guard = requireRole(request, [RoleName.ADMIN, RoleName.EDITOR]);
  if (guard.error) return guard.error;

  const { id } = await context.params;

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

    const current = await prisma.leadershipProfile.findUnique({
      where: { id },
      include: { translations: true },
    });
    if (!current) return NextResponse.json({ error: "Leadership profile not found." }, { status: 404 });

    const updated = await prisma.leadershipProfile.update({
      where: { id },
      data: {
        slug: body.slug ?? current.slug,
        sortOrder: body.sortOrder ?? current.sortOrder,
        photoUrl: body.photoUrl ?? current.photoUrl,
        qualificationType: body.qualificationType ?? current.qualificationType,
        isActive: body.isActive ?? current.isActive,
      },
      include: { translations: true },
    });

    if (body.fullNameEn || body.roleTitleEn || body.bioEn) {
      await prisma.leadershipTranslation.upsert({
        where: { profileId_locale: { profileId: id, locale: Locale.en } },
        update: {
          fullName:
            body.fullNameEn ??
            current.translations.find((item) => item.locale === Locale.en)?.fullName ??
            "Unknown",
          roleTitle:
            body.roleTitleEn ??
            current.translations.find((item) => item.locale === Locale.en)?.roleTitle ??
            "Unknown",
          bio:
            body.bioEn ??
            current.translations.find((item) => item.locale === Locale.en)?.bio ??
            null,
        },
        create: {
          profileId: id,
          locale: Locale.en,
          fullName: body.fullNameEn || "Unknown",
          roleTitle: body.roleTitleEn || "Unknown",
          bio: body.bioEn || null,
        },
      });
    }

    if (body.fullNameId || body.roleTitleId || body.bioId) {
      await prisma.leadershipTranslation.upsert({
        where: { profileId_locale: { profileId: id, locale: Locale.id } },
        update: {
          fullName:
            body.fullNameId ??
            current.translations.find((item) => item.locale === Locale.id)?.fullName ??
            "Unknown",
          roleTitle:
            body.roleTitleId ??
            current.translations.find((item) => item.locale === Locale.id)?.roleTitle ??
            "Unknown",
          bio:
            body.bioId ??
            current.translations.find((item) => item.locale === Locale.id)?.bio ??
            null,
        },
        create: {
          profileId: id,
          locale: Locale.id,
          fullName: body.fullNameId || "Unknown",
          roleTitle: body.roleTitleId || "Unknown",
          bio: body.bioId || null,
        },
      });
    }

    const result = await prisma.leadershipProfile.findUnique({
      where: { id },
      include: { translations: true },
    });

    await writeAuditLog({
      actorUserId: guard.session?.userId,
      action: "UPDATE",
      entityType: "LeadershipProfile",
      entityId: id,
      beforeJson: current,
      afterJson: result ?? updated,
    });

    return NextResponse.json(result ?? updated);
  } catch (error) {
    console.error("PUT /api/admin/leadership/[id] failed:", error);
    return NextResponse.json({ error: "Failed to update leadership profile." }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, context: Params) {
  const guard = requireRole(request, [RoleName.ADMIN, RoleName.EDITOR]);
  if (guard.error) return guard.error;
  const { id } = await context.params;

  try {
    const current = await prisma.leadershipProfile.findUnique({
      where: { id },
      include: { translations: true },
    });
    if (!current) {
      return NextResponse.json({ error: "Leadership profile not found." }, { status: 404 });
    }

    await prisma.leadershipProfile.delete({ where: { id } });

    await writeAuditLog({
      actorUserId: guard.session?.userId,
      action: "DELETE",
      entityType: "LeadershipProfile",
      entityId: id,
      beforeJson: current,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("DELETE /api/admin/leadership/[id] failed:", error);
    return NextResponse.json(
      { error: "Failed to delete leadership profile." },
      { status: 500 },
    );
  }
}
