'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import {
  Package,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  ChevronRight,
  ArrowLeft,
  Truck,
  Sparkles,
  Layers,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';
import { useStore } from '@/lib/store';
import { OrderFulfillmentStatus } from '@/types';
import { BRAND } from '@/lib/constants';

const STATUS_STEPS: OrderFulfillmentStatus[] = [
  'Pending',
  'Confirmed',
  'Printing',
  'Ready',
  'Out for Delivery',
  'Delivered',
];

export default function OrderDetailPage() {
  const routeParams = useParams();
  const id = (routeParams?.id as string) || 'order-101';
  const { orders } = useStore();

  const order = orders.find((o) => o.id === id) || orders[0];

  if (!order) {
    return (
      <div className="w-full min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-xl font-bold text-slate-900">Order not found</h2>
        <Link href="/orders" className="mt-4 px-6 py-2.5 rounded-xl font-bold text-xs text-white bg-[#1c0b60]">
          View All Orders
        </Link>
      </div>
    );
  }

  const currentStepIndex = STATUS_STEPS.indexOf(order.fulfillmentStatus);

  return (
    <div className="w-full min-h-screen bg-slate-50/60 py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Navigation Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-slate-500">
          <Link href="/" className="hover:text-slate-900">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/orders" className="hover:text-slate-900">My Orders</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-900 font-semibold">{order.orderNumber}</span>
        </nav>

        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Order #{order.orderNumber}
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Placed on {new Date(order.createdAt).toLocaleString()} • {order.paymentMethod} ({order.paymentStatus})
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-3 py-1.5 rounded-xl border bg-indigo-50 border-indigo-200 text-indigo-900">
              Status: {order.fulfillmentStatus}
            </span>
          </div>
        </div>

        {/* Real-time Order Fulfillment Progress Tracker Timeline */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-6">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Truck className="w-4 h-4 text-indigo-700" />
            <span>Fulfillment & 3D Fabrication Timeline</span>
          </h2>

          <div className="relative">
            {/* Horizontal progress bar line on desktop */}
            <div className="hidden sm:block absolute top-1/2 left-4 right-4 -translate-y-1/2 h-1 bg-slate-100 -z-0" />
            <div
              className="hidden sm:block absolute top-1/2 left-4 -translate-y-1/2 h-1 bg-emerald-500 transition-all duration-500 -z-0"
              style={{
                width: `${Math.max(0, (currentStepIndex / (STATUS_STEPS.length - 1)) * 95)}%`,
              }}
            />

            {/* Steps Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-4 relative z-10">
              {STATUS_STEPS.map((step, idx) => {
                const isPassed = idx <= currentStepIndex;
                const isCurrent = idx === currentStepIndex;

                return (
                  <div key={step} className="flex flex-col items-center text-center space-y-2">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                        isPassed
                          ? isCurrent
                            ? 'bg-[#1c0b60] text-white ring-4 ring-indigo-100 shadow-md animate-bounce'
                            : 'bg-emerald-600 text-white'
                          : 'bg-slate-100 text-slate-400 border border-slate-200'
                      }`}
                    >
                      {isPassed ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                    </div>
                    <span
                      className={`text-[11px] font-semibold leading-tight ${
                        isCurrent
                          ? 'text-[#1c0b60] font-bold'
                          : isPassed
                          ? 'text-slate-900'
                          : 'text-slate-400'
                      }`}
                    >
                      {step}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Status Notes History Log */}
          {order.statusHistory && order.statusHistory.length > 0 && (
            <div className="pt-4 border-t border-slate-100 space-y-2 text-xs">
              <span className="font-bold text-slate-700 block text-[11px] uppercase tracking-wider">
                Production Floor Updates:
              </span>
              <div className="space-y-1.5">
                {order.statusHistory.map((hist, i) => (
                  <div key={i} className="flex items-start gap-2 text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
                    <span className="font-bold text-indigo-900">{hist.status}:</span>
                    <span className="flex-1">{hist.note || 'Status updated'}</span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(hist.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 2-Col Grid: Ordered Products & Delivery Address */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Left: Ordered Items */}
          <div className="md:col-span-7 bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-3">
              Customized Items ({order.items.length})
            </h3>

            <div className="space-y-4">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex gap-4 p-3 rounded-2xl bg-slate-50/70 border border-slate-200/80">
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-white flex-shrink-0 border border-slate-200">
                    <Image src={item.imageUrl} alt={item.productName} fill className="object-cover" />
                  </div>
                  <div className="flex-1 space-y-1 text-xs">
                    <h4 className="font-bold text-slate-900">{item.productName}</h4>
                    {item.customization.text && (
                      <div className="font-mono font-bold text-indigo-950 bg-white px-2 py-0.5 rounded border border-slate-200 inline-block text-[11px]">
                        &quot;{item.customization.text}&quot;
                      </div>
                    )}
                    <div className="flex flex-wrap gap-2 text-[10px] text-slate-500 pt-0.5">
                      <span>Body: {item.customization.bodyColor}</span>
                      <span>•</span>
                      <span>Text: {item.customization.textColor}</span>
                      <span>•</span>
                      <span>Material: {item.customization.material || 'PLA'}</span>
                    </div>
                  </div>
                  <div className="text-right text-xs">
                    <span className="font-bold text-slate-900 block">{BRAND.currency}{item.unitPrice * item.quantity}</span>
                    <span className="text-[10px] text-slate-400">{item.quantity} × {BRAND.currency}{item.unitPrice}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-100 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal:</span>
                <span>{BRAND.currency}{order.subtotal}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Delivery:</span>
                <span>{order.deliveryFee === 0 ? 'FREE' : `${BRAND.currency}${order.deliveryFee}`}</span>
              </div>
              <div className="flex justify-between items-baseline pt-2 border-t border-slate-100">
                <span className="font-bold text-slate-900">Total:</span>
                <span className="text-xl font-extrabold text-[#1c0b60]">{BRAND.currency}{order.total}</span>
              </div>
            </div>
          </div>

          {/* Right: Shipping & Delivery Info */}
          <div className="md:col-span-5 bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-4 text-xs">
            <h3 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-3">
              Delivery Schedule & Address
            </h3>

            <div className="space-y-3">
              <div>
                <span className="text-slate-400 block text-[11px]">Selected Delivery Window:</span>
                <span className="font-bold text-indigo-950 text-sm">{order.deliverySlot}</span>
                <span className="text-slate-600 block">{order.deliveryDate}</span>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <span className="text-slate-400 block text-[11px]">Recipient Details:</span>
                <span className="font-bold text-slate-900">{order.customer.fullName}</span>
                <p className="text-slate-600 mt-0.5 leading-relaxed">
                  {order.customer.address}, {order.customer.city} - {order.customer.postalCode}
                </p>
                <p className="text-slate-500 mt-1">Phone: {order.customer.phone}</p>
                <p className="text-slate-500">Email: {order.customer.email}</p>
              </div>

              {order.customer.deliveryNotes && (
                <div className="pt-2 border-t border-slate-100">
                  <span className="text-slate-400 block text-[11px]">Delivery Note:</span>
                  <p className="text-slate-700 italic mt-0.5">&quot;{order.customer.deliveryNotes}&quot;</p>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-100">
              <Link
                href="/orders"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to All Orders</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
