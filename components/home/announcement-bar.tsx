"use client";

import Link from "next/link";
import { X } from "lucide-react";
import { useState } from "react";

interface AnnouncementBarProps {
  message: string;
  link?: string | null;
  bgColor?: string;
}

export function AnnouncementBar({
  message,
  link,
  bgColor = "bg-green-700",
}: AnnouncementBarProps) {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  const content = (
    <span className="flex items-center justify-center gap-2 text-white text-xs sm:text-sm font-semibold tracking-wide px-8">
      {message}
    </span>
  );

  return (
    <div className={`relative ${bgColor} py-2.5 text-center`}>
      {link ? (
        <Link href={link} className="hover:underline underline-offset-2">
          {content}
        </Link>
      ) : (
        content
      )}
      <button
        onClick={() => setVisible(false)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors"
        aria-label="Close announcement"
      >
        <X size={16} />
      </button>
    </div>
  );
}
