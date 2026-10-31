'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Pause } from 'lucide-react';
import { useStore } from '@/lib/store';
import { BRAND } from '@/lib/constants';
import { getCustomizeHref } from '@/lib/catalog';
import Reveal from '@/components/ui/Reveal';

export default function FeaturedCarousel() {
  const { products } = useStore();
  const [activeCategory, setActiveCategory] = useState('All');

  const published = useMemo(() => products.filter((product) => product.isPublished), [products]);
  const categories = useMemo(
    () => ['All', ...Array.from(new Set(published.map((product) => product.category)))],
    [published],
  );

  const filtered = useMemo(
    () =>
      activeCategory === 'All'
        ? published
        : published.filter((product) => product.category === activeCategory),
    [activeCategory, published],
  );

  return (
    <section className="relative overflow-hidden border-b border-ink/15 bg-paper-2 py-20 sm:py-28">
      <div className="pointer-events-none absolute inset-0 paper-grid opacity-45" />
      <div className="pointer-events-none absolute -left-24 top-20 h-72 w-72 rounded-full bg-lime/60 blur-[100px]" />
      <div className="pointer-events-none absolute -right-20 bottom-10 h-80 w-80 rounded-full bg-vermilion/10 blur-[110px]" />

      <div className="relative mx-auto max-w-[92rem] px-4 sm:px-6 lg:px-10">
        <Reveal y={38} amount={0.2}>
          <div className="flex flex-col gap-8 border-b border-ink/20 pb-8 md:flex-row md:items-end md:justify-between">
            <div className="max-w-3xl">
              <span className="font-mono text-[9px] uppercase tracking-[0.24em] text-vermilion">
                (03) / Selected objects
              </span>
              <h2 className="mt-4 font-display text-[clamp(2.8rem,6vw,5.6rem)] leading-[0.85] tracking-[-0.045em] text-ink">
                Objects,
                <br />
                <span className="italic text-ink/45">worth keeping.</span>
              </h2>
            </div>
            <div className="max-w-sm">
              <p className="text-sm leading-relaxed text-ink/55">
                Personalised, printed-to-order pieces in premium polymers. Pick a design, make it
                yours, and we will build it layer by layer.
              </p>
              <Link
                href="/catalogue"
                className="group mt-5 inline-flex items-center gap-2 border border-ink/25 bg-paper px-4 py-2.5 font-mono text-[9px] uppercase tracking-[0.16em] text-ink transition-colors hover:border-ink hover:bg-lime"
              >
                View all pieces
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </div>
        </Reveal>

        <Reveal y={24} delay={0.08} amount={0.3}>
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
            <div className="no-scrollbar flex max-w-full gap-2 overflow-x-auto pb-1">
              {categories.map((category, index) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  className={`shrink-0 rounded-full border px-3.5 py-2 font-mono text-[9px] uppercase tracking-[0.15em] transition-all ${
                    activeCategory === category
                      ? 'border-brand-primary bg-brand-primary text-white'
                      : 'border-line bg-paper text-ink/55 hover:border-brand-primary hover:bg-brand-gold/15 hover:text-ink'
                  }`}
                >
                  <span className="mr-1.5 text-[8px] text-vermilion">{String(index + 1).padStart(2, '0')}</span>
                  {category}
                </button>
              ))}
            </div>
            <span className="hidden items-center gap-2 font-mono text-[9px] uppercase tracking-[0.16em] text-ink/35 sm:flex">
              <Pause className="h-3 w-3" />
              Auto-loop / hover to pause
            </span>
          </div>
        </Reveal>
      </div>

      <Reveal y={30} delay={0.1} amount={0.05} className="mt-9">
        <div className="marquee-mask group relative overflow-hidden">
          <div className="flex w-max [animation:marquee_46s_linear_infinite] group-hover:[animation-play-state:paused]">
            {[0, 1].map((copy) => (
              <div key={copy} className="flex shrink-0 gap-4 pr-4" aria-hidden={copy === 1}>
                {filtered.map((product, index) => (
                  <Link
                    key={`${copy}-${product.id}`}
                    href={getCustomizeHref(product)}
                    className="group/card relative flex w-[272px] shrink-0 flex-col rounded-[1.7rem] border border-line bg-paper p-2.5 shadow-[0_18px_50px_-40px_rgba(13,30,62,0.35)] transition-all duration-500 hover:-translate-y-1.5 hover:border-brand-pink/40 hover:shadow-[0_30px_70px_-38px_rgba(231,30,100,0.35)] sm:w-[330px] lg:w-[370px]"
                  >
                    <div className="relative aspect-square overflow-hidden rounded-[1.15rem] border border-line bg-[#f3f0fb]">
                      <Image
                        src={product.imageUrl}
                        alt={product.name}
                        fill
                        sizes="(max-width: 640px) 272px, (max-width: 1024px) 330px, 370px"
                        className="object-cover grayscale-[15%] transition-all duration-700 group-hover/card:scale-105 group-hover/card:grayscale-0"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-ink/20 via-transparent to-transparent" />
                      <span className="absolute left-2.5 top-2.5 rounded-full border border-line bg-white/90 px-2.5 py-1 font-mono text-[8px] uppercase tracking-[0.16em] text-ink backdrop-blur">
                        No. {String(index + 1).padStart(2, '0')}
                      </span>
                      <span className="absolute right-2.5 top-2.5 flex h-8 w-8 items-center justify-center rounded-full border border-line bg-white/90 text-ink backdrop-blur transition-colors group-hover/card:border-brand-primary group-hover/card:bg-brand-primary group-hover/card:text-white">
                        <ArrowRight className="h-3.5 w-3.5 -rotate-45 transition-transform group-hover/card:rotate-0" />
                      </span>
                    </div>

                    <div className="flex flex-1 flex-col px-2 pb-1 pt-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <span className="font-mono text-[8px] uppercase tracking-[0.18em] text-vermilion">
                            {product.category}
                          </span>
                          <h3 className="mt-1.5 font-display text-[26px] leading-[0.95] tracking-[-0.025em] text-ink">
                            {product.name}
                          </h3>
                        </div>
                      </div>
                      <p className="mt-2.5 line-clamp-2 text-[11px] leading-relaxed text-ink/50">
                        {product.shortDescription}
                      </p>

                      <div className="mt-5 flex items-end justify-between border-t border-ink/15 pt-3">
                        <div>
                          <span className="block font-mono text-[8px] uppercase tracking-[0.16em] text-ink/40">
                            From
                          </span>
                          <span className="font-display text-[24px] leading-none tracking-[-0.02em] text-ink">
                            {BRAND.currency}
                            {product.startingPrice}
                          </span>
                        </div>
                        <div className="flex -space-x-1.5 pb-0.5">
                          {(product.customizationSchema?.supportedColors ?? []).slice(0, 4).map((color) => (
                            <span
                              key={color.id}
                              className="h-4 w-4 rounded-full border-2 border-paper"
                              style={{ backgroundColor: color.hex }}
                              title={color.name}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
