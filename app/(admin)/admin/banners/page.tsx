import type { Metadata } from "next";
import { AdminBannersClient } from "./banners-client";

export const metadata: Metadata = { title: "Banners" };

export default function AdminBannersPage() {
  return <AdminBannersClient />;
}
