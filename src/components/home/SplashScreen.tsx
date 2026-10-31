'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { GlassIconReveal } from '@/components/ui/liquid-glass-logo-reveal';
import { BRAND } from '@/lib/constants';

const REVEAL_MS = 3900;
const REDUCED_MOTION_MS = 1400;

export default function SplashScreen() {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  const [visible, setVisible] = useState(true);

  const hidden = Boolean(pathname?.startsWith('/admin'));

  useEffect(() => {
    const timer = window.setTimeout(
      () => setVisible(false),
      reduceMotion ? REDUCED_MOTION_MS : REVEAL_MS,
    );
    return () => window.clearTimeout(timer);
  }, [reduceMotion]);

  useEffect(() => {
    if (!visible || hidden) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [hidden, visible]);

  const unlockScroll = () => {
    document.body.style.overflow = '';
  };

  return (
    <AnimatePresence onExitComplete={unlockScroll}>
      {visible && !hidden && (
        <motion.div
          key="splash"
          className="fixed inset-0 z-[200] overflow-hidden bg-paper text-ink"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
          aria-label="Dhanalakshmi Prints is opening"
        >
          <GlassIconReveal
            logo={BRAND.logoUrl}
            label={BRAND.name}
            background="#f8f8f7"
            logoColor={BRAND.colors.midnightNavy}
            originalColors
            tileSize={560}
            logoScale={0.68}
            finalScale={1}
            loop={false}
            replayOnClick={false}
            className="h-full w-full cursor-default"
          />

          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex items-end justify-between gap-4 px-6 pb-6 sm:px-10 sm:pb-8">
            <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-ink/45">
              {BRAND.tagline}
            </span>
            <button
              type="button"
              onClick={() => setVisible(false)}
              className="pointer-events-auto group flex shrink-0 items-center gap-2 rounded-full border border-line bg-paper-2/80 px-4 py-2.5 font-mono text-[9px] uppercase tracking-[0.18em] text-ink backdrop-blur transition-colors hover:border-brand-primary hover:bg-brand-primary hover:text-white"
            >
              Skip
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
