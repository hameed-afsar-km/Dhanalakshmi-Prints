'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ShoppingBag, Menu, X, Sparkles, Box, Shield, FileText } from 'lucide-react';
import { useStore } from '@/lib/store';
import { BRAND } from '@/lib/constants';

export default function Navbar() {
  const pathname = usePathname();
  const { cart, isAdminLoggedIn } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Shop Catalog', href: '/shop' },
    { label: 'Custom Printing', href: '/custom-printing' },
    { label: 'Track Orders', href: '/orders' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo & Title */}
          <Link href="/" className="flex items-center gap-3.5 group">
            <div className="relative w-12 h-12 flex-shrink-0 rounded-xl overflow-hidden bg-white p-1 border border-slate-200 shadow-sm group-hover:border-indigo-600 transition-colors">
              <Image
                src="/assets/logo.png"
                alt="Dhanalakshmi Prints Official Logo"
                fill
                className="object-contain p-0.5"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight text-slate-900 group-hover:text-indigo-900 transition-colors">
                {BRAND.name}
              </span>
              <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                Precision 3D Studio
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'text-indigo-950 bg-indigo-50/80 font-semibold shadow-xs'
                      : 'text-slate-600 hover:text-slate-950 hover:bg-slate-50'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}

            {/* Admin Dashboard Quick Link */}
            <Link
              href="/admin"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                pathname.startsWith('/admin')
                  ? 'bg-indigo-900 text-white'
                  : 'text-slate-500 hover:text-indigo-900 hover:bg-slate-100'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              Admin Portal
            </Link>
          </nav>

          {/* Right Action Items: Cart + Primary CTA */}
          <div className="hidden sm:flex items-center gap-3.5">
            <Link
              href="/cart"
              className="relative p-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all"
              aria-label="View Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5 text-slate-800" />
              {totalCartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex items-center justify-center min-w-5 h-5 px-1.5 text-xs font-bold text-white bg-pink-600 rounded-full shadow-sm animate-in zoom-in-75">
                  {totalCartCount}
                </span>
              )}
            </Link>

            <Link
              href="/customize/prod-1"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#1c0b60] hover:bg-[#28137e] shadow-md shadow-indigo-950/15 hover:shadow-indigo-950/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Design Your Own</span>
            </Link>
          </div>

          {/* Mobile Menu & Cart Icon */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              href="/cart"
              className="relative p-2 rounded-lg text-slate-700 hover:bg-slate-100"
              aria-label="View Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalCartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-pink-600 rounded-full">
                  {totalCartCount}
                </span>
              )}
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 shadow-xl animate-in slide-in-from-top-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2.5 rounded-lg text-base font-medium ${
                pathname === link.href ? 'bg-indigo-50 text-indigo-950 font-semibold' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/admin"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-100"
          >
            <Shield className="w-4 h-4 text-indigo-700" />
            Admin Dashboard
          </Link>
          <div className="pt-2">
            <Link
              href="/customize/prod-1"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl font-semibold text-white bg-[#1c0b60]"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              Design Your Own 3D Product
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
