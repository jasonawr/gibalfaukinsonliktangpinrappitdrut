import { RoleName } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

import { canAccess, getSessionFromRequest } from "@/lib/auth";

export function forbidden(message = "Forbidden") {
  return NextResponse.json({ error: message }, { status: 403 });
}

export function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export function requireRole(request: NextRequest, allowed: RoleName[]) {
  const session = getSessionFromRequest(request);
  if (!session) return { error: unauthorized() as NextResponse, session: null };
  if (!canAccess(session.role, allowed)) {
    return { error: forbidden(), session: null };
  }
  return { error: null, session };
}
