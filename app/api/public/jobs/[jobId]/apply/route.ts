import { JobStatus } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

import { enforceRateLimit, jsonError } from "@/lib/api";
import { writeAuditLog } from "@/lib/audit";
import {
  notifyHrOnApplication,
  sendApplicantConfirmation,
} from "@/lib/notifications";
import { prisma } from "@/lib/prisma";

type Params = {
  params: Promise<{ jobId: string }>;
};

type ApplyBody = {
  fullName?: string;
  email?: string;
  phone?: string;
  coverLetter?: string;
  cvAssetId?: string;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest, context: Params) {
  try {
    const limited = enforceRateLimit(request, "job-apply", 8, 60_000);
    if (limited) return limited;

    const { jobId } = await context.params;
    const body = (await request.json()) as ApplyBody;

    const validationErrors: Record<string, string> = {};
    const fullName = body.fullName?.trim();
    const email = body.email?.trim().toLowerCase();
    const phone = body.phone?.trim();
    const coverLetter = body.coverLetter?.trim();
    const cvAssetId = body.cvAssetId?.trim();

    if (!fullName || fullName.length < 2) {
      validationErrors.fullName = "Full name is required (min 2 characters).";
    }
    if (!email || !emailPattern.test(email)) {
      validationErrors.email = "A valid email is required.";
    }
    if (phone && phone.length > 30) {
      validationErrors.phone = "Phone number is too long.";
    }
    if (coverLetter && coverLetter.length > 5000) {
      validationErrors.coverLetter = "Cover letter max length is 5000 characters.";
    }

    if (Object.keys(validationErrors).length > 0) {
      return jsonError("Validation failed.", 422, validationErrors);
    }

    const job = await prisma.job.findUnique({
      where: { id: jobId },
      select: { id: true, status: true, closedAt: true },
    });

    if (!job) {
      return jsonError("Job not found.", 404);
    }
    if (job.status !== JobStatus.OPEN || (job.closedAt && job.closedAt <= new Date())) {
      return jsonError("This job is not accepting applications.", 409);
    }

    if (cvAssetId) {
      const cvAsset = await prisma.mediaAsset.findUnique({
        where: { id: cvAssetId },
        select: { id: true, kind: true },
      });
      if (!cvAsset || (cvAsset.kind !== "CV" && cvAsset.kind !== "DOC")) {
        return jsonError("Invalid CV asset.", 422, {
          cvAssetId: "CV asset not found or not allowed.",
        });
      }
    }

    const application = await prisma.jobApplication.create({
      data: {
        jobId: job.id,
        fullName: fullName!,
        email: email!,
        phone: phone || null,
        coverLetter: coverLetter || null,
        cvAssetId: cvAssetId || null,
      },
      select: {
        id: true,
        status: true,
        submittedAt: true,
      },
    });

    const jobInfo = await prisma.jobTranslation.findFirst({
      where: { jobId: job.id },
      select: { title: true },
    });

    await notifyHrOnApplication({
      jobTitle: jobInfo?.title || "Open Position",
      fullName: fullName!,
      email: email!,
      submittedAt: application.submittedAt,
    });

    await sendApplicantConfirmation({
      to: email!,
      fullName: fullName!,
      jobTitle: jobInfo?.title || "Open Position",
    });

    await writeAuditLog({
      action: "PUBLIC_JOB_APPLY",
      entityType: "JobApplication",
      entityId: application.id,
      afterJson: application,
    });

    return NextResponse.json(
      {
        message: "Application submitted successfully.",
        application,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("POST /api/public/jobs/[jobId]/apply failed:", error);
    return jsonError("Internal server error.", 500);
  }
}
