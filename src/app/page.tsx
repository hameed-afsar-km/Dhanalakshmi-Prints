'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Sparkles,
  UploadCloud,
  Layers,
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCw,
  Sliders,
  ChevronDown,
  CheckCircle2,
  Box,
  Palette,
} from 'lucide-react';
import Hero3DScene from '@/components/3d/Hero3DScene';
import { useStore } from '@/lib/store';
import { BRAND } from '@/lib/constants';

export default function HomePage() {
  const { products } = useStore();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const featuredProducts = products.filter((p) => p.isPublished).slice(0, 4);

  const faqs = [
    {
      q: 'What 3D file formats can I upload for custom printing?',
      a: 'We support standard 3D CAD mesh formats including STL, OBJ, and 3MF files up to 50MB. Our online viewer automatically analyzes the geometry, calculates bounding dimensions in millimeters, and lets you choose filament material and color.',
    },
    {
      q: 'How does live 3D product customization work?',
      a: 'When you select any customizable product (like our popular number-plate keychain or desk nameplate), our interactive 3D studio generates your personalized embossed lettering and selected colors in real-time right inside your browser before you place the order.',
    },
    {
      q: 'What materials and filaments do you print with?',
      a: 'We maintain a calibrated fleet of industrial FDM and SLA resin printers using premium polymers: Standard Tough PLA, High-Gloss Silk PLA, Impact-Resistant PETG, Ultra-Rigid Carbon-Fiber composites, and Micron-Precision Resin.',
    },
    {
      q: 'Can I choose my preferred delivery date and time slot?',
      a: 'Yes! During checkout, you can choose from predefined daily slots (e.g., 9 AM – 12 PM, 12 PM – 3 PM, 3 PM – 6 PM, 6 PM – 9 PM) to ensure your package arrives exactly when you are available.',
    },
    {
      q: 'What payment methods are supported?',
      a: 'We support Cash on Delivery (COD) as well as simulated instant online card/UPI payments for this demonstration platform.',
    },
  ];

  return (
    <div className="flex flex-col w-full min-h-screen">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white via-indigo-50/20 to-slate-50/50 pt-10 pb-20 lg:pt-16 lg:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column: Headline and CTAs */}
            <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200/80 shadow-xs text-xs font-semibold text-indigo-900">
                <span className="w-2 h-2 rounded-full bg-[#1c0b60]" />
                Next-Gen 3D Digital Fabrication Studio
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.12]">
                Your Ideas. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1c0b60] via-[#e71e64] to-[#019c87]">
                  Made Real in 3D.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Design custom personalized keychains, desk plaques, and accessories with instant 3D preview. Or upload your own 3D models for precision rapid manufacturing.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  href="/shop"
                  className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl font-semibold text-white bg-[#1c0b60] hover:bg-[#2a138e] shadow-lg shadow-indigo-950/20 hover:shadow-indigo-950/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Explore Products</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/custom-printing"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200/90 shadow-sm hover:border-slate-300 transition-all"
                >
                  <UploadCloud className="w-4 h-4 text-indigo-700" />
                  <span>Upload Your 3D Model</span>
                </Link>
              </div>

              {/* Social Proof & Features */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-200/80">
                <div>
                  <div className="text-2xl font-bold text-slate-900">0.05 mm</div>
                  <div className="text-xs text-slate-500 font-medium">Layer Accuracy</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900">100% Realtime</div>
                  <div className="text-xs text-slate-500 font-medium">3D Preview Engine</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-900">Same-Day</div>
                  <div className="text-xs text-slate-500 font-medium">Production Dispatch</div>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive 3D Hero Scene */}
            <div className="lg:col-span-6 w-full">
              <Hero3DScene />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Featured Products Section */}
      <section className="py-20 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-xs font-bold text-indigo-700 uppercase tracking-widest">
                Curated Collection
              </span>
              <h2 className="text-3xl font-bold text-slate-900 mt-1">
                Featured Personalized Products
              </h2>
              <p className="text-sm text-slate-500 mt-1.5 max-w-xl">
                Ready-to-personalize designs crafted with durable industrial polymers and precision raised typography.
              </p>
            </div>
            <Link
              href="/shop"
              className="mt-4 md:mt-0 inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-900 hover:text-indigo-700 transition-colors"
            >
              <span>View All Products</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <div
                key={product.id}
                className="group flex flex-col rounded-2xl border border-slate-200/90 bg-white overflow-hidden shadow-xs hover:shadow-xl hover:border-indigo-200 transition-all duration-300"
              >
                {/* Product Image / 3D Tag */}
                <div className="relative aspect-[4/3] w-full bg-slate-100 overflow-hidden">
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-md text-[11px] font-bold text-indigo-900 border border-slate-200/60 shadow-xs flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    3D Customizer
                  </div>
                  <div className="absolute bottom-3 right-3 bg-slate-900/80 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] font-medium text-white">
                    {product.category}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col flex-1 justify-between">
                  <div>
                    <h3 className="font-bold text-base text-slate-900 group-hover:text-indigo-900 transition-colors line-clamp-1">
                      {product.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
                      {product.shortDescription}
                    </p>
                  </div>

                  <div className="pt-5 mt-4 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-slate-400 block">Starting at</span>
                      <span className="text-lg font-extrabold text-slate-900">
                        {BRAND.currency}{product.startingPrice}
                      </span>
                    </div>

                    <Link
                      href={`/customize/${product.id}`}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-[#1c0b60] hover:bg-[#28137e] shadow-sm transition-colors"
                    >
                      <span>Customize</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. "Customize in 3D" Feature Showcase */}
      <section className="py-20 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-xs font-bold text-amber-900">
                <Sliders className="w-3.5 h-3.5 text-amber-600" />
                Browser-Native 3D Configurator
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight">
                Inspect Every Angle. <br />
                Personalize with Confidence.
              </h2>

              <p className="text-base text-slate-600 leading-relaxed">
                No more guessing how your custom item will turn out. Our interactive 3D configurator lets you rotate, zoom, change plate and typography colors, choose fonts, and watch real-time embossed geometries update instantaneously.
              </p>

              <div className="space-y-3.5 pt-2">
                <div className="flex items-start gap-3">
                  <div className="p-1 rounded-md bg-emerald-100 text-emerald-800 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900">Live Embossed Text Generation</h4>
                    <p className="text-xs text-slate-500">Real geometry mapping that updates as you type your name or vehicle plate.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-1 rounded-md bg-emerald-100 text-emerald-800 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900">Official Multi-Tone Filament Palette</h4>
                    <p className="text-xs text-slate-500">Pick from Royal Indigo, Velvet Wine, Cyber Teal, and Lustrous Gold filaments.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-1 rounded-md bg-emerald-100 text-emerald-800 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900">Deterministic Transparent Pricing</h4>
                    <p className="text-xs text-slate-500">Instant price updates as you add accessories, materials, or custom text.</p>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/customize/prod-1"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white bg-[#1c0b60] hover:bg-[#28137e] transition-all shadow-md shadow-indigo-950/15"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Launch 3D Customizer Now</span>
                </Link>
              </div>
            </div>

            {/* Visual Feature Card */}
            <div className="relative p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-xl overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl -z-10" />
              <div className="flex items-center justify-between pb-6 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#1c0b60] text-white flex items-center justify-center font-bold text-sm">
                    3D
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Vehicle Number-Plate Keychain</h4>
                    <p className="text-xs text-slate-500">Active Live Configuration</p>
                  </div>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Ready to Print
                </span>
              </div>

              <div className="py-6 space-y-4">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-600">Sample Text</span>
                  <span className="text-xs font-mono font-bold text-indigo-900 bg-white px-2 py-1 rounded border border-slate-200">
                    TN 09 DP 2026
                  </span>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-600">Material & Finish</span>
                  <span className="text-xs font-semibold text-slate-900">Silk PLA (Metallic Sheen)</span>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-600">Calculated Price</span>
                  <span className="text-sm font-extrabold text-[#1c0b60]">{BRAND.currency}268</span>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/customize/prod-1"
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-white bg-[#e71e64] hover:bg-[#d61858] transition-colors shadow-sm"
                >
                  Try Interactive Demo
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Custom Printing Workflow */}
      <section className="py-20 bg-[#0d1e3e] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
              Have Your Own 3D CAD File?
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-1">
              Custom Rapid 3D Printing Service
            </h2>
            <p className="text-sm text-slate-300 mt-2">
              From college engineering prototypes to custom mechanical replacement parts, upload your 3D model and receive an official quotation in minutes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-indigo-950/40 border border-indigo-800/40 space-y-4">
              <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-base">
                1
              </div>
              <h3 className="font-bold text-base text-white">Upload 3D File</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Drag and drop STL, OBJ, or 3MF files into our browser viewer. Inspect dimensions and triangle counts automatically.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-indigo-950/40 border border-indigo-800/40 space-y-4">
              <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-base">
                2
              </div>
              <h3 className="font-bold text-base text-white">Select Preferences</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Choose quantity, filament material (PLA, PETG, Resin, Carbon-Fiber), scaling percentage, and optional infill density.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-indigo-950/40 border border-indigo-800/40 space-y-4">
              <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-base">
                3
              </div>
              <h3 className="font-bold text-base text-white">Review Quotation</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Our print engineers calculate print time and published quotation price with estimated lead days.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-indigo-950/40 border border-indigo-800/40 space-y-4">
              <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-base">
                4
              </div>
              <h3 className="font-bold text-base text-white">Confirm & Dispatch</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Accept quote with 1-click, choose your preferred delivery time slot, and track real-time fulfillment progress.
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link
              href="/custom-printing"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 transition-colors shadow-lg"
            >
              <UploadCloud className="w-5 h-5" />
              <span>Go to Custom 3D Model Upload</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 5. FAQ Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-bold text-indigo-700 uppercase tracking-widest">
              Answers & Information
            </span>
            <h2 className="text-3xl font-bold text-slate-900 mt-1">
              Frequently Asked Questions
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Everything you need to know about our custom 3D printing process and orders.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-slate-200 overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-5 text-left bg-slate-50/50 hover:bg-slate-50 transition-colors"
                >
                  <span className="text-sm font-semibold text-slate-900">{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-500 transition-transform ${openFaq === idx ? 'rotate-180 text-indigo-900' : ''}`}
                  />
                </button>
                {openFaq === idx && (
                  <div className="p-5 pt-0 bg-white text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Final CTA Section */}
      <section className="py-16 bg-gradient-to-r from-[#1c0b60] via-[#0d1e3e] to-[#1c0b60] text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Ready to bring your 3D idea to life?
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto">
            Choose from our bespoke ready-to-personalize collection or send us your custom CAD file for an instant quotation.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              href="/shop"
              className="px-7 py-3 rounded-xl font-semibold text-slate-950 bg-[#fed003] hover:bg-amber-300 transition-colors shadow-lg"
            >
              Explore Catalog
            </Link>
            <Link
              href="/custom-printing"
              className="px-7 py-3 rounded-xl font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/20 transition-colors backdrop-blur-sm"
            >
              Upload Custom 3D Model
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
