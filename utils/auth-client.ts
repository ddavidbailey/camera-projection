import { createAuthClient } from "better-auth/react"; // make sure to import from better-auth/react

export const authClient = createAuthClient({
  //you can pass client configuration here
});

export async function dropboxSignIn() {
  await authClient.signIn.social({
    provider: "dropbox",
  });
}

export async function googleSignIn() {
  await authClient.signIn.social({
    provider: "google",
  });
}

export const { signIn, signUp, useSession } = createAuthClient();
