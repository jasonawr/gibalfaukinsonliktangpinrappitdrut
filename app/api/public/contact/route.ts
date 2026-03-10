import { InquiryType } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

import { enforceRateLimit, jsonError } from "@/lib/api";
import { writeAuditLog } from "@/lib/audit";
import { sendInquiryConfirmation } from "@/lib/notifications";
import { prisma } from "@/lib/prisma";

type ContactBody = {
  type?: "CONTACT" | "PARTNERSHIP";
  fullName?: string;
  company?: string;
  email?: string;
  phone?: string;
  message?: string;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  try {
    const limited = enforceRateLimit(request, "contact", 5, 60_000);
    if (limited) return limited;

    const body = (await request.json()) as ContactBody;

    const type = body.type ?? "CONTACT";
    const fullName = body.fullName?.trim();
    const company = body.company?.trim();
    const email = body.email?.trim().toLowerCase();
    const phone = body.phone?.trim();
    const message = body.message?.trim();

    const validationErrors: Record<string, string> = {};

    if (type !== "CONTACT" && type !== "PARTNERSHIP") {
      validationErrors.type = "Type must be CONTACT or PARTNERSHIP.";
    }
    if (!fullName || fullName.length < 2) {
      validationErrors.fullName = "Full name is required (min 2 characters).";
    }
    if (!email || !emailPattern.test(email)) {
      validationErrors.email = "A valid email is required.";
    }
    if (!message || message.length < 10) {
      validationErrors.message = "Message is required (min 10 characters).";
    }
    if (message && message.length > 5000) {
      validationErrors.message = "Message max length is 5000 characters.";
    }
    if (phone && phone.length > 30) {
      validationErrors.phone = "Phone number is too long.";
    }
    if (company && company.length > 160) {
      validationErrors.company = "Company is too long.";
    }

    if (Object.keys(validationErrors).length > 0) {
      return jsonError("Validation failed.", 422, validationErrors);
    }

    const inquiry = await prisma.contactInquiry.create({
      data: {
        type: type === "PARTNERSHIP" ? InquiryType.PARTNERSHIP : InquiryType.CONTACT,
        fullName: fullName!,
        company: company || null,
        email: email!,
        phone: phone || null,
        message: message!,
      },
      select: {
        id: true,
        type: true,
        submittedAt: true,
      },
    });

    await writeAuditLog({
      action: "PUBLIC_CONTACT_SUBMIT",
      entityType: "ContactInquiry",
      entityId: inquiry.id,
      afterJson: inquiry,
    });

    await sendInquiryConfirmation({
      to: email!,
      fullName: fullName!,
      type: inquiry.type,
    });

    return NextResponse.json(
      {
        message: "Inquiry submitted successfully.",
        inquiry,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("POST /api/public/contact failed:", error);
    return jsonError("Internal server error.", 500);
  }
}
