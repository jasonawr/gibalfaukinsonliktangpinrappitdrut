import { createHmac, timingSafeEqual } from "node:crypto";

type PortalSessionPayload = {
  userId: string;
  email: string;
  name: string;
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

export function createPortalSessionToken(
  payload: Omit<PortalSessionPayload, "exp">,
  expiresInSeconds = 60 * 60 * 24 * 7,
) {
  const session: PortalSessionPayload = {
    ...payload,
    exp: Math.floor(Date.now() / 1000) + expiresInSeconds,
  };
  const encoded = base64UrlEncode(JSON.stringify(session));
  const signature = sign(encoded);
  return `${encoded}.${signature}`;
}

export function verifyPortalSessionToken(token?: string | null): PortalSessionPayload | null {
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
    const decoded = JSON.parse(base64UrlDecode(encoded)) as PortalSessionPayload;
    if (!decoded.exp || decoded.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }
    return decoded;
  } catch {
    return null;
  }
}
