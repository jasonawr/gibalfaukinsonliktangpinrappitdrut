import { NextRequest, NextResponse } from "next/server";

import { firstTranslation, getLocale, jsonError } from "@/lib/api";
import { prisma } from "@/lib/prisma";

type Params = {
  params: Promise<{ slug: string }>;
};

export async function GET(request: NextRequest, context: Params) {
  try {
    const { slug } = await context.params;
    const locale = getLocale(request);

    const job = await prisma.job.findUnique({
      where: { slug },
      include: { translations: true },
    });

    if (!job) {
      return jsonError("Job not found.", 404);
    }

    const translation = firstTranslation(job.translations, locale);
    if (!translation) {
      return jsonError("No translation available for this job.", 404);
    }

    return NextResponse.json({
      id: job.id,
      slug: job.slug,
      department: job.department,
      location: job.location,
      employmentType: job.employmentType,
      status: job.status,
      postedAt: job.postedAt,
      closedAt: job.closedAt,
      locale: translation.locale,
      title: translation.title,
      description: translation.description,
      requirements: translation.requirements,
    });
  } catch (error) {
    console.error("GET /api/public/jobs/[slug] failed:", error);
    return jsonError("Internal server error.", 500);
  }
}
