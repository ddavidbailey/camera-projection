import type { Metadata } from "next";
import { ViewClient } from "./view-client";

export const metadata: Metadata = {
  title: "Tracelight — Session",
  description: "Point your camera at a blank sheet of paper.",
};

export default async function TokenPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  // Token will be used for DB lookup (worksheet, expiry) in production
  await params;
  return <ViewClient />;
}
