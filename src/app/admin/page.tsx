import Link from "next/link";
import {
  ShoppingBagIcon,
  TagIcon,
  CurrencyDollarIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { MOCK_PRODUCTS } from "@/lib/mockData";

const stats = [
  { label: "Total Products", value: "2,847", icon: TagIcon, color: "#007791", change: "+12 this week" },
  { label: "Active Orders", value: "143", icon: ShoppingBagIcon, color: "#E01F54", change: "+28 today" },
  { label: "Revenue (MTD)", value: "CHF 18,420", icon: CurrencyDollarIcon, color: "#28A745", change: "+15.3%" },
  { label: "Low Stock Alerts", value: "23", icon: ExclamationTriangleIcon, color: "#FFC107", change: "Action needed" },
];

const recentOrders = [
  { id: "MRF-001A2B", customer: "Anna M.", total: "CHF 89.95", status: "Processing", date: "Today 14:22" },
  { id: "MRF-002C3D", customer: "Maria K.", total: "CHF 134.90", status: "Shipped", date: "Today 11:05" },
  { id: "MRF-003E4F", customer: "Guest User", total: "CHF 49.95", status: "Delivered", date: "Yesterday" },
  { id: "MRF-004G5H", customer: "Laura B.", total: "CHF 219.85", status: "Processing", date: "Yesterday" },
];

const statusColors: Record<string, string> = {
  Processing: "bg-blue-100 text-blue-700",
  Shipped: "bg-purple-100 text-purple-700",
  Delivered: "bg-green-100 text-green-700",
  Pending: "bg-yellow-100 text-yellow-700",
  Cancelled: "bg-red-100 text-red-700",
};

export default function AdminDashboard() {
  const lowStockProducts = MOCK_PRODUCTS.filter((p) =>
    p.variants.some((v) => v.isAvailable && v.currentStock > 0 && v.currentStock <= 5)
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#1A1A1A]">Dashboard</h2>
        <p className="text-sm text-gray-500 mt-1">Welcome back — here's what's happening today.</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-xl bg-white p-5 shadow-sm border border-gray-100">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{stat.label}</p>
                <p className="mt-1.5 text-2xl font-black text-[#1A1A1A]">{stat.value}</p>
                <p className="mt-1 text-xs text-gray-400">{stat.change}</p>
              </div>
              <div className="rounded-lg p-2.5" style={{ backgroundColor: stat.color + "20" }}>
                <stat.icon className="h-5 w-5" style={{ color: stat.color }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="rounded-xl bg-white shadow-sm border border-gray-100">
          <div className="flex items-center justify-between p-5 border-b">
            <h3 className="font-bold text-[#1A1A1A]">Recent Orders</h3>
            <Link href="/admin/orders" className="text-xs text-[#E01F54] font-semibold hover:underline">View all</Link>
          </div>
          <div className="divide-y">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between px-5 py-3.5">
                <div>
                  <p className="text-sm font-semibold text-[#1A1A1A]">{order.id}</p>
                  <p className="text-xs text-gray-400">{order.customer} · {order.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-[#1A1A1A]">{order.total}</p>
                  <span className={`mt-0.5 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold ${statusColors[order.status]}`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="rounded-xl bg-white shadow-sm border border-gray-100">
          <div className="flex items-center justify-between p-5 border-b">
            <h3 className="font-bold text-[#1A1A1A]">
              Low Stock Alerts
              <span className="ml-2 rounded-full bg-[#FFC107] px-2 py-0.5 text-[10px] font-bold text-[#1A1A1A]">
                {lowStockProducts.length}
              </span>
            </h3>
            <Link href="/admin/inventory" className="text-xs text-[#E01F54] font-semibold hover:underline">Manage</Link>
          </div>
          <div className="divide-y">
            {lowStockProducts.map((product) => {
              const lowVar = product.variants.filter((v) => v.isAvailable && v.currentStock <= 5 && v.currentStock > 0);
              return (
                <div key={product.id} className="flex items-center justify-between px-5 py-3.5">
                  <div>
                    <p className="text-sm font-semibold text-[#1A1A1A] line-clamp-1">{product.name}</p>
                    <p className="text-xs text-gray-400">
                      {lowVar.map((v) => `${v.sizeValue}: ${v.currentStock} left`).join(", ")}
                    </p>
                  </div>
                  <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-700">
                    Restock
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div>
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          {[
            { label: "Add New Product", href: "/admin/products/new", cls: "border-[#E01F54] text-[#E01F54] hover:bg-[#E01F54] hover:text-white" },
            { label: "Bulk CSV Import", href: "/admin/import", cls: "border-[#007791] text-[#007791] hover:bg-[#007791] hover:text-white" },
            { label: "Edit Homepage Slots", href: "/admin/merchandising", cls: "border-[#1A1A1A] text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white" },
            { label: "View All Orders", href: "/admin/orders", cls: "border-[#28A745] text-[#28A745] hover:bg-[#28A745] hover:text-white" },
          ].map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className={`rounded-full border-2 px-5 py-2 text-sm font-semibold transition-colors ${action.cls}`}
            >
              {action.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
