'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { MOCK_PRODUCTS, MOCK_CATEGORIES } from '@/lib/mockData';
import { ProductCard } from '@/components/product/ProductCard';
import ShaderAnimation from '@/components/ui/shader-animation';

// ─── Shared serif style ───────────────────────────────────────────────────────
const serif: React.CSSProperties = { fontFamily: "'Bodoni Moda', Georgia, serif" };

// ─── Filter products by category ─────────────────────────────────────────────
function getProducts(slug: string) {
  return MOCK_PRODUCTS.filter((p) => p.category === slug && p.isActive);
}

// ─── MARIFE Hero ─────────────────────────────────────────────────────────────

function MarifeHero({ compact }: { compact: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const y       = useTransform(scrollYProgress, [0, 1], ['0%', '12%']);

  return (
    <div ref={ref} className="relative h-screen w-full overflow-hidden bg-[#080808]">
      {/* WebGL shader */}
      <ShaderAnimation lowPower={compact} />

      {/* Parallax content */}
      <motion.div
        style={{ opacity: compact ? 1 : opacity, y: compact ? 0 : y }}
        className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
      >
        {/* Vignette over shader */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_70%_at_50%_50%,transparent_25%,rgba(8,8,8,0.5)_100%)]" />

        <div className="relative flex flex-col items-center text-center px-4">
          {/* Category tag */}
          <motion.p
            initial={compact ? false : { opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.15 }}
            className="text-[#E01F54] text-[9px] font-semibold tracking-[0.55em] uppercase mb-8"
          >
            Dessous &amp; Korsett
          </motion.p>

          {/* MARIFE logotype */}
          <div className="overflow-hidden">
            <motion.h1
              initial={compact ? false : { y: '110%' }}
              animate={{ y: 0 }}
              transition={{ duration: 1.05, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
              className="text-white leading-none select-none"
              style={{
                ...serif,
                fontSize: 'clamp(4.5rem, 16vw, 16rem)',
                fontWeight: 900,
                letterSpacing: '-0.02em',
              }}
            >
              MARIFE
            </motion.h1>
          </div>

          {/* Red line divider */}
          <motion.div
            initial={compact ? false : { scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.3, delay: 0.65 }}
            style={{ transformOrigin: 'center' }}
            className="mt-6 h-px w-64 bg-gradient-to-r from-transparent via-[#E01F54] to-transparent"
          />

          {/* Tagline */}
          <motion.p
            initial={compact ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 1.0 }}
            className="mt-5 text-white/30 text-[9px] tracking-[0.42em] uppercase font-light"
          >
            Switzerland · Collection 2025
          </motion.p>

          {/* Decorative rings */}
          {!compact && (
            <>
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ duration: 2.5, delay: 1.4 }}
                className="absolute -top-28 -left-32 w-60 h-60 rounded-full border border-[#007791]/10 pointer-events-none"
              />
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ duration: 2.5, delay: 1.6 }}
                className="absolute -bottom-28 -right-32 w-80 h-80 rounded-full border border-[#E01F54]/10 pointer-events-none"
              />
            </>
          )}
        </div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        style={{ opacity: compact ? 0.8 : opacity }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2.5"
      >
        <motion.div
          animate={compact ? {} : { y: [0, 6, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-white/20 text-[8px] tracking-[0.5em] uppercase font-light">Scroll</span>
          <div className="w-px h-9 bg-gradient-to-b from-white/20 to-transparent" />
        </motion.div>
      </motion.div>
    </div>
  );
}

// ─── Category scroll-expansion section ───────────────────────────────────────

interface Cat { id: number; name: string; slug: string; imageUrl: string; count: number }

function CategorySection({ cat, index, total, compact }: {
  cat: Cat; index: number; total: number; compact: boolean
}) {
  const ref = useRef<HTMLDivElement>(null);
  const products = getProducts(cat.slug);

  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start end', 'end start'] });

  const cardW = useTransform(p, compact ? [0,1] : [0, 0.26, 0.46], compact ? ['100%','100%'] : ['44%','100%','100%']);
  const cardH = useTransform(p, compact ? [0,1] : [0, 0.26, 0.46], compact ? ['100vh','100vh'] : ['56vh','100vh','100vh']);
  const cardR = useTransform(p, compact ? [0,1] : [0, 0.26], compact ? ['0px','0px'] : ['16px','0px']);
  const imgS  = useTransform(p, compact ? [0,1] : [0, 0.26], compact ? [1,1] : [0.6, 1]);

  const titleO  = useTransform(p, compact ? [0,0.18] : [0.26, 0.44], [1, 0]);
  const prodO   = useTransform(p, compact ? [0,0.08,1] : [0.42, 0.56, 0.70], compact ? [1,1,1] : [0, 1, 1]);

  return (
    <div ref={ref} className={`relative w-full ${compact ? 'h-[150vh]' : 'h-[200vh]'}`}>
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden bg-[#080808]">
        <motion.div
          style={{ width: cardW, height: cardH, borderRadius: cardR }}
          className="relative overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.7)] [contain:layout_paint]"
        >
          {/* ── BG image + title overlay ──────────────────────────────────── */}
          <motion.div style={{ scale: imgS }} className="absolute inset-0 origin-center will-change-transform">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${cat.imageUrl})` }}
            />
            {/* Dark gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/80" />
          </motion.div>

          {/* Title (fades out as card expands) */}
          <motion.div
            style={{ opacity: titleO }}
            className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-8 pointer-events-none"
          >
            <p className="text-[#E01F54] text-[8px] font-semibold tracking-[0.5em] uppercase mb-5">
              {String(index + 1).padStart(2,'0')} / {String(total).padStart(2,'0')}
            </p>
            <h2
              className="text-white leading-none"
              style={{ ...serif, fontSize: 'clamp(2rem, 7vw, 8rem)', fontWeight: 700 }}
            >
              {cat.name}
            </h2>
            <p className="mt-3 text-white/35 text-xs font-light tracking-[0.3em] uppercase">
              {cat.count} styles
            </p>

            {/* Scroll nudge */}
            <motion.div
              animate={compact ? {} : { y: [0, 5, 0] }}
              transition={{ duration: 1.9, repeat: Infinity }}
              className="mt-10 flex flex-col items-center gap-1.5"
            >
              <span className="text-white/20 text-[7px] tracking-[0.5em] uppercase">scroll</span>
              <div className="w-px h-7 bg-gradient-to-b from-white/20 to-transparent" />
            </motion.div>
          </motion.div>

          {/* ── Products (fades in when full-screen) ─────────────────────── */}
          <motion.div
            style={{ opacity: prodO }}
            className="absolute inset-0 z-20 overflow-y-auto overflow-x-hidden bg-[#0a0a0a]"
          >
            <div className="min-h-screen px-5 pt-16 pb-20 md:px-14 md:pt-20">

              {/* Section header — raydarten editorial style */}
              <div className="flex flex-col items-center text-center mb-14">
                <p className="text-[#E01F54] text-[8px] font-semibold tracking-[0.5em] uppercase mb-5">
                  Collection
                </p>
                <h2
                  className="text-white leading-none"
                  style={{ ...serif, fontSize: 'clamp(2.5rem, 6vw, 6rem)', fontWeight: 700 }}
                >
                  {cat.name}
                </h2>
                {/* Fine underline */}
                <div className="mt-5 h-px w-20 bg-white/15" />
                <p className="mt-4 text-white/30 text-[10px] tracking-[0.3em] uppercase font-light">
                  {products.length} Produkte
                </p>
              </div>

              {/* Product grid */}
              <div className="max-w-6xl mx-auto grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 md:gap-5">
                {products.slice(0, 4).map((product, i) => (
                  <motion.div
                    key={product.id}
                    initial={compact ? false : { opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07, duration: 0.4, ease: [0.25,0.1,0.25,1] }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </div>

              {/* CTA — raydarten style: minimal text + arrow */}
              <div className="mt-14 flex flex-col items-center gap-3">
                <Link
                  href={`/category/${cat.slug}`}
                  className="group inline-flex items-center gap-3 text-white/60 hover:text-white text-[11px] tracking-[0.3em] uppercase font-medium transition-colors duration-300"
                >
                  Alle {cat.name} entdecken
                  <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                    <ArrowRightIcon className="h-3.5 w-3.5" />
                  </span>
                </Link>
                {/* Fine rule */}
                <div className="h-px w-16 bg-white/10" />
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

// ─── Category grid teaser (below scroll sections) ────────────────────────────
// Shows remaining categories not in the top 4 scroll sections

function CategoryGrid({ cats }: { cats: Cat[] }) {
  return (
    <section className="bg-[#F5F4F2] py-20 px-5 md:px-14">
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <div className="flex flex-col items-center text-center mb-12">
          <p className="text-[#007791] text-[8px] font-semibold tracking-[0.5em] uppercase mb-4">
            Collections
          </p>
          <h2
            className="text-[#1A1A1A] leading-none"
            style={{ ...serif, fontSize: 'clamp(1.8rem, 4vw, 3.5rem)', fontWeight: 700 }}
          >
            All Categories
          </h2>
          <div className="mt-4 h-px w-16 bg-[#1A1A1A]/15" />
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 md:gap-4">
          {cats.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
            >
              <Link href={`/category/${cat.slug}`} className="group block relative overflow-hidden aspect-[3/4] bg-gray-100">
                <Image
                  src={cat.imageUrl}
                  alt={cat.name}
                  fill
                  sizes="(max-width:640px) 50vw, 25vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4">
                  <p className="text-white text-[9px] tracking-[0.3em] uppercase font-medium opacity-60 mb-1">
                    {cat.count} styles
                  </p>
                  <h3
                    className="text-white leading-none"
                    style={{ ...serif, fontSize: 'clamp(1rem, 2.5vw, 1.5rem)', fontWeight: 600 }}
                  >
                    {cat.name}
                  </h3>
                </div>
                {/* Hover line */}
                <div className="absolute inset-x-0 bottom-0 h-0.5 bg-[#E01F54] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Editorial strip ──────────────────────────────────────────────────────────

function EditorialStrip() {
  const pillars = [
    { icon: '✦', label: 'Swiss Quality', sub: 'Premium materials & craft' },
    { icon: '◈', label: 'Fast Delivery',  sub: '2–4 days across Switzerland' },
    { icon: '◉', label: 'Discreet',       sub: 'Plain packaging, always' },
    { icon: '◇', label: 'Easy Returns',   sub: '30-day return policy' },
  ];
  return (
    <section className="bg-white border-y border-gray-100 py-10 px-5 md:px-14">
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
        {pillars.map((p) => (
          <div key={p.label} className="flex flex-col items-center text-center gap-2">
            <span className="text-[#007791] text-xl mb-1">{p.icon}</span>
            <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[#1A1A1A]">{p.label}</p>
            <p className="text-[10px] text-gray-400 font-light">{p.sub}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const SCROLL_CATS = [0, 1, 2, 3]; // First 4 categories get scroll-expand treatment

export default function HomePage() {
  const prefersReducedMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)');
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  const compact = Boolean(prefersReducedMotion) || isMobile;
  const scrollCats = MOCK_CATEGORIES.filter((_, i) => SCROLL_CATS.includes(i));

  return (
    <div className="bg-[#080808]">
      {/* Hero */}
      <MarifeHero compact={compact} />

      {/* Scroll-expansion sections */}
      {scrollCats.map((cat, i) => (
        <CategorySection
          key={cat.slug}
          cat={cat}
          index={i}
          total={scrollCats.length}
          compact={compact}
        />
      ))}

      {/* White section — editorial pillars */}
      <EditorialStrip />

      {/* Category grid (all categories) */}
      <CategoryGrid cats={MOCK_CATEGORIES} />

      {/* Footer mark */}
      <footer className="bg-[#080808] border-t border-white/[0.05] py-16 flex flex-col items-center gap-4">
        <p
          className="text-white font-black tracking-[0.25em] text-xl"
          style={serif}
        >
          MARIFE
        </p>
        <div className="h-px w-12 bg-white/10" />
        <p className="text-white/15 text-[9px] tracking-[0.45em] uppercase font-light">
          Zürich · Switzerland · 2025
        </p>
      </footer>
    </div>
  );
}
