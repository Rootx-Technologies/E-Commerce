"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";
import { SITE_NAME as DEFAULT_SITE_NAME, SOCIAL_LINKS as DEFAULT_SOCIAL_LINKS } from "@/lib/constants";
import { FooterAdminLink } from "./footer-admin-link";

// Social icons as inline SVGs
function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
    </svg>
  );
}
function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
    </svg>
  );
}
function TwitterIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
    </svg>
  );
}
function YoutubeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/>
    </svg>
  );
}

interface FooterLink {
  label: string;
  href: string;
}

interface SettingsData {
  siteName?: string;
  description?: string;
  phone?: string;
  email?: string;
  address?: string;
  socialLinks?: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
    youtube?: string;
  };
  footerLinks?: {
    shop?: FooterLink[];
    support?: FooterLink[];
    company?: FooterLink[];
  };
}

const defaultFooterLinks = {
  shop: [
    { label: "New Arrivals", href: "/products?filter=new" },
    { label: "Best Sellers", href: "/products?filter=bestseller" },
    { label: "Flash Sales", href: "/deals" },
    { label: "All Products", href: "/products" },
    { label: "Brands", href: "/brands" },
  ],
  support: [
    { label: "Track Order", href: "/track-order" },
    { label: "Returns & Exchanges", href: "/returns" },
    { label: "Shipping Policy", href: "/shipping" },
    { label: "FAQ", href: "/faq" },
    { label: "Contact Us", href: "/contact" },
  ],
  company: [
    { label: "About Us", href: "/about" },
    { label: "Careers", href: "/careers" },
    { label: "Press", href: "/press" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
  ],
};

export function Footer() {
  const [settings, setSettings] = useState<SettingsData | null>(null);

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setSettings(data.data);
        }
      })
      .catch((err) => console.error("Failed to load footer settings:", err));
  }, []);

  const siteName = settings?.siteName || DEFAULT_SITE_NAME;
  const description =
    settings?.description ||
    "Your premium destination for luxury fashion, electronics, and branded products. Quality you can trust, style you can feel.";
  const phone = settings?.phone || "+92 302 7372812";
  const email = settings?.email || "support@faizan.com";
  const address = settings?.address || "Lahore, Punjab, Pakistan";

  const social = {
    instagram: settings?.socialLinks?.instagram || DEFAULT_SOCIAL_LINKS.instagram,
    facebook: settings?.socialLinks?.facebook || DEFAULT_SOCIAL_LINKS.facebook,
    twitter: settings?.socialLinks?.twitter || DEFAULT_SOCIAL_LINKS.twitter,
    youtube: settings?.socialLinks?.youtube || DEFAULT_SOCIAL_LINKS.youtube,
  };

  const footerSections = settings?.footerLinks || defaultFooterLinks;

  return (
    <footer className="bg-neutral-900 text-neutral-300">
      {/* Main Footer */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link
              href="/"
              className="text-3xl font-black tracking-[0.15em] text-white hover:text-amber-400 transition-colors"
            >
              {siteName}
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-neutral-400 max-w-xs">
              {description}
            </p>

            {/* Contact */}
            <div className="mt-6 space-y-2">
              {phone && (
                <a
                  href={`tel:${phone.replace(/\s+/g, "")}`}
                  className="flex items-center gap-2 text-sm text-neutral-400 hover:text-white transition-colors"
                >
                  <Phone className="h-4 w-4 text-amber-500" />
                  {phone}
                </a>
              )}
              {email && (
                <a
                  href={`mailto:${email}`}
                  className="flex items-center gap-2 text-sm text-neutral-400 hover:text-white transition-colors"
                >
                  <Mail className="h-4 w-4 text-amber-500" />
                  {email}
                </a>
              )}
              {address && (
                <div className="flex items-center gap-2 text-sm text-neutral-400">
                  <MapPin className="h-4 w-4 text-amber-500 flex-shrink-0" />
                  {address}
                </div>
              )}
            </div>

            {/* Social */}
            <div className="mt-6 flex items-center gap-3">
              {[
                { icon: InstagramIcon, href: social.instagram, label: "Instagram" },
                { icon: FacebookIcon, href: social.facebook, label: "Facebook" },
                { icon: TwitterIcon, href: social.twitter, label: "Twitter" },
                { icon: YoutubeIcon, href: social.youtube, label: "YouTube" },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-800 text-neutral-400 hover:bg-amber-500 hover:text-white transition-all duration-200"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerSections).map(([section, links]) => (
            <div key={section}>
              <h3 className="text-sm font-semibold uppercase tracking-widest text-white mb-4">
                {section}
              </h3>
              <ul className="space-y-2.5">
                {(links as FooterLink[]).map((link, idx) => (
                  <li key={idx}>
                    <Link
                      href={link.href}
                      className="text-sm text-neutral-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-neutral-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-neutral-500">
            © {new Date().getFullYear()} {siteName}. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <FooterAdminLink />
            <span className="text-xs text-neutral-500">We accept:</span>
            <div className="flex items-center gap-2">
              {["Visa", "MC", "JazzCash", "EasyPaisa"].map((method) => (
                <span
                  key={method}
                  className="rounded border border-neutral-700 px-2 py-0.5 text-[10px] font-medium text-neutral-400"
                >
                  {method}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
