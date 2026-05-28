import { decrypt, encrypt } from "@/utils/crypto";
import { getPool } from "@/database/db";

export interface DropboxFile {
  id: string;
  name: string;
  pathDisplay: string;
  serverModified: string;
}

async function refreshDropboxToken(userId: string, refreshToken: string): Promise<string> {
  const db = getPool();
  const body = new URLSearchParams({
    grant_type:    "refresh_token",
    refresh_token: refreshToken,
    client_id:     process.env.DROPBOX_CLIENT_ID!,
    client_secret: process.env.DROPBOX_CLIENT_SECRET!,
  });

  const res = await fetch("https://api.dropbox.com/oauth2/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  if (!res.ok) throw new Error(`Dropbox token refresh failed: ${res.status}`);

  const data = await res.json() as { access_token: string; expires_in: number };
  const expiresAt = new Date(Date.now() + data.expires_in * 1000);

  await db.query(
    `update "user_integrations"
     set "accessToken"=$1, "tokenExpiresAt"=$2, "updatedAt"=now()
     where "userId"=$3 and "provider"='dropbox'`,
    [encrypt(data.access_token), expiresAt, userId]
  );

  return data.access_token;
}

export async function listDropboxFiles(userId: string): Promise<DropboxFile[]> {
  const db = getPool();
  const { rows } = await db.query(
    `select "accessToken", "refreshToken", "tokenExpiresAt"
     from "user_integrations"
     where "userId" = $1 and "provider" = 'dropbox'`,
    [userId]
  );

  if (rows.length === 0) throw new Error("dropbox integration not found");

  const row = rows[0];
  const expired = row.tokenExpiresAt && new Date(row.tokenExpiresAt) < new Date();

  let accessToken = decrypt(row.accessToken);
  if (expired && row.refreshToken) {
    accessToken = await refreshDropboxToken(userId, decrypt(row.refreshToken));
  }

  const res = await fetch("https://api.dropboxapi.com/2/files/list_folder", {
    method: "POST",
    headers: {
      Authorization:  `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ path: "", recursive: true }),
  });

  if (!res.ok) throw new Error(`Dropbox list_folder failed: ${res.status}`);

  const data = await res.json() as {
    entries: Array<{
      ".tag": string;
      id: string;
      name: string;
      path_display: string;
      server_modified: string;
    }>;
  };

  return data.entries
    .filter((e) => e[".tag"] === "file" && /\.(pdf|png|jpg|jpeg)$/i.test(e.name))
    .map((e) => ({
      id:             e.id,
      name:           e.name,
      pathDisplay:    e.path_display,
      serverModified: e.server_modified,
    }));
}

export async function downloadDropboxFile(
  userId: string,
  fileId: string
): Promise<{ stream: ReadableStream; contentType: string }> {
  const db = getPool();
  const { rows } = await db.query(
    `select "accessToken", "refreshToken", "tokenExpiresAt"
     from "user_integrations"
     where "userId" = $1 and "provider" = 'dropbox'`,
    [userId]
  );

  if (rows.length === 0) throw new Error("dropbox integration not found");

  const row = rows[0];
  const expired = row.tokenExpiresAt && new Date(row.tokenExpiresAt) < new Date();

  let accessToken = decrypt(row.accessToken);
  if (expired && row.refreshToken) {
    accessToken = await refreshDropboxToken(userId, decrypt(row.refreshToken));
  }

  const res = await fetch("https://content.dropboxapi.com/2/files/download", {
    method: "POST",
    headers: {
      Authorization:      `Bearer ${accessToken}`,
      "Dropbox-API-Arg":  JSON.stringify({ path: fileId }),
    },
  });

  if (!res.ok) throw new Error(`Dropbox download failed: ${res.status}`);
  if (!res.body) throw new Error("Dropbox download returned empty body");

  const contentType = res.headers.get("Content-Type") ?? "application/octet-stream";

  return { stream: res.body, contentType };
}
