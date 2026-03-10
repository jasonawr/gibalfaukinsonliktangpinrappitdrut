import { ApplicationStatus, RoleName } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

import { requireRole } from "@/lib/admin-api";
import { writeAuditLog } from "@/lib/audit";
import { prisma } from "@/lib/prisma";

type Params = {
  params: Promise<{ id: string }>;
};

export async function PUT(request: NextRequest, context: Params) {
  const guard = requireRole(request, [RoleName.ADMIN, RoleName.HR]);
  if (guard.error) return guard.error;

  const { id } = await context.params;
  const body = (await request.json()) as { status?: ApplicationStatus };
  if (!body.status || !Object.values(ApplicationStatus).includes(body.status)) {
    return NextResponse.json({ error: "Invalid status." }, { status: 422 });
  }

  const current = await prisma.jobApplication.findUnique({ where: { id } });
  if (!current) return NextResponse.json({ error: "Application not found." }, { status: 404 });

  const updated = await prisma.jobApplication.update({
    where: { id },
    data: { status: body.status },
  });

  await writeAuditLog({
    actorUserId: guard.session?.userId,
    action: "UPDATE_STATUS",
    entityType: "JobApplication",
    entityId: id,
    beforeJson: current,
    afterJson: updated,
  });

  return NextResponse.json(updated);
}
