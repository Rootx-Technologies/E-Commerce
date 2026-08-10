import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  viewAllHref?: string;
  viewAllLabel?: string;
  centered?: boolean;
  className?: string;
}

export function SectionHeader({
  title,
  subtitle,
  viewAllHref,
  viewAllLabel = "View All",
  centered = false,
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "flex items-end justify-between gap-4 mb-8",
        centered && "flex-col items-center text-center",
        className
      )}
    >
      <div className={cn(centered && "flex flex-col items-center")}>
        {subtitle && (
          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.28em] text-amber-600 sm:text-xs">
            {subtitle}
          </p>
        )}
        <h2 className="text-2xl font-black tracking-[-0.04em] text-neutral-900 sm:text-3xl lg:text-4xl">
          {title}
        </h2>
        <div className="mt-3 h-1 w-14 rounded-full bg-gradient-to-r from-amber-500 via-orange-400 to-amber-300" />
      </div>

      {viewAllHref && !centered && (
        <Link
          href={viewAllHref}
          className="flex items-center gap-1.5 text-sm font-medium text-neutral-600 hover:text-amber-600 transition-colors group flex-shrink-0"
        >
          {viewAllLabel}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      )}

      {viewAllHref && centered && (
        <Link
          href={viewAllHref}
          className="flex items-center gap-1.5 text-sm font-medium text-amber-600 hover:text-amber-700 transition-colors group mt-2"
        >
          {viewAllLabel}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      )}
    </div>
  );
}
