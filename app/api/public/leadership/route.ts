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
    const profiles = await prisma.leadershipProfile.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
      include: { translations: true },
    });

    const items = profiles
      .map((profile) => {
        const translation =
          profile.translations.find((item) => item.locale === locale) ||
          profile.translations.find((item) => item.locale === Locale.en) ||
          profile.translations[0];

        if (!translation) return null;

        return {
          id: profile.id,
          slug: profile.slug,
          sortOrder: profile.sortOrder,
          photoUrl: profile.photoUrl,
          qualificationType: profile.qualificationType,
          locale: translation.locale,
          fullName: translation.fullName,
          roleTitle: translation.roleTitle,
          bio: translation.bio,
        };
      })
      .filter(Boolean);

    return NextResponse.json({ items });
  } catch (error) {
    console.error("GET /api/public/leadership failed:", error);
    return jsonError("Internal server error.", 500);
  }
}
