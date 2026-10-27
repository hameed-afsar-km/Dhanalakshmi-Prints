'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  FileCheck,
  ArrowRight,
  ArrowLeft,
  Edit3,
  ShoppingBag,
  Sparkles,
  Layers,
  ShieldCheck,
  Box,
  Palette,
} from 'lucide-react';
import { useStore } from '@/lib/store';
import { calculateCustomizedPrice, calculateOrderSummary } from '@/lib/pricing';
import ProductViewer3D from '@/components/3d/ProductViewer3D';
import { Product, SavedCustomization, CartItem } from '@/types';
import { BRAND } from '@/lib/constants';

export default function DesignSummaryPage() {
  const router = useRouter();
  const { cart, products, deliverySettings } = useStore();

  const [activeItem, setActiveItem] = useState<CartItem | null>(null);
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);

  useEffect(() => {
    // If cart has items, pick the first item or session-selected item
    if (cart.length > 0) {
      const selected = cart[0];
      setActiveItem(selected);
      const prod = products.find((p) => p.id === selected.productId);
      if (prod) setActiveProduct(prod);
    } else {
      // Check if session preview exists
      if (typeof window !== 'undefined') {
        const previewProdId = sessionStorage.getItem('dp_preview_product_id');
        const previewCustStr = sessionStorage.getItem('dp_preview_customization');
        if (previewProdId && previewCustStr) {
          const prod = products.find((p) => p.id === previewProdId);
          if (prod) {
            const cust: SavedCustomization = JSON.parse(previewCustStr);
            const breakdown = calculateCustomizedPrice(prod, cust, 1);
            setActiveProduct(prod);
            setActiveItem({
              id: 'preview-session',
              productId: prod.id,
              productName: prod.name,
              modelType: prod.modelType,
              imageUrl: prod.imageUrl,
              unitPrice: breakdown.unitTotal,
              quantity: 1,
              customization: cust,
              calculatedPriceBreakdown: {
                basePrice: breakdown.basePrice,
                personalizationFee: breakdown.personalizationFee,
                materialSurcharge: breakdown.materialSurcharge,
                sizeSurcharge: breakdown.sizeSurcharge,
                accessoriesFee: breakdown.accessoriesFee,
                unitTotal: breakdown.unitTotal,
              },
            });
          }
        }
      }
    }
  }, [cart, products]);

  const summary = calculateOrderSummary(
    activeItem ? [{ unitPrice: activeItem.unitPrice, quantity: activeItem.quantity }] : [],
    deliverySettings.defaultDeliveryFee,
    deliverySettings.freeDeliveryThreshold
  );

  if (!activeItem || !activeProduct) {
    return (
      <div className="w-full min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-900 flex items-center justify-center mb-4">
          <FileCheck className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">No active design to summarize</h2>
        <p className="text-xs text-slate-500 mt-1 max-w-sm">
          Please customize a product first or add an item to your cart.
        </p>
        <Link
          href="/shop"
          className="mt-5 px-6 py-2.5 rounded-xl font-bold text-xs text-white bg-[#1c0b60]"
        >
          Explore Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-slate-50/70 py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              Pre-Checkout Verification
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900">Your Design Summary</h1>
            <p className="text-xs text-slate-500 mt-1">
              Review your customized physical specifications and pricing breakdown before placing the order.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={`/customize/${activeProduct.id}`}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 transition-colors shadow-xs"
            >
              <Edit3 className="w-3.5 h-3.5 text-indigo-700" />
              <span>Edit Customization</span>
            </Link>
            <Link
              href="/cart"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 transition-colors shadow-xs"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Return to Cart</span>
            </Link>
          </div>
        </div>

        {/* 2-Column Design Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Interactive 3D Model Rendering */}
          <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200/90 shadow-md space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-bold text-indigo-900 uppercase tracking-wider">
                Interactive 3D Geometry Verification
              </span>
              <span className="text-[11px] font-medium text-slate-400">Drag to inspect</span>
            </div>

            <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-inner">
              <ProductViewer3D
                product={activeProduct}
                customization={activeItem.customization}
              />
            </div>

            <div className="grid grid-cols-3 gap-3 pt-2 text-center text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-400 block text-[10px]">Model Type</span>
                <span className="font-bold text-slate-800 capitalize">{activeProduct.modelType.replace('-', ' ')}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-400 block text-[10px]">Filament</span>
                <span className="font-bold text-indigo-900">{activeItem.customization.material || 'PLA'}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-400 block text-[10px]">Print Resolution</span>
                <span className="font-bold text-emerald-700">0.12 mm Ultra-Fine</span>
              </div>
            </div>
          </div>

          {/* Right: Detailed Specification Table & Actions */}
          <div className="lg:col-span-5 space-y-5">
            <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/90 shadow-md space-y-5">
              <div>
                <h3 className="text-lg font-bold text-slate-900">{activeItem.productName}</h3>
                <p className="text-xs text-slate-500 mt-0.5">Manufacturing Specification Sheet</p>
              </div>

              {/* Specifications List */}
              <div className="space-y-3 text-xs border-y border-slate-100 py-4">
                {activeItem.customization.text && (
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Personalized Lettering:</span>
                    <span className="font-mono font-bold text-sm text-indigo-950 bg-indigo-50 px-2.5 py-0.5 rounded border border-indigo-200">
                      {activeItem.customization.text}
                    </span>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Body Filament Color:</span>
                  <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-slate-300"
                      style={{ backgroundColor: activeItem.customization.bodyColor }}
                    />
                    <span>{activeItem.customization.bodyColor}</span>
                  </div>
                </div>

                {activeItem.customization.textColor && (
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Raised Text Color:</span>
                    <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-slate-300"
                        style={{ backgroundColor: activeItem.customization.textColor }}
                      />
                      <span>{activeItem.customization.textColor}</span>
                    </div>
                  </div>
                )}

                {activeItem.customization.font && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Typography Style:</span>
                    <span className="font-bold text-slate-800">{activeItem.customization.font}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-slate-500">Order Quantity:</span>
                  <span className="font-bold text-slate-800">{activeItem.quantity} unit(s)</span>
                </div>
              </div>

              {/* Price Itemization Breakdown */}
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-slate-500">
                  <span>Base Product Price:</span>
                  <span>{BRAND.currency}{activeItem.calculatedPriceBreakdown.basePrice}</span>
                </div>
                {activeItem.calculatedPriceBreakdown.personalizationFee > 0 && (
                  <div className="flex justify-between text-slate-500">
                    <span>3D Raised Text Surcharge:</span>
                    <span>+{BRAND.currency}{activeItem.calculatedPriceBreakdown.personalizationFee}</span>
                  </div>
                )}
                {activeItem.calculatedPriceBreakdown.materialSurcharge > 0 && (
                  <div className="flex justify-between text-slate-500">
                    <span>Specialty Polymer Surcharge:</span>
                    <span>+{BRAND.currency}{activeItem.calculatedPriceBreakdown.materialSurcharge}</span>
                  </div>
                )}
                {activeItem.calculatedPriceBreakdown.accessoriesFee > 0 && (
                  <div className="flex justify-between text-slate-500">
                    <span>Hardware Attachments:</span>
                    <span>+{BRAND.currency}{activeItem.calculatedPriceBreakdown.accessoriesFee}</span>
                  </div>
                )}

                <div className="pt-3 border-t border-slate-100 flex justify-between items-baseline">
                  <span className="text-sm font-bold text-slate-900">Item Line Total:</span>
                  <span className="text-2xl font-extrabold text-[#1c0b60]">
                    {BRAND.currency}{activeItem.unitPrice * activeItem.quantity}
                  </span>
                </div>
              </div>

              {/* Primary Checkout CTA */}
              <div className="pt-2">
                <Link
                  href="/checkout"
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-white bg-[#1c0b60] hover:bg-[#28137e] transition-all shadow-md shadow-indigo-950/15 text-sm"
                >
                  <span>Approve Design & Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
