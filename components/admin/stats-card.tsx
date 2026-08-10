"use client";

import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { CURRENCY_SYMBOL } from "@/lib/constants";

interface StatsCardProps {
  title: string;
  value: number | string;
  growth?: number;
  isCurrency?: boolean;
  icon: React.ReactNode;
  color: "blue" | "green" | "purple" | "orange";
}

const colorMap = {
  blue:   { bg: "bg-blue-50",   icon: "bg-blue-100 text-blue-600",   text: "text-blue-600"   },
  green:  { bg: "bg-green-50",  icon: "bg-green-100 text-green-600",  text: "text-green-600"  },
  purple: { bg: "bg-purple-50", icon: "bg-purple-100 text-purple-600", text: "text-purple-600" },
  orange: { bg: "bg-orange-50", icon: "bg-orange-100 text-orange-600", text: "text-orange-600" },
};

export function StatsCard({ title, value, growth, isCurrency, icon, color }: StatsCardProps) {
  const c = colorMap[color];
  const growthPositive = (growth ?? 0) >= 0;
  const GrowthIcon = growth === 0 ? Minus : growthPositive ? TrendingUp : TrendingDown;

  const displayValue =
    isCurrency
      ? `${CURRENCY_SYMBOL}${Number(value).toLocaleString("en-PK")}`
      : Number(value).toLocaleString("en-PK");

  return (
    <div className={`rounded-xl border border-neutral-100 bg-white p-5 shadow-sm`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-neutral-500">{title}</p>
          <p className="mt-1 text-2xl font-bold text-neutral-900">{displayValue}</p>
          {growth !== undefined && (
            <div className={`mt-1 flex items-center gap-1 text-xs font-medium ${growthPositive ? "text-green-600" : "text-red-500"}`}>
              <GrowthIcon size={13} />
              <span>{Math.abs(growth)}% vs last month</span>
            </div>
          )}
        </div>
        <div className={`rounded-xl p-3 ${c.icon}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}
