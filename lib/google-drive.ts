import { Readable } from "node:stream";
import { google } from "googleapis";
import { decrypt, encrypt } from "@/utils/crypto";
import { getPool } from "@/database/db";

export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  modifiedTime: string;
}

export async function listDriveFiles(userId: string): Promise<DriveFile[]> {
  const db = getPool();
  const { rows } = await db.query(
    `select "accessToken", "refreshToken", "tokenExpiresAt"
     from "user_integrations"
     where "userId" = $1 and "provider" = 'google_drive'`,
    [userId]
  );

  if (rows.length === 0) throw new Error("google_drive integration not found");

  const row = rows[0];
  const oauth2 = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  );

  oauth2.setCredentials({
    access_token:  decrypt(row.accessToken),
    refresh_token: row.refreshToken ? decrypt(row.refreshToken) : undefined,
    expiry_date:   row.tokenExpiresAt ? new Date(row.tokenExpiresAt).getTime() : undefined,
  });

  oauth2.on("tokens", async (tokens) => {
    if (!tokens.access_token) return;
    await db.query(
      `update "user_integrations"
       set "accessToken"=$1, "tokenExpiresAt"=$2, "updatedAt"=now()
       where "userId"=$3 and "provider"='google_drive'`,
      [encrypt(tokens.access_token), tokens.expiry_date ? new Date(tokens.expiry_date) : null, userId]
    );
  });

  const drive = google.drive({ version: "v3", auth: oauth2 });
  const res = await drive.files.list({
    q: "(mimeType='application/pdf' or mimeType contains 'image/') and trashed=false",
    fields: "files(id,name,mimeType,modifiedTime)",
    orderBy: "modifiedTime desc",
    pageSize: 100,
  });

  return (res.data.files ?? []).map((f) => ({
    id:           f.id!,
    name:         f.name!,
    mimeType:     f.mimeType!,
    modifiedTime: f.modifiedTime!,
  }));
}

async function getDriveClient(userId: string) {
  const db = getPool();
  const { rows } = await db.query(
    `select "accessToken", "refreshToken", "tokenExpiresAt"
     from "user_integrations"
     where "userId" = $1 and "provider" = 'google_drive'`,
    [userId]
  );
  if (rows.length === 0) throw new Error("google_drive integration not found");

  const row = rows[0];
  const expired = row.tokenExpiresAt && new Date(row.tokenExpiresAt) < new Date(Date.now() + 60_000);
  let accessToken = decrypt(row.accessToken);

  if (expired && row.refreshToken) {
    const refreshRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type:    "refresh_token",
        refresh_token: decrypt(row.refreshToken),
        client_id:     process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      }),
    });
    if (!refreshRes.ok) throw new Error(`Google token refresh failed: ${refreshRes.status}`);
    const data = await refreshRes.json() as { access_token: string; expires_in: number };
    accessToken = data.access_token;
    const expiresAt = new Date(Date.now() + data.expires_in * 1000);
    await db.query(
      `update "user_integrations" set "accessToken"=$1, "tokenExpiresAt"=$2, "updatedAt"=now() where "userId"=$3 and "provider"='google_drive'`,
      [encrypt(accessToken), expiresAt, userId]
    );
  }

  const oauth2 = new google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET);
  oauth2.setCredentials({ access_token: accessToken });
  return google.drive({ version: "v3", auth: oauth2 });
}

export async function deleteDriveFile(userId: string, fileId: string): Promise<void> {
  const drive = await getDriveClient(userId);
  // Move to trash rather than permanently delete — avoids the restricted
  // files.delete permission and lets users recover files via Drive.
  await drive.files.update({ fileId, requestBody: { trashed: true } });
}

export async function renameDriveFile(userId: string, fileId: string, newName: string): Promise<void> {
  const drive = await getDriveClient(userId);
  await drive.files.update({ fileId, requestBody: { name: newName } });
}

export async function downloadDriveFile(
  userId: string,
  fileId: string,
  mimeType: string
): Promise<{ stream: ReadableStream; contentType: string }> {
  const db = getPool();
  const { rows } = await db.query(
    `select "accessToken", "refreshToken", "tokenExpiresAt"
     from "user_integrations"
     where "userId" = $1 and "provider" = 'google_drive'`,
    [userId]
  );

  if (rows.length === 0) throw new Error("google_drive integration not found");

  const row = rows[0];

  // Fix 2: Explicit pre-flight token refresh — do not defer to an event listener
  // in a serverless environment where the function may shut down before the DB
  // write completes.
  const expired = row.tokenExpiresAt && new Date(row.tokenExpiresAt) < new Date(Date.now() + 60_000);
  let accessToken = decrypt(row.accessToken);

  if (expired && row.refreshToken) {
    const refreshRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: decrypt(row.refreshToken),
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      }),
    });
    if (!refreshRes.ok) throw new Error(`Google token refresh failed: ${refreshRes.status}`);
    const refreshData = await refreshRes.json() as { access_token: string; expires_in: number };
    accessToken = refreshData.access_token;
    const expiresAt = new Date(Date.now() + refreshData.expires_in * 1000);
    await db.query(
      `update "user_integrations" set "accessToken"=$1, "tokenExpiresAt"=$2, "updatedAt"=now() where "userId"=$3 and "provider"='google_drive'`,
      [encrypt(accessToken), expiresAt, userId]
    );
  }

  const oauth2 = new google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET);
  oauth2.setCredentials({ access_token: accessToken });
  // Do NOT attach an oauth2.on("tokens") listener here

  const drive = google.drive({ version: "v3", auth: oauth2 });

  const mediaRes = await drive.files.get({ fileId, alt: "media" }, { responseType: "stream" });
  const nodeStream = mediaRes.data as unknown as Readable;
  nodeStream.pause();
  return { stream: Readable.toWeb(nodeStream) as ReadableStream, contentType: mimeType };
}
