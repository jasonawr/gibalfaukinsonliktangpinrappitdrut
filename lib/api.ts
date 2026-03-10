import { JobStatus, Locale, type JobTranslation } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

type ErrorPayload = {
  error: string;
  details?: Record<string, string>;
};

type RateEntry = {
  count: number;
  resetAt: number;
};

const rateStore = new Map<string, RateEntry>();

export function jsonError(
  message: string,
  status = 400,
  details?: Record<string, string>,
) {
  const payload: ErrorPayload = { error: message };
  if (details) payload.details = details;
  return NextResponse.json(payload, { status });
}

export function getLocale(request: NextRequest): Locale {
  const locale = request.nextUrl.searchParams.get("locale");
  return locale === Locale.id ? Locale.id : Locale.en;
}

export function getPublicJobStatus(request: NextRequest): JobStatus | undefined {
  const status = request.nextUrl.searchParams.get("status");
  if (!status) return undefined;
  if (status.toLowerCase() === "open") return JobStatus.OPEN;
  if (status.toLowerCase() === "closed") return JobStatus.CLOSED;
  if (status.toLowerCase() === "draft") return JobStatus.DRAFT;
  return undefined;
}

export function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return request.headers.get("x-real-ip") || "unknown";
}

export function enforceRateLimit(
  request: NextRequest,
  bucket: string,
  limit: number,
  windowMs: number,
) {
  const now = Date.now();
  const key = `${bucket}:${getClientIp(request)}`;
  const current = rateStore.get(key);

  if (!current || current.resetAt <= now) {
    rateStore.set(key, { count: 1, resetAt: now + windowMs });
    return null;
  }

  if (current.count >= limit) {
    const retryAfter = Math.ceil((current.resetAt - now) / 1000);
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      {
        status: 429,
        headers: {
          "Retry-After": retryAfter.toString(),
        },
      },
    );
  }

  current.count += 1;
  rateStore.set(key, current);
  return null;
}

export function firstTranslation(
  translations: JobTranslation[],
  locale: Locale,
): JobTranslation | null {
  return (
    translations.find((translation) => translation.locale === locale) ||
    translations.find((translation) => translation.locale === Locale.en) ||
    translations[0] ||
    null
  );
}
