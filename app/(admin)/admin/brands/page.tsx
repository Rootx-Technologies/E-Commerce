import type { Metadata } from "next";
import { AdminBrandsClient } from "./brands-client";

export const metadata: Metadata = { title: "Brands" };

export default function AdminBrandsPage() {
  return <AdminBrandsClient />;
}
