"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus, Pencil, Trash2, Eye, ToggleLeft, ToggleRight } from "lucide-react";
import toast from "react-hot-toast";
import {
  fetchAdminProducts, fetchAdminCategories, fetchAdminBrands,
  createProduct, updateProduct, deleteProduct,
} from "@/lib/admin-api";
import { DataTable, type Column } from "@/components/admin/data-table";
import { Modal } from "@/components/admin/modal";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { FormField, Input, Select, Textarea } from "@/components/admin/form-field";
import { CURRENCY_SYMBOL } from "@/lib/constants";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  comparePrice?: number | null;
  stock: number;
  isActive: boolean;
  isFeatured: boolean;
  isNew: boolean;
  isBestSeller: boolean;
  isTrending: boolean;
  category?: { id: string; name: string };
  brand?: { id: string; name: string } | null;
  images?: { url: string; isPrimary: boolean }[];
  description: string;
  tags: string[];
  createdAt: string;
  _count?: { reviews: number; orderItems: number };
}

interface Category { id: string; name: string; slug: string }
interface Brand { id: string; name: string; slug: string }

const EMPTY_FORM = {
  name: "", slug: "", description: "", price: "",
  comparePrice: "", categoryId: "", brandId: "", tags: "",
  stock: "0", isFeatured: false, isNew: true,
  isBestSeller: false, isTrending: false, isActive: true,
};

export function AdminProductsClient() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Product | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);

  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetchAdminProducts({ page, limit: 15, ...(search ? { search } : {}) });
    if (res.success && res.data) {
      const d = res.data as { data: Product[]; meta: { total: number; totalPages: number } };
      setProducts(d.data);
      setTotal(d.meta.total);
      setTotalPages(d.meta.totalPages);
    }
    setLoading(false);
  }, [page, search]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    Promise.all([fetchAdminCategories(), fetchAdminBrands()]).then(([cats, brnds]) => {
      if (cats.success) setCategories(cats.data as Category[]);
      if (brnds.success) setBrands(brnds.data as Brand[]);
    });
  }, []);

  useEffect(() => {
    const t = setTimeout(() => { setPage(1); }, 400);
    return () => clearTimeout(t);
  }, [search]);

  function openCreate() {
    setEditTarget(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  }

  function openEdit(p: Product) {
    setEditTarget(p);
    setForm({
      name: p.name, slug: p.slug, description: p.description,
      price: String(p.price),
      comparePrice: p.comparePrice != null ? String(p.comparePrice) : "",
      categoryId: p.category?.id ?? "",
      brandId: p.brand?.id ?? "",
      tags: p.tags.join(", "),
      stock: String(p.stock),
      isFeatured: p.isFeatured, isNew: p.isNew,
      isBestSeller: p.isBestSeller, isTrending: p.isTrending, isActive: p.isActive,
    });
    setModalOpen(true);
  }

  async function handleSave() {
    if (!form.name || !form.slug || !form.description || !form.price || !form.categoryId) {
      toast.error("Name, slug, description, price and category are required");
      return;
    }
    setSaving(true);
    const payload = {
      ...form,
      price: Number(form.price),
      comparePrice: form.comparePrice ? Number(form.comparePrice) : null,
      stock: Number(form.stock),
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
    };
    const res = editTarget
      ? await updateProduct(editTarget.id, payload)
      : await createProduct(payload);

    if (res.success) {
      toast.success(editTarget ? "Product updated successfully" : "Product created successfully");
      setModalOpen(false);
      load();
    } else {
      toast.error(res.error ?? "Something went wrong");
    }
    setSaving(false);
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    const res = await deleteProduct(deleteTarget.id);
    if (res.success) {
      toast.success("Product deleted");
      setDeleteTarget(null);
      load();
    } else {
      toast.error(res.error ?? "Failed to delete");
    }
    setDeleting(false);
  }

  async function toggleActive(p: Product) {
    const res = await updateProduct(p.id, { isActive: !p.isActive });
    if (res.success) {
      toast.success(`Product ${!p.isActive ? "activated" : "deactivated"}`);
      load();
    }
  }

  const setF = (key: keyof typeof EMPTY_FORM, val: string | boolean) =>
    setForm((f) => ({ ...f, [key]: val }));

  function handleNameChange(val: string) {
    setF("name", val);
    if (!editTarget) {
      setF("slug", val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""));
    }
  }

  const columns: Column<Product>[] = [
    {
      key: "image",
      header: "Image",
      render: (p) => (
        <div className="h-10 w-10 rounded-lg bg-neutral-100 overflow-hidden flex-shrink-0">
          {p.images?.[0]?.url
            ? <img src={p.images[0].url} alt={p.name} className="h-full w-full object-cover" />
            : <div className="h-full w-full flex items-center justify-center text-neutral-300"><Eye size={14} /></div>
          }
        </div>
      ),
    },
    {
      key: "name",
      header: "Product",
      render: (p) => (
        <div>
          <p className="font-medium text-neutral-800 line-clamp-1">{p.name}</p>
          <p className="text-xs text-neutral-400">{p.category?.name}</p>
        </div>
      ),
    },
    {
      key: "price",
      header: "Price",
      render: (p) => (
        <div>
          <p className="font-semibold text-neutral-900">{CURRENCY_SYMBOL}{p.price.toLocaleString()}</p>
          {p.comparePrice && (
            <p className="text-xs text-neutral-400 line-through">{CURRENCY_SYMBOL}{p.comparePrice.toLocaleString()}</p>
          )}
        </div>
      ),
    },
    {
      key: "stock",
      header: "Stock",
      render: (p) => (
        <span className={`font-medium ${p.stock === 0 ? "text-red-500" : p.stock < 10 ? "text-yellow-600" : "text-green-600"}`}>
          {p.stock}
        </span>
      ),
    },
    {
      key: "flags",
      header: "Labels",
      render: (p) => (
        <div className="flex flex-wrap gap-1">
          {p.isFeatured && <span className="rounded bg-blue-100 px-1.5 py-0.5 text-[10px] font-medium text-blue-700">Featured</span>}
          {p.isNew && <span className="rounded bg-green-100 px-1.5 py-0.5 text-[10px] font-medium text-green-700">New</span>}
          {p.isBestSeller && <span className="rounded bg-purple-100 px-1.5 py-0.5 text-[10px] font-medium text-purple-700">Best Seller</span>}
          {p.isTrending && <span className="rounded bg-orange-100 px-1.5 py-0.5 text-[10px] font-medium text-orange-700">Trending</span>}
        </div>
      ),
    },
    {
      key: "isActive",
      header: "Status",
      render: (p) => (
        <button onClick={() => toggleActive(p)} className="transition-opacity hover:opacity-70">
          {p.isActive
            ? <ToggleRight size={22} className="text-green-500" />
            : <ToggleLeft size={22} className="text-neutral-300" />}
        </button>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (p) => (
        <div className="flex items-center gap-2">
          <button onClick={() => openEdit(p)} className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 transition-colors">
            <Pencil size={14} />
          </button>
          <button onClick={() => setDeleteTarget(p)} className="rounded-lg p-1.5 text-neutral-400 hover:bg-red-50 hover:text-red-500 transition-colors">
            <Trash2 size={14} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-neutral-900">Products</h1>
          <p className="mt-0.5 text-sm text-neutral-500">{total} total products</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 rounded-xl bg-neutral-900 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-neutral-800"
        >
          <Plus size={15} />
          Add Product
        </button>
      </div>

      <DataTable
        columns={columns}
        data={products}
        loading={loading}
        total={total}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search products..."
        emptyMessage="No products found"
      />

      {/* Create / Edit Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editTarget ? "Edit Product" : "Add New Product"}
        size="xl"
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label="Product Name" required>
            <Input value={form.name} onChange={(e) => handleNameChange(e.target.value)} placeholder="e.g. Premium Kurta" />
          </FormField>
          <FormField label="Slug" required hint="Auto-generated from name">
            <Input value={form.slug} onChange={(e) => setF("slug", e.target.value)} placeholder="e.g. premium-kurta" />
          </FormField>
          <div className="sm:col-span-2">
            <FormField label="Description" required>
              <Textarea rows={3} value={form.description} onChange={(e) => setF("description", e.target.value)} placeholder="Product description..." />
            </FormField>
          </div>
          <FormField label="Price (PKR)" required>
            <Input type="number" min="0" value={form.price} onChange={(e) => setF("price", e.target.value)} placeholder="2500" />
          </FormField>
          <FormField label="Compare Price (PKR)" hint="Original / crossed-out price">
            <Input type="number" min="0" value={form.comparePrice} onChange={(e) => setF("comparePrice", e.target.value)} placeholder="3000" />
          </FormField>
          <FormField label="Category" required>
            <Select value={form.categoryId} onChange={(e) => setF("categoryId", e.target.value)}>
              <option value="">Select category</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </Select>
          </FormField>
          <FormField label="Brand">
            <Select value={form.brandId} onChange={(e) => setF("brandId", e.target.value)}>
              <option value="">Select brand (optional)</option>
              {brands.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
            </Select>
          </FormField>
          <FormField label="Stock" required>
            <Input type="number" min="0" value={form.stock} onChange={(e) => setF("stock", e.target.value)} />
          </FormField>
          <FormField label="Tags" hint="Comma separated: shirt, cotton, casual">
            <Input value={form.tags} onChange={(e) => setF("tags", e.target.value)} placeholder="shirt, cotton, casual" />
          </FormField>

          {/* Toggles */}
          <div className="sm:col-span-2 grid grid-cols-2 sm:grid-cols-5 gap-3">
            {(["isFeatured", "isNew", "isBestSeller", "isTrending", "isActive"] as const).map((key) => (
              <label key={key} className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={form[key] as boolean}
                  onChange={(e) => setF(key, e.target.checked)}
                  className="h-4 w-4 rounded border-neutral-300"
                />
                <span className="text-sm text-neutral-700 capitalize">{key.replace("is", "")}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button onClick={() => setModalOpen(false)} className="rounded-lg border border-neutral-200 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50">
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 rounded-lg bg-neutral-900 px-5 py-2 text-sm font-semibold text-white hover:bg-neutral-800 disabled:opacity-60"
          >
            {saving && <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />}
            {editTarget ? "Update Product" : "Create Product"}
          </button>
        </div>
      </Modal>

      {/* Delete Confirm */}
      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete Product?"
        message={`"${deleteTarget?.name}" will be permanently deleted. This action cannot be undone.`}
        confirmLabel="Delete"
      />
    </div>
  );
}
