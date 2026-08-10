"use client";

import { useState } from "react";
import { Search, Package, Truck, CheckCircle, Clock, MapPin, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatDate, formatPrice } from "@/lib/utils";

type OrderStatus = "CONFIRMED" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";

interface TimelineEvent {
  status: string;
  time: string;
  done: boolean;
  active: boolean;
}

interface TrackResult {
  orderNumber: string;
  status: OrderStatus;
  placedAt: string;
  items: number;
  total: number;
  shippingAddress: Record<string, string>;
  timeline: TimelineEvent[];
}

const statusConfig: Record<OrderStatus, { label: string; color: string; icon: typeof Package }> = {
  CONFIRMED:  { label: "Confirmed",  color: "text-blue-600 bg-blue-50",    icon: CheckCircle },
  PROCESSING: { label: "Processing", color: "text-amber-600 bg-amber-50",  icon: Clock       },
  SHIPPED:    { label: "Shipped",    color: "text-violet-600 bg-violet-50", icon: Truck       },
  DELIVERED:  { label: "Delivered",  color: "text-green-600 bg-green-50",  icon: CheckCircle },
  CANCELLED:  { label: "Cancelled",  color: "text-red-600 bg-red-50",      icon: AlertCircle },
};

// Build timeline from order status
function buildTimeline(status: OrderStatus, placedAt: string): TimelineEvent[] {
  const steps: OrderStatus[] = ["CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED"];
  const stepLabels: Record<string, string> = {
    CONFIRMED:  "Order Confirmed",
    PROCESSING: "Processing",
    SHIPPED:    "Shipped",
    DELIVERED:  "Delivered",
  };

  const currentIndex = steps.indexOf(status);

  return steps.map((step, i) => ({
    status: stepLabels[step],
    time: i === 0 ? formatDate(placedAt) : i <= currentIndex ? "Completed" : "Pending",
    done: i <= currentIndex,
    active: i === currentIndex,
  }));
}

export function TrackOrderClient() {
  const [orderNumber, setOrderNumber] = useState("");
  const [result, setResult] = useState<TrackResult | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleTrack = async () => {
    const trimmed = orderNumber.trim().toUpperCase();
    if (!trimmed) return;

    setLoading(true);
    setNotFound(false);
    setResult(null);

    try {
      const res = await fetch(`/api/orders/track?orderNumber=${encodeURIComponent(trimmed)}`);
      const data = await res.json();

      if (data.success && data.data) {
        const order = data.data;
        setResult({
          orderNumber: order.orderNumber,
          status: order.status as OrderStatus,
          placedAt: order.createdAt,
          items: order.items?.length ?? 0,
          total: order.total,
          shippingAddress: order.shippingAddress ?? {},
          timeline: buildTimeline(order.status as OrderStatus, order.createdAt),
        });
      } else {
        setNotFound(true);
      }
    } catch {
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  const StatusIcon = result ? statusConfig[result.status]?.icon : null;

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Hero */}
      <div className="bg-neutral-950 py-14">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-amber-400 mb-3">Delivery</p>
          <h1 className="text-4xl font-black text-white">Track Your Order</h1>
          <p className="mt-3 text-neutral-400">Enter your order number to see real-time status.</p>

          {/* Search box */}
          <div className="mt-8 flex gap-3 max-w-md mx-auto">
            <Input
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleTrack()}
              placeholder="e.g. RMZ-ABC123DEF"
              className="bg-white/10 border-white/20 text-white placeholder:text-neutral-400 focus:ring-amber-500"
              aria-label="Order number"
            />
            <Button
              onClick={handleTrack}
              isLoading={loading}
              variant="gold"
              className="flex-shrink-0 gap-2"
            >
              <Search className="h-4 w-4" />
              Track
            </Button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Not found */}
        {notFound && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl bg-white border border-red-100 p-8 text-center"
          >
            <AlertCircle className="h-10 w-10 text-red-400 mx-auto mb-3" />
            <p className="font-semibold text-neutral-900">Order not found</p>
            <p className="text-sm text-neutral-500 mt-1">
              Check your order number and try again, or{" "}
              <a href="tel:+923027372812" className="text-amber-600 hover:underline">call us</a>.
            </p>
          </motion.div>
        )}

        {/* Result */}
        {result && StatusIcon && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-5"
          >
            {/* Status card */}
            <div className="rounded-2xl bg-white border border-neutral-100 p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs text-neutral-400 font-medium uppercase tracking-wider">Order Number</p>
                  <p className="text-xl font-black text-neutral-900 mt-0.5">{result.orderNumber}</p>
                  <p className="text-sm text-neutral-500 mt-1">
                    Placed {formatDate(result.placedAt)} · {result.items} item{result.items !== 1 ? "s" : ""}
                    {" "}· {formatPrice(result.total)}
                  </p>
                </div>
                <div className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-semibold ${statusConfig[result.status]?.color}`}>
                  <StatusIcon className="h-4 w-4" />
                  {statusConfig[result.status]?.label}
                </div>
              </div>

              {/* Shipping address */}
              {result.shippingAddress && Object.keys(result.shippingAddress).length > 0 && (
                <div className="mt-4 flex items-start gap-2 text-sm text-neutral-500">
                  <MapPin className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
                  <span>
                    {[
                      result.shippingAddress.addressLine1,
                      result.shippingAddress.city,
                      result.shippingAddress.state,
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </span>
                </div>
              )}
            </div>

            {/* Timeline */}
            <div className="rounded-2xl bg-white border border-neutral-100 p-6">
              <h3 className="font-semibold text-neutral-900 mb-6">Order Timeline</h3>
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-px bg-neutral-100" />
                <div className="space-y-6">
                  {result.timeline.map((event, i) => (
                    <div key={i} className="flex items-start gap-4 relative">
                      <div className={`relative z-10 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border-2 transition-all ${
                        event.done
                          ? event.active
                            ? "border-amber-500 bg-amber-500"
                            : "border-green-500 bg-green-500"
                          : "border-neutral-200 bg-white"
                      }`}>
                        {event.done ? (
                          <CheckCircle className="h-4 w-4 text-white" />
                        ) : (
                          <div className="h-2 w-2 rounded-full bg-neutral-300" />
                        )}
                      </div>
                      <div className="pt-1">
                        <p className={`text-sm font-semibold ${
                          event.active ? "text-amber-600" : event.done ? "text-neutral-900" : "text-neutral-400"
                        }`}>
                          {event.status}
                        </p>
                        <p className="text-xs text-neutral-400 mt-0.5">{event.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Help */}
            <div className="rounded-2xl bg-neutral-50 border border-neutral-100 p-5 text-center text-sm text-neutral-500">
              Issue with your order?{" "}
              <a href="tel:+923027372812" className="font-semibold text-amber-600 hover:text-amber-700">
                Call +92 302 7372812
              </a>
            </div>
          </motion.div>
        )}

        {/* Empty state */}
        {!result && !notFound && !loading && (
          <div className="text-center py-10 text-neutral-400">
            <Package className="h-14 w-14 mx-auto mb-4 opacity-30" />
            <p className="text-sm">Enter your order number above to track your delivery.</p>
          </div>
        )}
      </div>
    </div>
  );
}
