"use client";

import { Bell, Menu } from "lucide-react";
import { useState } from "react";

export function AdminHeader() {
  const [_menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="flex h-16 items-center justify-between border-b border-neutral-100 bg-white px-6">
      <button
        onClick={() => setMenuOpen((v) => !v)}
        className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-50 hover:text-neutral-700 md:hidden"
      >
        <Menu size={18} />
      </button>

      <div className="flex-1" />

      <div className="flex items-center gap-2">
        <button className="relative rounded-lg p-2 text-neutral-500 transition-colors hover:bg-neutral-50 hover:text-neutral-900">
          <Bell size={18} />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
        </button>
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-900 text-xs font-bold text-white">
          A
        </div>
      </div>
    </header>
  );
}
