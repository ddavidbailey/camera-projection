"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/utils/auth";

export async function googleSignInAction() {
  const response = await auth.api.signInSocial({
    body: {
      provider: "google",
      callbackURL: "/dashboard",
      errorCallbackURL: "/",
    },
    headers: await headers(),
  });
  redirect(response.url!);
}

export async function dropboxSignInAction() {
  const response = await auth.api.signInSocial({
    body: {
      provider: "dropbox",
      callbackURL: "/dashboard",
      errorCallbackURL: "/",
    },
    headers: await headers(),
  });
  redirect(response.url!);
}
