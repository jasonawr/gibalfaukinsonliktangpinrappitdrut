import { JobStatus } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

import { firstTranslation, getLocale, getPublicJobStatus, jsonError } from "@/lib/api";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const locale = getLocale(request);
    const statusFilter = getPublicJobStatus(request);

    if (request.nextUrl.searchParams.get("status") && !statusFilter) {
      return jsonError("Invalid status value. Use open, closed, or draft.");
    }

    const jobs = await prisma.job.findMany({
      where: statusFilter ? { status: statusFilter } : { status: JobStatus.OPEN },
      orderBy: [{ postedAt: "desc" }, { createdAt: "desc" }],
      include: {
        translations: true,
      },
    });

    const items = jobs
      .map((job) => {
        const translation = firstTranslation(job.translations, locale);
        if (!translation) return null;

        return {
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
        };
      })
      .filter(Boolean);

    return NextResponse.json({ items });
  } catch (error) {
    console.error("GET /api/public/jobs failed:", error);
    return jsonError("Internal server error.", 500);
  }
}
