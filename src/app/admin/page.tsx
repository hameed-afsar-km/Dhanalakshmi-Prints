'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShoppingBag,
  FileText,
  Clock,
  Layers,
  CheckCircle2,
  TrendingUp,
  ArrowRight,
  Truck,
  RotateCw,
  Box,
} from 'lucide-react';
import AdminLayout from '@/components/layout/AdminLayout';
import { useStore } from '@/lib/store';
import { BRAND } from '@/lib/constants';

export default function AdminOverviewPage() {
  const router = useRouter();
  const { orders, quotations, products, isAdminLoggedIn } = useStore();

  useEffect(() => {
    if (!isAdminLoggedIn) {
      router.push('/admin/login');
    }
  }, [isAdminLoggedIn, router]);

  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.fulfillmentStatus === 'Pending' || o.fulfillmentStatus === 'Confirmed').length;
  const inProductionOrders = orders.filter((o) => o.fulfillmentStatus === 'Printing').length;
  const completedOrders = orders.filter((o) => o.fulfillmentStatus === 'Delivered').length;
  const pendingQuotations = quotations.filter((q) => q.status === 'Submitted' || q.status === 'Under Review').length;
  const totalRevenue = orders.reduce((sum, o) => (o.paymentStatus === 'Paid' ? sum + o.total : sum), 0);

  const stats = [
    { label: 'Total Orders', value: totalOrders, icon: ShoppingBag, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Orders in Production', value: inProductionOrders, icon: Layers, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Pending Quotations', value: pendingQuotations, icon: FileText, color: 'text-pink-600', bg: 'bg-pink-50' },
    { label: 'Total Verified Revenue', value: `${BRAND.currency}${totalRevenue.toLocaleString()}`, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  ];

  const recentOrders = orders.slice(0, 5);
  const recentQuotations = quotations.slice(0, 3);

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Page Title */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Dhanalakshmi Prints — Workshop Overview
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time shop metrics, order fulfillment queue, and custom print quotations.
          </p>
        </div>

        {/* 4 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {stats.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div
                key={idx}
                className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs flex items-center justify-between"
              >
                <div>
                  <span className="text-xs font-semibold text-slate-400 block">{s.label}</span>
                  <div className="text-2xl font-extrabold text-slate-900 mt-1">{s.value}</div>
                </div>
                <div className={`w-12 h-12 rounded-2xl ${s.bg} ${s.color} flex items-center justify-center`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            );
          })}
        </div>

        {/* 2-Col: Recent Orders & Pending Quotations */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Recent Orders Table */}
          <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">Recent Customer Orders</h2>
                <p className="text-xs text-slate-500">Live order queue synced with manufacturing floor</p>
              </div>
              <Link
                href="/admin/orders"
                className="text-xs font-bold text-indigo-700 hover:text-indigo-900 flex items-center gap-1"
              >
                <span>Manage All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-slate-400 border-b border-slate-100 pb-2">
                    <th className="py-2.5 font-bold">Order ID</th>
                    <th className="py-2.5 font-bold">Customer</th>
                    <th className="py-2.5 font-bold">Slot</th>
                    <th className="py-2.5 font-bold">Total</th>
                    <th className="py-2.5 font-bold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentOrders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 font-mono font-bold text-indigo-950">
                        <Link href="/admin/orders" className="hover:underline">
                          {ord.orderNumber}
                        </Link>
                      </td>
                      <td className="py-3 font-medium text-slate-800">{ord.customer.fullName}</td>
                      <td className="py-3 text-slate-500">{ord.deliveryDate}</td>
                      <td className="py-3 font-bold text-slate-900">{BRAND.currency}{ord.total}</td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          ord.fulfillmentStatus === 'Printing'
                            ? 'bg-indigo-50 text-indigo-700'
                            : ord.fulfillmentStatus === 'Delivered'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-amber-50 text-amber-700'
                        }`}>
                          {ord.fulfillmentStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right: Quotations Awaiting Review */}
          <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">Pending RFQs</h2>
                <p className="text-xs text-slate-500">Custom 3D model submissions</p>
              </div>
              <Link
                href="/admin/quotations"
                className="text-xs font-bold text-indigo-700 hover:text-indigo-900 flex items-center gap-1"
              >
                <span>View</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-3">
              {recentQuotations.map((q) => (
                <div key={q.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                  <div className="flex justify-between items-start">
                    <span className="font-mono font-bold text-slate-900">{q.requestNumber}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      q.status === 'Quotation Ready' ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-800'
                    }`}>
                      {q.status}
                    </span>
                  </div>
                  <div className="text-slate-600 truncate">File: {q.fileInfo.fileName}</div>
                  <div className="flex justify-between items-center text-[11px] pt-1 border-t border-slate-200">
                    <span className="text-slate-500">{q.preferences.material} • Qty {q.preferences.quantity}</span>
                    <Link href="/admin/quotations" className="font-bold text-[#1c0b60] hover:underline">
                      Review Model →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
