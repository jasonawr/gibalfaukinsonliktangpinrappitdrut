import { Locale } from "@prisma/client";
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
    const sectors = await prisma.industrySector.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
      include: { translations: true },
    });

    const items = sectors
      .map((sector) => {
        const translation =
          sector.translations.find((item) => item.locale === locale) ||
          sector.translations.find((item) => item.locale === Locale.en) ||
          sector.translations[0];

        if (!translation) return null;
        return {
          id: sector.id,
          key: sector.key,
          sortOrder: sector.sortOrder,
          locale: translation.locale,
          name: translation.name,
          summary: translation.summary,
          content: translation.content,
        };
      })
      .filter(Boolean);

    return NextResponse.json({ items });
  } catch (error) {
    console.error("GET /api/public/industries failed:", error);
    return jsonError("Internal server error.", 500);
  }
}
