import { JobStatus, Locale, RoleName } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

import { requireRole } from "@/lib/admin-api";
import { writeAuditLog } from "@/lib/audit";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const guard = requireRole(request, [RoleName.ADMIN, RoleName.EDITOR, RoleName.HR]);
  if (guard.error) return guard.error;

  const items = await prisma.job.findMany({
    include: { translations: true, applications: true },
    orderBy: { updatedAt: "desc" },
  });
  return NextResponse.json({ items });
}

export async function POST(request: NextRequest) {
  const guard = requireRole(request, [RoleName.ADMIN, RoleName.EDITOR]);
  if (guard.error) return guard.error;

  try {
    const body = (await request.json()) as {
      slug?: string;
      department?: string;
      location?: string;
      employmentType?: string;
      status?: JobStatus;
      titleEn?: string;
      titleId?: string;
      descriptionEn?: unknown;
      descriptionId?: unknown;
      requirementsEn?: unknown;
      requirementsId?: unknown;
    };

    if (!body.slug || !body.department || !body.location || !body.employmentType || !body.titleEn || !body.titleId) {
      return NextResponse.json({ error: "slug, department, location, employmentType, titleEn, and titleId are required." }, { status: 422 });
    }

    const job = await prisma.job.create({
      data: {
        slug: body.slug,
        department: body.department,
        location: body.location,
        employmentType: body.employmentType,
        status: body.status || JobStatus.DRAFT,
        postedAt: body.status === JobStatus.OPEN ? new Date() : null,
        translations: {
          create: [
            {
              locale: Locale.en,
              title: body.titleEn,
              description: body.descriptionEn || {},
              requirements: body.requirementsEn || {},
            },
            {
              locale: Locale.id,
              title: body.titleId,
              description: body.descriptionId || {},
              requirements: body.requirementsId || {},
            },
          ],
        },
      },
      include: { translations: true },
    });

    await writeAuditLog({
      actorUserId: guard.session?.userId,
      action: "CREATE",
      entityType: "Job",
      entityId: job.id,
      afterJson: job,
    });

    return NextResponse.json(job, { status: 201 });
  } catch (error) {
    console.error("POST /api/admin/jobs failed:", error);
    return NextResponse.json({ error: "Failed to create job." }, { status: 500 });
  }
}
