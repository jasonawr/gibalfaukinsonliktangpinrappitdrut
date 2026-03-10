import { Locale, RoleName } from "@prisma/client";
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

    const current = await prisma.industrySector.findUnique({
      where: { id },
      include: { translations: true },
    });
    if (!current) return NextResponse.json({ error: "Industry not found." }, { status: 404 });

    const updated = await prisma.industrySector.update({
      where: { id },
      data: {
        key: body.key ?? current.key,
        sortOrder: body.sortOrder ?? current.sortOrder,
        isActive: body.isActive ?? current.isActive,
      },
      include: { translations: true },
    });

    if (body.nameEn || body.summaryEn || body.contentEn) {
      await prisma.industryTranslation.upsert({
        where: { industryId_locale: { industryId: id, locale: Locale.en } },
        update: {
          name:
            body.nameEn ??
            current.translations.find((item) => item.locale === Locale.en)?.name ??
            "Untitled",
          summary:
            body.summaryEn ??
            current.translations.find((item) => item.locale === Locale.en)?.summary ??
            null,
          content:
            body.contentEn ??
            current.translations.find((item) => item.locale === Locale.en)?.content ??
            {},
        },
        create: {
          industryId: id,
          locale: Locale.en,
          name: body.nameEn || "Untitled",
          summary: body.summaryEn || null,
          content: body.contentEn || {},
        },
      });
    }

    if (body.nameId || body.summaryId || body.contentId) {
      await prisma.industryTranslation.upsert({
        where: { industryId_locale: { industryId: id, locale: Locale.id } },
        update: {
          name:
            body.nameId ??
            current.translations.find((item) => item.locale === Locale.id)?.name ??
            "Tanpa Judul",
          summary:
            body.summaryId ??
            current.translations.find((item) => item.locale === Locale.id)?.summary ??
            null,
          content:
            body.contentId ??
            current.translations.find((item) => item.locale === Locale.id)?.content ??
            {},
        },
        create: {
          industryId: id,
          locale: Locale.id,
          name: body.nameId || "Tanpa Judul",
          summary: body.summaryId || null,
          content: body.contentId || {},
        },
      });
    }

    const result = await prisma.industrySector.findUnique({
      where: { id },
      include: { translations: true },
    });

    await writeAuditLog({
      actorUserId: guard.session?.userId,
      action: "UPDATE",
      entityType: "IndustrySector",
      entityId: id,
      beforeJson: current,
      afterJson: result ?? updated,
    });

    return NextResponse.json(result ?? updated);
  } catch (error) {
    console.error("PUT /api/admin/industries/[id] failed:", error);
    return NextResponse.json({ error: "Failed to update industry." }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, context: Params) {
  const guard = requireRole(request, [RoleName.ADMIN, RoleName.EDITOR]);
  if (guard.error) return guard.error;
  const { id } = await context.params;

  try {
    const current = await prisma.industrySector.findUnique({
      where: { id },
      include: { translations: true },
    });
    if (!current) return NextResponse.json({ error: "Industry not found." }, { status: 404 });

    await prisma.industrySector.delete({ where: { id } });

    await writeAuditLog({
      actorUserId: guard.session?.userId,
      action: "DELETE",
      entityType: "IndustrySector",
      entityId: id,
      beforeJson: current,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("DELETE /api/admin/industries/[id] failed:", error);
    return NextResponse.json({ error: "Failed to delete industry." }, { status: 500 });
  }
}
