'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { BRAND, STANDARD_SWATCH_COLORS } from '@/lib/constants';
import { ShieldCheck, Truck, Sparkles, Clock, MapPin, Mail, Phone } from 'lucide-react';

export default function Footer() {
  const pathname = usePathname();
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="w-full bg-[#0d1e3e] text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Brand Value Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-12 border-b border-slate-700/60 mb-12">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-indigo-900/60 text-amber-400 border border-indigo-700/50">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-semibold text-white">Realtime 3D Personalization</h4>
              <p className="text-sm text-slate-400 mt-1">
                Preview your bespoke embossed names, colors, and accessories in high-fidelity 3D before printing.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-indigo-900/60 text-emerald-400 border border-indigo-700/50">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-semibold text-white">Guaranteed Delivery Slots</h4>
              <p className="text-sm text-slate-400 mt-1">
                Choose convenient morning, afternoon, or evening delivery slots with live dispatch tracking.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-indigo-900/60 text-pink-400 border border-indigo-700/50">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-semibold text-white">Industrial Grade Filament</h4>
              <p className="text-sm text-slate-400 mt-1">
                Crafted using premium Silk PLA, PETG, and aerospace Carbon-Fiber composites for long-term durability.
              </p>
            </div>
          </div>
        </div>

        {/* Main Footer Navigation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-700/60">
          {/* Col 1: Brand Info & Official Logo */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative w-11 h-11 rounded-lg overflow-hidden bg-white p-1 shadow-sm">
                <Image
                  src="/assets/logo.png"
                  alt="Dhanalakshmi Prints Logo"
                  fill
                  className="object-contain p-0.5"
                />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">{BRAND.name}</span>
            </div>
            <p className="text-xs leading-relaxed text-slate-400">
              {BRAND.description}
            </p>

            {/* Official Palette Swatches */}
            <div className="pt-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-2">
                Brand Palette Colors
              </span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {STANDARD_SWATCH_COLORS.slice(0, 8).map((color) => (
                  <span
                    key={color.id}
                    title={`${color.name}: ${color.hex}`}
                    className="w-5 h-5 rounded-full border border-white/20 shadow-xs cursor-pointer hover:scale-110 transition-transform"
                    style={{ backgroundColor: color.hex }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Col 2: Products Catalog */}
          <div>
            <h5 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Popular Products</h5>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link href="/customize/prod-1" className="hover:text-amber-400 transition-colors">
                  Personalized Number-Plate Keychain
                </Link>
              </li>
              <li>
                <Link href="/customize/prod-2" className="hover:text-amber-400 transition-colors">
                  Extruded Name Keychain
                </Link>
              </li>
              <li>
                <Link href="/customize/prod-3" className="hover:text-amber-400 transition-colors">
                  Executive Desk Nameplate
                </Link>
              </li>
              <li>
                <Link href="/customize/prod-4" className="hover:text-amber-400 transition-colors">
                  Luggage & Backpack Tag
                </Link>
              </li>
              <li>
                <Link href="/customize/prod-5" className="hover:text-amber-400 transition-colors">
                  Spiral Art Miniature Sculpture
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Services & Navigation */}
          <div>
            <h5 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Studio Services</h5>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link href="/custom-printing" className="hover:text-amber-400 transition-colors">
                  Custom 3D Model Upload (STL / OBJ)
                </Link>
              </li>
              <li>
                <Link href="/shop" className="hover:text-amber-400 transition-colors">
                  Full Ready-to-Print Shop
                </Link>
              </li>
              <li>
                <Link href="/orders" className="hover:text-amber-400 transition-colors">
                  Live Order Status & History
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-amber-400 transition-colors">
                  Owner Admin Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Studio Contact & Location */}
          <div>
            <h5 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Contact Studio</h5>
            <ul className="space-y-3 text-xs text-slate-400">
              <li className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>{BRAND.location}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>{BRAND.phone}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>{BRAND.supportEmail}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>Mon – Sat: 9:00 AM – 8:00 PM</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 {BRAND.name}. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Client Demonstration MVP</span>
            <span className="text-slate-700">|</span>
            <Link href="/admin" className="text-slate-400 hover:text-white">Admin Portal</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
