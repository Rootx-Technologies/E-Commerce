import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SITE_NAME } from "@/lib/constants";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center gap-6">
      <div>
        <p className="text-8xl font-black text-neutral-100 select-none">404</p>
        <h1 className="text-2xl font-bold text-neutral-900 -mt-4">Page Not Found</h1>
        <p className="mt-2 text-neutral-500 max-w-sm mx-auto">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-3">
        <Link href="/"><Button size="lg">Go Home</Button></Link>
        <Link href="/products"><Button size="lg" variant="outline">Browse Products</Button></Link>
      </div>
      <p className="text-xs text-neutral-400">{SITE_NAME} · Premium E-Commerce</p>
    </div>
  );
}
