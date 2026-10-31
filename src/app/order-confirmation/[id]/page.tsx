'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import {
  CheckCircle2,
  Package,
  Calendar,
  Clock,
  MapPin,
  ArrowRight,
  ShoppingBag,
  ShieldCheck,
  FileCheck,
} from 'lucide-react';
import { useStore } from '@/lib/store';
import { BRAND } from '@/lib/constants';

export default function OrderConfirmationPage() {
  const routeParams = useParams();
  const id = (routeParams?.id as string) || 'order-101';
  const { orders } = useStore();

  const order = orders.find((o) => o.id === id) || orders[0];

  if (!order) {
    return (
      <div className="w-full min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-xl font-bold text-slate-900">Order not found</h2>
        <Link href="/catalogue" className="mt-4 px-6 py-2.5 rounded-xl font-bold text-xs text-white bg-[#1c0b60]">
          Return to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-slate-50/70 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Celebration Banner Card */}
        <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/90 shadow-xl text-center space-y-4 animate-in zoom-in-95">
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200 mb-2">
              Order Confirmed & Queued for 3D Printing
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900">
              Thank you for your order, {order.customer.fullName}!
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Order reference: <span className="font-mono font-bold text-[#1c0b60]">{order.orderNumber}</span>
            </p>
          </div>

          <p className="text-xs text-slate-600 max-w-lg mx-auto leading-relaxed">
            A confirmation receipt has been simulated for <span className="font-semibold">{order.customer.email}</span>. Our 3D print technicians have received your custom CAD parameters.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
            <Link
              href={`/orders/${order.id}`}
              className="px-6 py-3 rounded-xl font-bold text-xs text-white bg-[#1c0b60] hover:bg-[#28137e] transition-colors shadow-md"
            >
              Track Live Order Timeline
            </Link>
            <Link
              href="/catalogue"
              className="px-6 py-3 rounded-xl font-bold text-xs text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>

        {/* 2-Col Details Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Delivery & Payment Info */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-4 text-xs">
            <h3 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <Package className="w-4 h-4 text-indigo-700" />
              <span>Delivery & Schedule Details</span>
            </h3>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Calendar className="w-4 h-4 text-slate-400 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-800 block">Target Delivery Date:</span>
                  <span className="text-slate-600">{order.deliveryDate}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-slate-400 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-800 block">Predefined Time Window:</span>
                  <span className="text-indigo-900 font-semibold">{order.deliverySlot}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-slate-400 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-800 block">Shipping Address:</span>
                  <span className="text-slate-600 leading-relaxed block">
                    {order.customer.address}, {order.customer.city} - {order.customer.postalCode}
                  </span>
                  <span className="text-slate-400 text-[11px]">Phone: {order.customer.phone}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex justify-between items-center">
                <span className="text-slate-500">Payment Status:</span>
                <span className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                  order.paymentStatus === 'Paid'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                }`}>
                  {order.paymentMethod} • {order.paymentStatus}
                </span>
              </div>
            </div>
          </div>

          {/* Ordered Custom Items Summary */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-4 text-xs">
            <h3 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-indigo-700" />
              <span>Fabricated Products ({order.items.length})</span>
            </h3>

            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex gap-3 pb-3 border-b border-slate-100 last:border-b-0">
                  <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-200">
                    <Image src={item.imageUrl} alt={item.productName} fill className="object-cover" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <h4 className="font-bold text-slate-900">{item.productName}</h4>
                    {item.customization.text && (
                      <span className="font-mono font-bold text-indigo-900 text-[11px] bg-indigo-50 px-2 py-0.5 rounded">
                        &quot;{item.customization.text}&quot;
                      </span>
                    )}
                    <div className="text-[10px] text-slate-500">
                      {item.quantity} × {BRAND.currency}{item.unitPrice}
                    </div>
                  </div>
                  <div className="font-bold text-slate-900">
                    {BRAND.currency}{item.unitPrice * item.quantity}
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
                <span className="font-bold text-slate-900">Paid Total:</span>
                <span className="text-xl font-extrabold text-[#1c0b60]">{BRAND.currency}{order.total}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
