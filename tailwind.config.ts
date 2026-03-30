import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Marife Brand Palette
        background: {
          primary: "#FFFFFF",
          secondary: "#F7F7F7",
        },
        text: {
          primary: "#1A1A1A",
        },
        brand: {
          red: "#E01F54",    // Action Primary - CTA buttons, sale badges
          teal: "#007791",   // Secondary Accent - navigation highlights, promo banners
        },
        status: {
          success: "#28A745",
          warning: "#FFC107",
          error: "#DC3545",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      fontSize: {
        "hero": ["3.5rem", { lineHeight: "1.1", fontWeight: "700" }],
        "section": ["2.25rem", { lineHeight: "1.2", fontWeight: "600" }],
        "product": ["1.25rem", { lineHeight: "1.3", fontWeight: "500" }],
        "body-lg": ["1.125rem", { lineHeight: "1.6" }],
        "caption": ["0.875rem", { lineHeight: "1.5" }],
      },
      screens: {
        "xs": "375px",
        "sm": "640px",
        "md": "768px",
        "lg": "1024px",
        "xl": "1280px",
        "2xl": "1536px",
      },
      animation: {
        "slide-in-right": "slideInRight 0.3s ease-out",
        "fade-in": "fadeIn 0.2s ease-in",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        slideInRight: {
          "0%": { transform: "translateX(100%)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
