import { Truck, Shield, RefreshCw, Headphones } from "lucide-react";

const features = [
  { icon: Truck, title: "Free Shipping", description: "Orders over ₨5,000" },
  { icon: Shield, title: "Secure Payment", description: "100% safe checkout" },
  { icon: RefreshCw, title: "Easy Returns", description: "30-day policy" },
  { icon: Headphones, title: "24/7 Support", description: "Always here for you" },
];

export function FeaturesBar() {
  return (
    <section className="border-b border-neutral-200/80 bg-white/80 py-5 sm:py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="flex items-center gap-3 rounded-2xl border border-neutral-200 bg-gradient-to-br from-white to-amber-50/80 p-3 shadow-[0_10px_30px_rgba(15,23,42,0.04)] transition-transform duration-200 hover:-translate-y-0.5"
            >
              <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 text-amber-700 shadow-inner">
                <feature.icon className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-xs font-semibold text-neutral-900 sm:text-sm">{feature.title}</p>
                <p className="truncate text-[10px] text-neutral-500 sm:text-xs">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
