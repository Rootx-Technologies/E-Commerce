"use client";

import { CheckCircle, MessageCircle } from "lucide-react";

// TODO: Replace with your actual WhatsApp number (with country code, no + or spaces)
const WHATSAPP_NUMBER = "923001234567";
const WHATSAPP_MESSAGE = "Hi! I'd like to know more about your exclusive deals and new arrivals.";

export function NewsletterSection() {
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

  return (
    <section className="bg-neutral-900 py-10 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-xl text-center">
          <div className="flex justify-center mb-3">
            <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-green-500/20">
              <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6 text-green-400" />
            </div>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Stay in the Loop</h2>
          <p className="mt-2 text-sm text-neutral-400">
            Exclusive deals, new arrivals, and special offers — contact us on WhatsApp!
          </p>

          <div className="mt-6">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2.5 h-11 px-6 rounded-lg bg-green-500 hover:bg-green-600 active:bg-green-700 text-white text-sm font-semibold transition-colors duration-200 shadow-md shadow-green-900/30"
            >
              <MessageCircle className="h-5 w-5" />
              Contact us on WhatsApp
            </a>
          </div>

          <div className="mt-5 flex flex-wrap justify-center gap-3 sm:gap-5">
            {["Exclusive deals", "Early access", "New arrivals"].map((perk) => (
              <span key={perk} className="flex items-center gap-1 text-[10px] sm:text-xs text-neutral-500">
                <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                {perk}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

