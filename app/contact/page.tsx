import type { Metadata } from "next";
import { ContactForm } from "./contact-form";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with the Marqet support team.",
};

const contactInfo = [
  { icon: Phone, label: "Phone", value: "+92 302 7372812", href: "tel:+923027372812" },
  { icon: Mail, label: "Email", value: "support@faizan.com", href: "mailto:support@faizan.com" },
  { icon: MapPin, label: "Address", value: "Gulberg III, Lahore, Punjab, Pakistan", href: null },
  { icon: Clock, label: "Hours", value: "Mon–Sat: 9am – 8pm PKT", href: null },
];

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="bg-neutral-950 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-amber-400 mb-3">Support</p>
          <h1 className="text-4xl sm:text-5xl font-black text-white">Get in Touch</h1>
          <p className="mt-4 text-neutral-400 max-w-lg mx-auto">
            Have a question or need help? Our team is here for you.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Contact info */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h2 className="text-xl font-bold text-neutral-900 mb-2">Contact Information</h2>
              <p className="text-sm text-neutral-500">
                Reach out through any of these channels and we&apos;ll respond within 24 hours.
              </p>
            </div>

            <div className="space-y-4">
              {contactInfo.map((item) => (
                <div key={item.label} className="flex items-start gap-4 rounded-xl bg-neutral-50 border border-neutral-100 p-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-amber-50">
                    <item.icon className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                      {item.label}
                    </p>
                    {item.href ? (
                      <a href={item.href} className="text-sm font-medium text-neutral-900 hover:text-amber-600 transition-colors mt-0.5 block">
                        {item.value}
                      </a>
                    ) : (
                      <p className="text-sm font-medium text-neutral-900 mt-0.5">{item.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* FAQ quick links */}
            <div className="rounded-xl bg-amber-50 border border-amber-100 p-5">
              <p className="text-sm font-semibold text-amber-900 mb-3">Quick Help</p>
              <ul className="space-y-2">
                {["Track my order", "Return & refund policy", "Payment issues", "Product authenticity"].map((q) => (
                  <li key={q}>
                    <a href="/faq" className="text-sm text-amber-700 hover:text-amber-900 hover:underline transition-colors">
                      → {q}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-3">
            <div className="rounded-2xl bg-white border border-neutral-100 p-8">
              <h2 className="text-xl font-bold text-neutral-900 mb-6">Send us a Message</h2>
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
