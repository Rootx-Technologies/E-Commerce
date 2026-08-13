import type { Metadata } from "next";
import { CompareClient } from "./compare-client";

export const metadata: Metadata = {
  title: "Compare Products",
  description: "Compare products side by side",
};

export default function ComparePage() {
  return <CompareClient />;
}
