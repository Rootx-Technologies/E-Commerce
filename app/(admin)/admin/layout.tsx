import type { Metadata } from "next";
import { AdminLayoutShell } from "@/components/admin/layout-shell";

export const metadata: Metadata = {
  title: { default: "Admin Panel — Marqet", template: "%s | Admin — Marqet" },
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminLayoutShell>{children}</AdminLayoutShell>;
}
