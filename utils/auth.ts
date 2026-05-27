import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { Pool } from "pg";
import { randomUUID } from "node:crypto";
import { getPool } from "@/database/db";
import { encrypt } from "@/utils/crypto";

export const auth = betterAuth({
  appName: "Tracelight",
  protocol: "https",
  baseURL: process.env.BETTER_AUTH_URL as string,
  database: new Pool({
    connectionString: process.env.DATABASE_URL as string,
  }),
  emailAndPassword: {
    enabled: true,
    rememberMeEnabled: true,
  },
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["google", "dropbox", "email-password"],
      allowDifferentEmails: false,
      allowUnlinkingAll: false,
    },
  },
  socialProviders: {
    dropbox: {
      clientId: process.env.DROPBOX_CLIENT_ID as string,
      clientSecret: process.env.DROPBOX_CLIENT_SECRET as string,
      scope: ["account_info.read", "files.metadata.read", "files.content.read"],
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      scope: [
        "openid",
        "email",
        "profile",
        "https://www.googleapis.com/auth/drive.readonly",
      ],
      accessType: "offline",
      prompt: "consent",
    },
  },
  databaseHooks: {
    account: {
      create: { after: syncAccount },
      update: { after: syncAccount },
    },
  },
  plugins: [nextCookies()],
});

type AccountPayload = {
  providerId: string;
  userId: string;
  accessToken?: string | null;
  refreshToken?: string | null;
  accessTokenExpiresAt?: Date | null;
  scope?: string | null;
};

async function syncAccount(account: AccountPayload) {
  if (
    account.providerId === "google" &&
    account.accessToken &&
    account.scope?.includes("drive")
  ) {
    await upsertGoogleDriveIntegration({
      userId: account.userId,
      accessToken: account.accessToken,
      refreshToken: account.refreshToken,
      accessTokenExpiresAt: account.accessTokenExpiresAt,
      scope: account.scope,
    });
  }
  if (account.providerId === "dropbox" && account.accessToken) {
    await upsertDropboxIntegration({
      userId: account.userId,
      accessToken: account.accessToken,
      refreshToken: account.refreshToken,
      accessTokenExpiresAt: account.accessTokenExpiresAt,
      scope: account.scope,
    });
  }
}

async function upsertDropboxIntegration(account: {
  userId: string;
  accessToken: string;
  refreshToken?: string | null;
  accessTokenExpiresAt?: Date | null;
  scope?: string | null;
}) {
  const db = getPool();
  const { rows } = await db.query(`select email from "user" where id = $1`, [
    account.userId,
  ]);
  const email = rows[0]?.email ?? "";

  await db.query(
    `insert into "user_integrations"
       ("id","userId","provider","accountEmail","accessToken","refreshToken","tokenExpiresAt","scope","createdAt","updatedAt")
     values ($1,$2,'dropbox',$3,$4,$5,$6,$7,now(),now())
     on conflict ("userId","provider") do update set
       "accessToken"=$4,"refreshToken"=$5,"tokenExpiresAt"=$6,"scope"=$7,"updatedAt"=now()`,
    [
      randomUUID(),
      account.userId,
      email,
      encrypt(account.accessToken),
      account.refreshToken ? encrypt(account.refreshToken) : null,
      account.accessTokenExpiresAt ?? null,
      account.scope ?? "",
    ],
  );
}

// Upsert the tokens for the Google integration when tokens expire
async function upsertGoogleDriveIntegration(account: {
  userId: string;
  accessToken: string;
  refreshToken?: string | null;
  accessTokenExpiresAt?: Date | null;
  scope?: string | null;
}) {
  const db = getPool();
  const { rows } = await db.query(`select email from "user" where id = $1`, [
    account.userId,
  ]);
  const email = rows[0]?.email ?? "";

  await db.query(
    `insert into "user_integrations"
       ("id","userId","provider","accountEmail","accessToken","refreshToken","tokenExpiresAt","scope","createdAt","updatedAt")
     values ($1,$2,'google_drive',$3,$4,$5,$6,$7,now(),now())
     on conflict ("userId","provider") do update set
       "accessToken"=$4,"refreshToken"=$5,"tokenExpiresAt"=$6,"scope"=$7,"updatedAt"=now()`,
    [
      randomUUID(),
      account.userId,
      email,
      encrypt(account.accessToken),
      account.refreshToken ? encrypt(account.refreshToken) : null,
      account.accessTokenExpiresAt ?? null,
      account.scope ?? "",
    ],
  );
}
