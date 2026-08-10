"use client";

import { useEffect, useState, useCallback } from "react";
import { Eye, ChevronDown } from "lucide-react";
import toast from "react-hot-toast";
import { fetchAdminOrders, fetchAdminOrder, updateOrder } from "@/lib/admin-api";
import { DataTable, type Column } from "@/components/admin/data-table";
import { Modal } from "@/components/admin/modal";
import { StatusBadge } from "@/components/admin/status-badge";
import { CURRENCY_SYMBOL, ORDER_STATUSES } from "@/lib/constants";
import { format } from "date-fns";

interface OrderUser { id: string; name: string; email: string; image?: string | null }
interface OrderProductImage { url: string }
interface OrderProduct { id: string; name: string; images?: OrderProductImage[] }
interface OrderItem { id: string; product: OrderProduct; quantity: number; price: number; size?: string; color?: string }
interface Order {
  id: string;
  orderNumber: string;
  user: OrderUser;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  total: number;
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  items?: OrderItem[];
  shippingAddress?: Record<string, string>;
  createdAt: string;
  notes?: string | null;
}

const PAYMENT_STATUSES = ["PENDING", "PAID", "FAILED", "REFUNDED"];

export function AdminOrdersClient() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [detailOrder, setDetailOrder] = useState<Order | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [newPayStatus, setNewPayStatus] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const params: Record<string, string | number> = { page, limit: 15 };
    if (search) params.search = search;
    if (statusFilter) params.status = statusFilter;
    const res = await fetchAdminOrders(params);
    if (res.success && res.data) {
      const d = res.data as { data: Order[]; meta: { total: number; totalPages: number } };
      setOrders(d.data);
      setTotal(d.meta.total);
      setTotalPages(d.meta.totalPages);
    }
    setLoading(false);
  }, [page, search, statusFilter]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    const t = setTimeout(() => setPage(1), 400);
    return () => clearTimeout(t);
  }, [search]);

  async function openDetail(orderId: string) {
    setDetailLoading(true);
    setDetailOrder(null);
    const res = await fetchAdminOrder(orderId);
    if (res.success) {
      const o = res.data as Order;
      setDetailOrder(o);
      setNewStatus(o.status);
      setNewPayStatus(o.paymentStatus);
    }
    setDetailLoading(false);
  }

  async function handleUpdateOrder() {
    if (!detailOrder) return;
    setUpdatingStatus(true);
    const res = await updateOrder(detailOrder.id, {
      status: newStatus,
      paymentStatus: newPayStatus,
    });
    if (res.success) {
      toast.success("Order updated successfully");
      setDetailOrder(res.data as Order);
      load();
    } else {
      toast.error(res.error ?? "Update failed");
    }
    setUpdatingStatus(false);
  }

  const columns: Column<Order>[] = [
    {
      key: "orderNumber",
      header: "Order #",
      render: (o) => <span className="font-mono text-xs text-neutral-600">{o.orderNumber}</span>,
    },
    {
      key: "user",
      header: "Customer",
      render: (o) => (
        <div>
          <p className="font-medium text-neutral-700">{o.user?.name ?? "—"}</p>
          <p className="text-xs text-neutral-400">{o.user?.email}</p>
        </div>
      ),
    },
    {
      key: "total",
      header: "Total",
      render: (o) => (
        <span className="font-semibold text-neutral-900">{CURRENCY_SYMBOL}{o.total.toLocaleString()}</span>
      ),
    },
    {
      key: "paymentStatus",
      header: "Payment",
      render: (o) => <StatusBadge status={o.paymentStatus} variant="payment" />,
    },
    {
      key: "status",
      header: "Status",
      render: (o) => <StatusBadge status={o.status} variant="order" />,
    },
    {
      key: "createdAt",
      header: "Date",
      render: (o) => (
        <span className="text-neutral-500">{format(new Date(o.createdAt), "dd MMM yyyy")}</span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (o) => (
        <button
          onClick={() => openDetail(o.id)}
          className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium text-neutral-600 border border-neutral-200 hover:bg-neutral-50 transition-colors"
        >
          <Eye size={13} /> View
        </button>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-neutral-900">Orders</h1>
          <p className="mt-0.5 text-sm text-neutral-500">{total} total orders</p>
        </div>
        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="appearance-none rounded-xl border border-neutral-200 bg-white py-2 pl-3 pr-8 text-sm text-neutral-700 outline-none focus:border-neutral-400"
          >
            <option value="">All Statuses</option>
            {ORDER_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <ChevronDown size={14} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400" />
        </div>
      </div>

      <DataTable
        columns={columns}
        data={orders}
        loading={loading}
        total={total}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search by order # or customer..."
        emptyMessage="No orders found"
      />

      {/* Order Detail Modal */}
      <Modal
        open={!!detailOrder || detailLoading}
        onClose={() => setDetailOrder(null)}
        title={detailOrder ? `Order ${detailOrder.orderNumber}` : "Loading..."}
        size="lg"
      >
        {detailLoading && (
          <div className="flex h-40 items-center justify-center">
            <span className="h-6 w-6 animate-spin rounded-full border-2 border-neutral-900 border-t-transparent" />
          </div>
        )}
        {detailOrder && (
          <div className="flex flex-col gap-5">
            {/* Customer + date */}
            <div className="grid grid-cols-2 gap-4 rounded-xl bg-neutral-50 p-4 text-sm">
              <div>
                <p className="text-xs text-neutral-400 mb-0.5">Customer</p>
                <p className="font-medium text-neutral-800">{detailOrder.user?.name}</p>
                <p className="text-neutral-500">{detailOrder.user?.email}</p>
              </div>
              <div>
                <p className="text-xs text-neutral-400 mb-0.5">Date</p>
                <p className="font-medium text-neutral-800">{format(new Date(detailOrder.createdAt), "dd MMM yyyy, HH:mm")}</p>
                <p className="text-neutral-500">Method: {detailOrder.paymentMethod}</p>
              </div>
            </div>

            {/* Shipping Address */}
            {detailOrder.shippingAddress && (
              <div className="text-sm">
                <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400 mb-2">Shipping Address</p>
                <div className="rounded-xl border border-neutral-100 p-3 text-neutral-600">
                  {Object.entries(detailOrder.shippingAddress)
                    .filter(([k]) => !["id", "isDefault"].includes(k))
                    .map(([k, v]) => v ? <p key={k}><span className="text-neutral-400 capitalize">{k}: </span>{v as string}</p> : null)}
                </div>
              </div>
            )}

            {/* Items */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400 mb-2">Items</p>
              <div className="flex flex-col gap-2">
                {detailOrder.items?.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 rounded-xl border border-neutral-100 p-3">
                    <div className="h-10 w-10 flex-shrink-0 rounded-lg bg-neutral-100 overflow-hidden">
                      {item.product?.images?.[0]?.url && (
                        <img src={item.product.images[0].url} alt={item.product.name} className="h-full w-full object-cover" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-neutral-700 truncate">{item.product?.name}</p>
                      <p className="text-xs text-neutral-400">
                        {item.quantity}x {CURRENCY_SYMBOL}{item.price.toLocaleString()}
                        {item.size ? ` · ${item.size}` : ""}
                        {item.color ? ` · ${item.color}` : ""}
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-neutral-900">
                      {CURRENCY_SYMBOL}{(item.quantity * item.price).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Totals */}
            <div className="rounded-xl bg-neutral-50 p-4 text-sm">
              {[
                ["Subtotal", detailOrder.subtotal],
                ["Discount", detailOrder.discount],
                ["Shipping", detailOrder.shipping],
                ["Tax (GST)", detailOrder.tax],
              ].map(([label, val]) => (
                <div key={label as string} className="flex justify-between py-0.5 text-neutral-600">
                  <span>{label}</span>
                  <span>{CURRENCY_SYMBOL}{(val as number).toLocaleString()}</span>
                </div>
              ))}
              <div className="mt-2 flex justify-between border-t border-neutral-200 pt-2 font-semibold text-neutral-900">
                <span>Total</span>
                <span>{CURRENCY_SYMBOL}{detailOrder.total.toLocaleString()}</span>
              </div>
            </div>

            {/* Status Update */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wide">Order Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-neutral-400"
                >
                  {ORDER_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wide">Payment Status</label>
                <select
                  value={newPayStatus}
                  onChange={(e) => setNewPayStatus(e.target.value)}
                  className="rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-neutral-400"
                >
                  {PAYMENT_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleUpdateOrder}
                disabled={updatingStatus}
                className="flex items-center gap-2 rounded-lg bg-neutral-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-neutral-800 disabled:opacity-60"
              >
                {updatingStatus && <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />}
                Update Status
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
