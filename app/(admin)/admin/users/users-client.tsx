"use client";

import { useEffect, useState, useCallback } from "react";
import { Pencil, Trash2, Shield, User as UserIcon } from "lucide-react";
import toast from "react-hot-toast";
import { fetchAdminUsers, updateUser, deleteUser } from "@/lib/admin-api";
import { DataTable, type Column } from "@/components/admin/data-table";
import { Modal } from "@/components/admin/modal";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { FormField, Input, Select } from "@/components/admin/form-field";
import { format } from "date-fns";

interface User {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  role: "USER" | "ADMIN";
  credits: number;
  emailVerified: boolean;
  createdAt: string;
  _count?: { orders: number; reviews: number };
}

export function AdminUsersClient() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  const [editTarget, setEditTarget] = useState<User | null>(null);
  const [editForm, setEditForm] = useState({ name: "", role: "USER", credits: "0" });
  const [saving, setSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const params: Record<string, string | number> = { page, limit: 15 };
    if (search) params.search = search;
    if (roleFilter) params.role = roleFilter;
    const res = await fetchAdminUsers(params);
    if (res.success && res.data) {
      const d = res.data as { data: User[]; meta: { total: number; totalPages: number } };
      setUsers(d.data);
      setTotal(d.meta.total);
      setTotalPages(d.meta.totalPages);
    }
    setLoading(false);
  }, [page, search, roleFilter]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    const t = setTimeout(() => setPage(1), 400);
    return () => clearTimeout(t);
  }, [search]);

  function openEdit(u: User) {
    setEditTarget(u);
    setEditForm({ name: u.name, role: u.role, credits: String(u.credits) });
  }

  async function handleSave() {
    if (!editTarget) return;
    setSaving(true);
    const res = await updateUser(editTarget.id, {
      name: editForm.name,
      role: editForm.role,
      credits: Number(editForm.credits),
    });
    if (res.success) {
      toast.success("User updated successfully");
      setEditTarget(null); load();
    } else {
      toast.error(res.error ?? "Update failed");
    }
    setSaving(false);
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    const res = await deleteUser(deleteTarget.id);
    if (res.success) {
      toast.success("User deleted");
      setDeleteTarget(null); load();
    } else {
      toast.error(res.error ?? "Failed to delete");
    }
    setDeleting(false);
  }

  const columns: Column<User>[] = [
    {
      key: "avatar",
      header: "",
      render: (u) => (
        <div className="h-9 w-9 rounded-full bg-neutral-100 overflow-hidden flex items-center justify-center">
          {u.image
            ? <img src={u.image} alt={u.name} className="h-full w-full object-cover" />
            : <UserIcon size={14} className="text-neutral-400" />}
        </div>
      ),
    },
    {
      key: "user",
      header: "User",
      render: (u) => (
        <div>
          <p className="font-medium text-neutral-800">{u.name}</p>
          <p className="text-xs text-neutral-400">{u.email}</p>
        </div>
      ),
    },
    {
      key: "role",
      header: "Role",
      render: (u) => (
        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${u.role === "ADMIN" ? "bg-red-100 text-red-700" : "bg-neutral-100 text-neutral-600"}`}>
          {u.role === "ADMIN" && <Shield size={10} />}
          {u.role}
        </span>
      ),
    },
    {
      key: "credits",
      header: "Credits",
      render: (u) => <span className="font-medium text-neutral-700">{u.credits.toLocaleString()}</span>,
    },
    {
      key: "orders",
      header: "Orders",
      render: (u) => <span className="text-neutral-500">{u._count?.orders ?? 0}</span>,
    },
    {
      key: "verified",
      header: "Verified",
      render: (u) => (
        <span className={`text-xs font-medium ${u.emailVerified ? "text-green-600" : "text-red-400"}`}>
          {u.emailVerified ? "Yes" : "No"}
        </span>
      ),
    },
    {
      key: "joined",
      header: "Joined",
      render: (u) => <span className="text-neutral-400 text-xs">{format(new Date(u.createdAt), "dd MMM yyyy")}</span>,
    },
    {
      key: "actions",
      header: "Actions",
      render: (u) => (
        <div className="flex gap-2">
          <button onClick={() => openEdit(u)} className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 transition-colors"><Pencil size={14} /></button>
          <button onClick={() => setDeleteTarget(u)} className="rounded-lg p-1.5 text-neutral-400 hover:bg-red-50 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-neutral-900">Users</h1>
          <p className="mt-0.5 text-sm text-neutral-500">{total} registered users</p>
        </div>
        <select
          value={roleFilter}
          onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
          className="rounded-xl border border-neutral-200 bg-white py-2 pl-3 pr-8 text-sm text-neutral-700 outline-none focus:border-neutral-400"
        >
          <option value="">All Roles</option>
          <option value="USER">User</option>
          <option value="ADMIN">Admin</option>
        </select>
      </div>

      <DataTable
        columns={columns}
        data={users}
        loading={loading}
        total={total}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search by name or email..."
        emptyMessage="No users found"
      />

      {/* Edit Modal */}
      <Modal open={!!editTarget} onClose={() => setEditTarget(null)} title="Edit User" size="sm">
        <div className="flex flex-col gap-4">
          <FormField label="Name">
            <Input value={editForm.name} onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))} />
          </FormField>
          <FormField label="Role">
            <Select value={editForm.role} onChange={(e) => setEditForm((f) => ({ ...f, role: e.target.value }))}>
              <option value="USER">User</option>
              <option value="ADMIN">Admin</option>
            </Select>
          </FormField>
          <FormField label="Credits" hint="1 credit = 1 PKR">
            <Input type="number" min="0" value={editForm.credits} onChange={(e) => setEditForm((f) => ({ ...f, credits: e.target.value }))} />
          </FormField>
        </div>
        <div className="mt-5 flex justify-end gap-3">
          <button onClick={() => setEditTarget(null)} className="rounded-lg border border-neutral-200 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50">Cancel</button>
          <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 rounded-lg bg-neutral-900 px-5 py-2 text-sm font-semibold text-white hover:bg-neutral-800 disabled:opacity-60">
            {saving && <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />}
            Update User
          </button>
        </div>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete User?"
        message={`Permanently delete "${deleteTarget?.name}" (${deleteTarget?.email})?`}
        confirmLabel="Delete"
      />
    </div>
  );
}
