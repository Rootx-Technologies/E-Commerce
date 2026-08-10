import type { Metadata } from "next";
import { DashboardClient } from "./dashboard-client";

export const metadata: Metadata = {
  title: "My Account",
  description: "Manage your RAMZAN account, orders, and preferences.",
};

export default function DashboardPage() {
  return <DashboardClient />;
}
