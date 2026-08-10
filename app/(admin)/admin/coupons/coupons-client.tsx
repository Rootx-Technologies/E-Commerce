"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight } from "lucide-react";
import toast from "react-hot-toast";
import { fetchAdminCoupons, createCoupon, updateCoupon, deleteCoupon } from "@/lib/admin-api";
import { DataTable, type Column } from "@/components/admin/data-table";
import { Modal } from "@/components/admin/modal";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { FormField, Input, Select } from "@/components/admin/form-field";
import { CURRENCY_SYMBOL } from "@/lib/constants";
import { format } from "date-fns";

interface Coupon {
  id: string;
  code: string;
  discountType: "PERCENTAGE" | "FIXED";
  discountValue: number;
  minOrderAmount?: number | null;
  maxUses?: number | null;
  usedCount: number;
  expiresAt?: string | null;
  isActive: boolean;
  createdAt: string;
}

const EMPTY = {
  code: "", discountType: "PERCENTAGE", discountValue: "",
  minOrderAmount: "", maxUses: "", expiresAt: "", isActive: true,
};

export function AdminCouponsClient() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Coupon | null>(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<Coupon | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetchAdminCoupons();
    if (res.success) setCoupons(res.data as Coupon[]);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = coupons.filter((c) =>
    c.code.toLowerCase().includes(search.toLowerCase())
  );

  function openCreate() { setEditTarget(null); setForm(EMPTY); setModalOpen(true); }
  function openEdit(c: Coupon) {
    setEditTarget(c);
    setForm({
      code: c.code,
      discountType: c.discountType,
      discountValue: String(c.discountValue),
      minOrderAmount: c.minOrderAmount != null ? String(c.minOrderAmount) : "",
      maxUses: c.maxUses != null ? String(c.maxUses) : "",
      expiresAt: c.expiresAt ? c.expiresAt.slice(0, 10) : "",
      isActive: c.isActive,
    });
    setModalOpen(true);
  }

  const setF = (k: keyof typeof EMPTY, v: string | boolean) =>
    setForm((f) => ({ ...f, [k]: v }));

  async function handleSave() {
    if (!form.code || !form.discountValue) {
      toast.error("Code and discount value are required");
      return;
    }
    setSaving(true);
    const payload = {
      code: form.code,
      discountType: form.discountType,
      discountValue: Number(form.discountValue),
      minOrderAmount: form.minOrderAmount ? Number(form.minOrderAmount) : null,
      maxUses: form.maxUses ? Number(form.maxUses) : null,
      expiresAt: form.expiresAt || null,
      isActive: form.isActive,
    };
    const res = editTarget
      ? await updateCoupon(editTarget.id, payload)
      : await createCoupon(payload);
    if (res.success) {
      toast.success(editTarget ? "Coupon updated" : "Coupon created");
      setModalOpen(false); load();
    } else {
      toast.error(res.error ?? "Something went wrong");
    }
    setSaving(false);
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    const res = await deleteCoupon(deleteTarget.id);
    if (res.success) {
      toast.success("Coupon deleted");
      setDeleteTarget(null); load();
    } else {
      toast.error(res.error ?? "Failed to delete");
    }
    setDeleting(false);
  }

  async function toggleActive(c: Coupon) {
    const res = await updateCoupon(c.id, { isActive: !c.isActive });
    if (res.success) {
      toast.success(`Coupon ${!c.isActive ? "activated" : "deactivated"}`);
      load();
    }
  }

  const columns: Column<Coupon>[] = [
    {
      key: "code",
      header: "Code",
      render: (c) => (
        <span className="font-mono text-sm font-bold tracking-widest text-neutral-800 bg-neutral-100 px-2 py-0.5 rounded">
          {c.code}
        </span>
      ),
    },
    {
      key: "discount",
      header: "Discount",
      render: (c) => (
        <span className="font-semibold text-neutral-900">
          {c.discountType === "PERCENTAGE"
            ? `${c.discountValue}%`
            : `${CURRENCY_SYMBOL}${c.discountValue.toLocaleString()}`}
        </span>
      ),
    },
    {
      key: "minOrder",
      header: "Min Order",
      render: (c) => c.minOrderAmount
        ? <span className="text-neutral-600">{CURRENCY_SYMBOL}{c.minOrderAmount.toLocaleString()}</span>
        : <span className="text-neutral-300">—</span>,
    },
    {
      key: "usage",
      header: "Usage",
      render: (c) => (
        <span className="text-neutral-600">
          {c.usedCount}{c.maxUses ? `/${c.maxUses}` : ""}
        </span>
      ),
    },
    {
      key: "expiresAt",
      header: "Expires",
      render: (c) => c.expiresAt
        ? <span className={`text-xs ${new Date(c.expiresAt) < new Date() ? "text-red-500" : "text-neutral-500"}`}>{format(new Date(c.expiresAt), "dd MMM yyyy")}</span>
        : <span className="text-neutral-300 text-xs">No expiry</span>,
    },
    {
      key: "isActive",
      header: "Active",
      render: (c) => (
        <button onClick={() => toggleActive(c)} className="transition-opacity hover:opacity-70">
          {c.isActive
            ? <ToggleRight size={22} className="text-green-500" />
            : <ToggleLeft size={22} className="text-neutral-300" />}
        </button>
      ),
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

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-neutral-900">Coupons</h1>
          <p className="mt-0.5 text-sm text-neutral-500">{coupons.length} total coupons</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 rounded-xl bg-neutral-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-neutral-800">
          <Plus size={15} /> Add Coupon
        </button>
      </div>

      <DataTable columns={columns} data={filtered} loading={loading} searchValue={search} onSearchChange={setSearch} searchPlaceholder="Search coupon codes..." emptyMessage="No coupons found" />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editTarget ? "Edit Coupon" : "Add New Coupon"} size="md">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label="Coupon Code" required hint="Will be auto-uppercased">
            <Input
              value={form.code}
              onChange={(e) => setF("code", e.target.value.toUpperCase())}
              placeholder="EID20"
              className="uppercase tracking-widest font-mono"
            />
          </FormField>
          <FormField label="Discount Type" required>
            <Select value={form.discountType} onChange={(e) => setF("discountType", e.target.value)}>
              <option value="PERCENTAGE">Percentage (%)</option>
              <option value="FIXED">Fixed Amount (PKR)</option>
            </Select>
          </FormField>
          <FormField label="Discount Value" required>
            <Input type="number" min="0" value={form.discountValue} onChange={(e) => setF("discountValue", e.target.value)}
              placeholder={form.discountType === "PERCENTAGE" ? "20" : "500"} />
          </FormField>
          <FormField label="Min Order Amount (PKR)" hint="Optional — minimum cart value">
            <Input type="number" min="0" value={form.minOrderAmount} onChange={(e) => setF("minOrderAmount", e.target.value)} placeholder="2000" />
          </FormField>
          <FormField label="Max Uses" hint="Optional — unlimited if empty">
            <Input type="number" min="0" value={form.maxUses} onChange={(e) => setF("maxUses", e.target.value)} placeholder="100" />
          </FormField>
          <FormField label="Expiry Date" hint="Optional">
            <Input type="date" value={form.expiresAt} onChange={(e) => setF("expiresAt", e.target.value)} />
          </FormField>
          <div className="sm:col-span-2">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input type="checkbox" checked={form.isActive as boolean} onChange={(e) => setF("isActive", e.target.checked)} className="h-4 w-4 rounded border-neutral-300" />
              <span className="text-sm text-neutral-700">Active (can be used)</span>
            </label>
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

      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} loading={deleting} title="Delete Coupon?" message={`Coupon "${deleteTarget?.code}" will be permanently deleted.`} confirmLabel="Delete" />
    </div>
  );
}
