import type { Metadata } from "next";
import { AdminCouponsClient } from "./coupons-client";

export const metadata: Metadata = { title: "Coupons" };

export default function AdminCouponsPage() {
  return <AdminCouponsClient />;
}
