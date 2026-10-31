import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, Sparkles } from 'lucide-react';
import type { Product } from '@/types';
import { formatINR, getCustomizeHref, getProductHref } from '@/lib/catalog';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  className?: string;
  compact?: boolean;
}

export default function ProductCard({ product, className, compact = false }: ProductCardProps) {
  return (
    <article
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-[1.5rem] border border-brand-primary/10 bg-white shadow-[0_24px_60px_-46px_rgba(28,11,96,0.4)] transition-all duration-500 hover:-translate-y-1 hover:border-brand-primary/20 hover:shadow-[0_34px_80px_-46px_rgba(28,11,96,0.5)]',
        className
      )}
    >
      <Link href={getProductHref(product)} className="relative block aspect-[4/3] overflow-hidden bg-brand-lavender">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          sizes={compact ? '(max-width: 768px) 100vw, 33vw' : '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'}
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_55%,rgba(13,7,43,0.42)_100%)]" />
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          <span className="rounded-full border border-white/50 bg-white/80 px-2.5 py-1 font-mono text-[8px] uppercase tracking-[0.16em] text-brand-primary backdrop-blur-md">
            {product.category}
          </span>
          {product.badge && (
            <span className="rounded-full bg-brand-gold px-2.5 py-1 font-mono text-[8px] uppercase tracking-[0.16em] text-brand-navy">
              {product.badge}
            </span>
          )}
        </div>
        <span className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full border border-white/40 bg-white/20 text-white backdrop-blur-md transition-transform duration-300 group-hover:rotate-45">
          <ArrowUpRight className="h-3.5 w-3.5" />
        </span>
        <div className="absolute inset-x-3 bottom-3 flex items-center justify-between">
          <span className="rounded-full bg-brand-primary px-2.5 py-1 font-mono text-[8px] uppercase tracking-[0.14em] text-white">
            from {formatINR(product.startingPrice)}
          </span>
          {product.rating && (
            <span className="rounded-full border border-white/40 bg-white/20 px-2 py-1 font-mono text-[8px] tracking-[0.1em] text-white backdrop-blur-md">
              ★ {product.rating}
            </span>
          )}
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <Link href={getProductHref(product)} className="group/title">
          <h3 className="font-display text-[1.35rem] leading-[1.05] tracking-[-0.02em] text-brand-navy transition-colors group-hover/title:text-brand-primary">
            {product.name}
          </h3>
        </Link>
        <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-brand-navy/55">
          {product.shortDescription}
        </p>
        <div className="mt-auto flex items-center justify-between gap-3 pt-5">
          <Link
            href={getProductHref(product)}
            className="font-mono text-[9px] uppercase tracking-[0.16em] text-brand-primary/50 transition-colors hover:text-brand-primary"
          >
            View details
          </Link>
          {product.customizable && (
            <Link
              href={getCustomizeHref(product)}
              className="inline-flex items-center gap-1.5 rounded-full border border-brand-primary/15 bg-brand-lavender px-3 py-2 font-mono text-[8px] uppercase tracking-[0.14em] text-brand-primary transition-colors hover:border-brand-primary hover:bg-brand-primary hover:text-white"
            >
              <Sparkles className="h-3 w-3" />
              Customize
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
