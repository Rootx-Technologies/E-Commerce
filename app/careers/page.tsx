import type { Metadata } from "next";
import Link from "next/link";
import { MapPin, Clock, ArrowRight, Users, TrendingUp, Heart, Zap } from "lucide-react";
import { SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Careers",
  description: `Join the Marqet team and help build Pakistan's premium e-commerce platform.`,
};

const openings = [
  { title: "Senior Frontend Developer", dept: "Engineering", type: "Full-time", location: "Lahore / Remote" },
  { title: "Backend Engineer (Node.js)", dept: "Engineering", type: "Full-time", location: "Lahore" },
  { title: "Product Manager", dept: "Product", type: "Full-time", location: "Lahore" },
  { title: "UI/UX Designer", dept: "Design", type: "Full-time", location: "Lahore / Remote" },
  { title: "Digital Marketing Specialist", dept: "Marketing", type: "Full-time", location: "Lahore" },
  { title: "Customer Support Executive", dept: "Support", type: "Full-time", location: "Lahore" },
  { title: "Content Writer (Urdu/English)", dept: "Marketing", type: "Part-time", location: "Remote" },
  { title: "Warehouse & Logistics Coordinator", dept: "Operations", type: "Full-time", location: "Lahore" },
];

const perks = [
  { icon: TrendingUp, title: "Competitive Salary", desc: "Market-leading compensation with annual reviews." },
  { icon: Heart, title: "Health Benefits", desc: "Medical coverage for you and your family." },
  { icon: Zap, title: "Fast Growth", desc: "Work at a fast-growing startup with real impact." },
  { icon: Users, title: "Great Team", desc: "Collaborate with talented, passionate people." },
];

const deptColors: Record<string, string> = {
  Engineering: "bg-blue-100 text-blue-700",
  Product: "bg-violet-100 text-violet-700",
  Design: "bg-pink-100 text-pink-700",
  Marketing: "bg-amber-100 text-amber-700",
  Support: "bg-green-100 text-green-700",
  Operations: "bg-orange-100 text-orange-700",
};

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="bg-neutral-950 py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-amber-400 mb-3">We&apos;re Hiring</p>
          <h1 className="text-5xl font-black text-white tracking-tight">
            Build the Future of<br />Shopping in Pakistan
          </h1>
          <p className="mt-5 text-neutral-400 max-w-xl mx-auto leading-relaxed">
            Join {SITE_NAME} and help us create the most premium e-commerce experience
            for millions of Pakistanis. We&apos;re a fast-growing team that values talent,
            creativity, and impact.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16 space-y-16">

        {/* Perks */}
        <div>
          <h2 className="text-xl font-bold text-neutral-900 mb-6">Why Join Us?</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
            {perks.map((perk) => (
              <div key={perk.title} className="rounded-2xl bg-neutral-50 border border-neutral-100 p-5 text-center">
                <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-xl bg-amber-50 mb-3">
                  <perk.icon className="h-6 w-6 text-amber-600" />
                </div>
                <p className="font-semibold text-neutral-900 text-sm">{perk.title}</p>
                <p className="text-xs text-neutral-500 mt-1">{perk.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Open positions */}
        <div>
          <h2 className="text-xl font-bold text-neutral-900 mb-6">
            Open Positions
            <span className="ml-2 text-sm font-normal text-neutral-400">({openings.length} roles)</span>
          </h2>
          <div className="space-y-3">
            {openings.map((job) => (
              <div
                key={job.title}
                className="group flex items-center justify-between gap-4 rounded-2xl bg-white border border-neutral-100 p-5 hover:border-amber-200 hover:shadow-sm transition-all cursor-pointer"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div>
                    <p className="font-semibold text-neutral-900 group-hover:text-amber-700 transition-colors">
                      {job.title}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 mt-1.5">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${deptColors[job.dept] ?? "bg-neutral-100 text-neutral-600"}`}>
                        {job.dept}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-neutral-400">
                        <Clock className="h-3 w-3" />{job.type}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-neutral-400">
                        <MapPin className="h-3 w-3" />{job.location}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-amber-600 flex-shrink-0 group-hover:gap-3 transition-all">
                  Apply <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* No role? */}
        <div className="rounded-2xl bg-neutral-950 p-10 text-center">
          <h3 className="text-xl font-bold text-white">Don&apos;t see your role?</h3>
          <p className="mt-2 text-neutral-400 text-sm max-w-md mx-auto">
            We&apos;re always looking for exceptional talent. Send us your CV and we&apos;ll keep you in mind for future openings.
          </p>
          <a
            href="mailto:careers@faizan.com"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-amber-500 px-6 py-3 text-sm font-semibold text-white hover:bg-amber-600 transition-colors"
          >
            Send Your CV
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
