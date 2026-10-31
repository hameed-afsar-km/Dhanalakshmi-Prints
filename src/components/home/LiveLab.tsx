'use client';

import { useMemo, useState } from 'react';
import type { CSSProperties } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUpRight, Check, Palette, ScanLine, SlidersHorizontal } from 'lucide-react';
import { BRAND } from '@/lib/constants';
import Reveal from '@/components/ui/Reveal';

type FinishId = 'matte' | 'silk' | 'carbon';
type DetailId = 'draft' | 'standard' | 'ultra';

const finishes: { id: FinishId; name: string; note: string; price: number }[] = [
  { id: 'matte', name: 'Matte', note: 'Soft, architectural', price: 0 },
  { id: 'silk', name: 'Silk', note: 'Liquid-metal sheen', price: 80 },
  { id: 'carbon', name: 'Carbon', note: 'Technical texture', price: 140 },
];

const palette = [
  { name: 'Royal Indigo', hex: '#1c0b60' },
  { name: 'Electric Pink', hex: '#e71e64' },
  { name: 'Studio Gold', hex: '#fed003' },
  { name: 'Cyber Teal', hex: '#019c87' },
  { name: 'Bone White', hex: '#f8f8f7' },
];

const details: { id: DetailId; name: string; layer: string; note: string; price: number }[] = [
  { id: 'draft', name: 'Draft', layer: '0.20 mm', note: 'Fast form study', price: 0 },
  { id: 'standard', name: 'Standard', layer: '0.12 mm', note: 'Everyday detail', price: 60 },
  { id: 'ultra', name: 'Ultra', layer: '0.05 mm', note: 'Fine jewellery feel', price: 180 },
];

export default function LiveLab() {
  const [finish, setFinish] = useState<FinishId>('silk');
  const [color, setColor] = useState(palette[0]);
  const [detail, setDetail] = useState<DetailId>('standard');

  const selectedFinish = finishes.find((item) => item.id === finish) ?? finishes[1];
  const selectedDetail = details.find((item) => item.id === detail) ?? details[1];
  const price = 449 + selectedFinish.price + selectedDetail.price;

  const texture = useMemo(() => {
    if (finish === 'carbon') {
      return 'repeating-linear-gradient(45deg, rgba(13,30,62,0.35) 0px, rgba(13,30,62,0.35) 1px, transparent 1px, transparent 5px)';
    }
    if (finish === 'silk') {
      return 'linear-gradient(135deg, rgba(255,255,255,0.75) 0%, transparent 34%, rgba(255,255,255,0.12) 58%, rgba(255,255,255,0.5) 100%)';
    }
    return 'radial-gradient(circle at 30% 24%, rgba(255,255,255,0.35), transparent 62%)';
  }, [finish]);

  const previewStyle = {
    '--spec-color': color.hex,
    '--spec-texture': texture,
  } as CSSProperties;

  return (
    <section className="relative overflow-hidden border-b border-line bg-[#f4f0ff] py-20 sm:py-28">
      <div className="pointer-events-none absolute inset-0 paper-grid opacity-40" />
      <div className="pointer-events-none absolute -right-28 top-12 h-80 w-80 rounded-full border border-ink/15" />
      <div className="pointer-events-none absolute -right-10 bottom-20 h-40 w-40 rounded-full bg-vermilion/20 blur-3xl" />

      <div className="relative mx-auto max-w-[92rem] px-4 sm:px-6 lg:px-10">
        <Reveal y={30} amount={0.2}>
          <div className="flex items-center justify-between border-b border-ink/25 pb-4 font-mono text-[9px] uppercase tracking-[0.22em] text-ink/55">
            <span className="text-vermilion">(04) / Interactive lab</span>
            <span>No upload required</span>
          </div>
        </Reveal>

        <div className="mt-10 grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <Reveal y={42} amount={0.15}>
            <h2 className="max-w-2xl font-display text-[clamp(2.8rem,6vw,5.5rem)] leading-[0.85] tracking-[-0.045em] text-ink">
              A print lab,
              <br />
              <span className="italic text-ink/50">right in your browser.</span>
            </h2>
            <p className="mt-5 max-w-lg text-sm leading-relaxed text-ink/60">
              Tune the finish, colour and layer detail to see how a material changes the whole
              object. This is the same logic behind every live customizer in the shop.
            </p>

            <div className="mt-8 space-y-5">
              <div>
                <div className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.18em] text-ink/50">
                  <SlidersHorizontal className="h-3.5 w-3.5 text-vermilion" /> Finish
                </div>
                <div className="mt-2.5 grid grid-cols-3 gap-2">
                  {finishes.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setFinish(item.id)}
                      className={`rounded-xl border p-3 text-left transition-all ${
                        finish === item.id
                          ? 'border-brand-primary bg-brand-primary text-white shadow-[0_16px_40px_-24px_rgba(28,11,96,0.55)]'
                          : 'border-line bg-white/60 text-ink hover:border-brand-primary hover:bg-white'
                      }`}
                    >
                      <span className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.1em]">
                        {item.name}
                        {finish === item.id && <Check className="h-3.5 w-3.5 text-brand-gold" />}
                      </span>
                      <span className={`mt-1 block text-[9px] leading-tight ${finish === item.id ? 'text-white/45' : 'text-ink/45'}`}>
                        {item.note}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.18em] text-ink/50">
                  <Palette className="h-3.5 w-3.5 text-vermilion" /> Filament colour
                </div>
                <div className="mt-2.5 flex flex-wrap items-center gap-2.5">
                  {palette.map((swatch) => (
                    <button
                      key={swatch.name}
                      type="button"
                      aria-label={`Select ${swatch.name}`}
                      onClick={() => setColor(swatch)}
                      className={`relative flex h-9 w-9 items-center justify-center rounded-full border-2 transition-transform hover:scale-110 ${
                        color.name === swatch.name ? 'border-brand-primary ring-2 ring-brand-primary/15 ring-offset-2 ring-offset-[#f4f0ff]' : 'border-paper'
                      }`}
                      style={{ backgroundColor: swatch.hex }}
                    >
                      {color.name === swatch.name && (
                        <Check className={`h-3.5 w-3.5 ${swatch.name === 'Bone White' || swatch.name === 'Studio Gold' ? 'text-ink' : 'text-white'}`} />
                      )}
                    </button>
                  ))}
                  <span className="ml-1 font-mono text-[9px] uppercase tracking-[0.12em] text-ink/60">{color.name}</span>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.18em] text-ink/50">
                  <ScanLine className="h-3.5 w-3.5 text-vermilion" /> Layer detail
                </div>
                <div className="mt-2.5 grid grid-cols-3 gap-2">
                  {details.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setDetail(item.id)}
                      className={`rounded-xl border px-3 py-2.5 text-left transition-all ${
                        detail === item.id
                          ? 'border-brand-primary bg-brand-primary text-white shadow-[0_16px_40px_-24px_rgba(28,11,96,0.55)]'
                          : 'border-line bg-white/60 text-ink/65 hover:border-brand-primary hover:bg-white'
                      }`}
                    >
                      <span className="block font-mono text-[10px] font-bold">{item.layer}</span>
                      <span className="mt-0.5 block font-mono text-[8px] uppercase tracking-[0.12em] opacity-60">{item.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 rounded-[1.6rem] border border-line bg-white p-4 shadow-[0_24px_60px_-36px_rgba(13,30,62,0.35)] sm:flex sm:items-center sm:justify-between sm:gap-4">
              <div>
                <span className="block font-mono text-[8px] uppercase tracking-[0.18em] text-ink/45">
                  Live studio estimate
                </span>
                <span className="mt-1 flex items-baseline gap-2">
                  <span className="font-display text-[34px] leading-none tracking-[-0.02em] text-ink">
                    {BRAND.currency}
                    {price}
                  </span>
                  <span className="font-mono text-[8px] uppercase tracking-[0.1em] text-ink/45">
                    / {selectedDetail.note}
                  </span>
                </span>
              </div>
              <Link
                href="/customize/number-plate-keychain"
                className="group mt-4 flex items-center justify-between gap-3 rounded-full bg-brand-primary px-4 py-3 font-mono text-[9px] uppercase tracking-[0.14em] text-white transition-all hover:-translate-y-0.5 hover:bg-brand-pink sm:mt-0"
              >
                Open configurator
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </Reveal>

          <Reveal y={50} delay={0.1} amount={0.1} className="relative">
            <div style={previewStyle} className="relative">
              <div className="pointer-events-none absolute -inset-5 rounded-[3rem] bg-[radial-gradient(circle_at_50%_40%,var(--spec-color),transparent_68%)] opacity-20 blur-3xl" />

              <div className="relative rounded-[2rem] border border-line bg-white p-2 shadow-[0_36px_90px_-48px_rgba(13,30,62,0.4)]">
                <div className="flex items-center justify-between border-b border-ink/15 px-3 py-2 font-mono text-[8px] uppercase tracking-[0.2em] text-ink/50">
                  <span className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-vermilion [animation:blink_1.3s_ease-in-out_infinite]" />
                    Specimen 04 / live render
                  </span>
                  <span>LAB / 022</span>
                </div>

                <div className="relative aspect-square overflow-hidden rounded-[1.5rem] border border-line bg-[linear-gradient(135deg,#f7f3ff_0%,#fffaf0_52%,#eefbf8_100%)] sm:aspect-[5/4]">
                  <div className="absolute inset-0 paper-grid opacity-70" />
                  <div className="absolute inset-0 [background:radial-gradient(circle_at_50%_48%,var(--spec-color),transparent_64%)] opacity-20" />
                  <span className="pointer-events-none absolute -bottom-8 left-1 font-display text-[9rem] leading-none tracking-[-0.06em] text-ink/5">
                    04
                  </span>

                  <div className="absolute left-4 top-4 z-10 rounded-full border border-line bg-white/85 px-2.5 py-1 font-mono text-[8px] uppercase tracking-[0.16em] text-ink/55 shadow-sm backdrop-blur">
                    {selectedFinish.name} / {selectedDetail.layer}
                  </div>
                  <div className="absolute right-4 top-4 z-10 rounded-full border border-brand-gold/60 bg-brand-gold px-2.5 py-1 font-mono text-[8px] uppercase tracking-[0.16em] text-ink">
                    Ø 84 mm
                  </div>

                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 38, repeat: Infinity, ease: 'linear' }}
                      className="relative aspect-square w-[70%] max-w-[330px]"
                    >
                      {[0, 1, 2, 3, 4].map((ring) => (
                        <div
                          key={ring}
                          className="absolute rounded-full border"
                          style={{
                            inset: `${ring * 8}%`,
                            borderColor: ring === 0 ? color.hex : `${color.hex}66`,
                            borderWidth: ring === 0 ? 2 : 1,
                            boxShadow: ring === 0 ? `0 0 40px ${color.hex}44` : undefined,
                          }}
                        />
                      ))}
                      <div
                        className="absolute inset-[18%] rounded-full border border-ink/15"
                        style={{
                          background: `radial-gradient(circle at 32% 26%, #ffffffaa, ${color.hex} 26%, ${color.hex}dd 56%, #0d1e3e 88%)`,
                          boxShadow: `inset 0 0 44px ${color.hex}66, 0 28px 60px -22px ${color.hex}99`,
                        }}
                      />
                      <div
                        className="absolute inset-[18%] rounded-full opacity-70 mix-blend-overlay"
                        style={{ background: 'var(--spec-texture)' }}
                      />
                      <div
                        className="absolute inset-[38%] rounded-full border border-paper/30 bg-ink/20 backdrop-blur-sm"
                        style={{ boxShadow: `inset 0 0 28px ${color.hex}55` }}
                      />
                      <div className="absolute inset-[54%] rounded-full bg-paper/20" />
                    </motion.div>
                  </div>

                  <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
                    className="pointer-events-none absolute inset-[13%] rounded-full border border-dashed border-ink/15"
                  />

                  <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-vermilion shadow-[0_0_18px_2px_rgba(231,30,100,0.35)] [animation:scan-line_5.4s_ease-in-out_infinite]" />

                  <div className="absolute bottom-4 left-4 flex items-center gap-3 rounded-full border border-line bg-white/85 px-3 py-2 shadow-sm backdrop-blur">
                    <span className="h-6 w-6 rounded-full border border-ink/30" style={{ backgroundColor: color.hex }} />
                    <span>
                      <span className="block font-mono text-[7px] uppercase tracking-[0.18em] text-ink/45">Filament</span>
                      <span className="block font-mono text-[9px] font-bold uppercase tracking-[0.08em] text-ink">{color.name}</span>
                    </span>
                  </div>
                  <div className="absolute bottom-4 right-4 rounded-2xl border border-line bg-white/85 px-3 py-2 text-right shadow-sm backdrop-blur">
                    <span className="block font-mono text-[7px] uppercase tracking-[0.18em] text-ink/45">Est. build</span>
                    <span className="block font-mono text-[9px] font-bold uppercase tracking-[0.08em] text-ink">
                      {detail === 'ultra' ? '6h 40m' : detail === 'standard' ? '4h 10m' : '2h 25m'}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 px-1 pt-2">
                  {[
                    { label: 'Finish', value: selectedFinish.name },
                    { label: 'Layer', value: selectedDetail.layer },
                    { label: 'Estimate', value: `${BRAND.currency}${price}` },
                  ].map((stat) => (
                    <div key={stat.label} className="rounded-xl border border-line bg-white px-3 py-2.5">
                      <span className="block font-mono text-[7px] uppercase tracking-[0.18em] text-ink/40">{stat.label}</span>
                      <span className="mt-1 block font-mono text-[10px] font-bold uppercase tracking-[0.04em] text-ink/75">{stat.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
