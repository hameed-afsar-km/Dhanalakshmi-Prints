'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useStore } from '@/lib/store';
import { formatINR, getProductHref, PRODUCT_CATEGORIES } from '@/lib/catalog';
import SectionHeading from '@/components/ui/SectionHeading';
import Skiper49 from '@/components/ui/skiper49';
import Reveal from '@/components/ui/Reveal';

export default function CatalogueSection() {
  const { products } = useStore();
  const published = products.filter((product) => product.isPublished);

  const slides = published.map((product) => ({
    id: product.id,
    title: product.name,
    subtitle: product.category,
    image: product.imageUrl,
    href: getProductHref(product),
    meta: `from ${formatINR(product.startingPrice)} · ${product.customizable ? 'customisable' : 'ready to ship'}`,
  }));

  return (
    <section id="catalogue" className="relative overflow-hidden py-18 sm:py-22 lg:py-26">
      <div className="pointer-events-none absolute inset-0 brand-gradient-soft opacity-60" />
      <div className="pointer-events-none absolute -left-32 top-24 h-72 w-72 rounded-full bg-brand-pink/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-10 h-80 w-80 rounded-full bg-brand-teal/10 blur-3xl" />

      <div className="relative mx-auto max-w-[92rem] px-4 sm:px-6 lg:px-10">
        <Reveal>
          <SectionHeading
            eyebrow="The Collection"
            title={
              <>
                Objects With A Story
                <br />
                <span className="text-brand-pink">Built In.</span>
              </>
            }
            description="A curated showcase of precision 3D-printed gifts, bespoke keepsakes, and sculptural pieces. Every single design can be personalized with custom names, polymers, and color palettes."
            action={
              <Link
                href="/catalogue"
                className="group inline-flex items-center gap-3 rounded-full border border-brand-primary/15 bg-white/80 px-6 py-3.5 font-sans text-[11px] font-bold uppercase tracking-[0.16em] text-brand-primary backdrop-blur transition-all hover:-translate-y-0.5 hover:border-brand-primary hover:bg-brand-primary hover:text-white"
              >
                Full Catalogue
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            }
          />
        </Reveal>

        <Reveal delay={0.1} className="mt-10 sm:mt-12">
          <Skiper49 items={slides} />
        </Reveal>

        <Reveal delay={0.15} className="mt-8">
          <div className="flex flex-wrap items-center gap-2 border-t border-brand-primary/10 pt-6">
            <span className="mr-2 font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-primary/50">
              Browse By Category:
            </span>
            {PRODUCT_CATEGORIES.map((category) => (
              <Link
                key={category}
                href={`/catalogue?category=${encodeURIComponent(category)}`}
                className="rounded-full border border-brand-primary/10 bg-white/70 px-3.5 py-1.5 font-sans text-[11px] font-medium text-brand-navy/70 transition-colors hover:border-brand-primary/30 hover:bg-white hover:text-brand-primary"
              >
                {category}
              </Link>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
