import type { Metadata } from "next";
import Link from "next/link";
import { Truck, Clock, MapPin, Package, CheckCircle, AlertCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Shipping Policy",
  description: "Learn about Marqet's shipping options, delivery times, and charges.",
};

const shippingOptions = [
  {
    name: "Standard Delivery",
    time: "3–5 Business Days",
    cost: "PKR 250",
    free: "Free on orders above PKR 5,000",
    icon: Truck,
    color: "bg-blue-50 text-blue-600",
  },
  {
    name: "Express Delivery",
    time: "1–2 Business Days",
    cost: "PKR 500",
    free: "Available in major cities",
    icon: Clock,
    color: "bg-amber-50 text-amber-600",
  },
  {
    name: "Same Day Delivery",
    time: "Within 6–8 Hours",
    cost: "PKR 800",
    free: "Lahore only (order before 12pm)",
    icon: Package,
    color: "bg-emerald-50 text-emerald-600",
  },
];

const cities = [
  "Lahore", "Karachi", "Islamabad", "Rawalpindi", "Faisalabad",
  "Multan", "Peshawar", "Quetta", "Sialkot", "Gujranwala",
  "Hyderabad", "Bahawalpur", "Sargodha", "Sukkur", "Larkana",
];

export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="bg-neutral-950 py-14">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-amber-400 mb-3">Delivery</p>
          <h1 className="text-4xl font-black text-white">Shipping Policy</h1>
          <p className="mt-3 text-neutral-400">Fast, reliable delivery across Pakistan.</p>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-14 space-y-14">

        {/* Shipping options */}
        <div>
          <h2 className="text-xl font-bold text-neutral-900 mb-6">Delivery Options</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {shippingOptions.map((opt) => (
              <div key={opt.name} className="rounded-2xl border border-neutral-100 bg-white p-6 hover:shadow-md transition-shadow">
                <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${opt.color} mb-4`}>
                  <opt.icon className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-neutral-900">{opt.name}</h3>
                <p className="text-2xl font-black text-neutral-900 mt-1">{opt.time}</p>
                <p className="text-sm font-semibold text-amber-600 mt-1">{opt.cost}</p>
                <p className="text-xs text-neutral-500 mt-2">{opt.free}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Free shipping banner */}
        <div className="rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 p-8 text-white text-center">
          <Truck className="h-10 w-10 mx-auto mb-3 opacity-90" />
          <h2 className="text-2xl font-black">Free Shipping on Orders Over PKR 5,000</h2>
          <p className="mt-2 text-amber-100">Standard delivery, anywhere in Pakistan — no code needed.</p>
        </div>

        {/* Coverage */}
        <div>
          <h2 className="text-xl font-bold text-neutral-900 mb-2 flex items-center gap-2">
            <MapPin className="h-5 w-5 text-amber-500" />
            Delivery Coverage
          </h2>
          <p className="text-sm text-neutral-500 mb-5">We deliver to all cities and towns across Pakistan.</p>
          <div className="flex flex-wrap gap-2">
            {cities.map((city) => (
              <span key={city} className="rounded-full bg-neutral-100 px-3 py-1.5 text-sm text-neutral-700">
                {city}
              </span>
            ))}
            <span className="rounded-full bg-amber-100 px-3 py-1.5 text-sm text-amber-700 font-medium">
              + All other cities
            </span>
          </div>
        </div>

        {/* Important notes */}
        <div>
          <h2 className="text-xl font-bold text-neutral-900 mb-5">Important Notes</h2>
          <div className="space-y-3">
            {[
              { icon: CheckCircle, color: "text-green-500", text: "Orders placed before 2pm (Mon–Sat) are dispatched the same day." },
              { icon: CheckCircle, color: "text-green-500", text: "You will receive an SMS and email with your tracking number once your order is dispatched." },
              { icon: CheckCircle, color: "text-green-500", text: "Our delivery partners will attempt delivery twice before returning the package." },
              { icon: AlertCircle, color: "text-amber-500", text: "Delivery times are estimates and may vary during peak seasons, public holidays, or due to weather conditions." },
              { icon: AlertCircle, color: "text-amber-500", text: "Marqet is not responsible for delays caused by incorrect or incomplete delivery addresses." },
              { icon: AlertCircle, color: "text-amber-500", text: "Remote areas may require additional 1–2 days beyond the standard delivery window." },
            ].map((note, i) => (
              <div key={i} className="flex items-start gap-3 rounded-xl bg-neutral-50 border border-neutral-100 p-4">
                <note.icon className={`h-5 w-5 flex-shrink-0 mt-0.5 ${note.color}`} />
                <p className="text-sm text-neutral-600">{note.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div className="rounded-2xl bg-neutral-50 border border-neutral-100 p-6 text-center">
          <p className="text-sm text-neutral-600">
            Shipping questions?{" "}
            <Link href="/contact" className="font-semibold text-amber-600 hover:text-amber-700">Contact our team</Link>
            {" "}or visit our{" "}
            <Link href="/faq" className="font-semibold text-amber-600 hover:text-amber-700">FAQ page</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}
