import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({});

export async function emailSignIn(email: string, password: string, rememberMe: boolean) {
  return authClient.signIn.email({
    email,
    password,
    rememberMe,
  });
}

export async function emailSignUp(name: string, email: string, password: string) {
  return authClient.signUp.email({
    name,
    email,
    password,
  });
}

export async function signOut() {
  return authClient.signOut();
}
