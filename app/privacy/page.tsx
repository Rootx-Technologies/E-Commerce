import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Marqet collects, uses, and protects your personal information.",
};

const sections = [
  {
    title: "1. Information We Collect",
    content: [
      "Personal identification information (name, email address, phone number, postal address) when you register or place an order.",
      "Payment information processed securely through Stripe — we never store your full card details.",
      "Device and usage data including IP address, browser type, pages visited, and time spent on our platform.",
      "Order history, wishlist items, and preferences to personalise your shopping experience.",
    ],
  },
  {
    title: "2. How We Use Your Information",
    content: [
      "To process and fulfil your orders, including sending order confirmations and delivery updates.",
      "To communicate with you about promotions, new arrivals, and special offers (you may opt out at any time).",
      "To improve our website, products, and services based on your feedback and usage patterns.",
      "To prevent fraud, enforce our terms, and comply with legal obligations.",
      "To manage our loyalty credits programme and referral system.",
    ],
  },
  {
    title: "3. Information Sharing",
    content: [
      "We do not sell, trade, or rent your personal information to third parties.",
      "We share data with trusted service providers (delivery partners, payment processors) solely to fulfil your orders.",
      "We may disclose information when required by law or to protect the rights and safety of Marqet and its users.",
      "In the event of a business merger or acquisition, your data may be transferred as part of that transaction.",
    ],
  },
  {
    title: "4. Data Security",
    content: [
      "We implement industry-standard SSL encryption to protect data transmitted between your browser and our servers.",
      "Access to personal data is restricted to authorised personnel only.",
      "We regularly review and update our security practices to guard against unauthorised access.",
      "Despite our best efforts, no method of transmission over the internet is 100% secure.",
    ],
  },
  {
    title: "5. Cookies",
    content: [
      "We use cookies to maintain your session, remember your cart, and analyse site traffic.",
      "You can control cookie settings through your browser preferences.",
      "Disabling cookies may affect the functionality of certain features on our website.",
      "We use analytics cookies (e.g., Google Analytics) to understand how visitors use our site.",
    ],
  },
  {
    title: "6. Your Rights",
    content: [
      "You have the right to access, correct, or delete your personal information at any time.",
      "You may opt out of marketing communications by clicking 'Unsubscribe' in any email.",
      "You can request a copy of the data we hold about you by contacting our support team.",
      "To exercise any of these rights, please contact us at support@faizan.com.",
    ],
  },
  {
    title: "7. Children's Privacy",
    content: [
      "Our services are not directed to children under the age of 13.",
      "We do not knowingly collect personal information from children.",
      "If you believe a child has provided us with personal information, please contact us immediately.",
    ],
  },
  {
    title: "8. Changes to This Policy",
    content: [
      "We may update this Privacy Policy from time to time to reflect changes in our practices.",
      "We will notify you of significant changes by posting a notice on our website or sending an email.",
      "Your continued use of our services after changes constitutes acceptance of the updated policy.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="bg-neutral-950 py-14">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-amber-400 mb-3">Legal</p>
          <h1 className="text-4xl font-black text-white">Privacy Policy</h1>
          <p className="mt-3 text-neutral-400 text-sm">Last updated: April 27, 2026</p>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-14">
        {/* Intro */}
        <div className="rounded-2xl bg-amber-50 border border-amber-100 p-6 mb-10">
          <p className="text-sm text-amber-900 leading-relaxed">
            At <strong>{SITE_NAME}</strong>, your privacy is important to us. This policy explains
            what information we collect, how we use it, and the choices you have. By using our
            website, you agree to the practices described here.
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-10">
          {sections.map((section) => (
            <div key={section.title}>
              <h2 className="text-lg font-bold text-neutral-900 mb-4">{section.title}</h2>
              <ul className="space-y-3">
                {section.content.map((item, i) => (
                  <li key={i} className="flex gap-3 text-sm text-neutral-600 leading-relaxed">
                    <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-amber-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact */}
        <div className="mt-14 rounded-2xl bg-neutral-50 border border-neutral-100 p-6 text-center">
          <p className="text-sm text-neutral-600">
            Questions about this policy?{" "}
            <Link href="/contact" className="font-semibold text-amber-600 hover:text-amber-700">
              Contact our support team
            </Link>
            {" "}or email us at{" "}
            <a href="mailto:support@faizan.com" className="font-semibold text-amber-600 hover:text-amber-700">
              support@faizan.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
