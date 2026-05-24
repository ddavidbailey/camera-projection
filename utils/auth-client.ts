import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({});

export async function emailSignIn(email: string, password: string, rememberMe: boolean) {
  return authClient.signIn.email({
    email,
    password,
    rememberMe,
    callbackURL: "/dashboard",
  });
}

export async function signOut() {
  return authClient.signOut();
}

export async function googleSignIn() {
  await authClient.signIn.social({
    provider: "google",
    callbackURL: "/dashboard",
  });
}

export async function dropboxSignIn() {
  await authClient.signIn.social({
    provider: "dropbox",
    callbackURL: "/dashboard",
  });
}
