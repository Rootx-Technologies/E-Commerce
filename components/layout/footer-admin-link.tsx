"use client";

import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { useAuthStore } from "@/store/auth.store";
import { useEffect, useState } from "react";

export function FooterAdminLink() {
  const [mounted, setMounted] = useState(false);
  const isAdmin = useAuthStore((s) => s.isAdmin);

  useEffect(() => setMounted(true), []);

  if (!mounted || !isAdmin()) return null;

  return (
    <Link
      href="/admin"
      className="flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 transition-colors"
    >
      <ShieldCheck size={13} />
      Admin Panel
    </Link>
  );
}
