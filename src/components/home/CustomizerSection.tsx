'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Check, Palette, Ruler, Sparkles, Type } from 'lucide-react';
import { useStore } from '@/lib/store';
import { calculateCustomizedPrice } from '@/lib/pricing';
import { formatINR, getCustomizeHref } from '@/lib/catalog';
import type { Product, SavedCustomization } from '@/types';
import ProductViewer3D from '@/components/3d/ProductViewer3D';
import SectionHeading from '@/components/ui/SectionHeading';
import Reveal from '@/components/ui/Reveal';

function initialCustomization(product: Product): SavedCustomization {
  const schema = product.customizationSchema;
  return {
    text: schema.defaultText ?? '',
    bodyColor: schema.supportedColors[0]?.hex ?? '#1c0b60',
    textColor: schema.supportedColors.find((color) => color.id === 'gold')?.hex ?? '#fed003',
    material: schema.supportedMaterials?.[0] ?? 'PLA',
    sizeId: schema.supportedSizes?.[0]?.id,
    selectedAccessories: [],
  };
}

export default function CustomizerSection() {
  const { products } = useStore();
  const featured = useMemo(
    () => products.filter((product) => product.customizable && product.isPublished).slice(0, 3),
    [products]
  );

  const [activeId, setActiveId] = useState<string>('');
  const active = featured.find((product) => product.id === activeId) ?? featured[0];
  const [drafts, setDrafts] = useState<Record<string, SavedCustomization>>({});

  if (!active) return null;

  const schema = active.customizationSchema;
  const customization = drafts[active.id] ?? initialCustomization(active);
  const price = calculateCustomizedPrice(active, customization).unitTotal;

  const update = (patch: Partial<SavedCustomization>) => {
    setDrafts((current) => ({
      ...current,
      [active.id]: { ...(current[active.id] ?? initialCustomization(active)), ...patch },
    }));
  };

  return (
    <section id="customize" className="relative overflow-hidden bg-brand-primary py-18 text-white sm:py-22 lg:py-26">
      <div className="pointer-events-none absolute inset-0 opacity-[0.07] [background-image:linear-gradient(rgba(255,255,255,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.5)_1px,transparent_1px)] [background-size:52px_52px]" />
      <div className="pointer-events-none absolute -left-32 top-10 h-96 w-96 rounded-full bg-brand-pink/20 blur-[110px]" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-96 w-96 rounded-full bg-brand-teal/20 blur-[110px]" />

      <div className="relative mx-auto max-w-[92rem] px-4 sm:px-6 lg:px-10">
        <Reveal>
          <SectionHeading
            light
            eyebrow="Interactive 3D Configurator"
            title={
              <>
                Make It Yours,
                <br />
                <span className="text-brand-gold">Before It Is Printed.</span>
              </>
            }
            description="Pick a piece, customize embossed lettering, choose custom polymer colors and explore live 3D preview right in your browser. Our studio team ensures structural perfection before spooling."
            action={
              <Link
                href={getCustomizeHref(active)}
                className="group inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/10 px-5 py-3.5 font-sans text-[11px] font-bold uppercase tracking-[0.14em] text-white backdrop-blur transition-all hover:-translate-y-0.5 hover:border-white/40 hover:bg-white/20"
              >
                Open Full Customizer
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            }
          />
        </Reveal>

        <div className="mt-10 grid gap-5 lg:grid-cols-[0.92fr_1.08fr] lg:gap-8">
          <Reveal delay={0.05} className="order-2 lg:order-1">
            <div className="glass-dark h-full rounded-[1.8rem] p-4 sm:p-6">
              <div className="flex flex-wrap gap-2">
                {featured.map((product) => (
                  <button
                    key={product.id}
                    type="button"
                    onClick={() => setActiveId(product.id)}
                    className={`rounded-full border px-4 py-2 font-sans text-[11px] font-semibold transition-all ${
                      active.id === product.id
                        ? 'border-brand-gold bg-brand-gold text-brand-navy shadow-sm'
                        : 'border-white/15 bg-white/5 text-white/70 hover:border-white/30 hover:text-white'
                    }`}
                  >
                    {product.name.split(' ').slice(0, 3).join(' ')}
                  </button>
                ))}
              </div>

              <div className="mt-6 space-y-6">
                {schema.allowText && (
                  <div>
                    <label
                      htmlFor="quick-customize-text"
                      className="flex items-center gap-2 font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-white/70"
                    >
                      <Type className="h-3.5 w-3.5 text-brand-gold" />
                      {schema.textLabel ?? 'Your text'}
                    </label>
                    <div className="mt-2.5 flex items-center gap-2 rounded-2xl border border-white/15 bg-white/5 p-1.5 focus-within:border-brand-gold/60">
                      <input
                        id="quick-customize-text"
                        type="text"
                        value={customization.text ?? ''}
                        maxLength={schema.maxTextLength ?? 20}
                        onChange={(event) => update({ text: event.target.value })}
                        placeholder={schema.defaultText ?? 'Type here'}
                        className="min-w-0 flex-1 bg-transparent px-3 py-2.5 font-sans text-sm uppercase tracking-[0.08em] text-white outline-none placeholder:text-white/25"
                      />
                      <span className="pr-2 font-sans text-[10px] tabular-nums text-white/40">
                        {(customization.text ?? '').length}/{schema.maxTextLength ?? 20}
                      </span>
                    </div>
                  </div>
                )}

                <div>
                  <span className="flex items-center gap-2 font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-white/70">
                    <Palette className="h-3.5 w-3.5 text-brand-gold" />
                    Body Colour
                  </span>
                  <div className="mt-2.5 flex flex-wrap gap-2.5">
                    {schema.supportedColors.map((color) => {
                      const selected = customization.bodyColor === color.hex;
                      return (
                        <button
                          key={color.id}
                          type="button"
                          aria-label={`Select ${color.name}`}
                          onClick={() => update({ bodyColor: color.hex })}
                          className={`relative flex h-9 w-9 items-center justify-center rounded-full border-2 transition-transform hover:scale-110 ${
                            selected
                              ? 'border-white ring-2 ring-white/25 ring-offset-2 ring-offset-brand-primary'
                              : 'border-white/20'
                          }`}
                          style={{ backgroundColor: color.hex }}
                        >
                          {selected && (
                            <Check
                              className={`h-3.5 w-3.5 ${
                                ['white', 'gold'].includes(color.id) ? 'text-brand-navy' : 'text-white'
                              }`}
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {schema.supportedMaterials && schema.supportedMaterials.length > 0 && (
                  <div>
                    <span className="flex items-center gap-2 font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-white/70">
                      <Sparkles className="h-3.5 w-3.5 text-brand-gold" />
                      Material
                    </span>
                    <div className="mt-2.5 flex flex-wrap gap-2">
                      {schema.supportedMaterials.map((material) => (
                        <button
                          key={material}
                          type="button"
                          onClick={() => update({ material })}
                          className={`rounded-full border px-3.5 py-1.5 font-sans text-[11px] font-medium transition-colors ${
                            customization.material === material
                              ? 'border-brand-gold/60 bg-brand-gold/15 text-brand-gold'
                              : 'border-white/15 bg-white/5 text-white/60 hover:border-white/30 hover:text-white'
                          }`}
                        >
                          {material}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {schema.supportedSizes && schema.supportedSizes.length > 0 && (
                  <div>
                    <span className="flex items-center gap-2 font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-white/70">
                      <Ruler className="h-3.5 w-3.5 text-brand-gold" />
                      Size
                    </span>
                    <div className="mt-2.5 grid gap-2 sm:grid-cols-2">
                      {schema.supportedSizes.map((size) => (
                        <button
                          key={size.id}
                          type="button"
                          onClick={() => update({ sizeId: size.id })}
                          className={`rounded-xl border px-3 py-2.5 text-left transition-colors ${
                            customization.sizeId === size.id
                              ? 'border-brand-gold/60 bg-brand-gold/10'
                              : 'border-white/15 bg-white/5 hover:border-white/30'
                          }`}
                        >
                          <span className="block font-sans text-[11px] font-bold uppercase tracking-[0.08em] text-white/90">
                            {size.name}
                          </span>
                          <span className="mt-1 block font-sans text-[10px] text-white/50">
                            {size.dimensionsMm.x} x {size.dimensionsMm.y} x {size.dimensionsMm.z} mm
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-7 flex flex-col gap-3 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <span className="block font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-white/50">
                    Live Estimate
                  </span>
                  <span className="mt-1 flex items-baseline gap-2">
                    <span className="font-nechlas text-[2.2rem] uppercase leading-none tracking-[0.02em] text-white">
                      {formatINR(price)}
                    </span>
                    <span className="font-sans text-[10px] uppercase text-white/50">
                      incl. customisation
                    </span>
                  </span>
                </div>
                <Link
                  href={getCustomizeHref(active)}
                  className="group flex items-center justify-between gap-3 rounded-full bg-brand-gold px-5 py-3.5 font-sans text-[11px] font-bold uppercase tracking-[0.14em] text-brand-navy transition-all hover:-translate-y-0.5 hover:bg-white"
                >
                  Customize & Add To Cart
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1} className="order-1 lg:order-2">
            <div className="relative overflow-hidden rounded-[1.8rem] border border-white/15 bg-white p-2 shadow-[0_40px_100px_-40px_rgba(0,0,0,0.6)]">
              <div className="flex items-center justify-between px-3 py-2">
                <span className="font-nechlas text-[13px] uppercase tracking-[0.04em] text-brand-primary">
                  {active.name}
                </span>
                <span className="flex items-center gap-1.5 font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-brand-teal">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-teal" />
                  Live Preview
                </span>
              </div>
              <div className="relative h-[380px] overflow-hidden rounded-[1.4rem] sm:h-[460px] lg:h-[520px]">
                <ProductViewer3D product={active} customization={customization} className="!min-h-full !rounded-[1.4rem]" />
              </div>
              <p className="px-3 py-2.5 font-sans text-[10px] leading-relaxed text-brand-navy/50">
                Preview is indicative. Geometry and color are confirmed in the full configurator before printing.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
