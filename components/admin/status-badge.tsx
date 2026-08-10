interface StatusBadgeProps {
  status: string;
  variant?: "order" | "payment" | "generic";
}

const orderColors: Record<string, string> = {
  PENDING:    "bg-yellow-100 text-yellow-700",
  CONFIRMED:  "bg-blue-100 text-blue-700",
  PROCESSING: "bg-indigo-100 text-indigo-700",
  SHIPPED:    "bg-purple-100 text-purple-700",
  DELIVERED:  "bg-green-100 text-green-700",
  CANCELLED:  "bg-red-100 text-red-700",
  REFUNDED:   "bg-neutral-100 text-neutral-600",
};

const paymentColors: Record<string, string> = {
  PENDING:  "bg-yellow-100 text-yellow-700",
  PAID:     "bg-green-100 text-green-700",
  FAILED:   "bg-red-100 text-red-700",
  REFUNDED: "bg-neutral-100 text-neutral-600",
};

export function StatusBadge({ status, variant = "generic" }: StatusBadgeProps) {
  const colorMap = variant === "order" ? orderColors : variant === "payment" ? paymentColors : {};
  const color = colorMap[status] ?? "bg-neutral-100 text-neutral-600";
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${color}`}>
      {status}
    </span>
  );
}
