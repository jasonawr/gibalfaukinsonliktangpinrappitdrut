import { Locale, PublishStatus, RoleName } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

import { requireRole } from "@/lib/admin-api";
import { writeAuditLog } from "@/lib/audit";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const guard = requireRole(request, [RoleName.ADMIN, RoleName.EDITOR]);
  if (guard.error) return guard.error;

  const items = await prisma.newsPost.findMany({
    include: { translations: true, author: true },
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json({ items });
}

export async function POST(request: NextRequest) {
  const guard = requireRole(request, [RoleName.ADMIN, RoleName.EDITOR]);
  if (guard.error) return guard.error;

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

  if (!body.slug || !body.titleEn || !body.titleId || !guard.session) {
    return NextResponse.json({ error: "slug, titleEn, and titleId are required." }, { status: 422 });
  }

  const news = await prisma.newsPost.create({
    data: {
      slug: body.slug,
      status: body.status || PublishStatus.DRAFT,
      featuredImageUrl: body.featuredImageUrl || null,
      authorId: guard.session.userId,
      publishedAt: body.status === PublishStatus.PUBLISHED ? new Date() : null,
      translations: {
        create: [
          {
            locale: Locale.en,
            title: body.titleEn,
            excerpt: body.excerptEn || null,
            content: body.contentEn || {},
          },
          {
            locale: Locale.id,
            title: body.titleId,
            excerpt: body.excerptId || null,
            content: body.contentId || {},
          },
        ],
      },
    },
    include: { translations: true },
  });

  await writeAuditLog({
    actorUserId: guard.session.userId,
    action: "CREATE",
    entityType: "NewsPost",
    entityId: news.id,
    afterJson: news,
  });

  return NextResponse.json(news, { status: 201 });
}
