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

    const page = await prisma.page.findFirst({
      where: { slug, status: PublishStatus.PUBLISHED },
      include: { translations: true },
    });

    if (!page) return jsonError("Page not found.", 404);

    const translation =
      page.translations.find((item) => item.locale === locale) ||
      page.translations.find((item) => item.locale === Locale.en) ||
      page.translations[0];

    if (!translation) return jsonError("No page translation found.", 404);

    return NextResponse.json({
      id: page.id,
      slug: page.slug,
      status: page.status,
      locale: translation.locale,
      title: translation.title,
      body: translation.body,
      seoTitle: translation.seoTitle,
      seoDescription: translation.seoDescription,
    });
  } catch (error) {
    console.error("GET /api/public/pages/[slug] failed:", error);
    return jsonError("Internal server error.", 500);
  }
}
