"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { useAdminOrdersStore, type AdminOrder } from "@/store/useAdminOrdersStore";

const STATUS_OPTIONS = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];

const statusColors: Record<string, string> = {
  Processing: "bg-blue-100 text-blue-700",
  Shipped: "bg-purple-100 text-purple-700",
  Delivered: "bg-green-100 text-green-700",
  Pending: "bg-yellow-100 text-yellow-700",
  Cancelled: "bg-red-100 text-red-700",
};

export default function OrdersPage() {
  const orders = useAdminOrdersStore((s) => s.orders);
  const updateOrder = useAdminOrdersStore((s) => s.updateOrder);
  const deleteOrder = useAdminOrdersStore((s) => s.deleteOrder);

  const [editing, setEditing] = useState<AdminOrder | null>(null);
  const [form, setForm] = useState<Partial<AdminOrder>>({});

  const openEdit = (o: AdminOrder) => {
    setEditing(o);
    setForm({ ...o });
  };

  const closeEdit = () => {
    setEditing(null);
    setForm({});
  };

  const saveEdit = () => {
    if (!editing) return;
    updateOrder(editing.id, {
      customer: form.customer ?? editing.customer,
      email: form.email ?? editing.email,
      total: form.total ?? editing.total,
      status: form.status ?? editing.status,
      date: form.date ?? editing.date,
      items: Number(form.items ?? editing.items) || 0,
    });
    toast.success("Order updated");
    closeEdit();
  };

  const handleDelete = (o: AdminOrder) => {
    if (!window.confirm(`Delete order ${o.id}?`)) return;
    deleteOrder(o.id);
    toast.success("Order removed");
    if (editing?.id === o.id) closeEdit();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#1A1A1A]">Orders</h2>
          <p className="text-sm text-gray-500 mt-1">{orders.length} orders</p>
        </div>
        <button
          type="button"
          className="rounded-full bg-[#E01F54] px-5 py-2 text-sm font-semibold text-white hover:bg-[#c01843] transition-colors"
        >
          Export CSV
        </button>
      </div>

      <div className="rounded-xl bg-white shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#F7F7F7] text-xs text-gray-500 uppercase tracking-wide">
              <tr>
                <th className="px-5 py-3 text-left font-semibold">Order ID</th>
                <th className="px-5 py-3 text-left font-semibold">Customer</th>
                <th className="px-5 py-3 text-left font-semibold">Items</th>
                <th className="px-5 py-3 text-left font-semibold">Total</th>
                <th className="px-5 py-3 text-left font-semibold">Status</th>
                <th className="px-5 py-3 text-left font-semibold">Date</th>
                <th className="px-5 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-[#F7F7F7] transition-colors">
                  <td className="px-5 py-4 font-mono font-semibold text-[#1A1A1A]">{order.id}</td>
                  <td className="px-5 py-4">
                    <p className="font-medium text-[#1A1A1A]">{order.customer}</p>
                    <p className="text-xs text-gray-400">{order.email}</p>
                  </td>
                  <td className="px-5 py-4 text-gray-600">{order.items}</td>
                  <td className="px-5 py-4 font-bold text-[#1A1A1A]">{order.total}</td>
                  <td className="px-5 py-4">
                    <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${statusColors[order.status] ?? "bg-gray-100 text-gray-500"}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-gray-400 text-xs">{order.date}</td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => openEdit(order)}
                        className="text-[#007791] text-xs font-semibold hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(order)}
                        className="text-[#E01F54] text-xs font-semibold hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-[#1A1A1A]">Edit order</h3>
              <button type="button" onClick={closeEdit} className="text-gray-400 hover:text-[#1A1A1A] text-xl leading-none">
                ×
              </button>
            </div>
            <p className="text-xs font-mono text-gray-500">{editing.id}</p>
            <div className="grid gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Customer</label>
                <input
                  value={form.customer ?? ""}
                  onChange={(e) => setForm((f) => ({ ...f, customer: e.target.value }))}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Email</label>
                <input
                  type="email"
                  value={form.email ?? ""}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Total</label>
                  <input
                    value={form.total ?? ""}
                    onChange={(e) => setForm((f) => ({ ...f, total: e.target.value }))}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                    placeholder="CHF 0.00"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Items</label>
                  <input
                    type="number"
                    min={0}
                    value={form.items ?? ""}
                    onChange={(e) => setForm((f) => ({ ...f, items: Number(e.target.value) }))}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Status</label>
                <select
                  value={form.status ?? ""}
                  onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Date</label>
                <input
                  value={form.date ?? ""}
                  onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                />
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={saveEdit}
                className="flex-1 rounded-full bg-[#E01F54] py-2.5 text-sm font-semibold text-white hover:bg-[#c01843]"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => handleDelete(editing)}
                className="rounded-full border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
