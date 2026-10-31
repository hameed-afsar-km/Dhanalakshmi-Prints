'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronRight,
  Clock,
  Heart,
  Package,
  RotateCcw,
  Ruler,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
} from 'lucide-react';
import { useStore } from '@/lib/store';
import {
  formatINR,
  getCustomizeHref,
  getDefaultCustomization,
  getProductBySlugOrId,
  getProductHighlights,
  getProductSpecifications,
  getRelatedProducts,
} from '@/lib/catalog';
import { calculateCustomizedPrice } from '@/lib/pricing';
import type { CartItem } from '@/types';
import ProductViewer3D from '@/components/3d/ProductViewer3D';
import ProductCard from '@/components/products/ProductCard';
import Reveal from '@/components/ui/Reveal';

type TabKey = 'details' | 'specs' | 'delivery';

const tabs: Array<{ id: TabKey; label: string }> = [
  { id: 'details', label: 'The piece' },
  { id: 'specs', label: 'Specifications' },
  { id: 'delivery', label: 'Delivery & care' },
];

let cartIdSequence = 0;

function createCartId(productId: string) {
  cartIdSequence += 1;
  return `cart-${productId}-${cartIdSequence}`;
}

export default function ProductDetailContent({ slug }: { slug: string }) {
  const { products, addToCart } = useStore();
  const product = getProductBySlugOrId(products, slug);

  const [activeImage, setActiveImage] = useState(0);
  const [show3D, setShow3D] = useState(false);
  const [tab, setTab] = useState<TabKey>('details');
  const [added, setAdded] = useState(false);

  const gallery = useMemo(() => {
    if (!product) return [];
    return [product.imageUrl, ...(product.gallery ?? [])].filter(
      (image, index, array) => array.indexOf(image) === index
    );
  }, [product]);

  if (!product) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-lavender text-brand-primary">
          <Package className="h-6 w-6" />
        </span>
        <h1 className="mt-5 font-display text-4xl leading-none tracking-[-0.03em] text-brand-navy">
          Piece not found.
        </h1>
        <p className="mt-3 max-w-sm text-sm text-brand-navy/50">
          The design may have moved. Browse the catalogue to find something similar.
        </p>
        <Link
          href="/catalogue"
          className="mt-6 rounded-full bg-brand-primary px-5 py-3 font-mono text-[9px] uppercase tracking-[0.14em] text-white transition-colors hover:bg-brand-pink"
        >
          Back to catalogue
        </Link>
      </div>
    );
  }

  const highlights = getProductHighlights(product);
  const specs = getProductSpecifications(product);
  const related = getRelatedProducts(products, product, 3);
  const defaultCustomization = getDefaultCustomization(product);
  const defaultPrice = calculateCustomizedPrice(product, defaultCustomization).unitTotal;
  const rating = product.rating ?? 4.9;
  const reviews = product.reviewCount ?? 84;

  const handleAddToCart = () => {
    const price = calculateCustomizedPrice(product, defaultCustomization, 1);
    const item: CartItem = {
      id: createCartId(product.id),
      productId: product.id,
      productName: product.name,
      modelType: product.modelType,
      imageUrl: product.imageUrl,
      unitPrice: price.unitTotal,
      quantity: 1,
      customization: defaultCustomization,
      calculatedPriceBreakdown: {
        basePrice: price.basePrice,
        personalizationFee: price.personalizationFee,
        materialSurcharge: price.materialSurcharge,
        sizeSurcharge: price.sizeSurcharge,
        accessoriesFee: price.accessoriesFee,
        unitTotal: price.unitTotal,
      },
    };
    addToCart(item);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 2600);
  };

  return (
    <div className="w-full bg-brand-offwhite">
      <div className="mx-auto max-w-[92rem] px-4 pb-16 pt-6 sm:px-6 sm:pt-8 lg:px-10">
        <nav className="flex items-center gap-2 font-mono text-[8px] uppercase tracking-[0.16em] text-brand-primary/40">
          <Link href="/" className="transition-colors hover:text-brand-primary">
            Home
          </Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/catalogue" className="transition-colors hover:text-brand-primary">
            Catalogue
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="truncate text-brand-primary/65">{product.name}</span>
        </nav>

        <div className="mt-6 grid gap-8 lg:grid-cols-[1.02fr_0.98fr] lg:gap-12">
          <Reveal>
            <div className="lg:sticky lg:top-28">
              <div className="relative overflow-hidden rounded-[1.8rem] border border-brand-primary/10 bg-white p-2 shadow-[0_30px_80px_-52px_rgba(28,11,96,0.4)]">
                <div className="relative aspect-square overflow-hidden rounded-[1.4rem] bg-brand-lavender">
                  <AnimatePresence mode="wait">
                    {show3D ? (
                      <motion.div
                        key="3d"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0"
                      >
                        <ProductViewer3D
                          product={product}
                          customization={defaultCustomization}
                          className="!min-h-full !rounded-none !border-0"
                        />
                      </motion.div>
                    ) : (
                      <motion.div
                        key={gallery[activeImage]}
                        initial={{ opacity: 0, scale: 1.02 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.35 }}
                        className="absolute inset-0"
                      >
                        <Image
                          src={gallery[activeImage]}
                          alt={`${product.name} — view ${activeImage + 1}`}
                          fill
                          priority
                          sizes="(max-width: 1024px) 100vw, 50vw"
                          className="object-cover"
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-3">
                    <span className="rounded-full border border-white/50 bg-white/80 px-2.5 py-1 font-mono text-[8px] uppercase tracking-[0.16em] text-brand-primary backdrop-blur-md">
                      {product.category}
                    </span>
                    {product.badge && (
                      <span className="rounded-full bg-brand-gold px-2.5 py-1 font-mono text-[8px] uppercase tracking-[0.16em] text-brand-navy">
                        {product.badge}
                      </span>
                    )}
                  </div>

                  <div className="absolute inset-x-0 bottom-0 flex items-center justify-between p-3">
                    <button
                      type="button"
                      onClick={() => setShow3D((value) => !value)}
                      className="inline-flex items-center gap-1.5 rounded-full border border-white/50 bg-white/85 px-3 py-2 font-mono text-[8px] uppercase tracking-[0.14em] text-brand-primary backdrop-blur-md transition-colors hover:bg-white"
                    >
                      <RotateCcw className="h-3 w-3" />
                      {show3D ? 'Photo view' : 'View in 3D'}
                    </button>
                    <span className="rounded-full border border-white/40 bg-brand-primary/80 px-2.5 py-1.5 font-mono text-[8px] uppercase tracking-[0.14em] text-white backdrop-blur-md">
                      {product.dimensionsMm.x} × {product.dimensionsMm.y} × {product.dimensionsMm.z} mm
                    </span>
                  </div>
                </div>
              </div>

              {gallery.length > 1 && (
                <div className="mt-3 flex gap-2">
                  {gallery.map((image, index) => (
                    <button
                      key={`${image}-${index}`}
                      type="button"
                      onClick={() => {
                        setActiveImage(index);
                        setShow3D(false);
                      }}
                      className={`relative h-16 w-16 overflow-hidden rounded-xl border-2 transition-all ${
                        !show3D && activeImage === index
                          ? 'border-brand-primary'
                          : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                      aria-label={`View image ${index + 1}`}
                    >
                      <Image src={image} alt="" fill sizes="64px" className="object-cover" />
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setShow3D(true)}
                    className={`flex h-16 w-16 flex-col items-center justify-center gap-1 rounded-xl border-2 font-mono text-[7px] uppercase tracking-[0.1em] transition-all ${
                      show3D
                        ? 'border-brand-primary bg-brand-primary text-white'
                        : 'border-brand-primary/10 bg-white text-brand-primary/50 hover:border-brand-primary/30'
                    }`}
                  >
                    <RotateCcw className="h-4 w-4" />
                    3D
                  </button>
                </div>
              )}

              <p className="mt-3 px-1 font-mono text-[7px] uppercase leading-relaxed tracking-[0.12em] text-brand-navy/35">
                3D preview and photos are indicative. Final finish may vary slightly; the studio confirms
                every detail before printing.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="flex flex-col">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-brand-lavender px-3 py-1.5 font-mono text-[8px] uppercase tracking-[0.16em] text-brand-primary">
                  {product.customizable ? 'Made to order' : 'Ready to ship'}
                </span>
                <span className="flex items-center gap-1 rounded-full border border-brand-primary/10 bg-white px-2.5 py-1.5 font-mono text-[8px] text-brand-primary/60">
                  <Star className="h-3 w-3 fill-brand-gold text-brand-gold" />
                  {rating.toFixed(1)} · {reviews} reviews
                </span>
                <span className="flex items-center gap-1 rounded-full border border-brand-teal/20 bg-brand-mint px-2.5 py-1.5 font-mono text-[8px] uppercase tracking-[0.12em] text-brand-pine">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-teal" />
                  In stock
                </span>
              </div>

              <h1 className="mt-4 font-display text-[clamp(2.6rem,6vw,4.6rem)] leading-[0.88] tracking-[-0.04em] text-brand-navy">
                {product.name}
              </h1>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-brand-navy/60">
                {product.description}
              </p>

              <div className="mt-5 flex flex-wrap gap-1.5">
                {product.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-brand-primary/10 bg-white px-2.5 py-1 font-mono text-[8px] uppercase tracking-[0.12em] text-brand-navy/50"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              <div className="mt-6 rounded-2xl border border-brand-primary/10 bg-white p-4 sm:p-5">
                <div className="flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <span className="font-mono text-[8px] uppercase tracking-[0.18em] text-brand-primary/40">
                      {product.customizable ? 'From' : 'Price'}
                    </span>
                    <div className="mt-1 flex items-baseline gap-2">
                      <span className="font-display text-[2.6rem] leading-none tracking-[-0.03em] text-brand-navy">
                        {formatINR(product.startingPrice)}
                      </span>
                      {product.customizable && (
                        <span className="font-mono text-[8px] uppercase tracking-[0.12em] text-brand-primary/40">
                          base · {formatINR(defaultPrice)} configured
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 font-mono text-[8px] uppercase tracking-[0.12em] text-brand-navy/45">
                    <Clock className="h-3.5 w-3.5 text-brand-pink" />
                    {product.productionDays ?? 3}–{(product.productionDays ?? 3) + 2} working days
                  </div>
                </div>

                <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                  <Link
                    href={getCustomizeHref(product)}
                    className="group flex flex-1 items-center justify-between gap-3 rounded-full bg-brand-primary px-5 py-3.5 font-mono text-[10px] uppercase tracking-[0.14em] text-white transition-all hover:-translate-y-0.5 hover:bg-brand-pink"
                  >
                    <span className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4" />
                      Customize this piece
                    </span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className={`flex items-center justify-center gap-2 rounded-full border px-5 py-3.5 font-mono text-[10px] uppercase tracking-[0.14em] transition-all ${
                      added
                        ? 'border-brand-teal bg-brand-mint text-brand-pine'
                        : 'border-brand-primary/15 bg-white text-brand-primary hover:border-brand-primary/30 hover:bg-brand-lavender'
                    }`}
                  >
                    {added ? <Check className="h-4 w-4" /> : <ShoppingBag className="h-4 w-4" />}
                    {added ? 'Added' : 'Add standard'}
                  </button>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-2 border-t border-brand-primary/10 pt-3">
                  {[
                    { icon: ShieldCheck, label: 'Human reviewed' },
                    { icon: Ruler, label: '0.05 mm detail' },
                    { icon: Heart, label: 'Gift-ready' },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.label} className="flex items-center gap-1.5 font-mono text-[7px] uppercase tracking-[0.12em] text-brand-navy/45">
                        <Icon className="h-3.5 w-3.5 text-brand-teal" />
                        {item.label}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="mt-5 rounded-2xl border border-brand-primary/10 bg-white">
                <div className="flex gap-1 border-b border-brand-primary/10 p-1.5">
                  {tabs.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setTab(item.id)}
                      className={`flex-1 rounded-full px-3 py-2 font-mono text-[8px] uppercase tracking-[0.13em] transition-colors ${
                        tab === item.id
                          ? 'bg-brand-primary text-white'
                          : 'text-brand-navy/45 hover:bg-brand-lavender hover:text-brand-primary'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
                <div className="p-4 sm:p-5">
                  {tab === 'details' && (
                    <ul className="space-y-2.5">
                      {highlights.map((highlight) => (
                        <li key={highlight} className="flex items-start gap-2 text-xs leading-relaxed text-brand-navy/60">
                          <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-teal" />
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  )}
                  {tab === 'specs' && (
                    <dl className="grid gap-2.5 sm:grid-cols-2">
                      {specs.map((spec) => (
                        <div key={spec.label} className="rounded-xl bg-brand-lavender/40 px-3 py-2.5">
                          <dt className="font-mono text-[7px] uppercase tracking-[0.16em] text-brand-primary/40">
                            {spec.label}
                          </dt>
                          <dd className="mt-1 text-xs font-medium text-brand-navy/75">{spec.value}</dd>
                        </div>
                      ))}
                    </dl>
                  )}
                  {tab === 'delivery' && (
                    <div className="space-y-3 text-xs leading-relaxed text-brand-navy/60">
                      <p className="flex items-start gap-2">
                        <Package className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-pink" />
                        Gift-ready packing with protective foam. Tracked delivery across India; local
                        Chennai slots available at checkout.
                      </p>
                      <p className="flex items-start gap-2">
                        <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-teal" />
                        Wipe with a soft dry cloth. Keep away from prolonged direct sun and high heat.
                        Resin pieces should not be left in a hot car.
                      </p>
                      <p className="flex items-start gap-2">
                        <RotateCcw className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-primary" />
                        Personalised items are made to order and cannot be returned for change of mind.
                        If something arrives damaged, send a photo within 48 hours and we will make it
                        right.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <Link
                href="/#contact"
                className="mt-4 inline-flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.14em] text-brand-primary/50 transition-colors hover:text-brand-primary"
              >
                Ask the studio about this piece
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </Reveal>
        </div>

        {related.length > 0 && (
          <section className="mt-16 border-t border-brand-primary/10 pt-10 sm:mt-20">
            <div className="flex items-end justify-between gap-4">
              <div>
                <span className="font-mono text-[8px] uppercase tracking-[0.22em] text-brand-primary/40">
                  You may also like
                </span>
                <h2 className="mt-2 font-display text-[clamp(2rem,4.5vw,3.2rem)] leading-none tracking-[-0.03em] text-brand-navy">
                  More from the studio
                </h2>
              </div>
              <Link
                href="/catalogue"
                className="hidden items-center gap-2 rounded-full border border-brand-primary/15 px-4 py-2.5 font-mono text-[8px] uppercase tracking-[0.14em] text-brand-primary transition-colors hover:bg-white sm:flex"
              >
                All pieces
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item, index) => (
                <Reveal key={item.id} delay={index * 0.05} y={24}>
                  <ProductCard product={item} className="h-full" />
                </Reveal>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
