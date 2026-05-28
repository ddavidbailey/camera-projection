import type { Metadata } from "next";
import { getPool } from "@/database/db";
import { ViewClient } from "./view-client";

export const metadata: Metadata = {
  title: "Tracelight — Session",
  description: "Point your camera at a blank sheet of paper.",
};

export default async function TokenPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  // Validate token format — same regex as the DELETE route
  if (!/^[A-Za-z0-9_-]{12}$/.test(token)) {
    return <SessionEnded />;
  }

  const db = getPool();

  // Look up the link and its files in one query
  const { rows: linkRows } = await db.query<{
    id: string;
    userId: string;
    expiresAt: Date;
  }>(
    `SELECT id, "userId", "expiresAt" FROM share_links WHERE token = $1`,
    [token]
  );

  if (linkRows.length === 0 || linkRows[0].expiresAt < new Date()) {
    return <SessionEnded />;
  }

  const link = linkRows[0];

  const { rows: fileRows } = await db.query<{
    id: string;
    fileId: string;
    provider: string;
    fileName: string;
    filePath: string;
    mimeType: string;
    sortOrder: number;
  }>(
    `SELECT id, "fileId", provider, "fileName", "filePath", "mimeType", "sortOrder"
     FROM share_link_files
     WHERE "shareLinkId" = $1
     ORDER BY "sortOrder" ASC`,
    [link.id]
  );

  return (
    <ViewClient
      token={token}
      files={fileRows}
    />
  );
}

function SessionEnded() {
  return (
    <div
      style={{
        minHeight: "100dvh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--color-background)",
        fontFamily: "var(--font-code, monospace)",
      }}
    >
      <p
        style={{
          fontSize: "11px",
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          color: "var(--color-muted)",
        }}
      >
        This session has ended.
      </p>
    </div>
  );
}
