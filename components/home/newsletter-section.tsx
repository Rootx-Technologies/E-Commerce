"use client";

import { useState } from "react";
import { Mail, ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    try {
      await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
    }
  };

  return (
    <section className="bg-neutral-900 py-10 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-xl text-center">
          <div className="flex justify-center mb-3">
            <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-amber-500/20">
              <Mail className="h-5 w-5 sm:h-6 sm:w-6 text-amber-400" />
            </div>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Stay in the Loop</h2>
          <p className="mt-2 text-sm text-neutral-400">
            Exclusive deals, new arrivals, and special offers — straight to your inbox.
          </p>

          {status === "success" ? (
            <div className="mt-6 flex items-center justify-center gap-2 text-green-400">
              <CheckCircle className="h-5 w-5" />
              <span className="text-sm font-medium">You&apos;re subscribed! Check your inbox.</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 flex flex-col sm:flex-row gap-2.5 max-w-sm mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="flex-1 h-11 rounded-lg border border-neutral-700 bg-neutral-800 px-4 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                aria-label="Email address"
              />
              <Button type="submit" variant="gold" isLoading={status === "loading"}
                className="h-11 px-5 flex-shrink-0 gap-2 text-sm">
                Subscribe
                <ArrowRight className="h-4 w-4" />
              </Button>
            </form>
          )}

          <div className="mt-4 flex flex-wrap justify-center gap-3 sm:gap-5">
            {["Exclusive deals", "Early access", "New arrivals", "500 credits on signup"].map((perk) => (
              <span key={perk} className="flex items-center gap-1 text-[10px] sm:text-xs text-neutral-500">
                <CheckCircle className="h-3 w-3 text-amber-500 flex-shrink-0" />
                {perk}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
