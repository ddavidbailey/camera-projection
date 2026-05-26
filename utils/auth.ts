import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { Pool } from "pg";

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL as string,
  database: new Pool({
    connectionString: process.env.DATABASE_URL as string,
  }),
  emailAndPassword: {
    enabled: true,
    rememberMeEnabled: true,
  },
  socialProviders: {
    dropbox: {
      clientId: process.env.DROPBOX_CLIENT_ID as string,
      clientSecret: process.env.DROPBOX_CLIENT_SECRET as string,
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      accessType: "offline",
      prompt: "consent",
    },
  },
  plugins: [nextCookies()],
});
