import { getPool } from "@/database/db";
import { downloadDriveFile } from "@/lib/google-drive";
import { downloadDropboxFile } from "@/lib/dropbox";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ token: string; fileId: string }> }
) {
  // Fix 3: Wrap the entire handler in try/catch so unexpected DB or logic errors
  // return a 500 rather than crashing the serverless function silently.
  try {
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

    // 2. Look up the file record to get its provider, file name, and mimeType
    const { rows: fileRows } = await db.query(
      `select "provider", "fileName", "mimeType"
       from "share_link_files"
       where "shareLinkId" = $1 and "fileId" = $2`,
      [link.id, fileId]
    );

    if (fileRows.length === 0) {
      return new Response("File not found", { status: 404 });
    }

    const provider = fileRows[0].provider as string;
    const fileName = fileRows[0].fileName as string;
    const mimeType = fileRows[0].mimeType as string;

    // 3. Stream the file from the appropriate provider
    try {
      let stream: ReadableStream;
      let contentType: string;

      if (provider === "google_drive") {
        ({ stream, contentType } = await downloadDriveFile(link.userId, fileId, mimeType));
      } else if (provider === "dropbox") {
        ({ stream, contentType } = await downloadDropboxFile(link.userId, fileId));
      } else {
        return new Response("Unknown provider", { status: 400 });
      }

      // RFC 5987-compliant Content-Disposition: ASCII-safe fallback + UTF-8 encoded name
      const safeName = fileName.replace(/[^\w. ()-]/g, "_");
      return new Response(stream, {
        headers: {
          "Content-Type": contentType,
          "Content-Disposition": `inline; filename="${safeName}"; filename*=UTF-8''${encodeURIComponent(fileName)}`,
          "Cache-Control": "private, no-store",
        },
      });
    } catch (err) {
      console.error("[file-proxy] download error:", err);
      return new Response("Failed to fetch file from storage provider", { status: 502 });
    }
  } catch (err) {
    console.error("[file-proxy] unexpected error:", err);
    return new Response("Internal server error", { status: 500 });
  }
}
