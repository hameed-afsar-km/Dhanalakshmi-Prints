'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  ShoppingBag,
  Trash2,
  ArrowRight,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  FileCheck,
  ArrowLeft,
} from 'lucide-react';
import { useStore } from '@/lib/store';
import { calculateOrderSummary } from '@/lib/pricing';
import { BRAND } from '@/lib/constants';
import { getCustomizeHref } from '@/lib/catalog';

export default function CartPage() {
  const router = useRouter();
  const { cart, products, updateCartQuantity, removeFromCart, deliverySettings } = useStore();

  const summary = calculateOrderSummary(
    cart.map((item) => ({ unitPrice: item.unitPrice, quantity: item.quantity })),
    deliverySettings.defaultDeliveryFee,
    deliverySettings.freeDeliveryThreshold
  );

  return (
    <div className="w-full min-h-screen bg-slate-50/60 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6">
          <Link href="/" className="hover:text-slate-900">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/catalogue" className="hover:text-slate-900">Shop Catalog</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-900 font-semibold">Shopping Cart</span>
        </nav>

        <h1 className="text-3xl font-extrabold text-slate-900 mb-8 flex items-center gap-3">
          <ShoppingBag className="w-8 h-8 text-[#1c0b60]" />
          <span>Your Shopping Cart ({cart.length} {cart.length === 1 ? 'item' : 'items'})</span>
        </h1>

        {cart.length === 0 ? (
          /* Empty Cart State */
          <div className="bg-white p-12 sm:p-16 rounded-3xl border border-slate-200/90 shadow-sm text-center max-w-xl mx-auto space-y-5 animate-in zoom-in-95">
            <div className="w-20 h-20 rounded-3xl bg-indigo-50 text-indigo-900 flex items-center justify-center mx-auto border border-indigo-100">
              <ShoppingBag className="w-10 h-10" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Your cart is currently empty</h2>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Discover our ready-to-personalize 3D printed keychains, desk plaques, and travel accessories.
              </p>
            </div>
            <div className="pt-2">
              <Link
                href="/catalogue"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white bg-[#1c0b60] hover:bg-[#28137e] transition-colors shadow-md text-xs"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Explore 3D Products</span>
              </Link>
            </div>
          </div>
        ) : (
          /* Cart Items & Order Summary 2-Col Layout */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* LEFT: Cart Items List */}
            <div className="lg:col-span-8 space-y-4">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col sm:flex-row gap-5 items-start justify-between transition-all"
                >
                  <div className="flex gap-4 items-start w-full sm:w-auto">
                    {/* Thumbnail */}
                    <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-200">
                      <Image
                        src={item.imageUrl}
                        alt={item.productName}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 space-y-2">
                      <h3 className="text-base font-bold text-slate-900">{item.productName}</h3>

                      {/* Customized Attributes Pill Breakdown */}
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        {item.customization.text && (
                          <span className="font-mono font-bold text-indigo-950 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                            &quot;{item.customization.text}&quot;
                          </span>
                        )}

                        {item.customization.bodyColor && (
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px]">
                            <span
                              className="w-3 h-3 rounded-full border border-slate-300"
                              style={{ backgroundColor: item.customization.bodyColor }}
                            />
                            Body
                          </span>
                        )}

                        {item.customization.textColor && (
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px]">
                            <span
                              className="w-3 h-3 rounded-full border border-slate-300"
                              style={{ backgroundColor: item.customization.textColor }}
                            />
                            Text
                          </span>
                        )}

                        {item.customization.material && (
                          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px] font-medium">
                            {item.customization.material}
                          </span>
                        )}

                        {item.customization.font && (
                          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px]">
                            {item.customization.font}
                          </span>
                        )}
                      </div>

                      {/* Unit Price Info */}
                      <div className="text-xs text-slate-500 pt-1">
                        Unit Price: <span className="font-bold text-slate-800">{BRAND.currency}{item.unitPrice}</span>
                      </div>
                    </div>
                  </div>

                  {/* Quantity & Line Total & Actions */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto pt-4 sm:pt-0 border-t sm:border-t-0 border-slate-100 gap-4">
                    <div className="text-right">
                      <div className="text-lg font-extrabold text-[#1c0b60]">
                        {BRAND.currency}{item.unitPrice * item.quantity}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {item.quantity} × {BRAND.currency}{item.unitPrice}
                      </div>
                    </div>

                    {/* Quantity Selector */}
                    <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200">
                      <button
                        onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                        className="w-6 h-6 flex items-center justify-center bg-white rounded-lg text-slate-700 hover:bg-slate-200 text-xs font-bold"
                      >
                        -
                      </button>
                      <span className="text-xs font-bold text-slate-900 w-5 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                        className="w-6 h-6 flex items-center justify-center bg-white rounded-lg text-slate-700 hover:bg-slate-200 text-xs font-bold"
                      >
                        +
                      </button>
                    </div>

                    {/* Actions: Edit & Remove */}
                    <div className="flex items-center gap-3">
                      <Link
                        href={(() => {
                          const product = products.find((candidate) => candidate.id === item.productId);
                          return product ? getCustomizeHref(product) : '/catalogue';
                        })()}
                        className="text-xs text-indigo-700 hover:text-indigo-900 font-semibold"
                      >
                        Edit
                      </Link>
                      <span className="text-slate-300">|</span>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              <div className="pt-2 flex justify-between items-center">
                <Link
                  href="/catalogue"
                  className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Continue Shopping</span>
                </Link>
              </div>
            </div>

            {/* RIGHT: Order Summary Card */}
            <div className="lg:col-span-4 space-y-4">
              <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/90 shadow-md space-y-5">
                <h2 className="text-lg font-bold text-slate-900">Order Summary</h2>

                <div className="space-y-3 text-xs border-b border-slate-100 pb-4">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal:</span>
                    <span className="font-semibold text-slate-900">{BRAND.currency}{summary.subtotal}</span>
                  </div>

                  <div className="flex justify-between text-slate-600">
                    <span>Delivery Slot Fee:</span>
                    {summary.deliveryFee === 0 ? (
                      <span className="font-bold text-emerald-600">FREE</span>
                    ) : (
                      <span className="font-semibold text-slate-900">{BRAND.currency}{summary.deliveryFee}</span>
                    )}
                  </div>

                  {summary.deliveryFee > 0 && (
                    <p className="text-[11px] text-slate-400">
                      Add {BRAND.currency}{deliverySettings.freeDeliveryThreshold - summary.subtotal} more to qualify for Free Delivery!
                    </p>
                  )}
                </div>

                <div className="flex justify-between items-baseline pt-1">
                  <span className="text-sm font-bold text-slate-900">Estimated Total:</span>
                  <span className="text-2xl font-extrabold text-[#1c0b60]">
                    {BRAND.currency}{summary.total}
                  </span>
                </div>

                {/* Main Actions */}
                <div className="space-y-2.5 pt-2">
                  <Link
                    href="/checkout"
                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-white bg-[#1c0b60] hover:bg-[#28137e] transition-all shadow-md shadow-indigo-950/15 text-sm"
                  >
                    <span>Proceed to Checkout</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <Link
                    href="/design-summary"
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors text-xs"
                  >
                    <FileCheck className="w-4 h-4 text-indigo-700" />
                    <span>View Design Summary</span>
                  </Link>
                </div>

                {/* Assurance badge */}
                <div className="pt-3 border-t border-slate-100 flex items-center gap-2 text-[11px] text-slate-500">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Quality checked prior to dispatch. 100% satisfaction guarantee.</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
