'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, Menu, ShoppingBag, Sparkles, X } from 'lucide-react';
import { useStore } from '@/lib/store';
import { BRAND } from '@/lib/constants';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Collections', href: '/#catalogue' },
  { label: 'Customize', href: '/#customize' },
  { label: 'Upload File', href: '/#upload' },
  { label: 'FAQs', href: '/#faq' },
  { label: 'Contact', href: '/#contact' },
];

const ease = [0.22, 1, 0.36, 1] as const;

export default function Navbar() {
  const pathname = usePathname();
  const { cart } = useStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    if (href.startsWith('/#')) return pathname === '/';
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center px-3 pt-3 sm:px-4 sm:pt-4 lg:px-5 lg:pt-4">
      <motion.div
        layout
        transition={{ duration: 0.45, ease }}
        className={`pointer-events-auto flex w-full items-center justify-between gap-3 rounded-full border border-white/70 bg-white/80 px-3 py-2 shadow-[0_18px_50px_-28px_rgba(28,11,96,0.42)] backdrop-blur-xl backdrop-saturate-150 transition-[max-width,padding,box-shadow] duration-500 sm:px-5 ${
          scrolled
            ? 'max-w-[1600px] shadow-[0_24px_70px_-34px_rgba(28,11,96,0.55)]'
            : 'max-w-[1100px]'
        }`}
      >
        <Link
          href="/"
          className="group flex shrink-0 items-center gap-2.5"
          aria-label={`${BRAND.name} home`}
          onClick={() => setMobileOpen(false)}
        >
          <span className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-brand-primary/10 bg-white shadow-sm transition-transform duration-300 group-hover:-rotate-6 sm:h-10 sm:w-10">
            <Image
              src="/assets/logo.png"
              alt={`${BRAND.name} logo`}
              fill
              sizes="40px"
              className="object-contain p-1"
              priority
            />
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-nechlas text-[19px] uppercase leading-none tracking-[0.02em] text-brand-navy sm:text-[21px]">
              Dhanalakshmi
            </span>
            <span className="mt-1 font-sans text-[8px] font-semibold uppercase tracking-[0.22em] text-brand-primary/60">
              Prints / 3D Studio
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary navigation">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`relative rounded-full px-3.5 py-2 font-sans text-[11px] font-medium tracking-[0.02em] transition-colors ${
                isActive(link.href)
                  ? 'bg-brand-primary font-semibold text-white'
                  : 'text-brand-navy/70 hover:bg-brand-lavender hover:text-brand-primary'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <Link
            href="/cart"
            className="relative flex h-9 w-9 items-center justify-center rounded-full border border-brand-primary/10 bg-white text-brand-primary transition-colors hover:border-brand-primary/30 hover:bg-brand-lavender"
            aria-label={`View shopping cart, ${totalCartCount} items`}
          >
            <ShoppingBag className="h-[16px] w-[16px]" />
            {totalCartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-pink px-1 text-[9px] font-bold text-white ring-2 ring-white">
                {totalCartCount}
              </span>
            )}
          </Link>

          <Link
            href="/#customize"
            className="group hidden items-center gap-1.5 rounded-full bg-brand-primary px-4 py-2.5 font-sans text-[10px] font-bold uppercase tracking-[0.14em] text-white shadow-[0_12px_28px_-16px_rgba(28,11,96,0.7)] transition-all hover:-translate-y-0.5 hover:bg-brand-pink sm:flex"
          >
            <Sparkles className="h-3.5 w-3.5 text-brand-gold" />
            Customize Now
          </Link>
          <Link
            href="/catalogue"
            className="group hidden items-center gap-1.5 rounded-full border border-brand-primary/20 bg-white/70 px-4 py-2.5 font-sans text-[10px] font-bold uppercase tracking-[0.14em] text-brand-primary transition-all hover:-translate-y-0.5 hover:border-brand-primary/40 hover:bg-brand-gold md:flex"
          >
            Explore Designs
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>

          <button
            type="button"
            onClick={() => setMobileOpen((open) => !open)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-brand-primary/10 bg-white text-brand-primary transition-colors hover:border-brand-primary/30 hover:bg-brand-lavender lg:hidden"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </motion.div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="pointer-events-auto fixed inset-0 z-40 overflow-y-auto bg-brand-primary px-5 pb-10 pt-24 text-white lg:hidden"
          >
            <div className="pointer-events-none absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.5)_1px,transparent_1px)] [background-size:48px_48px]" />
            <div className="pointer-events-none absolute -right-24 top-24 h-72 w-72 rounded-full bg-brand-pink/30 blur-3xl" />
            <div className="pointer-events-none absolute -left-20 bottom-10 h-72 w-72 rounded-full bg-brand-teal/20 blur-3xl" />

            <div className="relative mx-auto flex max-w-2xl flex-col">
              <span className="font-sans text-[10px] font-semibold uppercase tracking-[0.24em] text-white/50">
                Studio Index
              </span>
              <nav className="mt-3 border-t border-white/15" aria-label="Mobile navigation">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -18 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.35, delay: 0.05 + index * 0.05 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className="group flex items-center justify-between gap-4 border-b border-white/15 py-4"
                    >
                      <span className="flex items-baseline gap-3">
                        <span className="font-sans text-[11px] font-semibold text-brand-gold">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <span
                          className={`font-nechlas text-[clamp(1.8rem,7vw,2.8rem)] uppercase leading-none tracking-[0.02em] transition-colors ${
                            isActive(link.href) ? 'text-brand-gold' : 'text-white'
                          }`}
                        >
                          {link.label}
                        </span>
                      </span>
                      <ArrowUpRight className="h-5 w-5 text-white/35 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-white" />
                    </Link>
                  </motion.div>
                ))}
              </nav>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className="mt-8 flex flex-col gap-3"
              >
                <Link
                  href="/#customize"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-between rounded-full bg-brand-gold px-5 py-4 font-sans text-[11px] font-bold uppercase tracking-[0.16em] text-brand-navy"
                >
                  Customize now
                  <Sparkles className="h-4 w-4" />
                </Link>
                <Link
                  href="/catalogue"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-between rounded-full border border-white/25 px-5 py-4 font-sans text-[11px] font-bold uppercase tracking-[0.16em] text-white/85"
                >
                  Explore designs
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
                <div className="mt-4 flex flex-col gap-2 font-sans text-[11px] text-white/50">
                  <a href={`mailto:${BRAND.supportEmail}`} className="transition-colors hover:text-white">
                    {BRAND.supportEmail}
                  </a>
                  <span>{BRAND.location}</span>
                  <span>Mon — Sat / 9:00 AM — 8:00 PM</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
