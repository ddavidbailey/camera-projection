import type { Metadata } from "next";
import { DashboardClient } from "./dashboard-client";

export const metadata: Metadata = {
  title: "Tracelight — Worksheets",
  description: "Your Drive and Dropbox worksheets in one place.",
};

export default function DashboardPage() {
  return <DashboardClient />;
}
