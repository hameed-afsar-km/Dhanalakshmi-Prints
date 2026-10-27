'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Package, Clock, Calendar, ArrowRight, CheckCircle2, ChevronRight, ShoppingBag } from 'lucide-react';
import { useStore } from '@/lib/store';
import { BRAND } from '@/lib/constants';

export default function OrdersHistoryPage() {
  const { orders } = useStore();
  const [statusFilter, setStatusFilter] = useState<string>('All');

  const filteredOrders = orders.filter((o) => {
    if (statusFilter === 'All') return true;
    return o.fulfillmentStatus === statusFilter;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Delivered':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Printing':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200 animate-pulse';
      case 'Ready':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Confirmed':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Out for Delivery':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="w-full min-h-screen bg-slate-50/60 py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6">
          <Link href="/" className="hover:text-slate-900">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-900 font-semibold">My Orders</span>
        </nav>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900">Your Orders & Fabrication Tracking</h1>
            <p className="text-xs text-slate-500 mt-1">
              Live updates synced with Dhanalakshmi Prints workshop floor and dispatch status.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {['All', 'Pending', 'Confirmed', 'Printing', 'Ready', 'Delivered'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  statusFilter === st
                    ? 'bg-[#1c0b60] text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-4 max-w-md mx-auto">
            <Package className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">No orders found</h3>
            <p className="text-xs text-slate-500">You haven&apos;t placed any orders matching &quot;{statusFilter}&quot;.</p>
            <Link href="/shop" className="inline-block px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-[#1c0b60]">
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div className="space-y-0.5">
                    <span className="text-[11px] font-semibold text-slate-400">
                      Placed on {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-900 text-sm">{order.orderNumber}</span>
                      <span className="text-slate-300">•</span>
                      <span className="text-xs text-slate-600 font-medium">{order.customer.fullName}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full border ${getStatusBadge(order.fulfillmentStatus)}`}>
                      {order.fulfillmentStatus}
                    </span>
                    <span className="text-lg font-extrabold text-[#1c0b60]">
                      {BRAND.currency}{order.total}
                    </span>
                  </div>
                </div>

                {/* Items in order */}
                <div className="space-y-3">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4 text-xs">
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-200">
                        <Image src={item.imageUrl} alt={item.productName} fill className="object-cover" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-slate-900">{item.productName}</h4>
                        <div className="flex items-center gap-2 text-slate-500 text-[11px] mt-0.5">
                          {item.customization.text && (
                            <span className="font-mono font-bold text-indigo-900 bg-indigo-50 px-1.5 py-0.5 rounded">
                              &quot;{item.customization.text}&quot;
                            </span>
                          )}
                          <span>Qty: {item.quantity}</span>
                          <span>•</span>
                          <span>{item.customization.material || 'PLA'}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Delivery and View details CTA */}
                <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2 text-slate-500">
                    <Clock className="w-4 h-4 text-indigo-700" />
                    <span>Slot: <span className="font-semibold text-slate-800">{order.deliverySlot}</span> ({order.deliveryDate})</span>
                  </div>

                  <Link
                    href={`/orders/${order.id}`}
                    className="inline-flex items-center gap-1.5 font-bold text-[#1c0b60] hover:text-[#28137e]"
                  >
                    <span>View Timeline & Order Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
