'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import {
  FileCheck,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
  ChevronRight,
  Layers,
  Box,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import ModelUploadViewer3D from '@/components/3d/ModelUploadViewer3D';
import { useStore } from '@/lib/store';
import { BRAND } from '@/lib/constants';

export default function QuotationDetailPage() {
  const router = useRouter();
  const routeParams = useParams();
  const id = (routeParams?.id as string) || 'quote-201';
  const { quotations, acceptQuotation, rejectQuotation, addToCart } = useStore();

  const quoteRequest = quotations.find((q) => q.id === id) || quotations[0];

  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  if (!quoteRequest) {
    return (
      <div className="w-full min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-xl font-bold text-slate-900">Quotation request not found</h2>
        <Link href="/custom-printing" className="mt-4 px-6 py-2.5 rounded-xl font-bold text-xs text-white bg-[#1c0b60]">
          Custom 3D Printing
        </Link>
      </div>
    );
  }

  const handleAccept = () => {
    acceptQuotation(quoteRequest.id);
    setActionFeedback('Quotation accepted! Transitioning to checkout...');

    // Add this custom quote item to cart
    if (quoteRequest.quote) {
      addToCart({
        id: `cart-quote-${quoteRequest.id}`,
        productId: 'custom-print',
        productName: `Custom 3D Print: ${quoteRequest.fileInfo.fileName}`,
        modelType: 'plate-keychain',
        imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=400&q=80',
        unitPrice: Math.round(quoteRequest.quote.quotedPrice / quoteRequest.preferences.quantity),
        quantity: quoteRequest.preferences.quantity,
        customization: {
          text: quoteRequest.fileInfo.fileName,
          material: quoteRequest.preferences.material,
          bodyColor: quoteRequest.preferences.color,
          notes: quoteRequest.preferences.notes,
        },
        calculatedPriceBreakdown: {
          basePrice: quoteRequest.quote.quotedPrice,
          personalizationFee: 0,
          materialSurcharge: 0,
          sizeSurcharge: 0,
          accessoriesFee: 0,
          unitTotal: Math.round(quoteRequest.quote.quotedPrice / quoteRequest.preferences.quantity),
        },
      });

      setTimeout(() => {
        router.push('/checkout');
      }, 800);
    }
  };

  const handleReject = () => {
    rejectQuotation(quoteRequest.id);
    setActionFeedback('Quotation declined.');
  };

  const isQuoteReady = quoteRequest.status === 'Quotation Ready' && quoteRequest.quote;

  return (
    <div className="w-full min-h-screen bg-slate-50/60 py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-slate-500">
          <Link href="/" className="hover:text-slate-900">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/custom-printing" className="hover:text-slate-900">Custom Printing</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-900 font-semibold">{quoteRequest.requestNumber}</span>
        </nav>

        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Quotation Request #{quoteRequest.requestNumber}
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              File: <span className="font-mono font-bold text-slate-800">{quoteRequest.fileInfo.fileName}</span> • Submitted on {new Date(quoteRequest.createdAt).toLocaleDateString()}
            </p>
          </div>

          <span className={`text-xs font-bold px-3 py-1.5 rounded-xl border ${
            quoteRequest.status === 'Quotation Ready'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-300 animate-pulse'
              : quoteRequest.status === 'Accepted'
              ? 'bg-blue-50 text-blue-800 border-blue-300'
              : quoteRequest.status === 'Rejected'
              ? 'bg-red-50 text-red-800 border-red-300'
              : 'bg-amber-50 text-amber-800 border-amber-300'
          }`}>
            Status: {quoteRequest.status}
          </span>
        </div>

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: 3D Model Rendering */}
          <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-bold text-indigo-900 uppercase tracking-wider">
                Submitted 3D CAD Geometry Viewer
              </span>
              <span className="text-[11px] font-medium text-slate-400">STL / OBJ Mesh</span>
            </div>

            <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-inner">
              <ModelUploadViewer3D
                fileFormat={quoteRequest.fileInfo.fileFormat}
                filamentColor={quoteRequest.preferences.color}
                materialType={quoteRequest.preferences.material}
              />
            </div>

            {/* Model Geometry Specifications */}
            <div className="grid grid-cols-3 gap-3 text-center text-xs pt-2">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-400 block text-[10px]">Dimensions</span>
                <span className="font-bold text-slate-800">
                  {quoteRequest.fileInfo.estimatedDimensionsMm
                    ? `${quoteRequest.fileInfo.estimatedDimensionsMm.x} × ${quoteRequest.fileInfo.estimatedDimensionsMm.y} × ${quoteRequest.fileInfo.estimatedDimensionsMm.z} mm`
                    : '120 × 45 × 28 mm'}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-400 block text-[10px]">Triangle Count</span>
                <span className="font-bold text-slate-800">
                  {quoteRequest.fileInfo.triangleCount?.toLocaleString() || '28,400'} Triangles
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-400 block text-[10px]">File Size</span>
                <span className="font-bold text-indigo-900">{quoteRequest.fileInfo.fileSizeMb} MB</span>
              </div>
            </div>
          </div>

          {/* Right: Quotation Details & Decision Panel */}
          <div className="lg:col-span-5 space-y-5">
            {/* Owner Official Quote Card */}
            {isQuoteReady ? (
              <div className="bg-white p-6 sm:p-7 rounded-3xl border-2 border-emerald-500 shadow-xl space-y-5 animate-in zoom-in-95">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest">
                    Official Quotation Published
                  </span>
                  <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                    Ready for Acceptance
                  </span>
                </div>

                <div>
                  <span className="text-xs text-slate-500 block">Total Quoted Manufacturing Price:</span>
                  <div className="text-3xl font-extrabold text-[#1c0b60] mt-0.5">
                    {BRAND.currency}{quoteRequest.quote?.quotedPrice}
                  </div>
                  <span className="text-[11px] text-slate-500">
                    For {quoteRequest.preferences.quantity} unit(s) • ~{BRAND.currency}{Math.round((quoteRequest.quote?.quotedPrice || 0) / quoteRequest.preferences.quantity)} each
                  </span>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-2.5">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Estimated Lead Time:</span>
                    <span className="font-bold text-slate-800">{quoteRequest.quote?.estimatedLeadDays} business days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Quotation Valid Until:</span>
                    <span className="font-semibold text-slate-800">{quoteRequest.quote?.validUntilDate}</span>
                  </div>
                  {quoteRequest.quote?.ownerNotes && (
                    <div className="pt-2 border-t border-slate-200">
                      <span className="text-slate-400 block text-[10px]">Studio Engineer Notes:</span>
                      <p className="text-slate-700 italic mt-0.5 leading-relaxed">
                        &quot;{quoteRequest.quote.ownerNotes}&quot;
                      </p>
                    </div>
                  )}
                </div>

                {quoteRequest.status === 'Quotation Ready' && (
                  <div className="space-y-2 pt-2">
                    <button
                      onClick={handleAccept}
                      className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-md text-sm"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Accept Quotation & Proceed to Order</span>
                    </button>
                    <button
                      onClick={handleReject}
                      className="w-full py-2.5 rounded-xl font-semibold text-xs text-slate-500 hover:text-red-600 hover:bg-slate-50 transition-colors"
                    >
                      Decline Quotation
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Awaiting Review Status Card */
              <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Quotation Under Engineering Review</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Our additive manufacturing team is evaluating slicing parameters, filament density, and print durations. You will receive an official price quote here shortly.
                  </p>
                </div>
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs text-slate-600">
                  <span className="font-semibold text-slate-800 block mb-0.5">What happens next:</span>
                  We will email you as soon as your quotation is ready. You can also return to this page for the latest status.
                </div>
              </div>
            )}

            {/* Requested Preferences Summary */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-3 text-xs">
              <h3 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-2">
                Requested Specifications
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Filament Material:</span>
                  <span className="font-bold text-slate-800">{quoteRequest.preferences.material}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Filament Color:</span>
                  <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                    <span className="w-3.5 h-3.5 rounded-full border border-slate-300" style={{ backgroundColor: quoteRequest.preferences.color }} />
                    <span>{quoteRequest.preferences.color}</span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Quantity:</span>
                  <span className="font-bold text-slate-800">{quoteRequest.preferences.quantity} units</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Scaling:</span>
                  <span className="font-semibold text-slate-800">{quoteRequest.preferences.scalingPercentage}%</span>
                </div>
                {quoteRequest.preferences.infillPercentage && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Infill Density:</span>
                    <span className="font-semibold text-slate-800">{quoteRequest.preferences.infillPercentage}%</span>
                  </div>
                )}
                {quoteRequest.preferences.notes && (
                  <div className="pt-2 border-t border-slate-100">
                    <span className="text-slate-400 block text-[10px]">Customer Notes:</span>
                    <p className="text-slate-600 italic mt-0.5">&quot;{quoteRequest.preferences.notes}&quot;</p>
                  </div>
                )}
              </div>
            </div>

            {actionFeedback && (
              <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl text-xs font-semibold text-indigo-900 text-center animate-in fade-in">
                {actionFeedback}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
