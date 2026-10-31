'use client';

import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import HeroMarquee from './HeroMarquee';

const ease = [0.22, 1, 0.36, 1] as const;

export default function Hero() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  const baseY = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const textScale = useTransform(scrollYProgress, [0, 1], [1, 1.03]);

  return (
    <section
      ref={sectionRef}
      id="home"
      className="relative isolate px-3 pt-20 sm:px-4 sm:pt-24 lg:px-5 lg:pt-26"
    >
      <div className="relative mx-auto max-w-[1600px]">
        <div className="relative overflow-hidden rounded-[1.75rem] bg-brand-primary shadow-[0_50px_120px_-60px_rgba(28,11,96,0.75)] sm:rounded-[2.5rem]">
          <div className="relative flex min-h-[580px] flex-col sm:min-h-[640px] lg:min-h-[calc(100svh-8.5rem)]">
            {/* Desktop layered artwork - positioned more up */}
            <div className="absolute inset-0 hidden lg:block" aria-hidden>
              <motion.div
                style={{ y: shouldReduceMotion ? 0 : baseY }}
                className="absolute -top-20 inset-x-0 bottom-0"
              >
                <Image
                  src="/assets/hero-base.png"
                  alt=""
                  fill
                  priority
                  sizes="100vw"
                  className="object-cover object-center"
                />
              </motion.div>
              <motion.div
                style={{
                  y: shouldReduceMotion ? 0 : textY,
                  scale: shouldReduceMotion ? 1 : textScale,
                }}
                className="absolute -top-20 inset-x-0 bottom-0"
              >
                <Image
                  src="/assets/hero-text.png"
                  alt=""
                  fill
                  priority
                  sizes="100vw"
                  className="object-cover object-center"
                />
              </motion.div>
              <motion.div
                style={{ y: shouldReduceMotion ? 0 : baseY }}
                className="absolute -top-20 inset-x-0 bottom-0"
              >
                <Image
                  src="/assets/hero-printer.png"
                  alt=""
                  fill
                  priority
                  sizes="100vw"
                  className="object-cover object-center"
                />
              </motion.div>
            </div>

            {/* Mobile artwork - positioned more up */}
            <div className="absolute inset-0 lg:hidden" aria-hidden>
              <Image
                src="/assets/hero-mob.png"
                alt=""
                fill
                priority
                sizes="100vw"
                className="object-cover object-top -translate-y-4 sm:-translate-y-8 scale-105"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(13,7,43,0.3)_0%,rgba(13,7,43,0.06)_32%,rgba(13,7,43,0.85)_100%)]" />
            </div>

            <div className="hero-vignette pointer-events-none absolute inset-0" aria-hidden />

            {/* Main content - moved more up on mobile / Android */}
            <div className="relative z-20 flex flex-1 flex-col justify-start px-4 pt-7 pb-12 sm:px-7 sm:pt-10 sm:pb-16 lg:justify-end lg:px-10 lg:pt-44 lg:pb-20">
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1, ease }}
                className="max-w-2xl"
              >
                <h1 className="sr-only">
                  DHANALAKSHMI GIFTS — personalised 3D printed gifts, keepsakes and custom objects
                </h1>

                {/* Mobile Heading - Full uppercase in NECHLAS font, moved up */}
                <p className="font-nechlas text-[clamp(2.7rem,12vw,5rem)] uppercase leading-[0.88] tracking-[0.02em] text-white lg:hidden">
                  DHANALAKSHMI
                  <br />
                  <span className="text-brand-gold">GIFTS</span>
                </p>

                {/* Tagline - moved above */}
                <p className="mt-3.5 max-w-lg font-sans text-sm leading-relaxed text-white/85 sm:text-[15px] lg:mt-4">
                  Personalised gifts, sculptural keepsakes and one-off commissions — designed with
                  you, printed layer by layer in our Chennai studio.
                </p>

                {/* CTAs - moved above */}
                <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <Link
                    href="/#customize"
                    className="group flex items-center justify-between gap-4 rounded-full bg-brand-gold px-6 py-3.5 font-sans text-[11px] font-bold uppercase tracking-[0.16em] text-brand-navy shadow-[0_20px_45px_-22px_rgba(254,208,3,0.55)] transition-all hover:-translate-y-0.5 hover:bg-white sm:min-w-[210px]"
                  >
                    Start customizing
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                  <Link
                    href="/catalogue"
                    className="group flex items-center justify-between gap-4 rounded-full border border-white/30 bg-white/10 px-6 py-3.5 font-sans text-[11px] font-bold uppercase tracking-[0.16em] text-white backdrop-blur-md transition-all hover:-translate-y-0.5 hover:border-white/50 hover:bg-white/20 sm:min-w-[210px]"
                  >
                    Explore designs
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Link>
                </div>
              </motion.div>
            </div>

            {/* Bottom edge ticker */}
            <div className="relative z-30 -mt-6 px-1 sm:-mt-8 sm:px-2">
              <div className="overflow-hidden rounded-t-[1.6rem] border border-white/70 bg-paper/95 shadow-[0_-24px_60px_-34px_rgba(28,11,96,0.5)] backdrop-blur-xl sm:rounded-t-[2.2rem]">
                <HeroMarquee />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
