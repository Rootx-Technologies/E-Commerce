import type { Metadata } from "next";
import { AdminCategoriesClient } from "./categories-client";

export const metadata: Metadata = { title: "Categories" };

export default function AdminCategoriesPage() {
  return <AdminCategoriesClient />;
}
