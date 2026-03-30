import Link from "next/link";
import { EnvelopeIcon, MapPinIcon } from "@heroicons/react/24/outline";
import { FooterShopLinks } from "./FooterShopLinks";
import { MarifeLogo } from "@/components/layout/MarifeLogo";

const footerLinks = {
  Help: [
    { label: "Size Guide", href: "/size-guide" },
    { label: "Shipping & Delivery", href: "/shipping" },
    { label: "Returns & Exchanges", href: "/returns" },
    { label: "FAQ", href: "/faq" },
    { label: "Contact Us", href: "/contact" },
  ],
  Company: [
    { label: "About Marife", href: "/about" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Cookie Policy", href: "/cookies" },
  ],
};

const paymentIcons = [
  { name: "TWINT", bg: "#000" },
  { name: "PayPal", bg: "#003087" },
  { name: "Visa", bg: "#1a1f71" },
  { name: "Mastercard", bg: "#eb001b" },
];

export default function Footer() {
  return (
    <footer className="bg-[#1A1A1A] text-white mt-auto">
      {/* Main footer */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
          {/* Brand column */}
          <div className="col-span-2 lg:col-span-2">
            <MarifeLogo variant="footer" href="/" />
            <p className="mt-4 text-sm text-gray-400 leading-relaxed max-w-xs">
              Dessous, Korsetts, Fashion und mehr — Marife, Schweiz.
            </p>
            <div className="mt-6 space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <EnvelopeIcon className="h-4 w-4 text-[#007791]" />
                <a href="mailto:hello@marife.ch" className="hover:text-white transition-colors">
                  hello@marife.ch
                </a>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <MapPinIcon className="h-4 w-4 text-[#007791]" />
                <span>Schweiz / Switzerland</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-300">
              Shop
            </h4>
            <FooterShopLinks />
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-300">
                {title}
              </h4>
              <ul className="mt-4 space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-gray-500">
              © {new Date().getFullYear()} Marife. Alle Rechte vorbehalten. Preise inkl. 8.1% MwSt.
            </p>
            {/* Payment methods */}
            <div className="flex items-center gap-2">
              {paymentIcons.map((p) => (
                <div
                  key={p.name}
                  className="rounded px-2 py-1 text-[10px] font-bold text-white"
                  style={{ backgroundColor: p.bg }}
                  title={p.name}
                >
                  {p.name}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
