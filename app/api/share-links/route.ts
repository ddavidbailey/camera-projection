import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { randomBytes, randomUUID } from "node:crypto";
import { auth } from "@/utils/auth";
import { getPool } from "@/database/db";

const VALID_EXPIRY_HOURS = [1, 4, 8, 24] as const;
type ExpiryHours = (typeof VALID_EXPIRY_HOURS)[number];

interface FileInput {
  fileId: string;
  provider: string;
  fileName: string;
  filePath: string;
  mimeType: string;
}

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: { files?: unknown; expiryHours?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { files, expiryHours } = body;

  if (!Array.isArray(files) || files.length === 0) {
    return NextResponse.json({ error: "files must be a non-empty array" }, { status: 400 });
  }

  if (!(VALID_EXPIRY_HOURS as readonly unknown[]).includes(expiryHours)) {
    return NextResponse.json(
      { error: "expiryHours must be 1, 4, 8, or 24" },
      { status: 400 },
    );
  }

  const db = getPool();
  const id = randomUUID();
  const token = randomBytes(9).toString("base64url");
  const userId = session.user.id;
  const hours = expiryHours as ExpiryHours;

  try {
    await db.query("BEGIN");

    await db.query(
      `INSERT INTO "share_links" ("id", "token", "userId", "expiresAt")
       VALUES ($1, $2, $3, now() + ($4 || ' hours')::interval)`,
      [id, token, userId, hours],
    );

    for (let i = 0; i < files.length; i++) {
      const file = files[i] as FileInput;
      await db.query(
        `INSERT INTO "share_link_files"
           ("id", "shareLinkId", "provider", "fileId", "fileName", "filePath", "mimeType", "sortOrder")
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          randomUUID(),
          id,
          file.provider,
          file.fileId,
          file.fileName,
          file.filePath,
          file.mimeType,
          i,
        ],
      );
    }

    await db.query("COMMIT");

    return NextResponse.json({ id, token }, { status: 201 });
  } catch (err) {
    await db.query("ROLLBACK");
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = getPool();

  try {
    const { rows: links } = await db.query<{
      id: string;
      token: string;
      expiresAt: Date;
      createdAt: Date;
    }>(
      `SELECT "id", "token", "expiresAt", "createdAt"
       FROM "share_links"
       WHERE "userId" = $1 AND "expiresAt" > now()
       ORDER BY "createdAt" DESC`,
      [session.user.id],
    );

    if (links.length === 0) return NextResponse.json([]);

    const linkIds = links.map((l) => l.id);
    const { rows: fileRows } = await db.query<{
      id: string;
      shareLinkId: string;
      fileId: string;
      provider: string;
      fileName: string;
      filePath: string;
      mimeType: string;
      sortOrder: number;
    }>(
      `SELECT "id", "shareLinkId", "fileId", "provider", "fileName", "filePath", "mimeType", "sortOrder"
       FROM "share_link_files"
       WHERE "shareLinkId" = ANY($1)
       ORDER BY "shareLinkId", "sortOrder"`,
      [linkIds],
    );

    const filesByLinkId = new Map<string, typeof fileRows>();
    for (const row of fileRows) {
      const bucket = filesByLinkId.get(row.shareLinkId) ?? [];
      bucket.push(row);
      filesByLinkId.set(row.shareLinkId, bucket);
    }

    const result = links.map((link) => ({
      id: link.id,
      token: link.token,
      expiresAt: link.expiresAt instanceof Date ? link.expiresAt.toISOString() : link.expiresAt,
      createdAt: link.createdAt instanceof Date ? link.createdAt.toISOString() : link.createdAt,
      files: (filesByLinkId.get(link.id) ?? []).map((f) => ({
        id: f.id,
        fileId: f.fileId,
        provider: f.provider,
        fileName: f.fileName,
        filePath: f.filePath,
        mimeType: f.mimeType,
        sortOrder: f.sortOrder,
      })),
    }));

    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
