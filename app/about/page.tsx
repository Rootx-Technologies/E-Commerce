import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Shield, Truck, RefreshCw, Headphones, Star, Users, Package, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about Marqet — Pakistan's premium e-commerce destination.",
};

const values = [
  { icon: Shield, title: "Authenticity", desc: "Every product is 100% genuine, sourced directly from authorized distributors." },
  { icon: Star, title: "Quality First", desc: "We curate only the finest products that meet our strict quality standards." },
  { icon: Truck, title: "Fast Delivery", desc: "Nationwide delivery with real-time tracking and express options." },
  { icon: Headphones, title: "Customer Care", desc: "Dedicated support team available 7 days a week to assist you." },
];

const stats = [
  { icon: Users, value: "50,000+", label: "Happy Customers" },
  { icon: Package, value: "10,000+", label: "Products" },
  { icon: Award, value: "500+", label: "Brands" },
  { icon: Star, value: "4.8/5", label: "Average Rating" },
];

const team = [
  { name: "Ahmed Raza", role: "Founder & CEO", initials: "AR" },
  { name: "Sara Khan", role: "Head of Operations", initials: "SK" },
  { name: "Bilal Ahmed", role: "Tech Lead", initials: "BA" },
  { name: "Nadia Malik", role: "Head of Marketing", initials: "NM" },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="relative overflow-hidden bg-neutral-950 py-24">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-900/20 via-neutral-950 to-neutral-950" />
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-amber-400 mb-4">Our Story</p>
          <h1 className="text-5xl sm:text-6xl font-black text-white tracking-tight leading-tight">
            Redefining Premium<br />Shopping in Pakistan
          </h1>
          <p className="mt-6 text-lg text-neutral-400 max-w-2xl mx-auto leading-relaxed">
            {SITE_NAME} was born from a simple belief — every Pakistani deserves access to
            authentic, premium products at fair prices, delivered with world-class service.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-white border-b border-neutral-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <div className="flex justify-center mb-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50">
                    <s.icon className="h-6 w-6 text-amber-600" />
                  </div>
                </div>
                <p className="text-3xl font-black text-neutral-900">{s.value}</p>
                <p className="text-sm text-neutral-500 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mission */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-amber-600 mb-3">Our Mission</p>
            <h2 className="text-3xl font-bold text-neutral-900 leading-tight">
              Making Premium Accessible to Everyone
            </h2>
            <p className="mt-5 text-neutral-600 leading-relaxed">
              We started {SITE_NAME} in 2023 with a mission to bridge the gap between
              international quality and local accessibility. We partner directly with brands
              and authorized distributors to bring you genuine products at competitive prices.
            </p>
            <p className="mt-4 text-neutral-600 leading-relaxed">
              Our loyalty credits system, transparent pricing, and hassle-free returns are
              all part of our commitment to putting customers first — always.
            </p>
            <div className="mt-8">
              <Link href="/products">
                <Button size="lg" variant="gold">Shop Now</Button>
              </Link>
            </div>
          </div>
          <div className="relative h-80 lg:h-96 rounded-2xl overflow-hidden bg-neutral-100">
            <Image
              src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80"
              alt="Marqet store"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>
      </div>

      {/* Values */}
      <div className="bg-neutral-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold uppercase tracking-widest text-amber-600 mb-3">What We Stand For</p>
            <h2 className="text-3xl font-bold text-neutral-900">Our Core Values</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v) => (
              <div key={v.title} className="rounded-2xl bg-white border border-neutral-100 p-6 hover:shadow-md transition-shadow">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 mb-4">
                  <v.icon className="h-6 w-6 text-amber-600" />
                </div>
                <h3 className="font-semibold text-neutral-900 mb-2">{v.title}</h3>
                <p className="text-sm text-neutral-500 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <p className="text-xs font-semibold uppercase tracking-widest text-amber-600 mb-3">The People</p>
          <h2 className="text-3xl font-bold text-neutral-900">Meet Our Team</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {team.map((member) => (
            <div key={member.name} className="text-center">
              <div className="flex h-20 w-20 mx-auto items-center justify-center rounded-full bg-neutral-900 text-white text-xl font-bold mb-4">
                {member.initials}
              </div>
              <p className="font-semibold text-neutral-900">{member.name}</p>
              <p className="text-sm text-neutral-500 mt-0.5">{member.role}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="bg-neutral-950 py-16">
        <div className="mx-auto max-w-2xl px-4 text-center">
          <h2 className="text-3xl font-bold text-white">Ready to Experience {SITE_NAME}?</h2>
          <p className="mt-3 text-neutral-400">
            Join 50,000+ customers who trust us for their premium shopping needs.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/products"><Button size="lg" variant="gold">Shop Now</Button></Link>
            <Link href="/contact"><Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">Contact Us</Button></Link>
          </div>
        </div>
      </div>
    </div>
  );
}
