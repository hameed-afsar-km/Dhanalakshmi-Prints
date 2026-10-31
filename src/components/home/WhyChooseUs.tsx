'use client';

import { motion } from 'framer-motion';
import { Gift, HeartHandshake, Leaf, Ruler, ShieldCheck, Sparkles } from 'lucide-react';
import SectionHeading from '@/components/ui/SectionHeading';
import Reveal from '@/components/ui/Reveal';

const reasons = [
  {
    icon: Sparkles,
    title: 'Designed around you',
    body: 'Every piece starts with a name, a date or a memory. We adapt the geometry — not just the label — so the object feels genuinely yours.',
    tint: 'bg-brand-lavender text-brand-primary',
  },
  {
    icon: Ruler,
    title: 'Small-batch precision',
    body: '0.05 mm layer capability, tuned per material. The studio checks orientation, wall thickness and finish before anything reaches the bed.',
    tint: 'bg-brand-blush text-brand-pink',
  },
  {
    icon: HeartHandshake,
    title: 'A human on every order',
    body: 'No black-box checkout. A real studio reviewer confirms your file, flags anything unclear and sends a fixed quote before printing.',
    tint: 'bg-brand-mint text-brand-teal',
  },
  {
    icon: Gift,
    title: 'Gift-ready by default',
    body: 'Protective packing, a care card and optional premium wrap. Pieces arrive ready to give, not just ready to ship.',
    tint: 'bg-brand-cream text-brand-wine',
  },
];

const stats = [
  { value: '1,200+', label: 'objects printed' },
  { value: '4.9/5', label: 'average gift rating' },
  { value: '2–6', label: 'working days' },
  { value: '100%', label: 'human-reviewed' },
];

export default function WhyChooseUs() {
  return (
    <section id="why" className="relative overflow-hidden bg-brand-offwhite py-20 sm:py-24 lg:py-28">
      <div className="pointer-events-none absolute inset-0 opacity-[0.5] [background-image:radial-gradient(rgba(28,11,96,0.08)_1px,transparent_1px)] [background-size:22px_22px]" />
      <div className="pointer-events-none absolute -left-32 top-20 h-80 w-80 rounded-full bg-brand-gold/15 blur-[100px]" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-96 w-96 rounded-full bg-brand-pink/10 blur-[110px]" />

      <div className="relative mx-auto max-w-[92rem] px-4 sm:px-6 lg:px-10">
        <Reveal>
          <SectionHeading
            eyebrow="Why choose us"
            title={
              <>
                Not a print farm.
                <br />
                <span className="italic text-brand-primary">A small studio that cares.</span>
              </>
            }
            description="We keep the catalogue small and the attention high. Every commission is reviewed, printed and finished by the same team that designed it with you."
            action={
              <div className="flex items-center gap-2 rounded-full border border-brand-primary/10 bg-white px-4 py-3 font-mono text-[8px] uppercase tracking-[0.16em] text-brand-primary/60">
                <Leaf className="h-3.5 w-3.5 text-brand-teal" />
                PLA-first / low-waste studio
              </div>
            }
          />
        </Reveal>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {reasons.map((reason, index) => {
            const Icon = reason.icon;
            return (
              <Reveal key={reason.title} delay={0.05 * index}>
                <motion.div
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.3 }}
                  className="flex h-full flex-col rounded-[1.5rem] border border-brand-primary/10 bg-white p-5 shadow-[0_24px_60px_-48px_rgba(28,11,96,0.4)]"
                >
                  <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${reason.tint}`}>
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="mt-5 font-mono text-[8px] uppercase tracking-[0.2em] text-brand-primary/35">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <h3 className="mt-2 font-display text-[1.45rem] leading-[1.05] tracking-[-0.02em] text-brand-navy">
                    {reason.title}
                  </h3>
                  <p className="mt-2.5 text-xs leading-relaxed text-brand-navy/55">{reason.body}</p>
                </motion.div>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={0.15} className="mt-10">
          <div className="relative overflow-hidden rounded-[1.8rem] bg-brand-primary p-6 text-white sm:p-8">
            <div className="pointer-events-none absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.5)_1px,transparent_1px)] [background-size:44px_44px]" />
            <div className="relative grid gap-6 sm:grid-cols-2 lg:grid-cols-[1.1fr_1fr] lg:items-center">
              <div className="flex items-start gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-gold text-brand-navy">
                  <ShieldCheck className="h-6 w-6" />
                </span>
                <div>
                  <h3 className="font-display text-[clamp(1.8rem,4vw,2.6rem)] leading-[0.95] tracking-[-0.03em]">
                    Studio promise
                  </h3>
                  <p className="mt-2 max-w-md text-sm leading-relaxed text-white/60">
                    If a print does not match the approved preview in a meaningful way, we reprint it.
                    Gift orders get a photo check before dispatch.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-2">
                {stats.map((stat) => (
                  <div key={stat.label} className="rounded-xl border border-white/12 bg-white/5 px-3 py-3">
                    <span className="block font-display text-2xl leading-none tracking-[-0.02em] text-brand-gold">
                      {stat.value}
                    </span>
                    <span className="mt-1 block font-mono text-[7px] uppercase tracking-[0.16em] text-white/45">
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
