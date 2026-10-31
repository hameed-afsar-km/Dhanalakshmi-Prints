'use client';

import type { FormEvent } from 'react';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  ArrowRight,
  ArrowUp,
  ArrowUpRight,
  Check,
  Clock,
  Layers,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Sparkles,
  Truck,
} from 'lucide-react';
import { BRAND } from '@/lib/constants';

const collectionLinks = [
  { label: 'Personalized Keychains', href: '/catalogue?category=Keychains' },
  { label: 'Executive Desk Nameplates', href: '/catalogue?category=Desk%20Decor' },
  { label: 'Lithophane Photo Lamps', href: '/catalogue?category=Lamps' },
  { label: 'Sculptural Figurines', href: '/catalogue?category=Art%20%26%20Decor' },
  { label: 'All Catalog Pieces', href: '/catalogue' },
];

const serviceLinks = [
  { label: 'Live 3D Customizer', href: '/#customize' },
  { label: 'Custom CAD Model Upload', href: '/custom-printing' },
  { label: 'Bulk & Corporate Gifting', href: '/custom-printing' },
  { label: 'Track An Order', href: '/orders' },
  { label: 'Quotation Portal', href: '/custom-printing' },
];

export default function Footer() {
  const pathname = usePathname();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const handleSubscribe = (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setEmail('');
  };

  return (
    <footer className="relative overflow-hidden bg-[#090619] text-white pt-16 pb-10 border-t border-white/10">
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.06] [background-image:linear-gradient(rgba(255,255,255,0.4)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.4)_1px,transparent_1px)] [background-size:44px_44px]" />
      <div className="pointer-events-none absolute -left-40 top-1/4 h-[30rem] w-[30rem] rounded-full bg-brand-royal/25 blur-[120px]" />
      <div className="pointer-events-none absolute -right-32 bottom-0 h-[28rem] w-[28rem] rounded-full bg-brand-pink/20 blur-[130px]" />

      <div className="relative mx-auto max-w-[92rem] px-4 sm:px-6 lg:px-10">
        {/* Top Call-To-Action Banner */}
        <div className="rounded-[2.2rem] border border-white/15 bg-gradient-to-r from-brand-primary via-[#240e7a] to-brand-primary p-8 sm:p-12 shadow-[0_30px_90px_-40px_rgba(28,11,96,0.9)]">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-8">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-brand-gold">
                <Sparkles className="h-3.5 w-3.5 text-brand-gold" />
                Next-Gen 3D Fabrication
              </span>
              <h2 className="mt-4 font-nechlas text-[clamp(2.5rem,6vw,4.8rem)] uppercase leading-[0.9] tracking-[0.02em] text-white">
                MAKE SOMETHING
                <br />
                <span className="text-brand-gold">WORTH KEEPING.</span>
              </h2>
              <p className="mt-3.5 max-w-xl font-sans text-sm leading-relaxed text-white/75">
                Whether it is a custom named keepsake or an industrial CAD blueprint, we fabricate every layer with surgical precision right here in Chennai.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row lg:col-span-4 lg:flex-col">
              <Link
                href="/#customize"
                className="group flex items-center justify-between gap-4 rounded-full bg-brand-gold px-6 py-4 font-sans text-xs font-bold uppercase tracking-[0.16em] text-brand-navy shadow-md transition-all hover:-translate-y-0.5 hover:bg-white"
              >
                <span>Customize A Piece</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/custom-printing"
                className="group flex items-center justify-between gap-4 rounded-full border border-white/25 bg-white/10 px-6 py-4 font-sans text-xs font-bold uppercase tracking-[0.16em] text-white backdrop-blur-md transition-all hover:-translate-y-0.5 hover:border-white/50 hover:bg-white/20"
              >
                <span>Upload Custom CAD</span>
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Studio Value Highlights */}
        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-3 border-b border-white/10 pb-12">
          <div className="flex items-center gap-3.5 rounded-2xl border border-white/10 bg-white/5 p-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-pink/20 text-brand-pink">
              <Layers className="h-5 w-5" />
            </span>
            <div>
              <h4 className="font-nechlas text-base uppercase tracking-[0.02em] text-white">
                0.05 MM LAYER DETAIL
              </h4>
              <p className="font-sans text-xs text-white/60">
                Ultra-smooth surface resolution on high-speed printers.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 rounded-2xl border border-white/10 bg-white/5 p-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-gold/20 text-brand-gold">
              <Truck className="h-5 w-5" />
            </span>
            <div>
              <h4 className="font-nechlas text-base uppercase tracking-[0.02em] text-white">
                PAN-INDIA DELIVERY
              </h4>
              <p className="font-sans text-xs text-white/60">
                Gift-ready insulated packaging with live order tracking.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 rounded-2xl border border-white/10 bg-white/5 p-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-teal/20 text-brand-teal">
              <ShieldCheck className="h-5 w-5" />
            </span>
            <div>
              <h4 className="font-nechlas text-base uppercase tracking-[0.02em] text-white">
                ZERO-DEFECT GUARANTEE
              </h4>
              <p className="font-sans text-xs text-white/60">
                Hand-inspected finishing with free reprint guarantee.
              </p>
            </div>
          </div>
        </div>

        {/* 4 Navigation Columns */}
        <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-12">
          {/* Brand Info & Newsletter */}
          <div className="lg:col-span-4">
            <Link href="/" className="inline-flex items-center gap-3">
              <span className="relative flex h-10 w-10 overflow-hidden rounded-full border border-white/20 bg-white p-1">
                <Image
                  src="/assets/logo.png"
                  alt={`${BRAND.name} logo`}
                  fill
                  sizes="40px"
                  className="object-contain p-1"
                />
              </span>
              <div>
                <span className="font-nechlas text-xl uppercase tracking-[0.02em] text-white">
                  DHANALAKSHMI
                </span>
                <span className="block font-sans text-[8px] font-semibold uppercase tracking-[0.24em] text-brand-gold">
                  PRINTS / 3D STUDIO
                </span>
              </div>
            </Link>

            <p className="mt-4 font-sans text-xs leading-relaxed text-white/65">
              Chennai&apos;s premier 3D digital fabrication lab. We specialize in bespoke sculptural gifts, personalized nameplates, precision resin casting, and industrial CAD prototyping.
            </p>

            <div className="mt-4 flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              <span className="font-sans text-[11px] font-semibold text-emerald-300">
                Studio Active · Taking Custom Orders
              </span>
            </div>

            <form onSubmit={handleSubscribe} className="mt-6 max-w-sm">
              <label htmlFor="footer-subscribe" className="font-sans text-[10px] font-bold uppercase tracking-[0.16em] text-white/50">
                Get Studio Drop Updates
              </label>
              <div className="mt-2 flex items-center rounded-full border border-white/15 bg-white/5 p-1.5 focus-within:border-brand-gold">
                <input
                  id="footer-subscribe"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="min-w-0 flex-1 bg-transparent px-3 py-1.5 font-sans text-xs text-white outline-none placeholder:text-white/30"
                />
                <button
                  type="submit"
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-gold text-brand-navy transition-colors hover:bg-white"
                  aria-label="Subscribe"
                >
                  {subscribed ? <Check className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
                </button>
              </div>
              {subscribed && (
                <p className="mt-2 font-sans text-[11px] text-brand-gold">
                  Thank you! You are on our VIP studio list.
                </p>
              )}
            </form>
          </div>

          {/* Collections */}
          <div className="lg:col-span-3 lg:pl-6">
            <h4 className="font-nechlas text-base uppercase tracking-[0.02em] text-white">
              COLLECTIONS
            </h4>
            <ul className="mt-4 space-y-2.5">
              {collectionLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="font-sans text-xs text-white/60 transition-colors hover:text-brand-gold"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="lg:col-span-2">
            <h4 className="font-nechlas text-base uppercase tracking-[0.02em] text-white">
              SERVICES
            </h4>
            <ul className="mt-4 space-y-2.5">
              {serviceLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="font-sans text-xs text-white/60 transition-colors hover:text-brand-gold"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Studio Contact */}
          <div className="lg:col-span-3">
            <h4 className="font-nechlas text-base uppercase tracking-[0.02em] text-white">
              CHENNAI STUDIO
            </h4>
            <ul className="mt-4 space-y-3 font-sans text-xs text-white/65">
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-gold" />
                <span>{BRAND.location}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 shrink-0 text-brand-gold" />
                <a href={`tel:${BRAND.phone.replace(/[^0-9]/g, '')}`} className="hover:text-brand-gold">
                  {BRAND.phone}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 shrink-0 text-brand-gold" />
                <a href={`mailto:${BRAND.supportEmail}`} className="hover:text-brand-gold">
                  {BRAND.supportEmail}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Clock className="h-4 w-4 shrink-0 text-brand-gold" />
                <span>Mon — Sat · 9:00 AM — 8:00 PM</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright & actions */}
        <div className="mt-14 border-t border-white/10 pt-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="font-sans text-xs text-white/45">
              © 2026 {BRAND.name}. All rights reserved. Precision 3D Digital Fabrication & Gifts.
            </p>

            <div className="flex items-center gap-4 font-sans text-xs text-white/50">
              <Link href="/admin" className="hover:text-white transition-colors">
                Admin Portal
              </Link>
              <span>·</span>
              <button
                type="button"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="group flex items-center gap-1.5 rounded-full border border-white/15 px-3 py-1.5 transition-colors hover:border-brand-gold hover:bg-brand-gold hover:text-brand-navy"
              >
                <span>Back To Top</span>
                <ArrowUp className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
