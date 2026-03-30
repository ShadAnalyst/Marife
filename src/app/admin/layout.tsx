import Link from "next/link";
import { MarifeLogo } from "@/components/layout/MarifeLogo";
import {
  ChartBarIcon,
  ShoppingBagIcon,
  TagIcon,
  ClipboardDocumentListIcon,
  MegaphoneIcon,
  Cog6ToothIcon,
  ArrowUpTrayIcon,
} from "@heroicons/react/24/outline";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: ChartBarIcon },
  { label: "Products", href: "/admin/products", icon: TagIcon },
  { label: "Orders", href: "/admin/orders", icon: ShoppingBagIcon },
  { label: "Inventory", href: "/admin/inventory", icon: ClipboardDocumentListIcon },
  { label: "Merchandising", href: "/admin/merchandising", icon: MegaphoneIcon },
  { label: "Bulk Import", href: "/admin/import", icon: ArrowUpTrayIcon },
  { label: "Settings", href: "/admin/settings", icon: Cog6ToothIcon },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#F7F7F7]">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1A1A1A] text-white flex-shrink-0 flex flex-col">
        <div className="p-5 border-b border-white/10">
          <div className="flex flex-col gap-2">
            <MarifeLogo variant="admin" href="/admin" />
            <span className="text-[10px] font-bold tracking-[0.2em] text-[#E01F54] uppercase">Admin</span>
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-colors"
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-white/10">
          <Link href="/" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
            ← View Store
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <header className="bg-white border-b px-6 py-4 flex items-center justify-between">
          <h1 className="text-base font-semibold text-[#1A1A1A]">Admin Panel</h1>
          <span className="text-sm text-gray-400">admin@marife.ch</span>
        </header>
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
