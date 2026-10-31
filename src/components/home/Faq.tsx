'use client';

import { useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ChevronDown,
  HelpCircle,
  Mail,
  MessageCircle,
  Plus,
  Minus,
  Sparkles,
} from 'lucide-react';
import { BRAND } from '@/lib/constants';
import Reveal from '@/components/ui/Reveal';

interface FaqItem {
  id: string;
  category: 'Customizer' | 'Materials' | 'Shipping' | 'CAD / Upload' | 'Bulk Orders';
  q: string;
  a: string;
  badge?: string;
}

const FAQS_DATA: FaqItem[] = [
  {
    id: 'faq-1',
    category: 'Customizer',
    q: 'How does the 3D customization work in real-time?',
    a: 'Choose any customizable model in our studio (number plates, cursive keychains, or desk signs), type your desired text, pick your dual-color polymer shades, and watch the photorealistic 3D model update instantly in your browser with live pricing.',
    badge: 'Real-Time 3D',
  },
  {
    id: 'faq-2',
    category: 'CAD / Upload',
    q: 'What 3D file formats can I upload for custom fabrication?',
    a: 'We accept standard CAD and polygonal mesh files including .STL, .OBJ, .GLB, .GLTF, and .3MF files up to 50 MB. Our slicers inspect your geometry for wall thickness and printability within minutes.',
    badge: '.STL / .OBJ / .3MF',
  },
  {
    id: 'faq-3',
    category: 'Materials',
    q: 'Which polymers and filaments do you print with?',
    a: 'We fabricate with high-strength Tough PLA, liquid-sheen Silk PLA, weather-resistant PETG, lightweight Carbon Fiber composite, and micron-accurate SLA resin for ultra-fine figurines and miniature detailing.',
    badge: 'Tough PLA & PETG',
  },
  {
    id: 'faq-4',
    category: 'Shipping',
    q: 'How long does production and delivery take across India?',
    a: 'Standard catalogue and custom orders are printed and hand-finished in our Tiruchendur studio within 2 to 4 working days, then shipped via express couriers with end-to-end tracking to your doorstep.',
    badge: 'Pan-India Delivery',
  },
  {
    id: 'faq-5',
    category: 'Shipping',
    q: 'What happens if a print arrives damaged in transit?',
    a: 'Every parcel is packed in multi-layer foam and fully insured. In the rare event of transit damage, simply share an unboxing photo on WhatsApp within 48 hours and we will reprint and dispatch a replacement free of charge.',
    badge: '100% Guarantee',
  },
  {
    id: 'faq-6',
    category: 'Bulk Orders',
    q: 'Can you fabricate bulk corporate gifts or bespoke commissions?',
    a: 'Yes! We regularly produce branded company keychains, event awards, architect models, and personalized merchandise in runs from 10 to 10,000+ units with tiered volume discounts and custom branding.',
    badge: 'B2B & Volume',
  },
];

const CATEGORIES = ['All', 'Customizer', 'Materials', 'Shipping', 'CAD / Upload', 'Bulk Orders'] as const;

export default function Faq() {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [openId, setOpenId] = useState<string | null>('faq-1');

  const filteredFaqs =
    activeCategory === 'All'
      ? FAQS_DATA
      : FAQS_DATA.filter((item) => item.category === activeCategory);

  const toggleFaq = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section
      id="faq"
      className="relative z-10 min-h-[100svh] h-auto lg:h-[100svh] lg:min-h-[100svh] lg:max-h-[100svh] w-full max-w-full flex flex-col justify-center py-10 sm:py-14 lg:py-6 overflow-visible lg:overflow-hidden text-black"
      style={{ scrollMarginTop: '80px' }}
    >
      {/* Background Images with 100% full opacity */}
      <div className="absolute inset-0 hidden lg:block" aria-hidden>
        <Image
          src="/assets/FAQ-bg.png"
          alt="FAQ background"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>

      <div className="absolute inset-0 lg:hidden" aria-hidden>
        <Image
          src="/assets/FAQ-bg-mob.png"
          alt="FAQ mobile background"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>

      {/* Main Content: Perfectly centered in the open sky-blue region, leaving corner 3D artwork completely clear */}
      <div className="relative mx-auto w-full max-w-5xl px-4 sm:px-6 z-10 flex flex-col justify-center my-auto">
        {/* Header Block */}
        <Reveal>
          <div className="text-center max-w-xl mx-auto mb-3 sm:mb-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-black/15 bg-white/90 px-3.5 py-1 backdrop-blur-md shadow-xs">
              <span className="h-2 w-2 rounded-full bg-brand-pink animate-pulse" />
              <span className="font-heading text-[10.5px] font-bold uppercase tracking-[0.2em] text-slate-800">
                Help & Knowledge Base
              </span>
            </div>
            <h2 className="mt-2 font-heading text-[clamp(1.75rem,3.2vw,2.6rem)] font-black uppercase leading-[1.05] tracking-tight text-slate-900">
              Frequently Asked <span className="text-brand-pink">Questions.</span>
            </h2>
            <p className="mt-1 font-sans text-xs sm:text-[13px] text-slate-600 max-w-md mx-auto">
              Everything you need to know about our precision 3D fabrication, materials, and delivery.
            </p>
          </div>
        </Reveal>

        {/* Filter Pills */}
        <Reveal delay={0.04} className="mb-3 sm:mb-4 flex justify-center">
          <div className="inline-flex flex-wrap items-center justify-center gap-1 sm:gap-1.5 rounded-full border border-black/15 bg-white/85 p-1 backdrop-blur-md shadow-xs max-w-full overflow-x-auto">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  setActiveCategory(cat);
                  // Auto-open first item in new category
                  const firstMatch = cat === 'All' ? FAQS_DATA[0] : FAQS_DATA.find((item) => item.category === cat);
                  if (firstMatch) setOpenId(firstMatch.id);
                }}
                className={`rounded-full px-3 py-1 font-sans text-[10.5px] sm:text-[11px] font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                  activeCategory === cat
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-700 hover:text-black hover:bg-black/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </Reveal>

        {/* Modern 2-Column Responsive FAQ Grid */}
        <Reveal delay={0.08} className="w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 sm:gap-3">
            {filteredFaqs.map((faq, index) => {
              const isOpen = openId === faq.id;
              return (
                <div
                  key={faq.id}
                  className={`group rounded-2xl border transition-all duration-200 overflow-hidden backdrop-blur-xl ${
                    isOpen
                      ? 'border-black/30 bg-white/95 shadow-[0_12px_32px_-12px_rgba(28,11,96,0.12)] ring-1 ring-black/5'
                      : 'border-black/12 bg-white/75 hover:bg-white/90 hover:border-black/25 shadow-xs'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(faq.id)}
                    className="flex w-full items-start justify-between gap-3 p-3 sm:p-3.5 text-left"
                    aria-expanded={isOpen}
                  >
                    <div className="flex items-start gap-2.5 min-w-0 flex-1">
                      <span
                        className={`font-mono text-[10px] font-bold px-1.5 py-0.5 rounded transition-colors shrink-0 mt-0.5 ${
                          isOpen ? 'bg-brand-pink text-white' : 'bg-black/5 text-slate-500'
                        }`}
                      >
                        0{index + 1}
                      </span>
                      <div className="min-w-0">
                        <h3 className="font-heading text-[12.5px] sm:text-[13.5px] font-bold uppercase tracking-tight text-slate-900 leading-snug">
                          {faq.q}
                        </h3>
                        {faq.badge && (
                          <span className="mt-1 inline-block text-[9px] font-sans font-bold uppercase tracking-wider text-brand-purple">
                            {faq.badge}
                          </span>
                        )}
                      </div>
                    </div>

                    <span
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-all duration-200 mt-0.5 ${
                        isOpen
                          ? 'border-slate-900 bg-slate-900 text-white rotate-180'
                          : 'border-black/20 bg-white/80 text-slate-700 group-hover:border-black/40'
                      }`}
                    >
                      <ChevronDown className="h-3.5 w-3.5" />
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="border-t border-black/8 px-3.5 pb-3 pt-2 sm:px-4 sm:pb-3.5 sm:pt-2.5 bg-black/[0.015]">
                          <p className="font-sans text-[11.5px] sm:text-[12.5px] leading-relaxed text-slate-700 font-medium">
                            {faq.a}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </Reveal>

        {/* Integrated Sleek Support Banner */}
        <Reveal delay={0.12} className="mt-3 sm:mt-4 w-full">
          <div className="rounded-2xl border border-black/15 bg-white/90 p-2.5 sm:p-3 px-3.5 sm:px-4 backdrop-blur-xl shadow-xs flex flex-wrap items-center justify-between gap-2.5">
            <div className="flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-pink/15 text-brand-pink shrink-0">
                <Sparkles className="h-3.5 w-3.5" />
              </span>
              <div>
                <p className="font-heading text-[12px] font-extrabold uppercase tracking-tight text-slate-900">
                  Have a custom CAD file or unique gift idea?
                </p>
                <p className="font-sans text-[10.5px] text-slate-600 hidden sm:block">
                  Chat directly with our 3D engineers · Free geometry review & quick quote.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <a
                href={`https://wa.me/${BRAND.whatsappNumber}?text=Hi%20Dhanalakshmi%20Prints,%20I%20have%20a%20question%20about%20a%20custom%203D%20print.`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full bg-[#128C7E] hover:bg-[#075E54] text-white px-3.5 py-1.5 font-sans text-[11px] font-bold uppercase tracking-wider shadow-xs transition-colors"
              >
                <MessageCircle className="h-3.5 w-3.5" />
                <span>WhatsApp Us</span>
              </a>
              <a
                href={`mailto:${BRAND.supportEmail}`}
                className="inline-flex items-center gap-1.5 rounded-full border border-black/20 bg-white hover:bg-black/5 text-slate-800 px-3 py-1.5 font-sans text-[11px] font-bold uppercase tracking-wider transition-colors"
              >
                <Mail className="h-3.5 w-3.5" />
                <span>Email</span>
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
