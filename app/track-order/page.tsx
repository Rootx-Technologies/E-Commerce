import type { Metadata } from "next";
import { TrackOrderClient } from "./track-order-client";

export const metadata: Metadata = {
  title: "Track Your Order",
  description: "Track the status of your RAMZAN order in real time.",
};

export default function TrackOrderPage() {
  return <TrackOrderClient />;
}
