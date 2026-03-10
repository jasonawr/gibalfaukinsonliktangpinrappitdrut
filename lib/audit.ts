import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";

function toJsonValue(input: unknown): Prisma.InputJsonValue | Prisma.NullableJsonNullValueInput | undefined {
  if (input === undefined) return undefined;
  if (input === null) return Prisma.JsonNull;
  return JSON.parse(JSON.stringify(input)) as Prisma.InputJsonValue;
}

export async function writeAuditLog(input: {
  actorUserId?: string;
  action: string;
  entityType: string;
  entityId: string;
  beforeJson?: unknown;
  afterJson?: unknown;
}) {
  await prisma.auditLog.create({
    data: {
      actorUserId: input.actorUserId || null,
      action: input.action,
      entityType: input.entityType,
      entityId: input.entityId,
      beforeJson: toJsonValue(input.beforeJson),
      afterJson: toJsonValue(input.afterJson),
    },
  });
}
