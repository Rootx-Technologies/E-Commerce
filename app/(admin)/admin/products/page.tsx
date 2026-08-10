import type { Metadata } from "next";
import { AdminProductsClient } from "./products-client";

export const metadata: Metadata = { title: "Products" };

export default function AdminProductsPage() {
  return <AdminProductsClient />;
}
