'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  ShoppingBag,
  FileText,
  Package,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Shield,
  Layers,
  Sparkles,
} from 'lucide-react';
import { useStore } from '@/lib/store';
import { BRAND } from '@/lib/constants';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { orders, quotations, isAdminLoggedIn, setAdminLoggedIn } = useStore();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const pendingOrdersCount = orders.filter((o) => o.fulfillmentStatus === 'Pending' || o.fulfillmentStatus === 'Confirmed').length;
  const pendingQuotesCount = quotations.filter((q) => q.status === 'Submitted' || q.status === 'Under Review').length;

  const navItems = [
    { label: 'Overview', href: '/admin', icon: LayoutDashboard },
    { label: 'Order Management', href: '/admin/orders', icon: ShoppingBag, badge: pendingOrdersCount },
    { label: 'Custom Quotations', href: '/admin/quotations', icon: FileText, badge: pendingQuotesCount },
    { label: 'Product Catalog', href: '/admin/products', icon: Package },
    { label: 'Delivery & Pricing', href: '/admin/settings', icon: Settings },
  ];

  const handleLogout = () => {
    setAdminLoggedIn(false);
    router.push('/admin/login');
  };

  return (
    <div className="flex w-full min-h-screen bg-slate-100/70 font-sans">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-[#0d1e3e] text-slate-300 border-r border-slate-800 flex-shrink-0">
        {/* Sidebar Brand Header */}
        <div className="p-5 border-b border-slate-800/80 flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-white p-1 flex-shrink-0">
            <Image
              src="/assets/logo.png"
              alt="Dhanalakshmi Prints Logo"
              fill
              className="object-contain p-0.5"
            />
          </div>
          <div>
            <span className="font-bold text-white text-sm block tracking-tight">{BRAND.name}</span>
            <span className="text-[10px] font-semibold text-amber-400 uppercase tracking-wider flex items-center gap-1">
              <Shield className="w-2.5 h-2.5" />
              Owner Admin Portal
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-3.5 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-[#1c0b60] text-white shadow-sm font-bold border border-indigo-500/40'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#e71e64] text-white">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-slate-800/80 space-y-2">
          <Link
            href="/"
            className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
          >
            <span>Customer Storefront</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-red-400 hover:text-red-300 hover:bg-red-950/30 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <header className="lg:hidden flex items-center justify-between p-4 bg-[#0d1e3e] text-white border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="relative w-8 h-8 rounded-lg overflow-hidden bg-white p-0.5">
              <Image src="/assets/logo.png" alt="Logo" fill className="object-contain" />
            </div>
            <span className="font-bold text-sm">Admin Dashboard</span>
          </div>

          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800"
          >
            {mobileSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </header>

        {/* Mobile Navigation Drawer */}
        {mobileSidebarOpen && (
          <div className="lg:hidden bg-[#0d1e3e] border-b border-slate-800 p-3 space-y-1 z-40">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileSidebarOpen(false)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold ${
                  pathname === item.href ? 'bg-[#1c0b60] text-white' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <span>{item.label}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-[#e71e64] text-white">
                    {item.badge}
                  </span>
                )}
              </Link>
            ))}
            <Link
              href="/"
              onClick={() => setMobileSidebarOpen(false)}
              className="block px-3.5 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
            >
              Back to Storefront
            </Link>
          </div>
        )}

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
