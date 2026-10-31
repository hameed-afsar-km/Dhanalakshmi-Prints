'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowRight,
  ArrowUpRight,
  FileCheck2,
  PackageCheck,
  SlidersHorizontal,
  UploadCloud,
} from 'lucide-react';
import Reveal from '@/components/ui/Reveal';

const steps = [
  {
    title: 'Upload your file',
    body: 'Drop an STL, OBJ, or 3MF and we will inspect its dimensions automatically.',
    icon: UploadCloud,
    tag: 'CAD intake',
  },
  {
    title: 'Tune the build',
    body: 'Pick material, colour, infill and scale. The quote updates live as you adjust.',
    icon: SlidersHorizontal,
    tag: 'Build setup',
  },
  {
    title: 'Approve your quote',
    body: 'A fixed price and lead time land in your inbox. Approve it in a single click.',
    icon: FileCheck2,
    tag: 'Studio review',
  },
  {
    title: 'Watch it take shape',
    body: 'Follow your part from the print bed to dispatch with live status at every layer.',
    icon: PackageCheck,
    tag: 'Production',
  },
];

export default function CustomProcess() {
  const [activeStep, setActiveStep] = useState(0);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting);
        if (!visible.length) return;
        const next = Number(visible[0].target.getAttribute('data-step') ?? 0);
        setActiveStep(next);
      },
      { rootMargin: '-44% 0px -44% 0px', threshold: 0 },
    );

    const nodes = stepRefs.current.filter((node): node is HTMLDivElement => Boolean(node));
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  const active = steps[activeStep];
  const ActiveIcon = active.icon;

  return (
    <section className="relative overflow-hidden border-b border-ink/15 bg-paper-2 py-20 sm:py-28">
      <div className="pointer-events-none absolute inset-0 paper-grid opacity-55" />
      <div className="pointer-events-none absolute -right-20 top-16 h-80 w-80 rounded-full bg-lime/50 blur-[110px]" />
      <div className="pointer-events-none absolute -left-20 bottom-10 h-72 w-72 rounded-full bg-vermilion/10 blur-[100px]" />
      <span className="pointer-events-none absolute -right-8 top-1/2 hidden -translate-y-1/2 font-display text-[14rem] leading-none tracking-[-0.06em] text-ink/[0.035] lg:block">
        CAD
      </span>

      <div className="relative mx-auto max-w-[92rem] px-4 sm:px-6 lg:px-10">
        <Reveal y={36} amount={0.2}>
          <div className="flex flex-col gap-7 border-b border-ink/20 pb-8 md:flex-row md:items-end md:justify-between">
            <div className="max-w-3xl">
              <span className="font-mono text-[9px] uppercase tracking-[0.24em] text-vermilion">
                (05) / Have Your Own 3D CAD File?
              </span>
              <h2 className="mt-4 font-display text-[clamp(2.7rem,6vw,5.4rem)] leading-[0.85] tracking-[-0.045em] text-ink">
                Custom Rapid
                <br />
                <span className="italic text-ink/45">3D Printing Service.</span>
              </h2>
            </div>
            <p className="max-w-md text-sm leading-relaxed text-ink/55">
              From college engineering prototypes to custom mechanical replacement parts, upload your
              3D model and receive an official quotation in minutes.
            </p>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div className="self-start lg:sticky lg:top-24">
            <div className="relative overflow-hidden rounded-[2rem] border border-brand-primary/30 bg-brand-primary p-5 text-white shadow-[0_36px_90px_-48px_rgba(13,30,62,0.55)] sm:p-7">
              <div className="pointer-events-none absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.12)_1px,transparent_1px)] [background-size:36px_36px]" />
              <div className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full border border-white/10" />

              <div className="relative flex items-center justify-between">
                <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-white/55">
                  Build sequence
                </span>
                <span className="rounded-full border border-white/15 bg-white/10 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.12em] text-white/75">
                  Step {activeStep + 1} of 4
                </span>
              </div>

              <div className="relative mt-10 min-h-[210px] sm:min-h-[200px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={active.title}
                    initial={{ opacity: 0, y: 20, filter: 'blur(5px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, y: -16, filter: 'blur(5px)' }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <div className="flex items-start gap-4">
                      <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-brand-gold text-brand-navy shadow-[0_12px_30px_-16px_rgba(254,208,3,0.6)]">
                        <ActiveIcon className="h-6 w-6" />
                      </span>
                      <div className="pt-1">
                        <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-white/45">
                          {active.tag}
                        </span>
                        <h3 className="mt-1 font-display text-[30px] leading-[0.95] tracking-[-0.025em] sm:text-[34px]">
                          {active.title}
                        </h3>
                      </div>
                    </div>
                    <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/60">{active.body}</p>
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="mt-8 grid grid-cols-4 gap-2">
                {steps.map((step, index) => {
                  const Icon = step.icon;
                  const isDone = index < activeStep;
                  const isActive = index === activeStep;
                  return (
                    <div
                      key={step.title}
                      className={`flex flex-col items-center gap-1.5 rounded-xl border px-1.5 py-2.5 transition-all duration-300 ${
                        isActive
                          ? 'border-brand-gold bg-brand-gold text-brand-navy'
                          : isDone
                            ? 'border-white/20 bg-white/10 text-white/55'
                            : 'border-white/10 bg-white/5 text-white/25'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="font-mono text-[8px] font-bold">{String(index + 1).padStart(2, '0')}</span>
                    </div>
                  );
                })}
              </div>

              <div className="mt-7 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3.5 font-mono text-[9px] leading-relaxed tracking-[0.06em] text-white/60">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/10 text-brand-gold">
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </span>
                No guesswork. Just a clear path from file to finished object.
              </div>

              <Link
                href="/custom-printing"
                className="group mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-brand-gold px-5 py-3.5 font-mono text-[10px] uppercase tracking-[0.15em] text-brand-navy transition-all hover:-translate-y-0.5 hover:bg-white"
              >
                Go to Custom 3D Model Upload
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="absolute bottom-10 left-6 top-8 w-px bg-ink/15 sm:left-8">
              <div
                className="w-px bg-vermilion transition-all duration-700"
                style={{ height: `${((activeStep + 1) / steps.length) * 100}%` }}
              />
            </div>

            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = index === activeStep;
              return (
                <div
                  key={step.title}
                  ref={(node) => {
                    stepRefs.current[index] = node;
                  }}
                  data-step={index}
                  className="relative flex gap-4 pb-14 last:pb-0 sm:gap-6"
                >
                  <div
                    className={`relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border font-mono text-sm font-bold transition-all duration-500 sm:h-16 sm:w-16 sm:text-base ${
                      isActive
                        ? 'scale-105 border-brand-pink bg-brand-pink text-white shadow-[0_16px_36px_-20px_rgba(231,30,100,0.6)]'
                        : 'border-line bg-white text-ink/35'
                    }`}
                  >
                    {String(index + 1).padStart(2, '0')}
                  </div>

                  <motion.div
                    initial={{ opacity: 0.15, y: 34 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, amount: 0.45, margin: '-10% 0px -10% 0px' }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className={`flex-1 pt-1 transition-opacity duration-500 ${isActive ? 'opacity-100' : 'opacity-40'}`}
                  >
                    <div className="flex items-center gap-2 font-mono text-[8px] uppercase tracking-[0.2em] text-ink/45">
                      <Icon className="h-3.5 w-3.5 text-vermilion" />
                      {step.tag}
                    </div>
                    <h3
                      className={`mt-2 font-display text-[30px] leading-[0.95] tracking-[-0.025em] transition-colors sm:text-[38px] ${
                        isActive ? 'text-ink' : 'text-ink/55'
                      }`}
                    >
                      {step.title}
                    </h3>
                    <p className="mt-2 max-w-md text-sm leading-relaxed text-ink/55">{step.body}</p>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
