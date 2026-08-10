"use client";

import { useState } from "react";
import { ChevronDown, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const categories = [
  {
    label: "Orders & Payments",
    faqs: [
      { q: "How do I place an order?", a: "Browse our products, add items to your cart, and proceed to checkout. Fill in your shipping details and choose a payment method — Cash on Delivery or Card via Stripe." },
      { q: "What payment methods do you accept?", a: "We accept Cash on Delivery (COD), Visa, Mastercard, JazzCash, and EasyPaisa through our secure Stripe payment gateway." },
      { q: "Can I modify or cancel my order?", a: "You can cancel or modify your order within 1 hour of placing it by contacting our support team. Once dispatched, orders cannot be modified." },
      { q: "How do I track my order?", a: "Visit the Track Order page and enter your order number and phone number. You will also receive SMS and email updates at each stage of delivery." },
      { q: "Is it safe to pay online on Marqet?", a: "Absolutely. All transactions are secured with 256-bit SSL encryption. We use Stripe, a globally trusted payment processor, and never store your card details." },
    ],
  },
  {
    label: "Shipping & Delivery",
    faqs: [
      { q: "How long does delivery take?", a: "Standard delivery takes 3–5 business days across Pakistan. Express delivery (1–2 days) is available in major cities for an additional charge." },
      { q: "Do you offer free shipping?", a: "Yes! Orders above PKR 5,000 qualify for free standard shipping anywhere in Pakistan." },
      { q: "Do you ship internationally?", a: "Currently we only ship within Pakistan. International shipping is coming soon — sign up for our newsletter to be notified." },
      { q: "What if my order is delayed?", a: "If your order hasn't arrived within the estimated timeframe, please contact our support team with your order number and we'll investigate immediately." },
    ],
  },
  {
    label: "Returns & Refunds",
    faqs: [
      { q: "What is your return policy?", a: "We offer a 30-day return policy. Items must be unused, in original packaging, and accompanied by proof of purchase. Some items like undergarments and personalised products are non-returnable." },
      { q: "How do I initiate a return?", a: "Contact our support team via the Contact page or WhatsApp with your order number and reason for return. We'll arrange a pickup or provide a return address." },
      { q: "When will I receive my refund?", a: "Refunds are processed within 7–10 business days after we receive and inspect the returned item. The amount is credited to your original payment method." },
      { q: "What if I receive a damaged or wrong item?", a: "We sincerely apologise! Please contact us within 48 hours of delivery with photos of the item. We'll arrange a free replacement or full refund immediately." },
    ],
  },
  {
    label: "Products & Authenticity",
    faqs: [
      { q: "Are all products on Marqet authentic?", a: "Yes, 100%. We source directly from authorised distributors and brand partners. Every product comes with authenticity guarantee — or your money back." },
      { q: "How do I know if a product is in stock?", a: "Stock availability is shown on each product page. If an item is out of stock, you can add it to your wishlist to be notified when it's back." },
      { q: "Can I request a product that's not listed?", a: "Yes! Contact us with the product details and we'll do our best to source it for you." },
    ],
  },
  {
    label: "Loyalty Credits",
    faqs: [
      { q: "What are Marqet Credits?", a: "Credits are our loyalty reward points. You earn 2% of every order value as credits, plus bonus credits for referrals and special promotions." },
      { q: "How do I use my credits?", a: "At checkout, you can choose to apply your credits as a discount. 1 credit = PKR 1 in discount value." },
      { q: "Do credits expire?", a: "Credits are valid for 12 months from the date they are earned. Credits earned from promotions may have shorter validity periods." },
      { q: "How do I earn referral credits?", a: "Share your unique referral code with friends. When they make their first purchase, you both receive 500 bonus credits." },
    ],
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-neutral-100 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between gap-4 py-4 text-left"
        aria-expanded={open}
      >
        <span className={cn("text-sm font-medium transition-colors", open ? "text-amber-600" : "text-neutral-900")}>
          {q}
        </span>
        <ChevronDown className={cn("h-4 w-4 flex-shrink-0 text-neutral-400 transition-transform duration-200", open && "rotate-180 text-amber-500")} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <p className="pb-4 text-sm text-neutral-500 leading-relaxed">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState(categories[0].label);

  const filtered = categories.map((cat) => ({
    ...cat,
    faqs: cat.faqs.filter(
      (f) =>
        f.q.toLowerCase().includes(search.toLowerCase()) ||
        f.a.toLowerCase().includes(search.toLowerCase())
    ),
  })).filter((cat) => cat.faqs.length > 0);

  const display = search ? filtered : categories.filter((c) => c.label === activeCategory);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="bg-neutral-950 py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-amber-400 mb-3">Help Centre</p>
          <h1 className="text-4xl font-black text-white">Frequently Asked Questions</h1>
          <p className="mt-3 text-neutral-400">Find quick answers to common questions.</p>
          {/* Search */}
          <div className="mt-8 relative max-w-md mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search questions..."
              className="w-full rounded-xl bg-white/10 border border-white/20 pl-11 pr-4 py-3 text-sm text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-14">
        {!search && (
          /* Category tabs */
          <div className="flex flex-wrap gap-2 mb-10">
            {categories.map((cat) => (
              <button
                key={cat.label}
                onClick={() => setActiveCategory(cat.label)}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium transition-all",
                  activeCategory === cat.label
                    ? "bg-neutral-900 text-white"
                    : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>
        )}

        <div className="space-y-10">
          {display.map((cat) => (
            <div key={cat.label}>
              {search && (
                <h2 className="text-base font-bold text-neutral-900 mb-2">{cat.label}</h2>
              )}
              <div className="rounded-2xl bg-white border border-neutral-100 px-6 divide-y divide-neutral-50">
                {cat.faqs.map((faq) => (
                  <FAQItem key={faq.q} q={faq.q} a={faq.a} />
                ))}
              </div>
            </div>
          ))}
          {search && filtered.length === 0 && (
            <div className="text-center py-16">
              <p className="text-neutral-500">No results for &ldquo;{search}&rdquo;</p>
              <button onClick={() => setSearch("")} className="mt-3 text-sm text-amber-600 hover:text-amber-700">
                Clear search
              </button>
            </div>
          )}
        </div>

        {/* Still need help */}
        <div className="mt-14 rounded-2xl bg-neutral-950 p-8 text-center">
          <h3 className="text-lg font-bold text-white">Still need help?</h3>
          <p className="mt-2 text-neutral-400 text-sm">Our support team is available Mon–Sat, 9am–8pm PKT.</p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <a href="tel:+923027372812" className="inline-flex items-center gap-2 rounded-lg bg-amber-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-amber-600 transition-colors">
              Call Us
            </a>
            <a href="mailto:support@faizan.com" className="inline-flex items-center gap-2 rounded-lg border border-white/20 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/10 transition-colors">
              Email Support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
