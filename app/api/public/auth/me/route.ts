import { NextRequest, NextResponse } from "next/server";

import { PORTAL_SESSION_COOKIE } from "@/lib/constants";
import { verifyPortalSessionToken } from "@/lib/portal-auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get(PORTAL_SESSION_COOKIE)?.value;
    const session = verifyPortalSessionToken(token);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.portalUser.findUnique({
      where: { id: session.userId },
      select: { id: true, name: true, email: true, isActive: true, createdAt: true },
    });

    if (!user || !user.isActive) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("GET /api/public/auth/me failed:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
