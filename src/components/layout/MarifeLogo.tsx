import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

type MarifeLogoProps = {
  href?: string;
  variant?: "header" | "footer" | "admin" | "mobile";
  className?: string;
  priority?: boolean;
  /** e.g. close mobile menu after navigation */
  onClick?: () => void;
};

const variantClass: Record<NonNullable<MarifeLogoProps["variant"]>, string> = {
  header: "h-9 sm:h-10 w-auto max-w-[min(220px,52vw)]",
  mobile: "h-8 w-auto max-w-[200px]",
  footer: "h-11 sm:h-12 w-auto max-w-[240px]",
  admin: "h-7 w-auto max-w-[180px]",
};

/**
 * Official MARIFE wordmark (Dessous & Korsett) — `/public/marife-logo.png`.
 */
export function MarifeLogo({
  href = "/",
  variant = "header",
  className,
  priority = false,
  onClick,
}: MarifeLogoProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "inline-flex items-center flex-shrink-0",
        (variant === "footer" || variant === "admin") &&
          "rounded-lg bg-[#FAF9F6] p-2 shadow-sm",
        className
      )}
      aria-label="Marife — Dessous & Korsett"
    >
      <Image
        src="/marife-logo.png"
        alt="Marife — Dessous & Korsett"
        width={280}
        height={82}
        className={cn("object-contain object-left", variantClass[variant])}
        priority={priority}
        sizes="(max-width: 640px) 55vw, 240px"
      />
    </Link>
  );
}
