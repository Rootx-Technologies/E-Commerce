"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus, Pencil, Trash2, Bookmark } from "lucide-react";
import toast from "react-hot-toast";
import { fetchAdminBrands, createBrand, updateBrand, deleteBrand } from "@/lib/admin-api";
import { DataTable, type Column } from "@/components/admin/data-table";
import { Modal } from "@/components/admin/modal";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { FormField, Input } from "@/components/admin/form-field";
import { ImageUploader } from "@/components/admin/image-uploader";

interface Brand {
  id: string;
  name: string;
  slug: string;
  logo?: string | null;
  _count?: { products: number };
}

const EMPTY = { name: "", slug: "", logo: "" };

export function AdminBrandsClient() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Brand | null>(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<Brand | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetchAdminBrands();
    if (res.success) setBrands(res.data as Brand[]);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = brands.filter(
    (b) =>
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.slug.toLowerCase().includes(search.toLowerCase())
  );

  function openCreate() { setEditTarget(null); setForm(EMPTY); setModalOpen(true); }
  function openEdit(b: Brand) {
    setEditTarget(b);
    setForm({ name: b.name, slug: b.slug, logo: b.logo ?? "" });
    setModalOpen(true);
  }

  const setF = (k: keyof typeof EMPTY, v: string) => setForm((f) => ({ ...f, [k]: v }));

  function handleNameChange(val: string) {
    setF("name", val);
    if (!editTarget) {
      setF("slug", val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""));
    }
  }

  async function handleSave() {
    if (!form.name || !form.slug) { toast.error("Name and slug are required"); return; }
    setSaving(true);
    const payload = { ...form, logo: form.logo || null };
    const res = editTarget
      ? await updateBrand(editTarget.id, payload)
      : await createBrand(payload);
    if (res.success) {
      toast.success(editTarget ? "Brand updated" : "Brand created");
      setModalOpen(false); load();
    } else {
      toast.error(res.error ?? "Something went wrong");
    }
    setSaving(false);
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    const res = await deleteBrand(deleteTarget.id);
    if (res.success) {
      toast.success("Brand deleted");
      setDeleteTarget(null); load();
    } else {
      toast.error(res.error ?? "Failed to delete");
    }
    setDeleting(false);
  }

  const columns: Column<Brand>[] = [
    {
      key: "logo",
      header: "",
      render: (b) => (
        <div className="h-10 w-10 rounded-lg bg-neutral-100 overflow-hidden p-1">
          {b.logo
            ? <img src={b.logo} alt={b.name} className="h-full w-full object-contain" />
            : <div className="h-full w-full flex items-center justify-center text-neutral-300"><Bookmark size={14} /></div>}
        </div>
      ),
    },
    {
      key: "name",
      header: "Brand",
      render: (b) => (
        <div>
          <p className="font-medium text-neutral-800">{b.name}</p>
          <p className="text-xs font-mono text-neutral-400">{b.slug}</p>
        </div>
      ),
    },
    {
      key: "products",
      header: "Products",
      render: (b) => <span className="font-medium text-neutral-700">{b._count?.products ?? 0}</span>,
    },
    {
      key: "actions",
      header: "Actions",
      render: (b) => (
        <div className="flex gap-2">
          <button onClick={() => openEdit(b)} className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 transition-colors"><Pencil size={14} /></button>
          <button onClick={() => setDeleteTarget(b)} className="rounded-lg p-1.5 text-neutral-400 hover:bg-red-50 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-neutral-900">Brands</h1>
          <p className="mt-0.5 text-sm text-neutral-500">{brands.length} total brands</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 rounded-xl bg-neutral-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-neutral-800">
          <Plus size={15} /> Add Brand
        </button>
      </div>

      <DataTable columns={columns} data={filtered} loading={loading} searchValue={search} onSearchChange={setSearch} searchPlaceholder="Search brands..." emptyMessage="No brands found" />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editTarget ? "Edit Brand" : "Add New Brand"} size="sm">
        <div className="flex flex-col gap-4">
          <FormField label="Brand Name" required>
            <Input value={form.name} onChange={(e) => handleNameChange(e.target.value)} placeholder="e.g. Nike" />
          </FormField>
          <FormField label="Slug" required>
            <Input value={form.slug} onChange={(e) => setF("slug", e.target.value)} placeholder="nike" />
          </FormField>
          <ImageUploader
            label="Brand Logo"
            hint="PNG with transparent background recommended"
            folder="marqet/brands"
            value={form.logo}
            onChange={(url) => setF("logo", url)}
          />
        </div>
        <div className="mt-5 flex justify-end gap-3">
          <button onClick={() => setModalOpen(false)} className="rounded-lg border border-neutral-200 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50">Cancel</button>
          <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 rounded-lg bg-neutral-900 px-5 py-2 text-sm font-semibold text-white hover:bg-neutral-800 disabled:opacity-60">
            {saving && <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />}
            {editTarget ? "Update" : "Create"}
          </button>
        </div>
      </Modal>

      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} loading={deleting} title="Delete Brand?" message={`Delete "${deleteTarget?.name}"? This will fail if the brand has products assigned to it.`} confirmLabel="Delete" />
    </div>
  );
}
