"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus, Pencil, Trash2, Tag } from "lucide-react";
import toast from "react-hot-toast";
import { fetchAdminCategories, createCategory, updateCategory, deleteCategory } from "@/lib/admin-api";
import { DataTable, type Column } from "@/components/admin/data-table";
import { Modal } from "@/components/admin/modal";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { FormField, Input, Select, Textarea } from "@/components/admin/form-field";

interface Category {
  id: string;
  name: string;
  slug: string;
  image?: string | null;
  description?: string | null;
  parentId?: string | null;
  parent?: { id: string; name: string } | null;
  _count?: { products: number; children: number };
}

const EMPTY = { name: "", slug: "", image: "", description: "", parentId: "" };

export function AdminCategoriesClient() {
  const [cats, setCats] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Category | null>(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetchAdminCategories();
    if (res.success) setCats(res.data as Category[]);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = cats.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.slug.toLowerCase().includes(search.toLowerCase())
  );

  function openCreate() {
    setEditTarget(null);
    setForm(EMPTY);
    setModalOpen(true);
  }

  function openEdit(c: Category) {
    setEditTarget(c);
    setForm({
      name: c.name, slug: c.slug,
      image: c.image ?? "", description: c.description ?? "",
      parentId: c.parentId ?? "",
    });
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
    const payload = {
      ...form,
      parentId: form.parentId || null,
      image: form.image || null,
      description: form.description || null,
    };
    const res = editTarget
      ? await updateCategory(editTarget.id, payload)
      : await createCategory(payload);
    if (res.success) {
      toast.success(editTarget ? "Category updated" : "Category created");
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
    const res = await deleteCategory(deleteTarget.id);
    if (res.success) {
      toast.success("Category deleted");
      setDeleteTarget(null);
      load();
    } else {
      toast.error(res.error ?? "Failed to delete");
    }
    setDeleting(false);
  }

  const columns: Column<Category>[] = [
    {
      key: "image",
      header: "",
      render: (c) => (
        <div className="h-9 w-9 rounded-lg bg-neutral-100 overflow-hidden">
          {c.image
            ? <img src={c.image} alt={c.name} className="h-full w-full object-cover" />
            : <div className="h-full w-full flex items-center justify-center text-neutral-300"><Tag size={14} /></div>}
        </div>
      ),
    },
    {
      key: "name",
      header: "Category",
      render: (c) => (
        <div>
          <p className="font-medium text-neutral-800">{c.name}</p>
          <p className="text-xs text-neutral-400 font-mono">{c.slug}</p>
        </div>
      ),
    },
    {
      key: "parent",
      header: "Parent",
      render: (c) => c.parent
        ? <span className="rounded bg-neutral-100 px-2 py-0.5 text-xs text-neutral-600">{c.parent.name}</span>
        : <span className="text-neutral-300 text-xs">—</span>,
    },
    {
      key: "products",
      header: "Products",
      render: (c) => <span className="font-medium text-neutral-700">{c._count?.products ?? 0}</span>,
    },
    {
      key: "children",
      header: "Sub-categories",
      render: (c) => <span className="text-neutral-500">{c._count?.children ?? 0}</span>,
    },
    {
      key: "actions",
      header: "Actions",
      render: (c) => (
        <div className="flex gap-2">
          <button onClick={() => openEdit(c)} className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 transition-colors"><Pencil size={14} /></button>
          <button onClick={() => setDeleteTarget(c)} className="rounded-lg p-1.5 text-neutral-400 hover:bg-red-50 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
        </div>
      ),
    },
  ];

  const parentOptions = cats.filter((c) => !editTarget || c.id !== editTarget.id);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-neutral-900">Categories</h1>
          <p className="mt-0.5 text-sm text-neutral-500">{cats.length} total categories</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 rounded-xl bg-neutral-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-neutral-800">
          <Plus size={15} /> Add Category
        </button>
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        loading={loading}
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search categories..."
        emptyMessage="No categories found"
      />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editTarget ? "Edit Category" : "Add New Category"} size="md">
        <div className="flex flex-col gap-4">
          <FormField label="Name" required>
            <Input value={form.name} onChange={(e) => handleNameChange(e.target.value)} placeholder="e.g. Men's Clothing" />
          </FormField>
          <FormField label="Slug" required>
            <Input value={form.slug} onChange={(e) => setF("slug", e.target.value)} placeholder="mens-clothing" />
          </FormField>
          <FormField label="Image URL">
            <Input value={form.image} onChange={(e) => setF("image", e.target.value)} placeholder="https://..." />
          </FormField>
          <FormField label="Description">
            <Textarea rows={2} value={form.description} onChange={(e) => setF("description", e.target.value)} placeholder="Category description..." />
          </FormField>
          <FormField label="Parent Category" hint="Select a parent to create a sub-category">
            <Select value={form.parentId} onChange={(e) => setF("parentId", e.target.value)}>
              <option value="">No parent (top-level)</option>
              {parentOptions.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </Select>
          </FormField>
        </div>
        <div className="mt-5 flex justify-end gap-3">
          <button onClick={() => setModalOpen(false)} className="rounded-lg border border-neutral-200 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50">Cancel</button>
          <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 rounded-lg bg-neutral-900 px-5 py-2 text-sm font-semibold text-white hover:bg-neutral-800 disabled:opacity-60">
            {saving && <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />}
            {editTarget ? "Update" : "Create"}
          </button>
        </div>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete Category?"
        message={`Delete "${deleteTarget?.name}"? This will fail if the category has products assigned to it.`}
        confirmLabel="Delete"
      />
    </div>
  );
}
