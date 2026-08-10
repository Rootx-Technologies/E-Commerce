"use client";

import { Star } from "lucide-react";
import { motion } from "framer-motion";
import { SectionHeader } from "./section-header";

const testimonials = [
  { id: 1, name: "Ayesha Khan", location: "Lahore", rating: 5, text: "Absolutely love the quality! Packaging is premium and delivery was super fast. Will definitely order again!", avatar: "AK", product: "Embroidered Lawn Suit" },
  { id: 2, name: "Muhammad Ali", location: "Karachi", rating: 5, text: "Best online shopping experience in Pakistan. The loyalty credits system is amazing — saved so much!", avatar: "MA", product: "Smart Watch" },
  { id: 3, name: "Fatima Malik", location: "Islamabad", rating: 5, text: "Product quality exceeded my expectations. Customer service was very helpful. Highly recommended!", avatar: "FM", product: "Leather Handbag" },
  { id: 4, name: "Usman Raza", location: "Faisalabad", rating: 4, text: "Great branded products at competitive prices. Flash sales are incredible — got 40% off!", avatar: "UR", product: "Running Shoes" },
];

export function TestimonialsSection() {
  return (
    <section className="py-10 sm:py-16 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader title="What Our Customers Say" subtitle="Reviews" centered />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mt-6 sm:mt-8">
          {testimonials.map((t, i) => (
            <motion.div key={t.id}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.08 }}
              className="rounded-2xl border border-neutral-100 bg-neutral-50 p-4 sm:p-5 hover:shadow-md transition-shadow">
              {/* Stars */}
              <div className="flex items-center gap-0.5 mb-3">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star key={j} className={`h-3.5 w-3.5 ${j < t.rating ? "text-amber-400 fill-amber-400" : "text-neutral-200 fill-neutral-200"}`} />
                ))}
              </div>

              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed mb-3 line-clamp-3">
                &ldquo;{t.text}&rdquo;
              </p>

              <p className="text-[10px] text-neutral-400 mb-3">
                Purchased: <span className="font-medium text-neutral-600">{t.product}</span>
              </p>

              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-900 text-[10px] font-bold text-white flex-shrink-0">
                  {t.avatar}
                </div>
                <div>
                  <p className="text-xs font-semibold text-neutral-900">{t.name}</p>
                  <p className="text-[10px] text-neutral-400">{t.location}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
