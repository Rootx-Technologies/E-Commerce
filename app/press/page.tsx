import type { Metadata } from "next";
import { Download, ExternalLink, Mail } from "lucide-react";
import { SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Press & Media",
  description: `Press resources and media kit for ${SITE_NAME}.`,
};

const pressReleases = [
  { title: `${SITE_NAME} Launches Premium E-Commerce Platform in Pakistan`, date: "April 2026", excerpt: "Marqet officially launches its premium e-commerce platform, offering authentic branded products with a luxury shopping experience." },
  { title: "Marqet Introduces Loyalty Credits System for Pakistani Shoppers", date: "March 2026", excerpt: "New loyalty programme rewards customers with credits on every purchase, referral, and special promotion." },
  { title: "Marqet Partners with 500+ International and Local Brands", date: "February 2026", excerpt: "Strategic partnerships with leading brands ensure 100% authentic products across all categories." },
];

const stats = [
  { value: "50,000+", label: "Customers" },
  { value: "10,000+", label: "Products" },
  { value: "500+", label: "Brand Partners" },
  { value: "4.8★", label: "Customer Rating" },
];

export default function PressPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="bg-neutral-950 py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-amber-400 mb-3">Media</p>
          <h1 className="text-4xl font-black text-white">Press & Media</h1>
          <p className="mt-3 text-neutral-400">Resources for journalists, bloggers, and media partners.</p>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-14 space-y-14">

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
          {stats.map((s) => (
            <div key={s.label} className="rounded-2xl bg-neutral-50 border border-neutral-100 p-5 text-center">
              <p className="text-3xl font-black text-neutral-900">{s.value}</p>
              <p className="text-sm text-neutral-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* About */}
        <div className="rounded-2xl bg-amber-50 border border-amber-100 p-8">
          <h2 className="text-lg font-bold text-amber-900 mb-3">About {SITE_NAME}</h2>
          <p className="text-sm text-amber-800 leading-relaxed">
            {SITE_NAME} is Pakistan&apos;s premium e-commerce destination, offering authentic branded
            products across fashion, electronics, footwear, fragrances, and lifestyle categories.
            Founded in 2026, Marqet is committed to making luxury accessible to every Pakistani
            with a world-class shopping experience, fast delivery, and a unique loyalty credits system.
          </p>
        </div>

        {/* Press releases */}
        <div>
          <h2 className="text-xl font-bold text-neutral-900 mb-6">Press Releases</h2>
          <div className="space-y-4">
            {pressReleases.map((pr) => (
              <div key={pr.title} className="rounded-2xl bg-white border border-neutral-100 p-6 hover:shadow-sm transition-shadow">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold text-amber-600 mb-1">{pr.date}</p>
                    <h3 className="font-semibold text-neutral-900">{pr.title}</h3>
                    <p className="text-sm text-neutral-500 mt-2 leading-relaxed">{pr.excerpt}</p>
                  </div>
                  <button className="flex-shrink-0 flex items-center gap-1.5 text-xs font-medium text-neutral-500 hover:text-neutral-900 transition-colors">
                    <ExternalLink className="h-3.5 w-3.5" />
                    Read
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Media kit */}
        <div className="rounded-2xl bg-neutral-950 p-8">
          <h2 className="text-xl font-bold text-white mb-2">Media Kit</h2>
          <p className="text-neutral-400 text-sm mb-6">
            Download our official logos, brand guidelines, and product images for editorial use.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {["Logo Pack (SVG/PNG)", "Brand Guidelines PDF", "Product Photography"].map((item) => (
              <button
                key={item}
                className="flex items-center gap-3 rounded-xl bg-white/10 border border-white/10 px-4 py-3 text-sm font-medium text-white hover:bg-white/20 transition-colors"
              >
                <Download className="h-4 w-4 text-amber-400" />
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* Press contact */}
        <div className="rounded-2xl bg-neutral-50 border border-neutral-100 p-6 text-center">
          <Mail className="h-8 w-8 text-amber-500 mx-auto mb-3" />
          <h3 className="font-semibold text-neutral-900">Press Enquiries</h3>
          <p className="text-sm text-neutral-500 mt-1">For interviews, quotes, or media requests:</p>
          <a href="mailto:press@faizan.com" className="mt-3 inline-block text-sm font-semibold text-amber-600 hover:text-amber-700">
            press@faizan.com
          </a>
        </div>
      </div>
    </div>
  );
}
