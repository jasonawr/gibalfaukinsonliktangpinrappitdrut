import { MediaKind } from "@prisma/client";
import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextRequest, NextResponse } from "next/server";

import { enforceRateLimit, jsonError } from "@/lib/api";
import { prisma } from "@/lib/prisma";

const ALLOWED = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

const MAX_FILE_SIZE = 5 * 1024 * 1024;

export async function POST(request: NextRequest) {
  const limited = enforceRateLimit(request, "public-cv-upload", 6, 60_000);
  if (limited) return limited;

  try {
    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File)) return jsonError("file is required.");
    if (!ALLOWED.has(file.type)) return jsonError("Only PDF, DOC, DOCX are allowed.", 422);
    if (file.size > MAX_FILE_SIZE) return jsonError("File exceeds 5MB.", 422);

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });

    const extension = path.extname(file.name || "").toLowerCase();
    const key = `cv-${Date.now()}-${randomUUID()}${extension}`;
    const targetPath = path.join(uploadDir, key);

    const arrayBuffer = await file.arrayBuffer();
    await writeFile(targetPath, Buffer.from(arrayBuffer));

    const asset = await prisma.mediaAsset.create({
      data: {
        kind: MediaKind.CV,
        fileName: file.name,
        mimeType: file.type,
        sizeBytes: file.size,
        storageKey: key,
      },
      select: {
        id: true,
        storageKey: true,
      },
    });

    return NextResponse.json(
      {
        cvAssetId: asset.id,
        url: `/uploads/${asset.storageKey}`,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("POST /api/public/upload-cv failed:", error);
    return jsonError("Upload failed.", 500);
  }
}
