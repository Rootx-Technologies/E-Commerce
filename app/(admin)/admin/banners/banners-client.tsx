"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight, Image as ImageIcon, GripVertical } from "lucide-react";
import toast from "react-hot-toast";
import { fetchAdminBanners, createBanner, updateBanner, deleteBanner } from "@/lib/admin-api";
import { Modal } from "@/components/admin/modal";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { FormField, Input, Textarea } from "@/components/admin/form-field";
import { ImageUploader } from "@/components/admin/image-uploader";

interface Banner {
  id: string;
  type: "HERO" | "PROMOTIONAL" | "ANNOUNCEMENT";
  title: string;
  brandName?: string | null;
  subtitle?: string | null;
  image: string;
  link?: string | null;
  isActive: boolean;
  position: number;
  publicId?: string | null;
}

const EMPTY = {
  type: "HERO" as "HERO" | "PROMOTIONAL" | "ANNOUNCEMENT",
  title: "",
  brandName: "",
  subtitle: "",
  imageUrl: "",
  link: "",
  isActive: true,
  position: "",
};

export function AdminBannersClient() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Banner | null>(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<Banner | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetchAdminBanners();
    if (res.success) setBanners(res.data as Banner[]);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  function openCreate() { setEditTarget(null); setForm(EMPTY); setModalOpen(true); }
  function openEdit(b: Banner) {
    setEditTarget(b);
    setForm({
      type: b.type,
      title: b.title,
      brandName: b.brandName ?? "",
      subtitle: b.subtitle ?? "",
      imageUrl: b.image,
      link: b.link ?? "",
      isActive: b.isActive,
      position: String(b.position),
    });
    setModalOpen(true);
  }

  const setF = (k: keyof typeof EMPTY, v: string | boolean) =>
    setForm((f) => ({ ...f, [k]: v }));

  async function handleSave() {
    if (!form.title) { toast.error("Title is required"); return; }
    if (!editTarget && !form.imageUrl && form.type !== "ANNOUNCEMENT") { toast.error("Image URL is required"); return; }
    setSaving(true);
    const payload = {
      type: form.type,
      title: form.title,
      brandName: form.brandName || null,
      subtitle: form.subtitle || null,
      imageUrl: form.imageUrl || undefined,
      link: form.link || null,
      isActive: form.isActive,
      position: form.position ? Number(form.position) : undefined,
    };
    const res = editTarget
      ? await updateBanner(editTarget.id, payload)
      : await createBanner(payload);
    if (res.success) {
      toast.success(editTarget ? "Banner updated" : "Banner created");
      setModalOpen(false); load();
    } else {
      toast.error(res.error ?? "Something went wrong");
    }
    setSaving(false);
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    const res = await deleteBanner(deleteTarget.id);
    if (res.success) {
      toast.success("Banner deleted");
      setDeleteTarget(null); load();
    } else {
      toast.error(res.error ?? "Failed to delete");
    }
    setDeleting(false);
  }

  async function toggleActive(b: Banner) {
    const res = await updateBanner(b.id, { isActive: !b.isActive });
    if (res.success) {
      toast.success(`Banner ${!b.isActive ? "activated" : "deactivated"}`);
      load();
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-neutral-900">Banners</h1>
          <p className="mt-0.5 text-sm text-neutral-500">{banners.length} banners (sorted by position)</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 rounded-xl bg-neutral-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-neutral-800">
          <Plus size={15} /> Add Banner
        </button>
      </div>

      {loading ? (
        <div className="flex h-40 items-center justify-center">
          <span className="h-6 w-6 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-900" />
        </div>
      ) : banners.length === 0 ? (
        <div className="flex h-40 flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-neutral-200 text-neutral-400">
          <ImageIcon size={28} />
          <p className="text-sm">No banners yet — add one above</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {banners.map((b) => (
            <div key={b.id} className="flex items-center gap-4 rounded-xl border border-neutral-100 bg-white p-4 shadow-sm">
              <GripVertical size={16} className="text-neutral-300 flex-shrink-0" />

              <div className="h-16 w-28 flex-shrink-0 rounded-lg bg-neutral-100 overflow-hidden">
                <img src={b.image} alt={b.title} className="h-full w-full object-cover" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-semibold text-neutral-800 truncate">{b.title}</p>
                  <span className="flex-shrink-0 rounded bg-neutral-100 px-1.5 py-0.5 text-xs text-neutral-500">
                    #{b.position}
                  </span>
                  <span className={`flex-shrink-0 rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                    b.type === "HERO" ? "bg-violet-100 text-violet-700" :
                    b.type === "PROMOTIONAL" ? "bg-amber-100 text-amber-700" :
                    "bg-green-100 text-green-700"
                  }`}>
                    {b.type === "HERO" ? "Hero Slide" : b.type === "PROMOTIONAL" ? "Promo Card" : "Announcement"}
                  </span>
                </div>
                {b.brandName && <p className="text-xs font-medium text-neutral-600 truncate uppercase tracking-wider">{b.brandName}</p>}
                {b.subtitle && <p className="text-sm text-neutral-500 truncate">{b.subtitle}</p>}
                {b.link && <p className="text-xs text-blue-500 truncate">{b.link}</p>}
              </div>

              <button onClick={() => toggleActive(b)} className="flex-shrink-0 transition-opacity hover:opacity-70">
                {b.isActive
                  ? <ToggleRight size={24} className="text-green-500" />
                  : <ToggleLeft size={24} className="text-neutral-300" />}
              </button>

              <div className="flex gap-2 flex-shrink-0">
                <button onClick={() => openEdit(b)} className="rounded-lg p-2 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 transition-colors"><Pencil size={15} /></button>
                <button onClick={() => setDeleteTarget(b)} className="rounded-lg p-2 text-neutral-400 hover:bg-red-50 hover:text-red-500 transition-colors"><Trash2 size={15} /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editTarget ? "Edit Banner" : "Add New Banner"} size="md">
        <div className="flex flex-col gap-4">
          {/* Banner Type */}
          <FormField label="Banner Type" required hint="Hero = homepage slider · Promo = mid-page card · Announcement = top bar text">
            <div className="flex gap-2">
              {(["HERO", "PROMOTIONAL", "ANNOUNCEMENT"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setF("type", t)}
                  className={`flex-1 rounded-lg border py-2 text-xs font-semibold uppercase tracking-wide transition-colors ${
                    form.type === t
                      ? t === "HERO" ? "border-violet-500 bg-violet-50 text-violet-700"
                        : t === "PROMOTIONAL" ? "border-amber-500 bg-amber-50 text-amber-700"
                        : "border-green-500 bg-green-50 text-green-700"
                      : "border-neutral-200 text-neutral-500 hover:border-neutral-300"
                  }`}
                >
                  {t === "HERO" ? "Hero Slide" : t === "PROMOTIONAL" ? "Promo Card" : "Announce"}
                </button>
              ))}
            </div>
          </FormField>

          <FormField label="Title" required>
            <Input value={form.title} onChange={(e) => setF("title", e.target.value)} placeholder={form.type === "HERO" ? "New Arrivals" : form.type === "PROMOTIONAL" ? "Eid Sale — 50% Off" : "FREE SHIPPING ON PREPAID ORDERS"} />
          </FormField>

          {/* Brand Name — only relevant for Hero slides */}
          {form.type === "HERO" && (
            <FormField label="Brand Name" hint="Shown above the title on the hero slide (e.g. POLO REPUBLICA)">
              <Input value={form.brandName as string} onChange={(e) => setF("brandName", e.target.value)} placeholder="POLO REPUBLICA" />
            </FormField>
          )}

          <FormField label={form.type === "ANNOUNCEMENT" ? "Message (subtitle)" : "Subtitle / Description"}>
            <Textarea rows={2} value={form.subtitle as string} onChange={(e) => setF("subtitle", e.target.value)} placeholder={form.type === "HERO" ? "Crafted from lightweight, breathable fabric..." : "Limited time offer on all clothing"} />
          </FormField>

          {/* No image needed for announcement type */}
          {form.type !== "ANNOUNCEMENT" && (
            <ImageUploader
              label="Banner Image"
              hint={editTarget ? "Leave empty to keep existing image" : "Required"}
              folder="marqet/banners"
              value={form.imageUrl as string}
              onChange={(url) => setF("imageUrl", url)}
            />
          )}

          <FormField label="Link (URL)" hint="Where the banner/button clicks to">
            <Input value={form.link as string} onChange={(e) => setF("link", e.target.value)} placeholder="/products" />
          </FormField>

          <div className="grid grid-cols-2 gap-3">
            <FormField label="Position" hint="Lower number = shown first">
              <Input type="number" min="1" value={form.position as string} onChange={(e) => setF("position", e.target.value)} placeholder="1" />
            </FormField>
            <div className="flex flex-col justify-end">
              <label className="flex items-center gap-2 cursor-pointer select-none pb-2">
                <input type="checkbox" checked={form.isActive as boolean} onChange={(e) => setF("isActive", e.target.checked)} className="h-4 w-4 rounded border-neutral-300" />
                <span className="text-sm text-neutral-700">Active</span>
              </label>
            </div>
          </div>
        </div>
        <div className="mt-5 flex justify-end gap-3">
          <button onClick={() => setModalOpen(false)} className="rounded-lg border border-neutral-200 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50">Cancel</button>
          <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 rounded-lg bg-neutral-900 px-5 py-2 text-sm font-semibold text-white hover:bg-neutral-800 disabled:opacity-60">
            {saving && <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />}
            {editTarget ? "Update" : "Create"}
          </button>
        </div>
      </Modal>

      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} loading={deleting} title="Delete Banner?" message={`"${deleteTarget?.title}" will be permanently deleted.`} confirmLabel="Delete" />
    </div>
  );
}
