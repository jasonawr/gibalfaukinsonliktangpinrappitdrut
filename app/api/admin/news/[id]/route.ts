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
  const body = (await request.json()) as {
    slug?: string;
    status?: PublishStatus;
    featuredImageUrl?: string;
    titleEn?: string;
    titleId?: string;
    excerptEn?: string;
    excerptId?: string;
    contentEn?: unknown;
    contentId?: unknown;
  };

  const current = await prisma.newsPost.findUnique({
    where: { id },
    include: { translations: true },
  });
  if (!current) return NextResponse.json({ error: "News post not found." }, { status: 404 });

  const status = body.status ?? current.status;

  const updated = await prisma.newsPost.update({
    where: { id },
    data: {
      slug: body.slug ?? current.slug,
      status,
      featuredImageUrl: body.featuredImageUrl ?? current.featuredImageUrl,
      publishedAt: status === PublishStatus.PUBLISHED ? current.publishedAt || new Date() : null,
    },
    include: { translations: true },
  });

  if (body.titleEn || body.excerptEn || body.contentEn) {
    await prisma.newsTranslation.upsert({
      where: { newsId_locale: { newsId: id, locale: Locale.en } },
      update: {
        title:
          body.titleEn ??
          current.translations.find((item) => item.locale === Locale.en)?.title ??
          "Untitled",
        excerpt:
          body.excerptEn ??
          current.translations.find((item) => item.locale === Locale.en)?.excerpt ??
          null,
        content:
          body.contentEn ??
          current.translations.find((item) => item.locale === Locale.en)?.content ??
          {},
      },
      create: {
        newsId: id,
        locale: Locale.en,
        title: body.titleEn || "Untitled",
        excerpt: body.excerptEn || null,
        content: body.contentEn || {},
      },
    });
  }

  if (body.titleId || body.excerptId || body.contentId) {
    await prisma.newsTranslation.upsert({
      where: { newsId_locale: { newsId: id, locale: Locale.id } },
      update: {
        title:
          body.titleId ??
          current.translations.find((item) => item.locale === Locale.id)?.title ??
          "Tanpa Judul",
        excerpt:
          body.excerptId ??
          current.translations.find((item) => item.locale === Locale.id)?.excerpt ??
          null,
        content:
          body.contentId ??
          current.translations.find((item) => item.locale === Locale.id)?.content ??
          {},
      },
      create: {
        newsId: id,
        locale: Locale.id,
        title: body.titleId || "Tanpa Judul",
        excerpt: body.excerptId || null,
        content: body.contentId || {},
      },
    });
  }

  const result = await prisma.newsPost.findUnique({
    where: { id },
    include: { translations: true },
  });

  await writeAuditLog({
    actorUserId: guard.session?.userId,
    action: "UPDATE",
    entityType: "NewsPost",
    entityId: id,
    beforeJson: current,
    afterJson: result ?? updated,
  });

  return NextResponse.json(result ?? updated);
}

export async function DELETE(request: NextRequest, context: Params) {
  const guard = requireRole(request, [RoleName.ADMIN, RoleName.EDITOR]);
  if (guard.error) return guard.error;
  const { id } = await context.params;

  try {
    const current = await prisma.newsPost.findUnique({
      where: { id },
      include: { translations: true },
    });
    if (!current) return NextResponse.json({ error: "News post not found." }, { status: 404 });

    await prisma.newsPost.delete({ where: { id } });

    await writeAuditLog({
      actorUserId: guard.session?.userId,
      action: "DELETE",
      entityType: "NewsPost",
      entityId: id,
      beforeJson: current,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("DELETE /api/admin/news/[id] failed:", error);
    return NextResponse.json({ error: "Failed to delete news post." }, { status: 500 });
  }
}
