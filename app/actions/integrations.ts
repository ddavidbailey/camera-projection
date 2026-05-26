"use server";

import { headers } from "next/headers";
import { auth } from "@/utils/auth";
import { getPool } from "@/database/db";

export interface IntegrationStatus {
  connected: boolean;
  email: string;
}

export interface Integrations {
  google_drive: IntegrationStatus;
  dropbox: IntegrationStatus;
}

export async function getIntegrationStatus(): Promise<Integrations> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");

  const db = getPool();
  const { rows } = await db.query(
    `select "provider", "accountEmail" from "user_integrations" where "userId" = $1`,
    [session.user.id]
  );

  const result: Integrations = {
    google_drive: { connected: false, email: "" },
    dropbox:      { connected: false, email: "" },
  };

  for (const row of rows) {
    const provider = row.provider as keyof Integrations;
    if (provider in result) {
      result[provider] = { connected: true, email: row.accountEmail };
    }
  }

  return result;
}
