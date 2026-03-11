import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

import { PORTAL_SESSION_COOKIE } from "@/lib/constants";
import { createPortalSessionToken } from "@/lib/portal-auth";
import { prisma } from "@/lib/prisma";

type RegisterBody = {
  name?: string;
  email?: string;
  password?: string;
};

function isStrongPassword(password: string) {
  return password.length >= 8;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as RegisterBody;
    const name = body.name?.trim();
    const email = body.email?.trim().toLowerCase();
    const password = body.password?.trim();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required." },
        { status: 422 },
      );
    }

    if (!isStrongPassword(password)) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters." },
        { status: 422 },
      );
    }

    const existing = await prisma.portalUser.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "Email is already registered." }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.portalUser.create({
      data: {
        name,
        email,
        passwordHash,
        lastLoginAt: new Date(),
      },
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
    console.error("POST /api/public/auth/register failed:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
