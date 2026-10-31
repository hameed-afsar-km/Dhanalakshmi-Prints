'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, HelpCircle, Mail, MessageSquare, Phone, Plus } from 'lucide-react';
import { BRAND } from '@/lib/constants';
import SectionHeading from '@/components/ui/SectionHeading';
import Reveal from '@/components/ui/Reveal';

interface FaqItem {
  q: string;
  a: string;
  category: 'Customization' | 'Materials' | 'Delivery' | 'CAD / Files';
}

const FAQS_DATA: FaqItem[] = [
  {
    category: 'Customization',
    q: 'HOW DOES THE 3D CUSTOMIZATION WORK IN REAL-TIME?',
    a: 'Pick any customizable design (such as our customized number plates, nameplates, or keychains), type your text, choose your preferred dual-color polymer shades, and watch the 3D preview render directly in your browser. Our engineers verify readability and layer line strength before manufacturing.',
  },
  {
    category: 'CAD / Files',
    q: 'WHAT 3D FILE FORMATS CAN I UPLOAD FOR CUSTOM FABRICATION?',
    a: 'We accept standard CAD and mesh formats including .STL, .OBJ, .GLB, .GLTF, and .3MF files up to 50 MB. Our automated geometry inspector calculates dimensions, polygon counts, and bounding volume instantly, followed by a human engineering review.',
  },
  {
    category: 'Materials',
    q: 'WHICH POLYMERS AND 3D PRINTING FILAMENTS DO YOU USE?',
    a: 'We print with premium grade Tough PLA, High-Gloss Silk PLA (liquid metallic sheen), Engineering PETG (temperature and impact resistant), Carbon Fiber composites, and Micron-Precision SLA Resin for jewelry and miniatures.',
  },
  {
    category: 'Delivery',
    q: 'HOW LONG DOES PRODUCTION AND DELIVERY TAKE ACROSS INDIA?',
    a: 'Standard catalogue and customized pieces leave our Chennai studio within 2 to 4 working days. Express rush dispatch is available for urgent gifts. We ship pan-India with tamper-proof gift-ready packaging and live tracking.',
  },
  {
    category: 'Customization',
    q: 'CAN I PRINT PHOTO GIFTS LIKE LITHOPHANE LAMPS?',
    a: 'Yes! Our custom Lithophane lamps turn any high-resolution photo into a 3D translucent embossed surface. When illuminated from inside, the varying layer thicknesses reveal the photograph with stunning photographic fidelity.',
  },
  {
    category: 'Delivery',
    q: 'WHAT HAPPENS IF A PRINT ARRIVES DAMAGED IN TRANSIT?',
    a: 'Every package is insured and carefully bubble-cushioned. In the rare event of transit damage, simply send us photos within 48 hours and we will reprint and dispatch a replacement on highest priority at zero additional cost.',
  },
  {
    category: 'CAD / Files',
    q: 'DO YOU PROVIDE BULK COMMISSIONS AND CORPORATE GIFTING?',
    a: 'Yes, we regularly produce batch runs for corporate gifting, hackathons, team awards, and wedding souvenirs. We offer tiered bulk volume discounts and customized packaging branding upon request.',
  },
];

const CATEGORIES = ['All', 'Customization', 'Materials', 'Delivery', 'CAD / Files'] as const;

export default function Faq() {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const filteredFaqs =
    activeCategory === 'All'
      ? FAQS_DATA
      : FAQS_DATA.filter((item) => item.category === activeCategory);

  return (
    <section id="faq" className="relative overflow-hidden py-18 sm:py-22 lg:py-26 bg-brand-offwhite">
      <div className="pointer-events-none absolute inset-0 opacity-[0.4] [background-image:radial-gradient(rgba(28,11,96,0.08)_1px,transparent_1px)] [background-size:26px_26px]" />
      <div className="pointer-events-none absolute -left-24 top-24 h-72 w-72 rounded-full bg-brand-gold/15 blur-[100px]" />
      <div className="pointer-events-none absolute -right-20 bottom-10 h-80 w-80 rounded-full bg-brand-pink/10 blur-[110px]" />

      <div className="relative mx-auto max-w-[92rem] px-4 sm:px-6 lg:px-10">
        <Reveal>
          <SectionHeading
            eyebrow="Help & Knowledge Base"
            title={
              <>
                Frequently Asked
                <br />
                <span className="text-brand-pink">Questions.</span>
              </>
            }
            description="Clear answers regarding our 3D digital fabrication process, materials, custom file uploads, production lead times, and pan-India doorstep delivery."
          />
        </Reveal>

        {/* Category Filter Pills */}
        <Reveal delay={0.05} className="mt-8">
          <div className="flex flex-wrap items-center gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  setActiveCategory(cat);
                  setOpenIndex(0);
                }}
                className={`rounded-full px-4 py-2 font-sans text-xs font-semibold transition-all ${
                  activeCategory === cat
                    ? 'bg-brand-primary text-white shadow-sm'
                    : 'border border-brand-primary/10 bg-white/80 text-brand-navy/70 hover:border-brand-primary/30 hover:bg-white hover:text-brand-primary'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </Reveal>

        {/* Accordion + Support Card */}
        <div className="mt-8 grid gap-8 lg:grid-cols-12 lg:items-start">
          <div className="space-y-3 lg:col-span-8">
            {filteredFaqs.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <Reveal key={faq.q} delay={0.04 * index}>
                  <div
                    className={`overflow-hidden rounded-2xl border transition-all ${
                      isOpen
                        ? 'border-brand-primary/30 bg-white shadow-md'
                        : 'border-brand-primary/10 bg-white/70 hover:border-brand-primary/20 hover:bg-white'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setOpenIndex(isOpen ? null : index)}
                      className="flex w-full items-center justify-between gap-4 p-5 text-left sm:p-6"
                      aria-expanded={isOpen}
                    >
                      <div className="flex items-center gap-3">
                        <span className="rounded-full bg-brand-primary/10 px-2.5 py-1 font-sans text-[9px] font-bold uppercase tracking-[0.14em] text-brand-primary">
                          {faq.category}
                        </span>
                        <h4 className="font-nechlas text-base uppercase tracking-[0.02em] text-brand-navy sm:text-lg">
                          {faq.q}
                        </h4>
                      </div>
                      <span
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-transform duration-300 ${
                          isOpen
                            ? 'rotate-180 border-brand-primary bg-brand-primary text-white'
                            : 'border-brand-primary/15 bg-brand-lavender/50 text-brand-primary'
                        }`}
                      >
                        <ChevronDown className="h-4 w-4" />
                      </span>
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25 }}
                        >
                          <div className="border-t border-brand-primary/10 p-5 pt-4 sm:p-6 sm:pt-4">
                            <p className="font-sans text-xs leading-relaxed text-brand-navy/75 sm:text-sm">
                              {faq.a}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </Reveal>
              );
            })}
          </div>

          {/* Quick Help Card */}
          <div className="lg:col-span-4">
            <Reveal delay={0.1}>
              <div className="rounded-[2rem] border border-brand-primary/15 bg-brand-primary p-6 text-white shadow-[0_25px_60px_-30px_rgba(28,11,96,0.5)] sm:p-8">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-brand-gold">
                  <MessageSquare className="h-6 w-6" />
                </span>

                <h4 className="mt-5 font-nechlas text-2xl uppercase tracking-[0.02em] text-white">
                  Have A Custom Idea?
                </h4>
                <p className="mt-2 font-sans text-xs leading-relaxed text-white/70">
                  Can&apos;t find your exact answer? Reach out to our 3D print engineering team directly. We evaluate custom CAD sketches, batch production, and special requests.
                </p>

                <div className="mt-6 space-y-3">
                  <a
                    href={`https://wa.me/${BRAND.phone.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between rounded-xl bg-brand-gold px-4 py-3 font-sans text-xs font-bold uppercase tracking-[0.12em] text-brand-navy transition-all hover:bg-white"
                  >
                    <span>Chat On WhatsApp</span>
                    <Phone className="h-4 w-4" />
                  </a>

                  <a
                    href={`mailto:${BRAND.supportEmail}`}
                    className="flex items-center justify-between rounded-xl border border-white/20 bg-white/10 px-4 py-3 font-sans text-xs font-bold uppercase tracking-[0.12em] text-white transition-all hover:bg-white/20"
                  >
                    <span>Email Studio</span>
                    <Mail className="h-4 w-4" />
                  </a>
                </div>

                <div className="mt-6 border-t border-white/15 pt-4">
                  <p className="font-sans text-[11px] text-white/50">
                    Studio Location: <span className="text-white/80">{BRAND.location}</span>
                    <br />
                    Mon — Sat · 9:00 AM — 8:00 PM
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
