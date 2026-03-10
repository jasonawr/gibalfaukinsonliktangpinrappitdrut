import { Locale, PublishStatus } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

import { jsonError } from "@/lib/api";
import { prisma } from "@/lib/prisma";

type Params = {
  params: Promise<{ slug: string }>;
};

function getLocale(request: NextRequest): Locale {
  const locale = request.nextUrl.searchParams.get("locale");
  return locale === "id" ? Locale.id : Locale.en;
}

export async function GET(request: NextRequest, context: Params) {
  try {
    const { slug } = await context.params;
    const locale = getLocale(request);

    const post = await prisma.newsPost.findFirst({
      where: { slug, status: PublishStatus.PUBLISHED },
      include: { translations: true },
    });

    if (!post) return jsonError("News not found.", 404);

    const translation =
      post.translations.find((item) => item.locale === locale) ||
      post.translations.find((item) => item.locale === Locale.en) ||
      post.translations[0];

    if (!translation) return jsonError("No translation found for this post.", 404);

    return NextResponse.json({
      id: post.id,
      slug: post.slug,
      featuredImageUrl: post.featuredImageUrl,
      publishedAt: post.publishedAt,
      locale: translation.locale,
      title: translation.title,
      excerpt: translation.excerpt,
      content: translation.content,
      seoTitle: translation.seoTitle,
      seoDescription: translation.seoDescription,
    });
  } catch (error) {
    console.error("GET /api/public/news/[slug] failed:", error);
    return jsonError("Internal server error.", 500);
  }
}
