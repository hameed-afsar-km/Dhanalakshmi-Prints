'use client';

import { useState } from 'react';
import {
  Check,
  Clock,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
  Sparkles,
} from 'lucide-react';
import { BRAND } from '@/lib/constants';
import Reveal from '@/components/ui/Reveal';

const INQUIRY_TYPES = [
  'Personalized 3D Gift',
  'Custom CAD / STL Print',
  'Bulk / Corporate Order',
  'Studio Consultation',
] as const;

export default function ContactSection() {
  const [sent, setSent] = useState(false);
  const [name, setName] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [inquiryType, setInquiryType] = useState<string>('Personalized 3D Gift');
  const [message, setMessage] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setSent(true);
    setMessage('');
  };

  return (
    <section
      id="contact"
      className="relative z-10 min-h-[100svh] h-auto lg:h-[100svh] lg:min-h-[100svh] lg:max-h-[100svh] w-full max-w-full flex flex-col justify-center py-10 sm:py-14 lg:py-5 overflow-visible lg:overflow-hidden bg-[#070617] text-white"
      style={{ scrollMarginTop: '80px' }}
    >
      {/* Dynamic Animated Ambient Background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="absolute inset-0 bg-gradient-to-b from-[#09051d] via-[#120835] to-[#050410]" />
        
        {/* Animated Glow Orbs */}
        <div className="absolute -left-20 top-1/4 h-[500px] w-[500px] rounded-full bg-brand-pink/20 blur-[130px] animate-pulse [animation-duration:8s]" />
        <div className="absolute -right-20 bottom-1/4 h-[500px] w-[500px] rounded-full bg-brand-teal/20 blur-[140px] animate-pulse [animation-duration:10s]" />
        <div className="absolute left-1/2 -top-32 -translate-x-1/2 h-[400px] w-[600px] rounded-full bg-brand-purple/25 blur-[150px]" />
        
        {/* Cyber Grid Lines */}
        <div className="absolute inset-0 opacity-[0.06] [background-image:linear-gradient(to_right,rgba(255,255,255,0.3)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.3)_1px,transparent_1px)] [background-size:48px_48px]" />
      </div>

      <div className="relative mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8 z-10 my-auto">
        {/* Section Header */}
        <Reveal>
          <div className="text-center max-w-xl mx-auto mb-3 sm:mb-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1 backdrop-blur-md shadow-xs">
              <span className="h-2 w-2 rounded-full bg-brand-gold animate-pulse" />
              <span className="font-heading text-[10.5px] font-bold uppercase tracking-[0.2em] text-white/90">
                Direct Studio Access · Tiruchendur
              </span>
            </div>
            <h2 className="mt-2 font-heading text-[clamp(1.75rem,3.4vw,2.8rem)] font-extrabold uppercase leading-[1.05] tracking-tight text-white">
              Let&apos;s Create Something <span className="text-brand-gold">Extraordinary.</span>
            </h2>
            <p className="mt-1 font-sans text-xs sm:text-[13px] text-white/70 max-w-md mx-auto">
              Custom name designs, sculptural keepsakes, or engineering CAD prints — reach our makers directly.
            </p>
          </div>
        </Reveal>

        {/* Bento Grid Split: Studio Channels (Left) & Inquiry Form (Right) */}
        <Reveal delay={0.06}>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 sm:gap-4 items-stretch">
            {/* Left Card: Direct Studio Channels (5 Cols) */}
            <div className="md:col-span-5 flex flex-col justify-between rounded-2xl sm:rounded-3xl border border-white/15 bg-white/[0.08] p-4 sm:p-5 backdrop-blur-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)]">
              <div>
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="font-heading text-sm sm:text-base font-bold uppercase tracking-tight text-white">
                    Tiruchendur Studio
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 px-2.5 py-0.5 text-[9.5px] font-mono font-bold text-emerald-300">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                    Open 9am–8pm
                  </span>
                </div>
                <p className="mt-1 font-sans text-xs text-white/65 leading-relaxed">
                  Visits by appointment. Meet our 3D fabrication specialists or chat with us online.
                </p>

                {/* Direct Info List */}
                <div className="mt-3.5 space-y-2 font-sans text-xs text-white/85">
                  <div className="flex items-start gap-2.5 rounded-xl border border-white/10 bg-white/[0.04] p-2 sm:p-2.5">
                    <MapPin className="h-3.5 w-3.5 text-brand-gold shrink-0 mt-0.5" />
                    <span className="text-[11.5px] text-white/90">Tiruchendur, Tamil Nadu, India</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <a
                      href={`tel:${BRAND.phone.replace(/[^0-9]/g, '')}`}
                      className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] p-2 hover:bg-white/[0.1] hover:border-white/20 transition-all text-[11px]"
                    >
                      <Phone className="h-3.5 w-3.5 text-brand-gold shrink-0" />
                      <span className="truncate">{BRAND.phone}</span>
                    </a>
                    <a
                      href={`mailto:${BRAND.supportEmail}`}
                      className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] p-2 hover:bg-white/[0.1] hover:border-white/20 transition-all text-[11px]"
                    >
                      <Mail className="h-3.5 w-3.5 text-brand-gold shrink-0" />
                      <span className="truncate">Email Studio</span>
                    </a>
                  </div>

                  <div className="flex items-center gap-2 px-1 text-[11px] text-white/60">
                    <Clock className="h-3 w-3 text-brand-gold shrink-0" />
                    <span>Mon — Sat · 9:00 AM — 8:00 PM IST</span>
                  </div>
                </div>
              </div>

              {/* Prominent High-Visibility WhatsApp Card */}
              <div className="mt-3.5 pt-3 border-t border-white/10">
                <a
                  href={`https://wa.me/${BRAND.whatsappNumber}?text=Hi%20Dhanalakshmi%20Prints,%20I%20have%20an%20idea%20for%20custom%203D%20printing.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative flex items-center justify-between rounded-2xl bg-gradient-to-r from-[#25D366] to-[#128C7E] p-3 text-white shadow-[0_10px_25px_-5px_rgba(37,211,102,0.4)] hover:brightness-105 transition-all overflow-hidden"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20 text-white backdrop-blur-md group-hover:scale-110 transition-transform">
                      <MessageCircle className="h-5 w-5 fill-white" />
                    </span>
                    <div className="text-left">
                      <span className="block font-heading text-[12px] font-bold uppercase tracking-wider text-white">
                        Chat On WhatsApp
                      </span>
                      <span className="block font-sans text-[10px] text-white/85">
                        Typical reply within 15 minutes
                      </span>
                    </div>
                  </div>
                  <span className="rounded-full bg-white/20 px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider text-white">
                    Live
                  </span>
                </a>
              </div>
            </div>

            {/* Right Card: Clean High-Contrast Message Form (7 Cols) */}
            <div className="md:col-span-7 flex flex-col justify-center rounded-2xl sm:rounded-3xl border border-white/15 bg-white/[0.08] p-4 sm:p-5 backdrop-blur-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)]">
              {sent ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-gold text-brand-navy shadow-lg">
                    <Check className="h-6 w-6 stroke-[3]" />
                  </span>
                  <h3 className="mt-3 font-heading text-lg font-black uppercase tracking-tight text-white">
                    Message Dispatched!
                  </h3>
                  <p className="mt-1 max-w-xs font-sans text-xs text-white/75">
                    Thank you, <strong className="text-white">{name || 'friend'}</strong>. Our 3D printing specialists in Tiruchendur will review and contact you shortly.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSent(false)}
                    className="mt-4 rounded-full border border-white/25 bg-white/10 px-5 py-2 font-sans text-[10.5px] font-bold uppercase tracking-wider text-white hover:bg-white/20 transition-colors"
                  >
                    Send Another Note
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-2.5">
                  {/* Name and Contact Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label
                        htmlFor="contact-name"
                        className="block font-sans text-[10px] font-bold uppercase tracking-wider text-white/80 mb-1"
                      >
                        Your Name *
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Priya or Rahul"
                        className="w-full h-9 rounded-xl border border-white/20 bg-black/40 px-3 font-sans text-xs text-white outline-none placeholder:text-white/35 focus:border-brand-gold focus:bg-black/60 transition-all"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="contact-info"
                        className="block font-sans text-[10px] font-bold uppercase tracking-wider text-white/80 mb-1"
                      >
                        Phone / WhatsApp / Email *
                      </label>
                      <input
                        id="contact-info"
                        type="text"
                        required
                        value={contactInfo}
                        onChange={(e) => setContactInfo(e.target.value)}
                        placeholder="+91 98765... or you@mail.com"
                        className="w-full h-9 rounded-xl border border-white/20 bg-black/40 px-3 font-sans text-xs text-white outline-none placeholder:text-white/35 focus:border-brand-gold focus:bg-black/60 transition-all"
                      />
                    </div>
                  </div>

                  {/* Inquiry Type Pills */}
                  <div>
                    <label className="block font-sans text-[10px] font-bold uppercase tracking-wider text-white/80 mb-1">
                      What Would You Like To Print?
                    </label>
                    <div className="grid grid-cols-2 gap-1.5">
                      {INQUIRY_TYPES.map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setInquiryType(type)}
                          className={`rounded-lg px-2 py-1.5 text-center font-sans text-[10px] font-bold transition-all truncate ${
                            inquiryType === type
                              ? 'bg-brand-gold text-brand-navy shadow-xs ring-1 ring-brand-gold'
                              : 'bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 hover:text-white'
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Message Field */}
                  <div>
                    <label
                      htmlFor="contact-message"
                      className="block font-sans text-[10px] font-bold uppercase tracking-wider text-white/80 mb-1"
                    >
                      Project Details & Dimensions *
                    </label>
                    <textarea
                      id="contact-message"
                      required
                      rows={3}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Describe what you have in mind (text, colors, scale, deadline, or special instructions)..."
                      className="w-full rounded-xl border border-white/20 bg-black/40 p-2.5 font-sans text-xs text-white outline-none placeholder:text-white/35 focus:border-brand-gold focus:bg-black/60 transition-all resize-none"
                    />
                  </div>

                  {/* Submit Button & Assurance */}
                  <div className="flex items-center justify-between gap-3 pt-1">
                    <button
                      type="submit"
                      className="group inline-flex items-center gap-2 rounded-full bg-brand-gold px-5 py-2 font-heading text-[11px] font-bold uppercase tracking-wider text-brand-navy shadow-md transition-all hover:bg-white active:scale-95"
                    >
                      <span>Send Message</span>
                      <Send className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                    </button>

                    <span className="flex items-center gap-1.5 font-sans text-[10px] text-white/60">
                      <Sparkles className="h-3 w-3 text-brand-gold" />
                      Free CAD review & instant quote
                    </span>
                  </div>
                </form>
              )}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
