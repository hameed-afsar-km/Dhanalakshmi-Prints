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
  Truck,
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
  { id: 'details', label: 'The Piece' },
  { id: 'specs', label: 'Specifications' },
  { id: 'delivery', label: 'Delivery & Care' },
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
        <h1 className="mt-5 font-heading text-3xl font-extrabold uppercase tracking-tight text-brand-navy">
          Piece Not Found.
        </h1>
        <p className="mt-2 max-w-sm font-sans text-sm text-brand-navy/60">
          The design may have moved. Browse the catalogue to find something similar.
        </p>
        <Link
          href="/catalogue"
          className="mt-5 rounded-full bg-brand-primary px-6 py-3 font-sans text-xs font-bold uppercase tracking-[0.14em] text-white transition-colors hover:bg-brand-pink"
        >
          Back To Catalogue
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
      <div className="mx-auto max-w-[92rem] px-4 pb-20 pt-6 sm:px-6 sm:pt-8 lg:px-10">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 font-sans text-[11px] font-semibold uppercase tracking-[0.12em] text-brand-navy/50">
          <Link href="/" className="transition-colors hover:text-brand-primary">
            Home
          </Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/catalogue" className="transition-colors hover:text-brand-primary">
            Catalogue
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="truncate text-brand-primary font-bold">{product.name}</span>
        </nav>

        <div className="mt-6 grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
          {/* Left Column: Visual Showcase (3D Viewer / High-Res Photos) */}
          <Reveal>
            <div className="lg:sticky lg:top-28">
              <div className="relative overflow-hidden rounded-[2rem] border border-brand-primary/10 bg-white p-2.5 shadow-[0_30px_80px_-50px_rgba(28,11,96,0.35)]">
                <div className="relative aspect-square overflow-hidden rounded-[1.6rem] bg-brand-lavender/40">
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
                        transition={{ duration: 0.3 }}
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

                  {/* Top Badges */}
                  <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-4">
                    <span className="rounded-full border border-white/60 bg-white/90 px-3 py-1 font-sans text-[10px] font-bold uppercase tracking-[0.14em] text-brand-primary shadow-xs backdrop-blur-md">
                      {product.category}
                    </span>
                    {product.badge && (
                      <span className="rounded-full bg-brand-gold px-3 py-1 font-sans text-[10px] font-bold uppercase tracking-[0.14em] text-brand-navy shadow-xs">
                        {product.badge}
                      </span>
                    )}
                  </div>

                  {/* Bottom Controls Toggle */}
                  <div className="absolute inset-x-0 bottom-0 flex items-center justify-between p-4">
                    <button
                      type="button"
                      onClick={() => setShow3D((value) => !value)}
                      className="inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/90 px-4 py-2 font-sans text-[10px] font-bold uppercase tracking-[0.14em] text-brand-primary shadow-xs backdrop-blur-md transition-colors hover:bg-white"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      <span>{show3D ? 'Photo View' : 'Live 3D View'}</span>
                    </button>
                    <span className="rounded-full border border-white/40 bg-brand-primary/85 px-3 py-1.5 font-sans text-[10px] font-bold uppercase tracking-[0.12em] text-white shadow-xs backdrop-blur-md">
                      {product.dimensionsMm.x} × {product.dimensionsMm.y} × {product.dimensionsMm.z} mm
                    </span>
                  </div>
                </div>
              </div>

              {/* Thumbnails */}
              {gallery.length > 1 && (
                <div className="mt-3 flex gap-2.5">
                  {gallery.map((image, index) => (
                    <button
                      key={`${image}-${index}`}
                      type="button"
                      onClick={() => {
                        setActiveImage(index);
                        setShow3D(false);
                      }}
                      className={`relative h-18 w-18 overflow-hidden rounded-2xl border-2 transition-all ${
                        !show3D && activeImage === index
                          ? 'border-brand-primary shadow-xs scale-105'
                          : 'border-transparent opacity-65 hover:opacity-100'
                      }`}
                      aria-label={`View image ${index + 1}`}
                    >
                      <Image src={image} alt="" fill sizes="72px" className="object-cover" />
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setShow3D(true)}
                    className={`flex h-18 w-18 flex-col items-center justify-center gap-1 rounded-2xl border-2 font-sans text-[9px] font-bold uppercase tracking-[0.1em] transition-all ${
                      show3D
                        ? 'border-brand-primary bg-brand-primary text-white shadow-xs'
                        : 'border-brand-primary/15 bg-white text-brand-primary/60 hover:border-brand-primary/30'
                    }`}
                  >
                    <RotateCcw className="h-4 w-4" />
                    <span>3D</span>
                  </button>
                </div>
              )}
            </div>
          </Reveal>

          {/* Right Column: Details, Pricing & Order Customization */}
          <Reveal delay={0.08}>
            <div className="flex flex-col">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-brand-lavender px-3 py-1 font-sans text-[10px] font-bold uppercase tracking-[0.14em] text-brand-primary">
                  {product.customizable ? 'Made To Order' : 'Ready To Ship'}
                </span>
                <span className="flex items-center gap-1 rounded-full border border-brand-primary/10 bg-white px-2.5 py-1 font-sans text-[11px] font-medium text-brand-navy/70">
                  <Star className="h-3.5 w-3.5 fill-brand-gold text-brand-gold" />
                  {rating.toFixed(1)} · {reviews} reviews
                </span>
                <span className="flex items-center gap-1.5 rounded-full border border-brand-teal/20 bg-brand-mint px-2.5 py-1 font-sans text-[10px] font-bold uppercase tracking-[0.12em] text-brand-pine">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-teal" />
                  Studio Verified
                </span>
              </div>

              <h1 className="mt-3 font-heading text-[clamp(2.2rem,5vw,3.6rem)] font-extrabold uppercase leading-[0.96] tracking-tight text-brand-navy">
                {product.name}
              </h1>

              <p className="mt-3 max-w-xl font-sans text-sm leading-relaxed text-brand-navy/70">
                {product.description}
              </p>

              {/* Price & Lead Time Banner */}
              <div className="mt-6 rounded-2xl border border-brand-primary/10 bg-white p-5 shadow-xs">
                <div className="flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <span className="font-sans text-[10px] font-bold uppercase tracking-[0.18em] text-brand-navy/50">
                      {product.customizable ? 'Starting From' : 'Unit Price'}
                    </span>
                    <div className="mt-1 flex items-baseline gap-2">
                      <span className="font-heading text-[2.6rem] font-extrabold uppercase leading-none tracking-tight text-brand-navy">
                        {formatINR(product.startingPrice)}
                      </span>
                      {product.customizable && (
                        <span className="font-sans text-[11px] text-brand-navy/50">
                          base · {formatINR(defaultPrice)} as previewed
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 font-sans text-xs font-semibold text-brand-navy/70">
                    <Clock className="h-4 w-4 text-brand-pink" />
                    <span>{product.productionDays ?? 3}–{(product.productionDays ?? 3) + 2} working days lead</span>
                  </div>
                </div>

                {/* Primary Action Buttons */}
                <div className="mt-5 flex flex-col gap-2.5 sm:flex-row">
                  {product.customizable && (
                    <Link
                      href={getCustomizeHref(product)}
                      className="group flex flex-1 items-center justify-between gap-3 rounded-full bg-brand-primary px-6 py-4 font-sans text-[11px] font-bold uppercase tracking-[0.14em] text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-brand-pink"
                    >
                      <span className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-brand-gold" />
                        Customize In 3D Live Studio
                      </span>
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  )}

                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className={`flex items-center justify-center gap-2 rounded-full border px-6 py-4 font-sans text-[11px] font-bold uppercase tracking-[0.14em] transition-all ${
                      added
                        ? 'border-brand-teal bg-brand-mint text-brand-pine shadow-xs'
                        : 'border-brand-primary/20 bg-white text-brand-primary hover:border-brand-primary hover:bg-brand-lavender'
                    }`}
                  >
                    {added ? <Check className="h-4 w-4" /> : <ShoppingBag className="h-4 w-4" />}
                    <span>{added ? 'Added To Cart' : 'Add Standard Piece'}</span>
                  </button>
                </div>

                {/* Studio Guarantee Row */}
                <div className="mt-5 grid grid-cols-3 gap-2 border-t border-brand-primary/10 pt-3.5">
                  {[
                    { icon: ShieldCheck, label: '0.05 mm Precision' },
                    { icon: Truck, label: 'Pan-India Insured' },
                    { icon: Heart, label: 'Gift-Ready Box' },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.label} className="flex items-center gap-1.5 font-sans text-[10px] font-semibold text-brand-navy/60">
                        <Icon className="h-3.5 w-3.5 text-brand-teal" />
                        <span>{item.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Tabs Section */}
              <div className="mt-6 rounded-2xl border border-brand-primary/10 bg-white shadow-xs">
                <div className="flex gap-1 border-b border-brand-primary/10 p-1.5">
                  {tabs.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setTab(item.id)}
                      className={`flex-1 rounded-xl px-3 py-2.5 font-sans text-[11px] font-bold uppercase tracking-[0.12em] transition-all ${
                        tab === item.id
                          ? 'bg-brand-primary text-white shadow-xs'
                          : 'text-brand-navy/60 hover:bg-brand-lavender hover:text-brand-primary'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>

                <div className="p-5">
                  {tab === 'details' && (
                    <ul className="space-y-2.5">
                      {highlights.map((highlight) => (
                        <li key={highlight} className="flex items-start gap-2.5 font-sans text-xs leading-relaxed text-brand-navy/75">
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-teal" />
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {tab === 'specs' && (
                    <dl className="grid gap-2.5 sm:grid-cols-2">
                      {specs.map((spec) => (
                        <div key={spec.label} className="rounded-xl bg-brand-lavender/30 p-3">
                          <dt className="font-sans text-[10px] font-bold uppercase tracking-[0.14em] text-brand-primary/60">
                            {spec.label}
                          </dt>
                          <dd className="mt-1 font-sans text-xs font-semibold text-brand-navy">{spec.value}</dd>
                        </div>
                      ))}
                    </dl>
                  )}

                  {tab === 'delivery' && (
                    <div className="space-y-3 font-sans text-xs leading-relaxed text-brand-navy/70">
                      <p className="flex items-start gap-2">
                        <Package className="mt-0.5 h-4 w-4 shrink-0 text-brand-pink" />
                        <span>Gift-ready insulated packing with high-density protective foam. Tracked delivery across India.</span>
                      </p>
                      <p className="flex items-start gap-2">
                        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-brand-teal" />
                        <span>Wipe gently with a soft dry cloth. Store away from excessive direct solar radiation.</span>
                      </p>
                      <p className="flex items-start gap-2">
                        <RotateCcw className="mt-0.5 h-4 w-4 shrink-0 text-brand-primary" />
                        <span>Every piece is inspected. In case of rare transit issue, notify us within 48 hours for immediate priority reprint.</span>
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Related Creations */}
        {related.length > 0 && (
          <section className="mt-16 border-t border-brand-primary/10 pt-10 sm:mt-20">
            <div className="flex items-end justify-between gap-4">
              <div>
                <span className="font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-brand-primary/60">
                  Recommended For You
                </span>
                <h2 className="mt-1.5 font-heading text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-brand-navy">
                  More From The Studio
                </h2>
              </div>
              <Link
                href="/catalogue"
                className="hidden items-center gap-2 rounded-full border border-brand-primary/20 bg-white px-4 py-2 font-sans text-xs font-bold uppercase tracking-[0.12em] text-brand-primary transition-colors hover:bg-brand-primary hover:text-white sm:flex"
              >
                <span>View All Creations</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item, index) => (
                <Reveal key={item.id} delay={index * 0.05} y={20}>
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
