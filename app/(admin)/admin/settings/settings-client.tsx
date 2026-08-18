"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus, Trash2, Save, RefreshCw, Link as LinkIcon, Building2, Share2 } from "lucide-react";
import toast from "react-hot-toast";
import { fetchAdminSettings, updateAdminSettings } from "@/lib/admin-api";
import { FormField, Input, Textarea } from "@/components/admin/form-field";

interface FooterLinkItem {
  label: string;
  href: string;
}

interface FooterLinksState {
  shop: FooterLinkItem[];
  support: FooterLinkItem[];
  company: FooterLinkItem[];
}

interface SocialLinksState {
  instagram: string;
  facebook: string;
  twitter: string;
  youtube: string;
}

const DEFAULT_FOOTER_LINKS: FooterLinksState = {
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

const DEFAULT_SOCIAL_LINKS: SocialLinksState = {
  instagram: "https://instagram.com/faizan",
  facebook: "https://facebook.com/faizan",
  twitter: "https://twitter.com/faizan",
  youtube: "https://youtube.com/faizan",
};

export function AdminSettingsClient() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [siteName, setSiteName] = useState("Marqet");
  const [description, setDescription] = useState(
    "Your premium destination for luxury fashion, electronics, and branded products. Quality you can trust, style you can feel."
  );
  const [phone, setPhone] = useState("+92 302 7372812");
  const [email, setEmail] = useState("support@faizan.com");
  const [address, setAddress] = useState("Lahore, Punjab, Pakistan");

  const [socialLinks, setSocialLinks] = useState<SocialLinksState>(DEFAULT_SOCIAL_LINKS);
  const [footerLinks, setFooterLinks] = useState<FooterLinksState>(DEFAULT_FOOTER_LINKS);

  const loadSettings = useCallback(async () => {
    setLoading(true);
    const res = await fetchAdminSettings();
    if (res.success && res.data) {
      const d = res.data as {
        siteName?: string;
        description?: string;
        phone?: string;
        email?: string;
        address?: string;
        socialLinks?: SocialLinksState;
        footerLinks?: FooterLinksState;
      };
      if (d.siteName) setSiteName(d.siteName);
      if (d.description) setDescription(d.description);
      if (d.phone) setPhone(d.phone);
      if (d.email) setEmail(d.email);
      if (d.address) setAddress(d.address);
      if (d.socialLinks) setSocialLinks({ ...DEFAULT_SOCIAL_LINKS, ...d.socialLinks });
      if (d.footerLinks) setFooterLinks({ ...DEFAULT_FOOTER_LINKS, ...d.footerLinks });
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  async function handleSave() {
    setSaving(true);
    const res = await updateAdminSettings({
      siteName,
      description,
      phone,
      email,
      address,
      socialLinks,
      footerLinks,
    });

    if (res.success) {
      toast.success("Site & Footer settings saved successfully!");
    } else {
      toast.error(res.error ?? "Failed to save settings");
    }
    setSaving(false);
  }

  // Helper functions for updating Footer Links
  const addLinkItem = (section: keyof FooterLinksState) => {
    setFooterLinks((prev) => ({
      ...prev,
      [section]: [...prev[section], { label: "New Link", href: "#" }],
    }));
  };

  const updateLinkItem = (
    section: keyof FooterLinksState,
    index: number,
    field: "label" | "href",
    value: string
  ) => {
    setFooterLinks((prev) => {
      const list = [...prev[section]];
      list[index] = { ...list[index], [field]: value };
      return { ...prev, [section]: list };
    });
  };

  const removeLinkItem = (section: keyof FooterLinksState, index: number) => {
    setFooterLinks((prev) => ({
      ...prev,
      [section]: prev[section].filter((_, i) => i !== index),
    }));
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <RefreshCw size={24} className="animate-spin text-neutral-400" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-5xl">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-neutral-900">Site & Footer Settings</h1>
          <p className="mt-0.5 text-sm text-neutral-500">
            Manage store brand info, contact details, social links, and footer links.
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 rounded-xl bg-neutral-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-neutral-800 disabled:opacity-60"
        >
          {saving ? (
            <RefreshCw size={15} className="animate-spin" />
          ) : (
            <Save size={15} />
          )}
          Save Settings
        </button>
      </div>

      {/* 1. Brand & Contact Information */}
      <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4 text-neutral-900 border-b border-neutral-100 pb-3">
          <Building2 size={18} className="text-neutral-700" />
          <h2 className="text-base font-semibold">Brand & Contact Details</h2>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label="Site Brand Name" required>
            <Input value={siteName} onChange={(e) => setSiteName(e.target.value)} placeholder="Marqet" />
          </FormField>

          <FormField label="Phone Number">
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+92 302 7372812" />
          </FormField>

          <FormField label="Support Email">
            <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="support@faizan.com" />
          </FormField>

          <FormField label="Physical Address / Location">
            <Input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Lahore, Punjab, Pakistan" />
          </FormField>

          <div className="sm:col-span-2">
            <FormField label="Brand Description (Footer Text)">
              <Textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Write a brief tagline or description about your store..."
              />
            </FormField>
          </div>
        </div>
      </div>

      {/* 2. Social Links */}
      <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4 text-neutral-900 border-b border-neutral-100 pb-3">
          <Share2 size={18} className="text-neutral-700" />
          <h2 className="text-base font-semibold">Social Media Links</h2>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label="Instagram URL">
            <Input
              value={socialLinks.instagram}
              onChange={(e) => setSocialLinks({ ...socialLinks, instagram: e.target.value })}
              placeholder="https://instagram.com/yourhandle"
            />
          </FormField>
          <FormField label="Facebook URL">
            <Input
              value={socialLinks.facebook}
              onChange={(e) => setSocialLinks({ ...socialLinks, facebook: e.target.value })}
              placeholder="https://facebook.com/yourhandle"
            />
          </FormField>
          <FormField label="Twitter / X URL">
            <Input
              value={socialLinks.twitter}
              onChange={(e) => setSocialLinks({ ...socialLinks, twitter: e.target.value })}
              placeholder="https://twitter.com/yourhandle"
            />
          </FormField>
          <FormField label="YouTube URL">
            <Input
              value={socialLinks.youtube}
              onChange={(e) => setSocialLinks({ ...socialLinks, youtube: e.target.value })}
              placeholder="https://youtube.com/yourhandle"
            />
          </FormField>
        </div>
      </div>

      {/* 3. Footer Links Sections (Shop, Support, Company) */}
      <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between border-b border-neutral-100 pb-3 mb-6">
          <div className="flex items-center gap-2 text-neutral-900">
            <LinkIcon size={18} className="text-neutral-700" />
            <h2 className="text-base font-semibold">Footer Navigation Links</h2>
          </div>
          <span className="text-xs text-neutral-400">Shop • Support • Company Columns</span>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {(["shop", "support", "company"] as const).map((section) => (
            <div key={section} className="rounded-xl border border-neutral-100 bg-neutral-50/50 p-4">
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-neutral-200">
                <h3 className="font-bold text-sm uppercase tracking-wider text-neutral-800">
                  {section} Section
                </h3>
                <button
                  onClick={() => addLinkItem(section)}
                  className="flex items-center gap-1 text-xs font-semibold text-neutral-800 hover:text-black bg-white border border-neutral-200 rounded-lg px-2.5 py-1 shadow-sm transition-colors"
                >
                  <Plus size={13} />
                  Add Link
                </button>
              </div>

              <div className="space-y-3">
                {footerLinks[section].map((item, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col gap-1.5 p-2.5 bg-white rounded-lg border border-neutral-200 shadow-sm"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <input
                        type="text"
                        value={item.label}
                        onChange={(e) => updateLinkItem(section, idx, "label", e.target.value)}
                        placeholder="Link Label"
                        className="w-full text-xs font-medium border-b border-neutral-200 pb-1 outline-none focus:border-neutral-900"
                      />
                      <button
                        onClick={() => removeLinkItem(section, idx)}
                        className="text-neutral-400 hover:text-red-500 p-1"
                        title="Remove link"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                    <input
                      type="text"
                      value={item.href}
                      onChange={(e) => updateLinkItem(section, idx, "href", e.target.value)}
                      placeholder="/url-path"
                      className="w-full text-[11px] text-neutral-500 font-mono outline-none focus:text-neutral-900"
                    />
                  </div>
                ))}

                {footerLinks[section].length === 0 && (
                  <p className="text-center text-xs text-neutral-400 py-4">No links in this section</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Save Button */}
      <div className="flex justify-end pb-8">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 rounded-xl bg-neutral-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-neutral-800 disabled:opacity-60 shadow-sm"
        >
          {saving ? (
            <RefreshCw size={16} className="animate-spin" />
          ) : (
            <Save size={16} />
          )}
          Save Settings
        </button>
      </div>
    </div>
  );
}
