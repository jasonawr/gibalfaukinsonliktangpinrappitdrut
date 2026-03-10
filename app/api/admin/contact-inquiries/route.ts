import { RoleName } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

import { requireRole } from "@/lib/admin-api";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const guard = requireRole(request, [RoleName.ADMIN, RoleName.EDITOR, RoleName.HR]);
  if (guard.error) return guard.error;

  const items = await prisma.contactInquiry.findMany({
    orderBy: { submittedAt: "desc" },
  });

  return NextResponse.json({ items });
}
