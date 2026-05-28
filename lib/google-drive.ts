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

export async function downloadDriveFile(
  userId: string,
  fileId: string
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

  const [metaRes, mediaRes] = await Promise.all([
    drive.files.get({ fileId, fields: "mimeType" }),
    drive.files.get({ fileId, alt: "media" }, { responseType: "stream" }),
  ]);

  const contentType = metaRes.data.mimeType ?? "application/octet-stream";
  const nodeStream = mediaRes.data as unknown as import("node:stream").Readable;
  const stream = Readable.toWeb(nodeStream) as ReadableStream;

  return { stream, contentType };
}
