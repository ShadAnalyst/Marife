import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/providers/CartProvider";
import { Toaster } from "react-hot-toast";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "Marife — Bold, Occasion-Based Fashion",
    template: "%s | Marife",
  },
  description:
    "Costumes, Lingerie & Accessories for every occasion. Fast delivery in Switzerland. CHF pricing with TWINT, PayPal & card payments.",
  keywords: ["costumes", "lingerie", "accessories", "Halloween", "Carnival", "Switzerland", "fashion"],
  openGraph: {
    type: "website",
    locale: "de_CH",
    siteName: "Marife",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de-CH" className={inter.variable}>
      <body className="min-h-screen flex flex-col bg-white text-[#1A1A1A] antialiased">
        <CartProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: "#1A1A1A",
                color: "#fff",
                borderRadius: "8px",
                fontSize: "14px",
              },
              success: {
                iconTheme: { primary: "#28A745", secondary: "#fff" },
              },
            }}
          />
        </CartProvider>
      </body>
    </html>
  );
}
