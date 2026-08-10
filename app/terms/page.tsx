import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms and conditions for using the Marqet platform.",
};

const sections = [
  {
    title: "1. Acceptance of Terms",
    content: [
      `By accessing or using ${SITE_NAME}, you agree to be bound by these Terms of Service and all applicable laws and regulations.`,
      "If you do not agree with any of these terms, you are prohibited from using this site.",
      "We reserve the right to update these terms at any time without prior notice.",
    ],
  },
  {
    title: "2. Use of the Platform",
    content: [
      "You must be at least 18 years old to make purchases on Marqet.",
      "You agree to provide accurate, current, and complete information when placing orders.",
      "You are responsible for maintaining the confidentiality of any account information.",
      "You agree not to use the platform for any unlawful purpose or in any way that could damage or impair the service.",
      "Automated scraping, crawling, or data extraction without written permission is strictly prohibited.",
    ],
  },
  {
    title: "3. Products and Pricing",
    content: [
      "All prices are listed in Pakistani Rupees (PKR) and include applicable taxes unless stated otherwise.",
      "We reserve the right to modify prices at any time without prior notice.",
      "Product images are for illustrative purposes; actual products may vary slightly.",
      "We make every effort to display accurate product information but do not warrant that descriptions are error-free.",
      "In the event of a pricing error, we reserve the right to cancel orders placed at the incorrect price.",
    ],
  },
  {
    title: "4. Orders and Payment",
    content: [
      "Placing an order constitutes an offer to purchase; acceptance occurs when we confirm the order.",
      "We reserve the right to refuse or cancel any order at our discretion.",
      "Payment must be made in full before dispatch for online payment methods.",
      "For Cash on Delivery orders, payment is due upon receipt of goods.",
      "We use Stripe for secure payment processing; your card details are never stored on our servers.",
    ],
  },
  {
    title: "5. Shipping and Delivery",
    content: [
      "Delivery times are estimates and not guaranteed; delays may occur due to circumstances beyond our control.",
      "Risk of loss and title for products pass to you upon delivery.",
      "We are not responsible for delays caused by incorrect or incomplete delivery addresses.",
      "Free shipping is available on orders above PKR 5,000 within Pakistan.",
    ],
  },
  {
    title: "6. Returns and Refunds",
    content: [
      "You may return most items within 30 days of delivery for a full refund or exchange.",
      "Items must be unused, in original packaging, and accompanied by proof of purchase.",
      "Certain items (undergarments, personalised products, perishables) are non-returnable.",
      "Refunds are processed within 7–10 business days after we receive the returned item.",
      "Shipping costs for returns are borne by the customer unless the item is defective.",
    ],
  },
  {
    title: "7. Intellectual Property",
    content: [
      `All content on ${SITE_NAME} — including text, graphics, logos, and images — is the property of ${SITE_NAME} or its content suppliers.`,
      "You may not reproduce, distribute, or create derivative works without our express written permission.",
      "Product names and trademarks belong to their respective owners.",
    ],
  },
  {
    title: "8. Limitation of Liability",
    content: [
      `${SITE_NAME} shall not be liable for any indirect, incidental, or consequential damages arising from your use of the platform.`,
      "Our total liability to you for any claim shall not exceed the amount paid for the specific product in question.",
      "We do not warrant that the platform will be uninterrupted, error-free, or free of viruses.",
    ],
  },
  {
    title: "9. Governing Law",
    content: [
      "These terms are governed by the laws of the Islamic Republic of Pakistan.",
      "Any disputes shall be subject to the exclusive jurisdiction of the courts of Lahore, Punjab.",
    ],
  },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="bg-neutral-950 py-14">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-amber-400 mb-3">Legal</p>
          <h1 className="text-4xl font-black text-white">Terms of Service</h1>
          <p className="mt-3 text-neutral-400 text-sm">Last updated: April 27, 2026</p>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-14">
        <div className="rounded-2xl bg-amber-50 border border-amber-100 p-6 mb-10">
          <p className="text-sm text-amber-900 leading-relaxed">
            Please read these Terms of Service carefully before using <strong>{SITE_NAME}</strong>.
            These terms govern your use of our website and services.
          </p>
        </div>

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

        <div className="mt-14 rounded-2xl bg-neutral-50 border border-neutral-100 p-6 text-center">
          <p className="text-sm text-neutral-600">
            Questions about these terms?{" "}
            <Link href="/contact" className="font-semibold text-amber-600 hover:text-amber-700">
              Contact us
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
