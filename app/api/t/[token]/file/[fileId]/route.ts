import { getPool } from "@/database/db";
import { downloadDriveFile } from "@/lib/google-drive";
import { downloadDropboxFile } from "@/lib/dropbox";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ token: string; fileId: string }> }
) {
  const { token, fileId } = await params;
  const db = getPool();

  // 1. Look up the share link and check expiry
  const { rows: linkRows } = await db.query(
    `select "id", "userId", "expiresAt"
     from "share_links"
     where "token" = $1`,
    [token]
  );

  if (linkRows.length === 0 || new Date(linkRows[0].expiresAt) < new Date()) {
    return new Response("Link expired or not found", { status: 410 });
  }

  const link = linkRows[0] as { id: string; userId: string; expiresAt: Date };

  // 2. Look up the file record to get its provider
  const { rows: fileRows } = await db.query(
    `select "provider"
     from "share_link_files"
     where "shareLinkId" = $1 and "fileId" = $2`,
    [link.id, fileId]
  );

  if (fileRows.length === 0) {
    return new Response("File not found", { status: 404 });
  }

  const provider = fileRows[0].provider as string;

  // 3. Stream the file from the appropriate provider
  try {
    let stream: ReadableStream;
    let contentType: string;

    if (provider === "google_drive") {
      ({ stream, contentType } = await downloadDriveFile(link.userId, fileId));
    } else if (provider === "dropbox") {
      ({ stream, contentType } = await downloadDropboxFile(link.userId, fileId));
    } else {
      return new Response("Unknown provider", { status: 400 });
    }

    return new Response(stream, {
      headers: { "Content-Type": contentType },
    });
  } catch (err) {
    console.error("[file-proxy] download error:", err);
    return new Response("Failed to fetch file from storage provider", { status: 502 });
  }
}
