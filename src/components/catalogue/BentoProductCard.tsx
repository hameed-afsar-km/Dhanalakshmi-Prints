'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, Box, Layers, Sparkles, Star } from 'lucide-react';
import type { Product } from '@/types';
import { formatINR, getCustomizeHref, getProductHref } from '@/lib/catalog';
import { cn } from '@/lib/utils';

interface BentoProductCardProps {
  product: Product;
  variant?: 'hero' | 'wide' | 'standard';
  className?: string;
}

export default function BentoProductCard({
  product,
  variant = 'standard',
  className,
}: BentoProductCardProps) {
  const href = getProductHref(product);
  const customizeHref = getCustomizeHref(product);

  // Variant 1: Hero Large Feature Bento Card (2 cols x 2 rows on large screens)
  if (variant === 'hero') {
    return (
      <article
        className={cn(
          'group relative flex flex-col justify-between overflow-hidden rounded-[2rem] border border-brand-primary/15 bg-[#0e0728] text-white shadow-[0_30px_70px_-25px_rgba(28,11,96,0.35)] transition-all duration-500 hover:border-brand-pink/50 hover:shadow-[0_40px_90px_-25px_rgba(255,0,122,0.3)] col-span-1 md:col-span-2 lg:col-span-2 md:row-span-2 min-h-[480px] lg:min-h-[560px]',
          className
        )}
      >
        {/* Full Card Background Image with Smooth Scale */}
        <Link href={href} className="absolute inset-0 block overflow-hidden">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            priority
          />
          {/* Multi-stage Luxury Gradient Overlay for Razor-Sharp Text Contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#09041a] via-[#09041a]/60 to-transparent opacity-90 transition-opacity duration-300 group-hover:opacity-85" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#09041a]/80 via-transparent to-transparent" />
        </Link>

        {/* Top Badges & Meta */}
        <div className="relative z-10 flex items-start justify-between p-5 sm:p-7">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-white/30 bg-black/40 px-3 py-1 font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-white backdrop-blur-md">
              {product.category}
            </span>
            {product.badge && (
              <span className="rounded-full bg-brand-gold px-3 py-1 font-mono text-[9px] font-extrabold uppercase tracking-[0.16em] text-brand-navy shadow-md">
                {product.badge}
              </span>
            )}
            <span className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-white/10 px-2.5 py-1 font-mono text-[9px] text-white backdrop-blur-md">
              <Star className="h-3 w-3 fill-brand-gold text-brand-gold" />
              <span>{product.rating ?? 4.9}</span>
            </span>
          </div>

          <Link
            href={href}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-white/20 text-white backdrop-blur-md transition-all duration-300 group-hover:scale-110 group-hover:bg-brand-pink group-hover:border-brand-pink"
            aria-label="View product"
          >
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Bottom Content Area */}
        <div className="relative z-10 p-5 sm:p-7">
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-1.5 font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-brand-gold">
              <Box className="h-3 w-3" />
              Flagship Studio Piece
            </span>
            <Link href={href} className="group/title block mt-1">
              <h3 className="font-heading text-[clamp(1.5rem,3vw,2.3rem)] font-extrabold uppercase leading-[1.05] tracking-tight text-white transition-colors group-hover/title:text-brand-gold">
                {product.name}
              </h3>
            </Link>
            <p className="mt-2 line-clamp-2 text-xs sm:text-sm text-white/80 leading-relaxed font-sans">
              {product.shortDescription}
            </p>

            {/* Tags / Material Highlights */}
            {product.tags && product.tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {product.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="rounded-md border border-white/15 bg-white/10 px-2 py-0.5 font-sans text-[10px] text-white/70"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-white/15">
            <div>
              <span className="block font-mono text-[9px] uppercase tracking-wider text-white/50">
                Starting from
              </span>
              <span className="font-heading text-xl sm:text-2xl font-extrabold text-white">
                {formatINR(product.startingPrice)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href={href}
                className="rounded-full border border-white/20 bg-white/10 px-4 py-2 font-heading text-[11px] font-bold uppercase tracking-wider text-white backdrop-blur-md hover:bg-white/20 transition-colors"
              >
                Details
              </Link>
              {product.customizable && (
                <Link
                  href={customizeHref}
                  className="inline-flex items-center gap-1.5 rounded-full bg-brand-gold px-4 py-2 font-heading text-[11px] font-extrabold uppercase tracking-wider text-brand-navy shadow-md hover:bg-white transition-all"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  Customize 3D
                </Link>
              )}
            </div>
          </div>
        </div>
      </article>
    );
  }

  // Variant 2: Wide Bento Card (2 cols wide, 1 row on medium+ screens)
  if (variant === 'wide') {
    return (
      <article
        className={cn(
          'group relative flex flex-col sm:flex-row overflow-hidden rounded-[1.8rem] border border-brand-primary/10 bg-white shadow-[0_20px_50px_-30px_rgba(28,11,96,0.25)] transition-all duration-400 hover:-translate-y-1 hover:border-brand-primary/25 hover:shadow-[0_28px_60px_-30px_rgba(28,11,96,0.35)] col-span-1 md:col-span-2',
          className
        )}
      >
        {/* Left Side: Product Image */}
        <Link
          href={href}
          className="relative block w-full sm:w-1/2 aspect-[4/3] sm:aspect-auto overflow-hidden bg-brand-lavender shrink-0"
        >
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, 30vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-106"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent sm:hidden" />
          
          <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
            <span className="rounded-full border border-white/40 bg-white/85 px-2.5 py-0.5 font-mono text-[8px] uppercase tracking-wider text-brand-primary backdrop-blur-md font-bold">
              {product.category}
            </span>
          </div>

          <span className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full border border-white/40 bg-white/30 text-brand-navy backdrop-blur-md transition-transform duration-300 group-hover:rotate-45">
            <ArrowUpRight className="h-3.5 w-3.5" />
          </span>
        </Link>

        {/* Right Side: Details & Actions */}
        <div className="flex flex-1 flex-col justify-between p-5 sm:p-6 bg-white">
          <div>
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-[9px] uppercase tracking-wider text-brand-primary/60 font-bold">
                {product.modelType ?? '3D Printed'}
              </span>
              <span className="rounded-full bg-brand-lavender px-2 py-0.5 font-mono text-[9px] font-bold text-brand-primary">
                ★ {product.rating ?? 4.8}
              </span>
            </div>

            <Link href={href} className="group/title block mt-1.5">
              <h3 className="font-heading text-lg sm:text-xl font-extrabold uppercase leading-snug tracking-tight text-slate-900 transition-colors group-hover/title:text-brand-pink">
                {product.name}
              </h3>
            </Link>

            <p className="mt-1.5 line-clamp-2 text-xs text-slate-600 leading-relaxed font-sans">
              {product.shortDescription}
            </p>
          </div>

          <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between gap-3">
            <div>
              <span className="block font-mono text-[8.5px] uppercase tracking-wider text-slate-400">
                Starting at
              </span>
              <span className="font-heading text-lg font-extrabold text-slate-900">
                {formatINR(product.startingPrice)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href={href}
                className="font-heading text-[10px] font-bold uppercase tracking-wider text-slate-500 hover:text-slate-900 transition-colors px-2.5 py-1.5"
              >
                Details
              </Link>
              {product.customizable ? (
                <Link
                  href={customizeHref}
                  className="inline-flex items-center gap-1.5 rounded-full bg-slate-900 hover:bg-brand-pink text-white px-3.5 py-2 font-heading text-[10px] font-bold uppercase tracking-wider shadow-xs transition-colors"
                >
                  <Sparkles className="h-3 w-3" />
                  Customize
                </Link>
              ) : (
                <Link
                  href={href}
                  className="inline-flex items-center gap-1.5 rounded-full bg-slate-900 hover:bg-brand-pink text-white px-3.5 py-2 font-heading text-[10px] font-bold uppercase tracking-wider shadow-xs transition-colors"
                >
                  View Piece
                </Link>
              )}
            </div>
          </div>
        </div>
      </article>
    );
  }

  // Variant 3: Standard Bento Card (1 col)
  return (
    <article
      className={cn(
        'group relative flex flex-col justify-between overflow-hidden rounded-[1.8rem] border border-brand-primary/10 bg-white shadow-[0_20px_50px_-30px_rgba(28,11,96,0.2)] transition-all duration-400 hover:-translate-y-1 hover:border-brand-primary/25 hover:shadow-[0_28px_60px_-30px_rgba(28,11,96,0.3)] col-span-1',
        className
      )}
    >
      <Link href={href} className="relative block aspect-[4/3] overflow-hidden bg-brand-lavender">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-108"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          <span className="rounded-full border border-white/40 bg-white/85 px-2.5 py-0.5 font-mono text-[8px] uppercase tracking-wider text-brand-primary backdrop-blur-md font-bold">
            {product.category}
          </span>
          {product.badge && (
            <span className="rounded-full bg-brand-gold px-2 py-0.5 font-mono text-[8px] font-bold uppercase tracking-wider text-brand-navy shadow-xs">
              {product.badge}
            </span>
          )}
        </div>

        <span className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full border border-white/40 bg-white/30 text-white backdrop-blur-md transition-transform duration-300 group-hover:rotate-45">
          <ArrowUpRight className="h-3.5 w-3.5" />
        </span>

        <div className="absolute inset-x-3 bottom-2.5 flex items-center justify-between">
          <span className="rounded-full bg-slate-900/90 px-2.5 py-0.5 font-mono text-[8.5px] uppercase tracking-wider text-white backdrop-blur-md">
            from {formatINR(product.startingPrice)}
          </span>
          {product.rating && (
            <span className="rounded-full bg-white/30 border border-white/30 px-2 py-0.5 font-mono text-[8px] text-white backdrop-blur-md">
              ★ {product.rating}
            </span>
          )}
        </div>
      </Link>

      <div className="flex flex-1 flex-col justify-between p-4 sm:p-5">
        <div>
          <Link href={href} className="group/title block">
            <h3 className="font-heading text-base font-extrabold uppercase leading-tight tracking-tight text-slate-900 transition-colors group-hover/title:text-brand-pink line-clamp-1">
              {product.name}
            </h3>
          </Link>
          <p className="mt-1 line-clamp-2 text-xs text-slate-500 leading-relaxed font-sans">
            {product.shortDescription}
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <Link
            href={href}
            className="font-mono text-[9px] uppercase tracking-wider text-slate-400 hover:text-slate-900 transition-colors"
          >
            Details
          </Link>
          {product.customizable ? (
            <Link
              href={customizeHref}
              className="inline-flex items-center gap-1.5 rounded-full border border-brand-primary/20 bg-brand-lavender px-3 py-1.5 font-heading text-[9.5px] font-bold uppercase tracking-wider text-brand-primary hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all"
            >
              <Sparkles className="h-2.5 w-2.5" />
              Customize
            </Link>
          ) : (
            <Link
              href={href}
              className="inline-flex items-center gap-1 rounded-full border border-slate-200 px-3 py-1.5 font-heading text-[9.5px] font-bold uppercase tracking-wider text-slate-700 hover:bg-slate-900 hover:text-white transition-all"
            >
              View
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}

