import type { Metadata } from "next";
import Link from "next/link";
import { RefreshCw, CheckCircle, XCircle, Clock, Package, Phone } from "lucide-react";

export const metadata: Metadata = {
  title: "Returns & Exchanges",
  description: "Marqet's hassle-free 30-day return and exchange policy.",
};

const eligible = [
  "Item received in damaged or defective condition",
  "Wrong item delivered",
  "Item significantly different from the product description",
  "Unused items in original packaging within 30 days",
  "Items with all original tags and accessories intact",
];

const notEligible = [
  "Items that have been used, washed, or altered",
  "Undergarments, swimwear, and intimate apparel",
  "Personalised or custom-made products",
  "Perishable goods and consumables",
  "Items returned after 30 days of delivery",
  "Products with removed or damaged tags",
  "Digital products and gift cards",
];

const steps = [
  { step: "01", title: "Contact Support", desc: "Reach out via WhatsApp, email, or our Contact page with your order number and reason for return.", icon: Phone },
  { step: "02", title: "Get Approval", desc: "Our team will review your request within 24 hours and send you a return authorisation.", icon: CheckCircle },
  { step: "03", title: "Pack & Ship", desc: "Pack the item securely in its original packaging. We'll arrange a pickup or provide a return address.", icon: Package },
  { step: "04", title: "Refund Processed", desc: "Once we receive and inspect the item, your refund is processed within 7–10 business days.", icon: RefreshCw },
];

export default function ReturnsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="bg-neutral-950 py-14">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-amber-400 mb-3">Customer Care</p>
          <h1 className="text-4xl font-black text-white">Returns & Exchanges</h1>
          <p className="mt-3 text-neutral-400">Hassle-free 30-day returns. No questions asked.</p>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-14 space-y-14">

        {/* Policy highlight */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {[
            { icon: Clock, title: "30-Day Window", desc: "Return any eligible item within 30 days of delivery.", color: "bg-blue-50 text-blue-600" },
            { icon: RefreshCw, title: "Free Exchange", desc: "Exchange for a different size or colour at no extra cost.", color: "bg-emerald-50 text-emerald-600" },
            { icon: CheckCircle, title: "Full Refund", desc: "Get a complete refund to your original payment method.", color: "bg-amber-50 text-amber-600" },
          ].map((item) => (
            <div key={item.title} className="rounded-2xl border border-neutral-100 bg-white p-6 text-center hover:shadow-md transition-shadow">
              <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${item.color} mb-4`}>
                <item.icon className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-neutral-900">{item.title}</h3>
              <p className="text-sm text-neutral-500 mt-1">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* How it works */}
        <div>
          <h2 className="text-xl font-bold text-neutral-900 mb-8">How to Return</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {steps.map((s) => (
              <div key={s.step} className="relative rounded-2xl bg-neutral-50 border border-neutral-100 p-6">
                <span className="text-4xl font-black text-neutral-100 absolute top-4 right-4">{s.step}</span>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 mb-4">
                  <s.icon className="h-5 w-5 text-amber-600" />
                </div>
                <h3 className="font-semibold text-neutral-900 mb-1">{s.title}</h3>
                <p className="text-sm text-neutral-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Eligible / Not eligible */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-green-100 bg-green-50 p-6">
            <h3 className="font-bold text-green-800 mb-4 flex items-center gap-2">
              <CheckCircle className="h-5 w-5" /> Eligible for Return
            </h3>
            <ul className="space-y-2.5">
              {eligible.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-green-700">
                  <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-green-500" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-red-100 bg-red-50 p-6">
            <h3 className="font-bold text-red-800 mb-4 flex items-center gap-2">
              <XCircle className="h-5 w-5" /> Not Eligible for Return
            </h3>
            <ul className="space-y-2.5">
              {notEligible.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-red-700">
                  <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-red-400" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Refund timeline */}
        <div className="rounded-2xl bg-neutral-50 border border-neutral-100 p-6">
          <h2 className="text-lg font-bold text-neutral-900 mb-4">Refund Timeline</h2>
          <div className="space-y-3">
            {[
              { method: "Credit / Debit Card", time: "7–10 business days" },
              { method: "JazzCash / EasyPaisa", time: "3–5 business days" },
              { method: "Cash on Delivery (Bank Transfer)", time: "5–7 business days" },
              { method: "Marqet Credits", time: "Instant" },
            ].map((r) => (
              <div key={r.method} className="flex items-center justify-between py-2 border-b border-neutral-100 last:border-0">
                <span className="text-sm text-neutral-700">{r.method}</span>
                <span className="text-sm font-semibold text-neutral-900">{r.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="rounded-2xl bg-neutral-950 p-8 text-center">
          <h3 className="text-lg font-bold text-white">Need to start a return?</h3>
          <p className="mt-2 text-neutral-400 text-sm">Our team will guide you through the process.</p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <a href="tel:+923027372812" className="inline-flex items-center gap-2 rounded-lg bg-amber-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-amber-600 transition-colors">
              Call +92 302 7372812
            </a>
            <Link href="/contact" className="inline-flex items-center gap-2 rounded-lg border border-white/20 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/10 transition-colors">
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
