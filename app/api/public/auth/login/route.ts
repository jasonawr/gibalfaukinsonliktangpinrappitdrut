import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

import { PORTAL_SESSION_COOKIE } from "@/lib/constants";
import { createPortalSessionToken } from "@/lib/portal-auth";
import { prisma } from "@/lib/prisma";

type LoginBody = {
  email?: string;
  password?: string;
};

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as LoginBody;
    const email = body.email?.trim().toLowerCase();
    const password = body.password?.trim();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 422 });
    }

    const user = await prisma.portalUser.findUnique({ where: { email } });
    if (!user || !user.isActive) {
      return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
    }

    await prisma.portalUser.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    const token = createPortalSessionToken({
      userId: user.id,
      email: user.email,
      name: user.name,
    });

    const response = NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
    });

    response.cookies.set({
      name: PORTAL_SESSION_COOKIE,
      value: token,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error("POST /api/public/auth/login failed:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
