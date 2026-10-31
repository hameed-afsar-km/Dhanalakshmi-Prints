'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowRight,
  ArrowUpRight,
  Menu,
  MessageCircle,
  Phone,
  ShoppingBag,
  Sparkles,
  X,
} from 'lucide-react';
import { useStore } from '@/lib/store';
import { BRAND } from '@/lib/constants';

interface NavItem {
  label: string;
  href: string;
  sectionId?: string;
}

const navLinks: NavItem[] = [
  { label: 'Customize', href: '/#customize', sectionId: 'customize' },
  { label: 'Catalogue', href: '/#catalogue', sectionId: 'catalogue' },
  { label: 'Upload 3D', href: '/#upload', sectionId: 'upload' },
  { label: 'FAQs', href: '/#faq', sectionId: 'faq' },
  { label: 'Contact', href: '/#contact', sectionId: 'contact' },
];

export default function Navbar() {
  const pathname = usePathname();
  const { cart } = useStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('');

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Track scroll depth and active section on the homepage
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setScrolled(scrollY > 20);

      if (pathname === '/') {
        const sections = ['contact', 'faq', 'upload', 'catalogue', 'customize'];
        const scrollPosition = scrollY + 220;

        let found = '';
        for (const id of sections) {
          const el = document.getElementById(id);
          if (el && scrollPosition >= el.offsetTop) {
            found = id;
            break;
          }
        }
        setActiveSection(found);
      } else {
        setActiveSection('');
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname]);

  // Lock body scroll when mobile menu is open
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

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center px-3 pt-3 sm:px-6 sm:pt-4">
      <motion.div
        layout
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className={`pointer-events-auto flex w-full items-center justify-between gap-3 rounded-full border border-white/80 bg-white/85 px-4 py-2 shadow-[0_14px_40px_-15px_rgba(28,11,96,0.14)] backdrop-blur-2xl backdrop-saturate-150 transition-all duration-300 sm:px-6 sm:py-2.5 ${
          scrolled
            ? 'max-w-[1240px] shadow-[0_20px_50px_-18px_rgba(28,11,96,0.22)] bg-white/95'
            : 'max-w-[1120px]'
        }`}
      >
        {/* Brand identity */}
        <Link
          href="/"
          className="group flex shrink-0 items-center gap-2.5"
          aria-label={`${BRAND.name} home`}
          onClick={() => setMobileOpen(false)}
        >
          <div className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-brand-primary/15 bg-white shadow-xs transition-transform duration-300 group-hover:scale-105 sm:h-10 sm:w-10">
            <Image
              src="/assets/logo.png"
              alt={`${BRAND.name} logo`}
              fill
              sizes="40px"
              className="object-contain p-1"
              priority
            />
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-heading text-[15px] font-black uppercase tracking-tight text-brand-navy sm:text-[17px]">
              Dhanalakshmi
            </span>
            <span className="mt-0.5 flex items-center gap-1.5 font-sans text-[8.5px] font-bold uppercase tracking-[0.18em] text-brand-primary/60">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Gifts & 3D Studio
            </span>
          </div>
        </Link>

        {/* Clean, minimalist text navigation */}
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary navigation">
          {navLinks.map((link) => {
            const isCurrent = link.sectionId && activeSection === link.sectionId;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative rounded-full px-3.5 py-1.5 font-sans text-[12.5px] font-semibold transition-all duration-200 ${
                  isCurrent
                    ? 'bg-brand-primary text-white shadow-xs'
                    : 'text-slate-600 hover:bg-brand-lavender/60 hover:text-brand-primary'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Cart button */}
          <Link
            href="/cart"
            className="relative flex h-9 w-9 items-center justify-center rounded-full border border-brand-primary/12 bg-white text-brand-navy shadow-2xs transition-all hover:border-brand-primary/30 hover:bg-brand-lavender/50 hover:text-brand-primary"
            aria-label={`View shopping cart, ${totalCartCount} items`}
          >
            <ShoppingBag className="h-[17px] w-[17px]" />
            {totalCartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-pink px-1 text-[9px] font-bold text-white ring-2 ring-white">
                {totalCartCount}
              </span>
            )}
          </Link>

          {/* Primary High-Impact CTA */}
          <Link
            href="/#customize"
            className="group hidden items-center gap-2 rounded-full bg-brand-primary px-4 sm:px-5 py-2 font-sans text-[11px] font-bold uppercase tracking-[0.14em] text-white shadow-xs transition-all hover:-translate-y-0.5 hover:bg-brand-pink sm:inline-flex"
          >
            <Sparkles className="h-3.5 w-3.5 text-brand-gold transition-transform group-hover:rotate-12" />
            <span>Customize Now</span>
          </Link>

          {/* Catalogue quick link */}
          <Link
            href="/catalogue"
            className="hidden items-center gap-1.5 rounded-full border border-brand-primary/15 bg-white/70 px-3.5 py-2 font-sans text-[11px] font-bold uppercase tracking-[0.12em] text-brand-navy transition-all hover:border-brand-primary hover:text-brand-primary xl:inline-flex"
          >
            <span>Catalogue</span>
            <ArrowUpRight className="h-3.5 w-3.5 text-brand-navy/60" />
          </Link>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setMobileOpen((open) => !open)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-brand-primary/15 bg-white text-brand-primary shadow-2xs transition-colors hover:border-brand-primary hover:bg-brand-lavender lg:hidden"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </motion.div>

      {/* Fullscreen Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="pointer-events-auto fixed inset-0 z-40 flex flex-col justify-between overflow-y-auto bg-brand-primary px-6 pb-8 pt-24 text-white lg:hidden"
          >
            <div className="pointer-events-none absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.5)_1px,transparent_1px)] [background-size:48px_48px]" />

            <div className="relative mx-auto flex w-full max-w-md flex-col">
              <span className="font-sans text-[10px] font-bold uppercase tracking-[0.24em] text-white/50">
                Studio Directory
              </span>
              <nav className="mt-4 border-t border-white/15" aria-label="Mobile navigation">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.25, delay: 0.04 + index * 0.03 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className="group flex items-center justify-between border-b border-white/12 py-3.5"
                    >
                      <span className="font-heading text-xl font-extrabold uppercase tracking-tight text-white transition-colors group-hover:text-brand-gold">
                        {link.label}
                      </span>
                      <ArrowUpRight className="h-4 w-4 text-white/40 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-white" />
                    </Link>
                  </motion.div>
                ))}
              </nav>

              <div className="mt-6 flex flex-col gap-2.5">
                <Link
                  href="/#customize"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-between rounded-full bg-brand-gold px-5 py-3.5 font-sans text-xs font-bold uppercase tracking-[0.16em] text-brand-navy shadow-sm transition-transform active:scale-95"
                >
                  <span className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-brand-navy" />
                    Customize Now
                  </span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/catalogue"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-between rounded-full border border-white/25 bg-white/10 px-5 py-3 font-sans text-xs font-bold uppercase tracking-[0.14em] text-white transition-colors hover:bg-white/20"
                >
                  <span>Explore Catalogue</span>
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
                <a
                  href={`https://wa.me/${BRAND.whatsappNumber}?text=Hi%20Dhanalakshmi%20Prints,%20I%20am%20looking%20for%20custom%203D%20printing.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 rounded-full bg-emerald-600 px-5 py-3 font-sans text-xs font-bold uppercase tracking-[0.14em] text-white transition-colors hover:bg-emerald-500"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>Chat On WhatsApp</span>
                </a>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-md border-t border-white/15 pt-5 text-center">
              <p className="font-sans text-xs text-white/70">
                {BRAND.name} · {BRAND.location}
              </p>
              <p className="mt-1 font-sans text-[11px] text-white/45">
                Mon — Sat · 9:00 AM — 8:00 PM · +91 98400 12345
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
