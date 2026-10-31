'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { GlassIconReveal } from '@/components/ui/liquid-glass-logo-reveal';
import { BRAND } from '@/lib/constants';

const REVEAL_MS = 3800;
const REDUCED_MOTION_MS = 1200;

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
          className="fixed inset-0 z-[200] overflow-hidden bg-[#fbfaff]"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 0.65, ease: [0.76, 0, 0.24, 1] }}
          aria-label="Dhanalakshmi Prints loading"
        >
          <GlassIconReveal
            logo={BRAND.logoUrl}
            label={BRAND.name}
            background="#fbfaff"
            logoColor="#1c0b60"
            originalColors
            tileSize={560}
            logoScale={0.72}
            finalScale={1}
            loop={false}
            replayOnClick={false}
            className="h-full w-full cursor-default"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
