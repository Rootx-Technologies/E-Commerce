import type { Metadata } from "next";
import { AdminOrdersClient } from "./orders-client";

export const metadata: Metadata = { title: "Orders" };

export default function AdminOrdersPage() {
  return <AdminOrdersClient />;
}
