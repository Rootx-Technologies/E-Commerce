"use client";

import { usePathname } from "next/navigation";
import { Header } from "./header";
import { Footer } from "./footer";
import { CartDrawer } from "./cart-drawer";
import { SearchModal } from "./search-modal";
import { PageTransition } from "./page-transition";

export function StoreLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/admin");

  if (isAdminRoute) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      <PageTransition>
        <main className="flex-1">{children}</main>
      </PageTransition>
      <Footer />
      <CartDrawer />
      <SearchModal />
    </>
  );
}
