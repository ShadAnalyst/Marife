'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import Link from 'next/link';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import type { MockProduct } from '@/lib/mockData';
import { ProductCard } from '@/components/product/ProductCard';
import ShaderAnimation from '@/components/ui/shader-animation';
import { useMergedCategories, useProductsByCategory, type MergedCategory } from '@/lib/useMergedCatalog';

// ─── Artistic hero ────────────────────────────────────────────────────────────

function MarifeHero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.6, 1], [1, 0.4, 0]);
  const scale  = useTransform(scrollYProgress, [0, 1], [1, 1.12]);

  return (
    <div ref={heroRef} className="relative h-screen w-full overflow-hidden bg-[#080808]">
      {/* ── WebGL shader layer (always full-screen, behind everything) ── */}
      <ShaderAnimation />

      <motion.div
        style={{ opacity, scale }}
        className="absolute inset-0 flex flex-col items-center justify-center"
      >
        {/* Subtle radial overlay so text stays readable over shader */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_50%,transparent_30%,rgba(8,8,8,0.55)_100%)]" />

        <div className="relative flex flex-col items-center text-center px-6">
          {/* Top label */}
          <motion.p
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.2 }}
            className="text-[#E01F54] text-[9px] md:text-[10px] font-semibold tracking-[0.55em] uppercase mb-9"
          >
            Dessous &amp; Korsett
          </motion.p>

          {/* MARIFE logotype */}
          <div className="overflow-hidden">
            <motion.h1
              initial={{ y: '105%' }}
              animate={{ y: 0 }}
              transition={{ duration: 1.1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-white leading-none select-none"
              style={{
                fontSize: 'clamp(4.5rem, 17vw, 17rem)',
                fontFamily: '"Georgia", "Times New Roman", serif',
                fontWeight: 900,
                letterSpacing: '-0.025em',
              }}
            >
              MARIFE
            </motion.h1>
          </div>

          {/* Animated divider line */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.4, delay: 0.7 }}
            style={{ transformOrigin: 'center' }}
            className="w-full max-w-xs mt-7 h-px bg-gradient-to-r from-transparent via-[#E01F54] to-transparent"
          />

          {/* Sub-label */}
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 1.1 }}
            className="text-white/35 text-[10px] font-light tracking-[0.38em] mt-6 uppercase"
          >
            Switzerland · Collection 2025
          </motion.p>

          {/* Decorative rings */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2.5, delay: 1.5 }}
            className="absolute -top-28 -left-28 w-56 h-56 border border-[#007791]/15 rounded-full pointer-events-none"
          />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2.5, delay: 1.7 }}
            className="absolute -bottom-28 -right-28 w-72 h-72 border border-[#E01F54]/15 rounded-full pointer-events-none"
          />
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        style={{ opacity }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <motion.div
          animate={{ y: [0, 7, 0] }}
          transition={{ duration: 2.3, repeat: Infinity, ease: 'easeInOut' }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-white/25 text-[8px] tracking-[0.45em] uppercase font-light">Scroll</span>
          <div className="w-px h-10 bg-gradient-to-b from-white/25 to-transparent" />
        </motion.div>
      </motion.div>
    </div>
  );
}

// ─── Per-category scroll-expansion section ────────────────────────────────────

function ScrollExpandSection({
  category,
  index,
  totalCategories,
}: {
  category: MergedCategory;
  index: number;
  totalCategories: number;
}) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const products = useProductsByCategory(category.slug);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  // Spring-smoothed scroll value for buttery transitions
  const smooth = useSpring(scrollYProgress, { stiffness: 75, damping: 22, restDelta: 0.001 });

  // Image card expansion: small pill → full screen
  const cardWidth        = useTransform(smooth, [0, 0.28, 0.48], ['42%', '100%', '100%']);
  const cardHeight       = useTransform(smooth, [0, 0.28, 0.48], ['58vh', '100vh', '100vh']);
  const cardBorderRadius = useTransform(smooth, [0, 0.28], ['18px', '0px']);
  const cardScale        = useTransform(smooth, [0, 0.28], [0.58, 1]);

  // Text transitions
  const titleOpacity    = useTransform(smooth, [0.28, 0.46], [1, 0]);
  const productsOpacity = useTransform(smooth, [0.42, 0.65, 0.82], [0, 0.6, 1]);

  return (
    // 200vh gives enough scroll travel for the sticky expansion animation
    <div ref={sectionRef} className="relative h-[200vh] w-full">
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden bg-[#080808]">
        <motion.div
          style={{
            width: cardWidth,
            height: cardHeight,
            borderRadius: cardBorderRadius,
            scale: cardScale,
          }}
          className="relative overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.6)]"
        >
          {/* Background image (CSS background so it spans the full card) */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${category.imageUrl})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/25 to-black/75" />
          </div>

          {/* ── Title overlay (visible while small, fades out when full-screen) ── */}
          <motion.div
            style={{ opacity: titleOpacity }}
            className="relative h-full flex flex-col items-center justify-center text-center p-8 pointer-events-none"
          >
            <p className="text-[#E01F54] text-[8px] font-semibold tracking-[0.42em] uppercase mb-4">
              {String(index + 1).padStart(2, '0')} &nbsp;/&nbsp; {String(totalCategories).padStart(2, '0')}
            </p>
            <h2
              className="text-white leading-none"
              style={{
                fontSize: 'clamp(2rem, 7vw, 7.5rem)',
                fontFamily: '"Georgia", "Times New Roman", serif',
                fontWeight: 700,
              }}
            >
              {category.name}
            </h2>
            <p className="text-white/45 text-xs mt-3 font-light tracking-[0.25em]">
              {category.count} styles
            </p>

            {/* Scroll nudge */}
            <div className="mt-10 flex flex-col items-center gap-1.5">
              <span className="text-white/25 text-[7px] tracking-[0.4em] uppercase">scroll</span>
              <motion.div
                animate={{ y: [0, 5, 0] }}
                transition={{ duration: 1.8, repeat: Infinity }}
                className="w-px h-7 bg-gradient-to-b from-white/25 to-transparent"
              />
            </div>
          </motion.div>

          {/* ── Products (fades in once fully expanded) ── */}
          <motion.div
            style={{ opacity: productsOpacity }}
            className="absolute inset-0 overflow-y-auto"
          >
            <div className="min-h-screen flex items-start justify-center px-5 pt-14 pb-16 md:px-14 md:pt-16">
              <div className="w-full max-w-7xl">
                {/* Section heading */}
                <div className="text-center mb-12">
                  <p className="text-[#E01F54] text-[8px] font-semibold tracking-[0.45em] uppercase mb-4">
                    Collection
                  </p>
                  <h2
                    className="text-white leading-none"
                    style={{
                      fontSize: 'clamp(2rem, 6vw, 5.5rem)',
                      fontFamily: '"Georgia", "Times New Roman", serif',
                      fontWeight: 700,
                    }}
                  >
                    {category.name}
                  </h2>
                  <p className="text-white/40 text-xs mt-3 font-light tracking-wide">
                    {products.length} products in this collection
                  </p>
                </div>

                {/* Product grid */}
                <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
                  {products.slice(0, 4).map((product, i) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 22 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.09, duration: 0.45 }}
                      viewport={{ once: true }}
                    >
                      <ProductCard product={product} />
                    </motion.div>
                  ))}
                </div>

                {/* CTA */}
                <div className="mt-10 text-center">
                  <Link
                    href={`/category/${category.slug}`}
                    className="inline-flex items-center gap-2.5 rounded-full border border-white/25 px-7 py-3 text-sm font-medium text-white hover:bg-white hover:text-[#0a0a0a] transition-all duration-300"
                  >
                    Shop All {category.name}
                    <ArrowRightIcon className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HomePage() {
  const categories = useMergedCategories();

  return (
    <div className="bg-[#080808]">
      <MarifeHero />

      {categories.map((cat, i) => (
        <ScrollExpandSection
          key={cat.slug}
          category={cat}
          index={i}
          totalCategories={categories.length}
        />
      ))}

      {/* Footer mark */}
      <footer className="bg-[#080808] border-t border-white/[0.06] py-16 flex flex-col items-center gap-3">
        <div className="h-px w-16 bg-white/[0.08]" />
        <p
          className="text-white/15 text-[8px] tracking-[0.5em] uppercase"
          style={{ fontFamily: '"Georgia", "Times New Roman", serif' }}
        >
          MARIFE · Zürich · Switzerland
        </p>
      </footer>
    </div>
  );
}
