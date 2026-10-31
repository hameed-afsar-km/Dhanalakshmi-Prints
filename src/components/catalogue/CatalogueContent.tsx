'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ArrowRight, Search, SlidersHorizontal, Sparkles, Tag, X } from 'lucide-react';
import { useStore } from '@/lib/store';
import { formatINR, getProductHref, PRODUCT_CATEGORIES } from '@/lib/catalog';
import ProductCard from '@/components/products/ProductCard';
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

  return (
    <div className="w-full bg-brand-offwhite">
      <section className="relative overflow-hidden px-3 pb-10 pt-6 sm:px-5 sm:pb-14">
        <div className="relative mx-auto max-w-[1600px] overflow-hidden rounded-[1.8rem] bg-brand-primary px-5 py-12 text-white sm:rounded-[2.5rem] sm:px-10 sm:py-16 lg:px-14">
          <div className="pointer-events-none absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.5)_1px,transparent_1px)] [background-size:52px_52px]" />
          <div className="pointer-events-none absolute -right-20 -top-24 h-80 w-80 rounded-full bg-brand-pink/30 blur-[100px]" />
          <div className="pointer-events-none absolute -bottom-24 -left-16 h-80 w-80 rounded-full bg-brand-teal/20 blur-[110px]" />

          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.24em] text-white/55">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-gold" />
                The catalogue / 2026
              </span>
              <h1 className="mt-5 font-display text-[clamp(3rem,8vw,6.4rem)] leading-[0.85] tracking-[-0.045em]">
                Gifts that
                <br />
                <span className="italic text-brand-gold">feel personal.</span>
              </h1>
              <p className="mt-5 max-w-lg text-sm leading-relaxed text-white/60">
                Personalised keychains, photo lamps, desk objects and one-off figurines. Every
                customisable piece opens in a live 3D configurator.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <div className="rounded-2xl border border-white/15 bg-white/5 px-4 py-3">
                <span className="block font-display text-2xl leading-none text-brand-gold">
                  {published.length}
                </span>
                <span className="mt-1 block font-mono text-[7px] uppercase tracking-[0.16em] text-white/45">
                  studio designs
                </span>
              </div>
              <div className="rounded-2xl border border-white/15 bg-white/5 px-4 py-3">
                <span className="block font-display text-2xl leading-none text-brand-gold">2–6</span>
                <span className="mt-1 block font-mono text-[7px] uppercase tracking-[0.16em] text-white/45">
                  days to make
                </span>
              </div>
              <div className="rounded-2xl border border-white/15 bg-white/5 px-4 py-3">
                <span className="block font-display text-2xl leading-none text-brand-gold">100%</span>
                <span className="mt-1 block font-mono text-[7px] uppercase tracking-[0.16em] text-white/45">
                  reviewed by humans
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {showCoverflow && (
        <section className="relative overflow-hidden pb-14">
          <div className="mx-auto max-w-[92rem] px-4 sm:px-6 lg:px-10">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-[clamp(1.8rem,4vw,2.8rem)] leading-none tracking-[-0.03em] text-brand-navy">
                Start with a favourite
              </h2>
              <span className="hidden font-mono text-[8px] uppercase tracking-[0.18em] text-brand-primary/40 sm:block">
                Swipe / drag to explore
              </span>
            </div>
            <div className="mt-6">
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

      <section className="pb-20 sm:pb-24">
        <div className="mx-auto max-w-[92rem] px-4 sm:px-6 lg:px-10">
          <div className="sticky top-[76px] z-30 -mx-2 rounded-2xl border border-brand-primary/10 bg-white/85 p-2.5 shadow-[0_18px_50px_-40px_rgba(28,11,96,0.4)] backdrop-blur-xl sm:top-[86px] sm:p-3">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="no-scrollbar flex items-center gap-1.5 overflow-x-auto">
                {['All', ...PRODUCT_CATEGORIES].map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setSelectedCategory(category)}
                    className={`shrink-0 rounded-full px-3.5 py-2 font-mono text-[8px] uppercase tracking-[0.13em] transition-all ${
                      selectedCategory === category
                        ? 'bg-brand-primary text-white'
                        : 'bg-brand-lavender/60 text-brand-navy/55 hover:bg-brand-lavender hover:text-brand-primary'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <div className="relative flex-1 sm:w-60">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-brand-primary/35" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="Search gifts or tags…"
                    className="w-full rounded-full border border-brand-primary/10 bg-brand-lavender/40 py-2.5 pl-9 pr-8 text-xs text-brand-navy outline-none transition-colors placeholder:text-brand-navy/30 focus:border-brand-primary/30 focus:bg-white"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-brand-navy/35 hover:text-brand-pink"
                      aria-label="Clear search"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
                <div className="relative">
                  <SlidersHorizontal className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-brand-primary/35" />
                  <select
                    value={sortBy}
                    onChange={(event) => setSortBy(event.target.value as SortKey)}
                    className="w-full appearance-none rounded-full border border-brand-primary/10 bg-brand-lavender/40 py-2.5 pl-9 pr-8 font-mono text-[8px] uppercase tracking-[0.1em] text-brand-navy outline-none focus:border-brand-primary/30 focus:bg-white sm:w-auto"
                  >
                    <option value="featured">Featured</option>
                    <option value="price-low">Price · low to high</option>
                    <option value="price-high">Price · high to low</option>
                    <option value="name">Name · A–Z</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between font-mono text-[8px] uppercase tracking-[0.16em] text-brand-primary/40">
            <span>
              {filtered.length} {filtered.length === 1 ? 'piece' : 'pieces'}
              {selectedCategory !== 'All' ? ` / ${selectedCategory}` : ''}
            </span>
            {(selectedCategory !== 'All' || searchQuery) && (
              <button type="button" onClick={reset} className="text-brand-pink hover:text-brand-wine">
                Clear filters
              </button>
            )}
          </div>

          {filtered.length === 0 ? (
            <div className="mt-8 flex flex-col items-center justify-center rounded-[1.8rem] border border-brand-primary/10 bg-white px-6 py-20 text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-lavender text-brand-primary">
                <Tag className="h-6 w-6" />
              </span>
              <h3 className="mt-4 font-display text-3xl leading-none tracking-[-0.02em] text-brand-navy">
                Nothing matches yet.
              </h3>
              <p className="mt-2 max-w-sm text-sm text-brand-navy/50">
                Try a different keyword or clear the filters. The studio can also make something from
                scratch.
              </p>
              <div className="mt-5 flex gap-2">
                <button
                  type="button"
                  onClick={reset}
                  className="rounded-full bg-brand-primary px-4 py-2.5 font-mono text-[9px] uppercase tracking-[0.14em] text-white transition-colors hover:bg-brand-pink"
                >
                  Reset filters
                </button>
                <Link
                  href="/custom-printing"
                  className="rounded-full border border-brand-primary/15 px-4 py-2.5 font-mono text-[9px] uppercase tracking-[0.14em] text-brand-primary transition-colors hover:bg-brand-lavender"
                >
                  Start a custom piece
                </Link>
              </div>
            </div>
          ) : (
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.map((product, index) => (
                <Reveal key={product.id} delay={Math.min(index * 0.04, 0.24)} y={24}>
                  <ProductCard product={product} className="h-full" compact />
                </Reveal>
              ))}
            </div>
          )}

          <div className="mt-14 overflow-hidden rounded-[1.8rem] bg-brand-primary p-6 text-white sm:p-10">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-gold text-brand-navy">
                  <Sparkles className="h-6 w-6" />
                </span>
                <div>
                  <h3 className="font-display text-[clamp(1.8rem,4vw,2.8rem)] leading-[0.95] tracking-[-0.03em]">
                    Not quite your story?
                  </h3>
                  <p className="mt-2 max-w-md text-sm leading-relaxed text-white/60">
                    Send a reference, a name or a file. We will design a one-off piece around it.
                  </p>
                </div>
              </div>
              <Link
                href="/custom-printing"
                className="group inline-flex items-center justify-between gap-3 rounded-full bg-brand-gold px-5 py-3.5 font-mono text-[9px] uppercase tracking-[0.15em] text-brand-navy transition-all hover:-translate-y-0.5 hover:bg-white sm:min-w-[220px]"
              >
                Start a custom piece
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
