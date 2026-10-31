'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Check, Clock, Mail, MapPin, MessageCircle, Phone, Send } from 'lucide-react';
import { BRAND } from '@/lib/constants';
import SectionHeading from '@/components/ui/SectionHeading';
import Reveal from '@/components/ui/Reveal';

export default function ContactSection() {
  const [sent, setSent] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [occasion, setOccasion] = useState('Personalised gift');
  const [message, setMessage] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setSent(true);
    setMessage('');
  };

  return (
    <section id="contact" className="relative overflow-hidden py-18 sm:py-22 lg:py-26">
      <div className="pointer-events-none absolute inset-0 brand-gradient-soft opacity-70" />
      <div className="relative mx-auto max-w-[92rem] px-4 sm:px-6 lg:px-10">
        <Reveal>
          <SectionHeading
            eyebrow="Contact Our Chennai Studio"
            title={
              <>
                Tell Us What
                <br />
                <span className="text-brand-pink">You Have In Mind.</span>
              </>
            }
            description="A custom name, an anniversary occasion, or a technical manufacturing commission — reach out to our studio team. We respond within a few hours."
          />
        </Reveal>

        <div className="mt-10 grid overflow-hidden rounded-[2rem] border border-brand-primary/10 bg-white shadow-[0_40px_100px_-60px_rgba(28,11,96,0.45)] lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal className="relative min-h-[380px] overflow-hidden">
            <Image
              src="/assets/contact-bg.jpg"
              alt="Pastel 3D printing studio texture"
              fill
              sizes="(max-width: 1024px) 100vw, 45vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(28,11,96,0.3)_0%,rgba(28,11,96,0.8)_100%)]" />
            <div className="relative flex h-full flex-col justify-between p-6 text-white sm:p-8">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3.5 py-1.5 font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-white/90 backdrop-blur-md">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-gold" />
                  Studio Visits By Appointment
                </span>
                <h3 className="mt-6 max-w-xs font-nechlas text-[clamp(2rem,5vw,3.2rem)] uppercase leading-[0.92] tracking-[0.02em] text-white">
                  COME SEE THE 3D PRINTERS IN PERSON.
                </h3>
              </div>

              <div className="mt-8 space-y-3 font-sans text-xs text-white/80">
                <p className="flex items-start gap-2.5">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-gold" />
                  {BRAND.location}
                </p>
                <p className="flex items-center gap-2.5">
                  <Phone className="h-4 w-4 shrink-0 text-brand-gold" />
                  <a href={`tel:${BRAND.phone.replace(/[^0-9]/g, '')}`} className="hover:text-white">
                    {BRAND.phone}
                  </a>
                </p>
                <p className="flex items-center gap-2.5">
                  <Mail className="h-4 w-4 shrink-0 text-brand-gold" />
                  <a href={`mailto:${BRAND.supportEmail}`} className="hover:text-white">
                    {BRAND.supportEmail}
                  </a>
                </p>
                <p className="flex items-center gap-2.5">
                  <Clock className="h-4 w-4 shrink-0 text-brand-gold" />
                  Mon — Sat · 9:00 AM — 8:00 PM
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.08} className="p-6 sm:p-10">
            {sent ? (
              <div className="flex h-full flex-col items-center justify-center py-12 text-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-mint text-brand-teal">
                  <Check className="h-7 w-7" />
                </span>
                <h3 className="mt-5 font-nechlas text-2xl uppercase tracking-[0.02em] text-brand-navy">
                  MESSAGE RECEIVED.
                </h3>
                <p className="mt-2 max-w-sm font-sans text-xs leading-relaxed text-brand-navy/60">
                  Thank you, {name || 'friend'}. We will review your brief and follow up with layout ideas and pricing shortly.
                </p>
                <button
                  type="button"
                  onClick={() => setSent(false)}
                  className="mt-6 rounded-full border border-brand-primary/20 bg-brand-lavender/50 px-5 py-2.5 font-sans text-[11px] font-bold uppercase tracking-[0.14em] text-brand-primary transition-colors hover:bg-brand-primary hover:text-white"
                >
                  Send another note
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="contact-name" className="block font-sans text-[10px] font-bold uppercase tracking-[0.16em] text-brand-navy/60">
                    Your Name *
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    className="mt-1.5 w-full rounded-xl border border-brand-primary/15 bg-brand-offwhite/50 px-3.5 py-2.5 font-sans text-xs text-brand-navy outline-none placeholder:text-brand-navy/40 focus:border-brand-primary focus:bg-white"
                  />
                </div>

                <div>
                  <label htmlFor="contact-email" className="block font-sans text-[10px] font-bold uppercase tracking-[0.16em] text-brand-navy/60">
                    Email Address *
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="mt-1.5 w-full rounded-xl border border-brand-primary/15 bg-brand-offwhite/50 px-3.5 py-2.5 font-sans text-xs text-brand-navy outline-none placeholder:text-brand-navy/40 focus:border-brand-primary focus:bg-white"
                  />
                </div>

                <div>
                  <label htmlFor="contact-occasion" className="block font-sans text-[10px] font-bold uppercase tracking-[0.16em] text-brand-navy/60">
                    What are you looking for?
                  </label>
                  <select
                    id="contact-occasion"
                    value={occasion}
                    onChange={(e) => setOccasion(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-brand-primary/15 bg-brand-offwhite/50 px-3.5 py-2.5 font-sans text-xs text-brand-navy outline-none focus:border-brand-primary focus:bg-white"
                  >
                    <option value="Personalised gift">Personalised gift (keychain, lamp, keepsake)</option>
                    <option value="Bulk gifting">Bulk / Corporate gifting</option>
                    <option value="Custom CAD upload">Custom CAD / STL model printing</option>
                    <option value="Studio visit">Studio visit / Consultation</option>
                    <option value="Other">Other enquiry</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="contact-message" className="block font-sans text-[10px] font-bold uppercase tracking-[0.16em] text-brand-navy/60">
                    Your Message / Design Ideas *
                  </label>
                  <textarea
                    id="contact-message"
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us what you want made, dimensions, desired color or date needed..."
                    className="mt-1.5 w-full rounded-xl border border-brand-primary/15 bg-brand-offwhite/50 px-3.5 py-2.5 font-sans text-xs text-brand-navy outline-none placeholder:text-brand-navy/40 focus:border-brand-primary focus:bg-white"
                  />
                </div>

                <div className="pt-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <button
                    type="submit"
                    className="group inline-flex items-center justify-center gap-2 rounded-full bg-brand-primary px-6 py-3.5 font-sans text-[11px] font-bold uppercase tracking-[0.16em] text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-brand-pink"
                  >
                    <span>Send Message</span>
                    <Send className="h-4 w-4" />
                  </button>

                  <a
                    href={`https://wa.me/${BRAND.phone.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 font-sans text-xs font-semibold text-brand-teal transition-colors hover:text-brand-primary"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>Quick chat on WhatsApp</span>
                  </a>
                </div>
              </form>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
