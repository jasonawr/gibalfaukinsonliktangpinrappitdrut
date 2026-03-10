import { Locale, PublishStatus, RoleName } from "@prisma/client";
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
      status?: PublishStatus;
      titleEn?: string;
      titleId?: string;
      bodyEn?: unknown;
      bodyId?: unknown;
    };

    const current = await prisma.page.findUnique({
      where: { id },
      include: { translations: true },
    });
    if (!current) return NextResponse.json({ error: "Page not found." }, { status: 404 });

    const updated = await prisma.page.update({
      where: { id },
      data: {
        slug: body.slug ?? current.slug,
        status: body.status ?? current.status,
        updatedBy: guard.session?.userId,
        publishedAt:
          (body.status ?? current.status) === PublishStatus.PUBLISHED
            ? current.publishedAt || new Date()
            : null,
      },
      include: { translations: true },
    });

    if (body.titleEn || body.bodyEn) {
      await prisma.pageTranslation.upsert({
        where: { pageId_locale: { pageId: id, locale: Locale.en } },
        update: {
          title:
            body.titleEn ??
            current.translations.find((item) => item.locale === Locale.en)?.title ??
            "Untitled",
          body:
            body.bodyEn ??
            current.translations.find((item) => item.locale === Locale.en)?.body ??
            {},
        },
        create: {
          pageId: id,
          locale: Locale.en,
          title: body.titleEn || "Untitled",
          body: body.bodyEn || {},
        },
      });
    }

    if (body.titleId || body.bodyId) {
      await prisma.pageTranslation.upsert({
        where: { pageId_locale: { pageId: id, locale: Locale.id } },
        update: {
          title:
            body.titleId ??
            current.translations.find((item) => item.locale === Locale.id)?.title ??
            "Tanpa Judul",
          body:
            body.bodyId ??
            current.translations.find((item) => item.locale === Locale.id)?.body ??
            {},
        },
        create: {
          pageId: id,
          locale: Locale.id,
          title: body.titleId || "Tanpa Judul",
          body: body.bodyId || {},
        },
      });
    }

    const withTranslations = await prisma.page.findUnique({
      where: { id },
      include: { translations: true },
    });

    await writeAuditLog({
      actorUserId: guard.session?.userId,
      action: "UPDATE",
      entityType: "Page",
      entityId: id,
      beforeJson: current,
      afterJson: withTranslations ?? updated,
    });

    return NextResponse.json(withTranslations ?? updated);
  } catch (error) {
    console.error("PUT /api/admin/pages/[id] failed:", error);
    return NextResponse.json({ error: "Failed to update page." }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, context: Params) {
  const guard = requireRole(request, [RoleName.ADMIN, RoleName.EDITOR]);
  if (guard.error) return guard.error;
  const { id } = await context.params;

  try {
    const current = await prisma.page.findUnique({
      where: { id },
      include: { translations: true },
    });
    if (!current) return NextResponse.json({ error: "Page not found." }, { status: 404 });

    await prisma.page.delete({ where: { id } });

    await writeAuditLog({
      actorUserId: guard.session?.userId,
      action: "DELETE",
      entityType: "Page",
      entityId: id,
      beforeJson: current,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("DELETE /api/admin/pages/[id] failed:", error);
    return NextResponse.json({ error: "Failed to delete page." }, { status: 500 });
  }
}
