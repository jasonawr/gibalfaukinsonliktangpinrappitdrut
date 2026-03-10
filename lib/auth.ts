import { RoleName } from "@prisma/client";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { createHmac, timingSafeEqual } from "node:crypto";

import { SESSION_COOKIE } from "@/lib/constants";

type SessionPayload = {
  userId: string;
  role: RoleName;
  email: string;
  exp: number;
};

function getSecret() {
  return process.env.AUTH_SECRET || "dev-secret-change-me";
}

function base64UrlEncode(value: string) {
  return Buffer.from(value, "utf8").toString("base64url");
}

function base64UrlDecode(value: string) {
  return Buffer.from(value, "base64url").toString("utf8");
}

function sign(input: string) {
  return createHmac("sha256", getSecret()).update(input).digest("base64url");
}

export function createSessionToken(
  payload: Omit<SessionPayload, "exp">,
  expiresInSeconds = 60 * 60 * 24,
) {
  const session: SessionPayload = {
    ...payload,
    exp: Math.floor(Date.now() / 1000) + expiresInSeconds,
  };
  const encoded = base64UrlEncode(JSON.stringify(session));
  const signature = sign(encoded);
  return `${encoded}.${signature}`;
}

export function verifySessionToken(token?: string | null): SessionPayload | null {
  if (!token) return null;
  const [encoded, signature] = token.split(".");
  if (!encoded || !signature) return null;

  const expected = sign(encoded);
  const signatureBuf = Buffer.from(signature);
  const expectedBuf = Buffer.from(expected);
  if (
    signatureBuf.length !== expectedBuf.length ||
    !timingSafeEqual(signatureBuf, expectedBuf)
  ) {
    return null;
  }

  try {
    const decoded = JSON.parse(base64UrlDecode(encoded)) as SessionPayload;
    if (!decoded.exp || decoded.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }
    return decoded;
  } catch {
    return null;
  }
}

export function getSessionFromRequest(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  return verifySessionToken(token);
}

export async function getSessionFromCookies() {
  const cookieStore = await cookies();
  return verifySessionToken(cookieStore.get(SESSION_COOKIE)?.value);
}

export function canAccess(role: RoleName, allowed: RoleName[]) {
  return allowed.includes(role);
}
