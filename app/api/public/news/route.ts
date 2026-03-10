import { Locale, PublishStatus } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

import { jsonError } from "@/lib/api";
import { prisma } from "@/lib/prisma";

function getLocale(request: NextRequest): Locale {
  const locale = request.nextUrl.searchParams.get("locale");
  return locale === "id" ? Locale.id : Locale.en;
}

export async function GET(request: NextRequest) {
  try {
    const locale = getLocale(request);

    const posts = await prisma.newsPost.findMany({
      where: { status: PublishStatus.PUBLISHED },
      include: { translations: true },
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    });

    const items = posts
      .map((post) => {
        const translation =
          post.translations.find((item) => item.locale === locale) ||
          post.translations.find((item) => item.locale === Locale.en) ||
          post.translations[0];

        if (!translation) return null;

        return {
          id: post.id,
          slug: post.slug,
          featuredImageUrl: post.featuredImageUrl,
          publishedAt: post.publishedAt,
          locale: translation.locale,
          title: translation.title,
          excerpt: translation.excerpt,
        };
      })
      .filter(Boolean);

    return NextResponse.json({ items });
  } catch (error) {
    console.error("GET /api/public/news failed:", error);
    return jsonError("Internal server error.", 500);
  }
}
