'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  ArrowRight,
  Layers,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Tag,
  UploadCloud,
  X,
  Zap,
} from 'lucide-react';
import { useStore } from '@/lib/store';
import { formatINR, getProductHref, PRODUCT_CATEGORIES } from '@/lib/catalog';
import BentoProductCard from '@/components/catalogue/BentoProductCard';
import Skiper49 from '@/components/ui/skiper49';
import Reveal from '@/components/ui/Reveal';

type SortKey = 'featured' | 'price-low' | 'price-high' | 'name';

export default function CatalogueContent() {
  const { products } = useStore();
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category');

  const [selectedCategory, setSelectedCategory] = useState<string>(
    initialCategory && PRODUCT_CATEGORIES.some((category) => category === initialCategory)
      ? initialCategory
      : 'All'
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortKey>('featured');

  const published = useMemo(() => products.filter((product) => product.isPublished), [products]);

  const filtered = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return published
      .filter((product) => {
        if (selectedCategory !== 'All' && product.category !== selectedCategory) return false;
        if (!query) return true;
        return (
          product.name.toLowerCase().includes(query) ||
          product.shortDescription.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query) ||
          product.tags.some((tag) => tag.toLowerCase().includes(query))
        );
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.startingPrice - b.startingPrice;
        if (sortBy === 'price-high') return b.startingPrice - a.startingPrice;
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        return 0;
      });
  }, [published, selectedCategory, searchQuery, sortBy]);

  const featured = useMemo(() => published.slice(0, 7), [published]);
  const showCoverflow = selectedCategory === 'All' && !searchQuery.trim();

  const reset = () => {
    setSelectedCategory('All');
    setSearchQuery('');
    setSortBy('featured');
  };

  // Helper to determine Bento Card Variant dynamically
  const getBentoVariant = (index: number, total: number): 'hero' | 'wide' | 'standard' => {
    // If only 1 or 2 items, make them wide or hero
    if (total <= 2) return index === 0 ? 'hero' : 'wide';

    // Rhythmic Bento pattern:
    // Index 0: Hero 2x2
    // Index 3: Wide 2x1
    // Index 6: Wide 2x1
    // Others: Standard 1x1
    if (index === 0) return 'hero';
    if (index === 3 || index === 6) return 'wide';
    return 'standard';
  };

  return (
    <div className="w-full bg-[#f8f9fc] min-h-screen">
      {/* Editorial Header */}
      <section className="relative overflow-hidden px-3 pb-8 pt-6 sm:px-5 sm:pb-12">
        <div className="relative mx-auto max-w-[1600px] overflow-hidden rounded-[2rem] bg-[#0c0524] px-5 py-12 text-white sm:rounded-[2.5rem] sm:px-10 sm:py-16 lg:px-14 shadow-[0_30px_90px_-30px_rgba(28,11,96,0.6)]">
          <div className="pointer-events-none absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,0.4)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.4)_1px,transparent_1px)] [background-size:48px_48px]" />
          <div className="pointer-events-none absolute -right-20 -top-24 h-96 w-96 rounded-full bg-brand-pink/30 blur-[130px]" />
          <div className="pointer-events-none absolute -bottom-24 -left-16 h-96 w-96 rounded-full bg-brand-teal/25 blur-[130px]" />

          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between z-10">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1 font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-white/90 backdrop-blur-md">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-gold animate-pulse" />
                Dhanalakshmi Studio Catalogue
              </span>
              <h1 className="mt-4 font-heading text-[clamp(2.5rem,6.5vw,5.5rem)] font-extrabold uppercase leading-[0.92] tracking-tight">
                Objects Crafted <br />
                <span className="text-brand-gold">Layer By Layer.</span>
              </h1>
              <p className="mt-4 max-w-lg font-sans text-xs sm:text-sm leading-relaxed text-white/75">
                Explore personalized automotive keychains, sculpted cursive names, glowing photo lamps, and bespoke one-off commissions fabricated in our Tiruchendur studio.
              </p>
            </div>

            <div className="flex flex-wrap gap-2.5 sm:gap-3">
              <div className="rounded-2xl border border-white/15 bg-white/10 p-3 sm:p-4 backdrop-blur-md min-w-[100px]">
                <span className="block font-heading text-2xl sm:text-3xl font-extrabold text-brand-gold leading-none">
                  {published.length}
                </span>
                <span className="mt-1 block font-mono text-[8px] uppercase tracking-wider text-white/60">
                  Studio Designs
                </span>
              </div>
              <div className="rounded-2xl border border-white/15 bg-white/10 p-3 sm:p-4 backdrop-blur-md min-w-[100px]">
                <span className="block font-heading text-2xl sm:text-3xl font-extrabold text-brand-gold leading-none">
                  0.05
                </span>
                <span className="mt-1 block font-mono text-[8px] uppercase tracking-wider text-white/60">
                  mm Layer Res
                </span>
              </div>
              <div className="rounded-2xl border border-white/15 bg-white/10 p-3 sm:p-4 backdrop-blur-md min-w-[100px]">
                <span className="block font-heading text-2xl sm:text-3xl font-extrabold text-brand-gold leading-none">
                  2–4
                </span>
                <span className="mt-1 block font-mono text-[8px] uppercase tracking-wider text-white/60">
                  Days Dispatch
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Coverflow Carousel */}
      {showCoverflow && (
        <section className="relative overflow-hidden pb-10 sm:pb-12">
          <div className="mx-auto max-w-[92rem] px-4 sm:px-6 lg:px-10">
            <div className="flex items-center justify-between mb-2">
              <div>
                <span className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-brand-pink block">
                  Interactive Showcase
                </span>
                <h2 className="font-heading text-[clamp(1.5rem,3.2vw,2.4rem)] font-extrabold uppercase tracking-tight text-slate-900 leading-none mt-1">
                  Studio Highlights
                </h2>
              </div>
              <span className="hidden font-mono text-[9px] uppercase tracking-wider text-slate-400 sm:block">
                Drag to inspect models
              </span>
            </div>
            <div className="mt-2">
              <Skiper49
                items={featured.map((product) => ({
                  id: product.id,
                  title: product.name,
                  subtitle: product.category,
                  image: product.imageUrl,
                  href: getProductHref(product),
                  meta: `from ${formatINR(product.startingPrice)}`,
                }))}
              />
            </div>
          </div>
        </section>
      )}

      {/* Sticky Filter & Search Control Bar */}
      <section className="pb-20 sm:pb-28">
        <div className="mx-auto max-w-[92rem] px-4 sm:px-6 lg:px-10">
          <div className="sticky top-[76px] z-30 -mx-2 rounded-2xl border border-black/10 bg-white/90 p-2.5 sm:p-3 shadow-[0_15px_40px_-20px_rgba(28,11,96,0.15)] backdrop-blur-xl sm:top-[86px]">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              {/* Category Pills */}
              <div className="no-scrollbar flex items-center gap-1.5 overflow-x-auto">
                {['All', ...PRODUCT_CATEGORIES].map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setSelectedCategory(category)}
                    className={`shrink-0 rounded-full px-3.5 py-1.5 font-sans text-[11px] font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                      selectedCategory === category
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'bg-black/5 text-slate-600 hover:bg-black/10 hover:text-black'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              {/* Search & Sort Controls */}
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <div className="relative flex-1 sm:w-64">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="Search designs or materials…"
                    className="w-full rounded-full border border-black/10 bg-black/[0.03] py-2 pl-9 pr-8 font-sans text-xs text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-black/30 focus:bg-white"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-black"
                      aria-label="Clear search"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>

                <div className="relative">
                  <SlidersHorizontal className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                  <select
                    value={sortBy}
                    onChange={(event) => setSortBy(event.target.value as SortKey)}
                    className="w-full appearance-none rounded-full border border-black/10 bg-black/[0.03] py-2 pl-9 pr-8 font-mono text-[9px] uppercase tracking-wider text-slate-800 outline-none focus:border-black/30 focus:bg-white sm:w-auto"
                  >
                    <option value="featured">Featured First</option>
                    <option value="price-low">Price · Low to High</option>
                    <option value="price-high">Price · High to Low</option>
                    <option value="name">Name · A–Z</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Result Count and Clear Filters */}
          <div className="mt-4 flex items-center justify-between font-mono text-[9px] uppercase tracking-wider text-slate-500">
            <span>
              Showing {filtered.length} {filtered.length === 1 ? 'Design' : 'Designs'}
              {selectedCategory !== 'All' ? ` in ${selectedCategory}` : ''}
            </span>
            {(selectedCategory !== 'All' || searchQuery) && (
              <button
                type="button"
                onClick={reset}
                className="font-bold text-brand-pink hover:text-slate-900 transition-colors"
              >
                Clear all filters
              </button>
            )}
          </div>

          {/* Empty State */}
          {filtered.length === 0 ? (
            <div className="mt-8 flex flex-col items-center justify-center rounded-[2rem] border border-black/10 bg-white px-6 py-20 text-center shadow-xs">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-pink/10 text-brand-pink">
                <Tag className="h-6 w-6" />
              </span>
              <h3 className="mt-4 font-heading text-2xl font-extrabold uppercase tracking-tight text-slate-900">
                No Designs Match Your Search.
              </h3>
              <p className="mt-2 max-w-sm font-sans text-xs text-slate-600">
                Try a different keyword or browse all categories. Our studio can also model and print any custom concept from scratch.
              </p>
              <div className="mt-5 flex gap-2">
                <button
                  type="button"
                  onClick={reset}
                  className="rounded-full bg-slate-900 px-5 py-2 font-heading text-[10.5px] font-bold uppercase tracking-wider text-white hover:bg-brand-pink transition-colors"
                >
                  Reset filters
                </button>
                <Link
                  href="/custom-printing"
                  className="rounded-full border border-black/20 px-5 py-2 font-heading text-[10.5px] font-bold uppercase tracking-wider text-slate-800 hover:bg-black/5 transition-colors"
                >
                  Upload 3D CAD File
                </Link>
              </div>
            </div>
          ) : (
            /* Bento Grid of Products with Editorial Studio Tiles */
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 [grid-auto-flow:dense]">
              {filtered.map((product, index) => {
                const variant = getBentoVariant(index, filtered.length);

                return (
                  <Reveal
                    key={product.id}
                    delay={Math.min(index * 0.03, 0.2)}
                    className={
                      variant === 'hero'
                        ? 'col-span-1 md:col-span-2 lg:col-span-2 md:row-span-2'
                        : variant === 'wide'
                        ? 'col-span-1 md:col-span-2'
                        : 'col-span-1'
                    }
                  >
                    <BentoProductCard product={product} variant={variant} className="h-full" />
                  </Reveal>
                );
              })}

              {/* Editorial Bento Tile 1: Custom CAD Upload Card */}
              <Reveal
                delay={0.12}
                className="col-span-1 md:col-span-2 rounded-[2rem] border border-white/20 bg-gradient-to-br from-[#1c0b60] via-[#2a0e8c] to-[#0d0426] p-6 sm:p-7 text-white shadow-[0_25px_60px_-20px_rgba(28,11,96,0.4)] flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-white backdrop-blur-md">
                      <UploadCloud className="h-3 w-3 text-brand-gold" />
                      Engineering Service
                    </span>
                    <span className="font-mono text-[9px] uppercase tracking-wider text-white/50">
                      .STL / .OBJ / .3MF
                    </span>
                  </div>

                  <h3 className="mt-3 font-heading text-xl sm:text-2xl font-extrabold uppercase leading-tight tracking-tight text-white">
                    Have A 3D Model? <span className="text-brand-gold">We Will Print It.</span>
                  </h3>
                  <p className="mt-2 text-xs sm:text-[13px] text-white/75 leading-relaxed font-sans max-w-lg">
                    Upload your CAD or polygon mesh file up to 50 MB. Our engineers analyze wall thickness, optimize orientation, and provide instant fabrication quotes.
                  </p>
                </div>

                <div className="mt-6 flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-white/15">
                  <div className="flex items-center gap-3 text-[11px] text-white/80 font-sans">
                    <span className="flex items-center gap-1">
                      <Zap className="h-3 w-3 text-brand-gold" /> Same-day slicing
                    </span>
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="h-3 w-3 text-brand-teal" /> Tolerance tested
                    </span>
                  </div>

                  <Link
                    href="/custom-printing"
                    className="group inline-flex items-center gap-2 rounded-full bg-brand-gold px-4 py-2 font-heading text-[10.5px] font-extrabold uppercase tracking-wider text-brand-navy shadow-md hover:bg-white transition-all"
                  >
                    <span>Upload CAD File</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </Reveal>

              {/* Editorial Bento Tile 2: Tiruchendur Studio Guarantee */}
              <Reveal
                delay={0.15}
                className="col-span-1 md:col-span-2 rounded-[2rem] border border-black/10 bg-white p-6 sm:p-7 text-slate-900 shadow-[0_20px_50px_-25px_rgba(28,11,96,0.1)] flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-black/5 px-3 py-1 font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-slate-700">
                      <Layers className="h-3 w-3 text-brand-pink" />
                      Studio Craftsmanship
                    </span>
                    <span className="font-mono text-[9px] uppercase tracking-wider text-slate-400">
                      Tiruchendur, TN
                    </span>
                  </div>

                  <h3 className="mt-3 font-heading text-xl sm:text-2xl font-extrabold uppercase leading-tight tracking-tight text-slate-900">
                    Industrial Filaments & <span className="text-brand-pink">Precision Finish.</span>
                  </h3>
                  <p className="mt-2 text-xs sm:text-[13px] text-slate-600 leading-relaxed font-sans max-w-lg">
                    Every piece is crafted in high-impact Tough PLA, liquid-sheen Silk PLA, or engineering PETG. Hand-inspected, deburred, and packed in tamper-proof bubble mailers.
                  </p>
                </div>

                <div className="mt-6 flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="rounded-md bg-slate-100 px-2 py-0.5 font-mono text-[9px] font-bold text-slate-700">
                      Tough PLA
                    </span>
                    <span className="rounded-md bg-slate-100 px-2 py-0.5 font-mono text-[9px] font-bold text-slate-700">
                      Silk Co-Extrusion
                    </span>
                    <span className="rounded-md bg-slate-100 px-2 py-0.5 font-mono text-[9px] font-bold text-slate-700">
                      SLA Resin
                    </span>
                  </div>

                  <Link
                    href="/#customize"
                    className="inline-flex items-center gap-1.5 rounded-full bg-slate-900 hover:bg-brand-pink text-white px-4 py-2 font-heading text-[10.5px] font-bold uppercase tracking-wider transition-colors shadow-xs"
                  >
                    <Sparkles className="h-3 w-3" />
                    <span>Try 3D Studio</span>
                  </Link>
                </div>
              </Reveal>
            </div>
          )}

          {/* Bottom Custom Commission CTA Banner */}
          <div className="mt-14 overflow-hidden rounded-[2rem] bg-[#0c0524] p-6 text-white sm:p-10 shadow-[0_30px_70px_-25px_rgba(28,11,96,0.5)]">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-gold text-brand-navy shadow-md">
                  <Sparkles className="h-6 w-6" />
                </span>
                <div>
                  <h3 className="font-heading text-[clamp(1.6rem,3.4vw,2.5rem)] font-extrabold uppercase leading-[1.0] tracking-tight text-white">
                    Need Something Entirely Bespoke?
                  </h3>
                  <p className="mt-2 max-w-md font-sans text-xs sm:text-sm leading-relaxed text-white/70">
                    Send a sketch, a corporate logo, or a reference image. Our studio will model and produce a one-off piece for you.
                  </p>
                </div>
              </div>
              <Link
                href="/custom-printing"
                className="group inline-flex items-center justify-between gap-3 rounded-full bg-brand-gold px-6 py-3.5 font-heading text-[11px] font-extrabold uppercase tracking-wider text-brand-navy transition-all hover:bg-white sm:min-w-[220px] shadow-md"
              >
                <span>Start Custom Commission</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
