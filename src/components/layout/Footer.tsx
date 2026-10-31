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
    <footer className="footer-animated-gradient relative w-full max-w-full flex flex-col justify-between overflow-hidden text-white py-10 sm:py-12 lg:h-[100svh] lg:min-h-[100svh] lg:max-h-[100svh] lg:py-8 border-t border-white/10">
      {/* Decorative ambient glowing orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="absolute -left-20 top-1/4 h-80 w-80 rounded-full bg-brand-pink/20 blur-[100px]" />
        <div className="absolute -right-20 bottom-1/4 h-80 w-80 rounded-full bg-brand-gold/15 blur-[100px]" />
      </div>

      <div className="relative mx-auto flex w-full max-w-[92rem] flex-1 flex-col justify-between px-4 sm:px-6 lg:px-10">
        {/* Top Call-To-Action Banner */}
        <div className="rounded-[2rem] border border-white/20 bg-white/10 p-5 sm:p-7 backdrop-blur-xl shadow-2xl">
          <div className="grid gap-4 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-8">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-brand-gold">
                <Sparkles className="h-3 w-3 text-brand-gold" />
                Precision 3D Fabrication
              </span>
              <h2 className="mt-2 font-heading text-[clamp(1.8rem,4.5vw,3.4rem)] font-extrabold uppercase leading-[0.96] tracking-tight text-white">
                MAKE SOMETHING
                <br />
                <span className="text-brand-gold">WORTH KEEPING.</span>
              </h2>
              <p className="mt-2 max-w-xl font-sans text-xs sm:text-sm leading-relaxed text-white/80">
                Custom named keepsakes and industrial CAD blueprints — fabricated with surgical layer precision in Tiruchendur.
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row lg:col-span-4 lg:flex-col">
              <Link
                href="/#customize"
                className="group flex items-center justify-between gap-4 rounded-full bg-brand-gold px-5 py-3 font-sans text-xs font-bold uppercase tracking-[0.14em] text-brand-navy shadow-md transition-all hover:bg-white"
              >
                <span>Customize A Piece</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/custom-printing"
                className="group flex items-center justify-between gap-4 rounded-full border border-white/30 bg-white/10 px-5 py-3 font-sans text-xs font-bold uppercase tracking-[0.14em] text-white backdrop-blur-md transition-all hover:bg-white/20"
              >
                <span>Upload Custom CAD</span>
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* 4 Navigation Columns */}
        <div className="my-auto grid gap-6 sm:grid-cols-2 lg:grid-cols-12 pt-2">
          {/* Brand Info & Newsletter */}
          <div className="lg:col-span-4">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <div className="relative flex h-8 w-8 overflow-hidden rounded-full border border-white/20 bg-white p-1">
                <Image
                  src="/assets/logo.png"
                  alt={`${BRAND.name} logo`}
                  fill
                  sizes="32px"
                  className="object-contain p-0.5"
                />
              </div>
              <div>
                <span className="font-heading text-base font-extrabold uppercase tracking-tight text-white">
                  DHANALAKSHMI
                </span>
                <span className="block font-sans text-[7px] font-bold uppercase tracking-[0.24em] text-brand-gold">
                  Gifts & 3D Studio
                </span>
              </div>
            </Link>

            <p className="mt-2.5 font-sans text-xs leading-relaxed text-white/70">
              Tiruchendur&apos;s premier 3D digital fabrication lab. Custom gifts, nameplates, lithophane lamps, and rapid engineering prototyping.
            </p>

            <form onSubmit={handleSubscribe} className="mt-3 max-w-sm">
              <div className="flex items-center rounded-full border border-white/20 bg-white/10 p-1 focus-within:border-brand-gold backdrop-blur-md">
                <input
                  id="footer-email-input"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email for studio drops"
                  className="min-w-0 flex-1 bg-transparent px-3 py-1 font-sans text-xs text-white outline-none placeholder:text-white/40"
                />
                <button
                  type="submit"
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-gold text-brand-navy transition-colors hover:bg-white"
                  aria-label="Subscribe"
                >
                  {subscribed ? <Check className="h-3.5 w-3.5" /> : <ArrowRight className="h-3.5 w-3.5" />}
                </button>
              </div>
            </form>
          </div>

          {/* Collections */}
          <div className="lg:col-span-3 lg:pl-6">
            <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-brand-gold">
              COLLECTIONS
            </h4>
            <ul className="mt-2.5 space-y-1.5">
              {collectionLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="font-sans text-xs text-white/70 transition-colors hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="lg:col-span-2">
            <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-brand-gold">
              SERVICES
            </h4>
            <ul className="mt-2.5 space-y-1.5">
              {serviceLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="font-sans text-xs text-white/70 transition-colors hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Studio Contact */}
          <div className="lg:col-span-3">
            <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-brand-gold">
              TIRUCHENDUR STUDIO
            </h4>
            <ul className="mt-2.5 space-y-1.5 font-sans text-xs text-white/75">
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-gold" />
                <span>{BRAND.location}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 shrink-0 text-brand-gold" />
                <a href={`tel:${BRAND.phone.replace(/[^0-9]/g, '')}`} className="hover:text-brand-gold">
                  {BRAND.phone}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 shrink-0 text-brand-gold" />
                <a href={`mailto:${BRAND.supportEmail}`} className="hover:text-brand-gold">
                  {BRAND.supportEmail}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Clock className="h-3.5 w-3.5 shrink-0 text-brand-gold" />
                <span>Mon — Sat · 9:00 AM — 8:00 PM</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright & actions */}
        <div className="border-t border-white/15 pt-3">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="font-sans text-xs text-white/60">
              © 2026 {BRAND.name}. All rights reserved. Precision 3D Digital Fabrication & Gifts.
            </p>

            <div className="flex items-center gap-4 font-sans text-xs text-white/60">
              <Link href="/admin" className="hover:text-white transition-colors">
                Admin Portal
              </Link>
              <span>·</span>
              <button
                type="button"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="group flex items-center gap-1.5 rounded-full border border-white/20 px-3 py-1 transition-colors hover:border-brand-gold hover:bg-brand-gold hover:text-brand-navy"
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
