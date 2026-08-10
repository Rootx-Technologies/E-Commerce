import type { Metadata } from "next";
import { WishlistClient } from "./wishlist-client";

export const metadata: Metadata = {
  title: "My Wishlist",
  description: "Your saved products on RAMZAN.",
};

export default function WishlistPage() {
  return <WishlistClient />;
}
