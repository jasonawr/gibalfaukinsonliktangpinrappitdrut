import { MediaKind, RoleName } from "@prisma/client";
import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextRequest, NextResponse } from "next/server";

import { requireRole } from "@/lib/admin-api";
import { prisma } from "@/lib/prisma";

const MAX_FILE_SIZE = 8 * 1024 * 1024;

function inferKind(mimeType: string): MediaKind {
  if (mimeType.startsWith("image/")) return MediaKind.IMAGE;
  if (
    mimeType === "application/pdf" ||
    mimeType === "application/msword" ||
    mimeType ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    return MediaKind.CV;
  }
  return MediaKind.DOC;
}

export async function POST(request: NextRequest) {
  const guard = requireRole(request, [RoleName.ADMIN, RoleName.EDITOR, RoleName.HR]);
  if (guard.error) return guard.error;

  try {
    const data = await request.formData();
    const file = data.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "file is required." }, { status: 422 });
    }
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "File exceeds 8MB limit." }, { status: 422 });
    }

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });

    const extension = path.extname(file.name || "").toLowerCase();
    const key = `${Date.now()}-${randomUUID()}${extension}`;
    const targetPath = path.join(uploadDir, key);

    const arrayBuffer = await file.arrayBuffer();
    await writeFile(targetPath, Buffer.from(arrayBuffer));

    const asset = await prisma.mediaAsset.create({
      data: {
        kind: inferKind(file.type),
        fileName: file.name,
        mimeType: file.type || "application/octet-stream",
        sizeBytes: file.size,
        storageKey: key,
        uploadedBy: guard.session?.userId || null,
      },
    });

    return NextResponse.json(
      {
        id: asset.id,
        kind: asset.kind,
        url: `/uploads/${key}`,
        storageKey: asset.storageKey,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("POST /api/admin/media/upload failed:", error);
    return NextResponse.json({ error: "Upload failed." }, { status: 500 });
  }
}
