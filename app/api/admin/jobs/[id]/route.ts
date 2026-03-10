import { JobStatus, Locale, RoleName } from "@prisma/client";
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

  try {
    const body = (await request.json()) as {
      slug?: string;
      department?: string;
      location?: string;
      employmentType?: string;
      status?: JobStatus;
      postedAt?: string;
      closedAt?: string | null;
      titleEn?: string;
      titleId?: string;
      descriptionEn?: unknown;
      descriptionId?: unknown;
      requirementsEn?: unknown;
      requirementsId?: unknown;
    };

    const current = await prisma.job.findUnique({
      where: { id },
      include: { translations: true },
    });
    if (!current) return NextResponse.json({ error: "Job not found." }, { status: 404 });

    const status = body.status ?? current.status;

    const updated = await prisma.job.update({
      where: { id },
      data: {
        slug: body.slug ?? current.slug,
        department: body.department ?? current.department,
        location: body.location ?? current.location,
        employmentType: body.employmentType ?? current.employmentType,
        status,
        postedAt:
          body.postedAt !== undefined
            ? new Date(body.postedAt)
            : status === JobStatus.OPEN
              ? current.postedAt || new Date()
              : current.postedAt,
        closedAt:
          body.closedAt === null
            ? null
            : body.closedAt
              ? new Date(body.closedAt)
              : status === JobStatus.CLOSED
                ? current.closedAt || new Date()
                : current.closedAt,
      },
      include: { translations: true },
    });

    if (body.titleEn || body.descriptionEn || body.requirementsEn) {
      await prisma.jobTranslation.upsert({
        where: { jobId_locale: { jobId: id, locale: Locale.en } },
        update: {
          title:
            body.titleEn ??
            current.translations.find((item) => item.locale === Locale.en)?.title ??
            "Untitled",
          description:
            body.descriptionEn ??
            current.translations.find((item) => item.locale === Locale.en)?.description ??
            {},
          requirements:
            body.requirementsEn ??
            current.translations.find((item) => item.locale === Locale.en)?.requirements ??
            {},
        },
        create: {
          jobId: id,
          locale: Locale.en,
          title: body.titleEn || "Untitled",
          description: body.descriptionEn || {},
          requirements: body.requirementsEn || {},
        },
      });
    }

    if (body.titleId || body.descriptionId || body.requirementsId) {
      await prisma.jobTranslation.upsert({
        where: { jobId_locale: { jobId: id, locale: Locale.id } },
        update: {
          title:
            body.titleId ??
            current.translations.find((item) => item.locale === Locale.id)?.title ??
            "Tanpa Judul",
          description:
            body.descriptionId ??
            current.translations.find((item) => item.locale === Locale.id)?.description ??
            {},
          requirements:
            body.requirementsId ??
            current.translations.find((item) => item.locale === Locale.id)?.requirements ??
            {},
        },
        create: {
          jobId: id,
          locale: Locale.id,
          title: body.titleId || "Tanpa Judul",
          description: body.descriptionId || {},
          requirements: body.requirementsId || {},
        },
      });
    }

    const result = await prisma.job.findUnique({
      where: { id },
      include: { translations: true },
    });

    await writeAuditLog({
      actorUserId: guard.session?.userId,
      action: "UPDATE",
      entityType: "Job",
      entityId: id,
      beforeJson: current,
      afterJson: result ?? updated,
    });

    return NextResponse.json(result ?? updated);
  } catch (error) {
    console.error("PUT /api/admin/jobs/[id] failed:", error);
    return NextResponse.json({ error: "Failed to update job." }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, context: Params) {
  const guard = requireRole(request, [RoleName.ADMIN, RoleName.EDITOR]);
  if (guard.error) return guard.error;
  const { id } = await context.params;

  try {
    const current = await prisma.job.findUnique({
      where: { id },
      include: { translations: true },
    });
    if (!current) return NextResponse.json({ error: "Job not found." }, { status: 404 });

    await prisma.job.delete({ where: { id } });

    await writeAuditLog({
      actorUserId: guard.session?.userId,
      action: "DELETE",
      entityType: "Job",
      entityId: id,
      beforeJson: current,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("DELETE /api/admin/jobs/[id] failed:", error);
    return NextResponse.json({ error: "Failed to delete job." }, { status: 500 });
  }
}
