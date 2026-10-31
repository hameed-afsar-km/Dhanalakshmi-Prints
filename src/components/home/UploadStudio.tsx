'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertCircle,
  ArrowRight,
  Box,
  CheckCircle2,
  FileUp,
  RefreshCw,
  Send,
  UploadCloud,
  X,
} from 'lucide-react';
import ModelUploadViewer3D from '@/components/3d/ModelUploadViewer3D';
import { useStore } from '@/lib/store';
import type { CustomPrintRequest, MaterialType } from '@/types';
import SectionHeading from '@/components/ui/SectionHeading';
import Reveal from '@/components/ui/Reveal';

const ACCEPTED_EXTENSIONS = ['.stl', '.obj', '.glb', '.gltf', '.3mf'];

const MATERIALS_INFO: { id: MaterialType; name: string; tag: string }[] = [
  { id: 'PLA', name: 'Standard Tough PLA', tag: 'Eco Polymer' },
  { id: 'Silk PLA', name: 'High-Gloss Silk PLA', tag: 'Liquid Metallic' },
  { id: 'PETG', name: 'Engineering PETG', tag: 'Durable Impact' },
  { id: 'Resin', name: 'Micron Precision Resin', tag: 'Fine Jewelry' },
  { id: 'Carbon Fiber PLA', name: 'Carbon Fiber Composite', tag: 'Rigid Tech' },
];

export default function UploadStudio() {
  const { submitQuotationRequest } = useStore();
  const inputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [fileFormat, setFileFormat] = useState<'stl' | 'obj' | 'glb' | 'gltf'>('stl');
  const [fileError, setFileError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [specs, setSpecs] = useState<{
    dimensionsMm: { x: number; y: number; z: number };
    triangleCount: number;
    volumeCm3: number;
  } | null>(null);

  const [material, setMaterial] = useState<MaterialType>('Silk PLA');
  const [quantity, setQuantity] = useState(1);
  const [infill, setInfill] = useState(20);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState<CustomPrintRequest | null>(null);

  const processFile = (selected: File) => {
    setFileError(null);
    const extension = selected.name.slice(selected.name.lastIndexOf('.')).toLowerCase();

    if (!ACCEPTED_EXTENSIONS.includes(extension)) {
      setFileError('Supported formats: .STL, .OBJ, .GLB, .GLTF, .3MF (up to 50 MB)');
      return;
    }

    if (selected.size > 50 * 1024 * 1024) {
      setFileError('File exceeds the 50 MB limit.');
      return;
    }

    const fmt =
      extension === '.obj'
        ? 'obj'
        : extension === '.glb' || extension === '.gltf'
        ? 'glb'
        : 'stl';

    setFileFormat(fmt);
    setFile(selected);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!fullName || !email || !phone) {
      setFileError('Please provide your name, email, and phone number for the quotation.');
      return;
    }

    setSubmitting(true);
    const requestNumber = `RFQ-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const request: CustomPrintRequest = {
      id: `quote-${Date.now()}`,
      requestNumber,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      customer: {
        fullName,
        email,
        phone,
        address: 'Tiruchendur, Tamil Nadu',
        city: 'Tiruchendur',
        postalCode: '600001',
      },
      fileInfo: {
        fileName: file ? file.name : 'Sample-Bracket-Component.stl',
        fileSizeMb: file ? Math.round((file.size / (1024 * 1024)) * 10) / 10 : 1.4,
        fileFormat,
        estimatedDimensionsMm: specs?.dimensionsMm ?? { x: 40, y: 40, z: 42 },
        triangleCount: specs?.triangleCount ?? 18400,
      },
      preferences: {
        material,
        color: '#1c0b60',
        quantity,
        scalingPercentage: 100,
        infillPercentage: infill,
        notes,
      },
      status: 'Submitted',
    };

    submitQuotationRequest(request);
    setSubmitted(request);
    setSubmitting(false);
    setFile(null);
    setSpecs(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <section id="upload" className="relative z-10 min-h-[100svh] h-auto lg:h-[100svh] lg:min-h-[100svh] lg:max-h-[100svh] w-full max-w-full flex flex-col justify-center py-10 sm:py-14 lg:py-6 overflow-visible lg:overflow-hidden bg-[#fbfaff]" style={{ scrollMarginTop: '80px' }}>
      {/* Redesigned clean ambient background with animated light orbs & blueprint microgrid */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="absolute inset-0 opacity-[0.4] [background-image:radial-gradient(rgba(28,11,96,0.12)_1px,transparent_1px)] [background-size:32px_32px]" />
        {/* Animated ambient gradient glowing orbs */}
        <div className="absolute -left-20 top-1/4 h-[380px] w-[380px] rounded-full bg-brand-pink/15 blur-[100px] animate-pulse [animation-duration:8s]" />
        <div className="absolute -right-20 bottom-1/4 h-[420px] w-[420px] rounded-full bg-brand-teal/15 blur-[110px] animate-pulse [animation-duration:10s]" />
        <div className="absolute left-1/2 top-10 h-[300px] w-[500px] -translate-x-1/2 rounded-full bg-brand-lavender/40 blur-[90px]" />
      </div>

      <div className="relative mx-auto w-full max-w-[92rem] px-4 sm:px-6 lg:px-10">
        <Reveal>
          <SectionHeading
            eyebrow="Custom 3D Printing Service"
            title={
              <>
                Have A 3D Model?
                <br />
                <span className="text-brand-teal">We Will Make It Real.</span>
              </>
            }
            description="Upload your CAD file (STL, OBJ, GLB, 3MF) for live in-browser 3D inspection and instant quotation."
            action={
              <Link
                href="/custom-printing"
                className="group inline-flex items-center gap-2.5 rounded-full border border-brand-primary/15 bg-white px-4 py-2 font-sans text-[11px] font-bold uppercase tracking-[0.14em] text-brand-primary shadow-2xs transition-all hover:-translate-y-0.5 hover:border-brand-primary hover:bg-brand-primary hover:text-white"
              >
                <span>Full Studio Mode</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            }
          />
        </Reveal>

        {/* Main interactive workstation with 3D model ALWAYS VISIBLE */}
        <div className="mt-4 overflow-hidden rounded-[1.8rem] border border-brand-primary/15 bg-white shadow-[0_30px_70px_-30px_rgba(28,11,96,0.18)]">
          {submitted ? (
            <div className="flex min-h-[380px] flex-col items-center justify-center p-6 text-center sm:p-10">
              <span className="flex h-16 w-16 items-center justify-center rounded-3xl bg-emerald-50 text-emerald-600 shadow-2xs ring-8 ring-emerald-50/50">
                <CheckCircle2 className="h-8 w-8" />
              </span>
              <h3 className="mt-4 font-heading text-2xl font-extrabold uppercase tracking-tight text-brand-navy sm:text-3xl">
                Quotation Request Received!
              </h3>
              <p className="mt-2 max-w-md font-sans text-xs sm:text-sm leading-relaxed text-brand-navy/70">
                Thank you, <strong className="text-brand-navy">{submitted.customer.fullName}</strong>. Request logged as{' '}
                <span className="font-bold text-brand-primary">#{submitted.requestNumber}</span>.
              </p>

              <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href={`/quotations/${submitted.id}`}
                  className="rounded-full bg-brand-primary px-5 py-2.5 font-sans text-[11px] font-bold uppercase tracking-[0.14em] text-white shadow-2xs transition-colors hover:bg-brand-pink"
                >
                  Track Quotation
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(null);
                    setFullName('');
                    setEmail('');
                    setPhone('');
                    setNotes('');
                  }}
                  className="rounded-full border border-brand-primary/20 bg-white px-5 py-2.5 font-sans text-[11px] font-bold uppercase tracking-[0.14em] text-brand-primary transition-colors hover:bg-brand-lavender"
                >
                  Upload Another File
                </button>
              </div>
            </div>
          ) : (
            <div className="grid gap-0 lg:grid-cols-12">
              {/* Left Column: 3D Model Viewport (ALWAYS VISIBLE) with Integrated Upload Trigger */}
              <div className="relative border-b border-brand-primary/10 p-3 sm:p-5 lg:col-span-7 lg:border-b-0 lg:border-r lg:border-r-brand-primary/10">
                {/* Hidden File Input */}
                <input
                  ref={inputRef}
                  type="file"
                  accept=".stl,.obj,.glb,.gltf,.3mf"
                  onChange={(e) => {
                    const selected = e.target.files?.[0];
                    if (selected) processFile(selected);
                  }}
                  className="hidden"
                />

                {/* Top Quick Status & Upload Action Bar */}
                <div className="flex items-center justify-between gap-3 mb-2 px-1">
                  <div className="flex items-center gap-2">
                    <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="font-sans text-[10px] font-bold uppercase tracking-[0.12em] text-brand-navy/70">
                      {file ? file.name : 'Interactive 3D Preview (Sample STL)'}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    className="btn-gradient-loop-glow group relative flex items-center gap-2 rounded-full px-4 py-1.5 font-heading text-[10.5px] font-extrabold uppercase tracking-[0.14em] text-white shadow-md hover:scale-105 active:scale-95 transition-all"
                  >
                    <FileUp className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5" />
                    <span>{file ? 'Change File' : 'Upload Your 3D File'}</span>
                  </button>
                </div>

                {/* The 3D Canvas Container */}
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOver(true);
                  }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragOver(false);
                    const dropped = e.dataTransfer.files?.[0];
                    if (dropped) processFile(dropped);
                  }}
                  className={`relative h-[250px] sm:h-[280px] lg:h-[320px] overflow-hidden rounded-[1.4rem] border transition-all ${
                    dragOver ? 'border-brand-primary ring-4 ring-brand-primary/20' : 'border-brand-primary/15'
                  }`}
                >
                  <ModelUploadViewer3D
                    fileData={file}
                    fileFormat={fileFormat}
                    filamentColor="#1c0b60"
                    materialType={material}
                    onGeometryComputed={(computed) => setSpecs(computed)}
                    className="!h-full !min-h-full !w-full"
                  />

                  {/* Drag overlay prompt if hovering */}
                  {dragOver && (
                    <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-brand-primary/80 backdrop-blur-xs text-white">
                      <UploadCloud className="h-10 w-10 animate-bounce text-brand-gold" />
                      <p className="mt-2 font-heading text-lg font-bold uppercase tracking-tight">Drop STL / OBJ / GLB here</p>
                    </div>
                  )}
                </div>

                {fileError && (
                  <p className="mt-2 flex items-center gap-1.5 font-sans text-xs font-semibold text-rose-600">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                    {fileError}
                  </p>
                )}
              </div>

              {/* Right Column: Material & Quotation Details */}
              <div className="p-3 sm:p-5 lg:col-span-5">
                <form onSubmit={handleSubmit} className="space-y-3">
                  <h4 className="font-heading text-base font-extrabold uppercase tracking-tight text-brand-navy">
                    Production Preferences
                  </h4>

                  {/* Material selection pills */}
                  <div>
                    <label className="block font-sans text-[10px] font-bold uppercase tracking-[0.16em] text-brand-navy/60">
                      Select Filament Material
                    </label>
                    <div className="mt-1 flex flex-wrap gap-1.5">
                      {MATERIALS_INFO.map((mat) => {
                        const isSelected = material === mat.id;
                        return (
                          <button
                            type="button"
                            key={mat.id}
                            onClick={() => setMaterial(mat.id)}
                            className={`rounded-full px-3 py-1 font-sans text-[10px] font-bold uppercase tracking-wider transition-all ${
                              isSelected
                                ? 'bg-brand-primary text-white shadow-xs'
                                : 'border border-brand-primary/15 bg-white text-brand-navy/70 hover:border-brand-primary/30'
                            }`}
                          >
                            {mat.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Quantity & Infill */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-sans text-[9px] font-bold uppercase tracking-[0.16em] text-brand-navy/60">
                        Quantity
                      </label>
                      <div className="mt-0.5 flex items-center rounded-xl border border-brand-primary/15 bg-white p-0.5">
                        <button
                          type="button"
                          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                          className="flex h-6 w-6 items-center justify-center rounded-lg font-bold text-brand-navy hover:bg-brand-lavender text-xs"
                        >
                          -
                        </button>
                        <span className="flex-1 text-center font-sans text-xs font-bold text-brand-navy">
                          {quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => setQuantity((q) => q + 1)}
                          className="flex h-6 w-6 items-center justify-center rounded-lg font-bold text-brand-navy hover:bg-brand-lavender text-xs"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block font-sans text-[9px] font-bold uppercase tracking-[0.16em] text-brand-navy/60">
                        Infill Density
                      </label>
                      <select
                        value={infill}
                        onChange={(e) => setInfill(Number(e.target.value))}
                        className="mt-0.5 w-full rounded-xl border border-brand-primary/15 bg-white px-2 py-1 font-sans text-xs font-medium text-brand-navy outline-none"
                      >
                        <option value={20}>20% (Standard)</option>
                        <option value={40}>40% (Rigid)</option>
                        <option value={70}>70% (Mechanical)</option>
                        <option value={100}>100% (Solid)</option>
                      </select>
                    </div>
                  </div>

                  {/* Contact Fields */}
                  <div className="space-y-1.5 border-t border-white/10 pt-2">
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Your Full Name *"
                      className="w-full rounded-xl border border-brand-primary/15 bg-brand-offwhite/50 px-3 py-1.5 font-sans text-xs text-brand-navy outline-none placeholder:text-brand-navy/40 focus:border-brand-primary focus:bg-white"
                    />

                    <div className="grid grid-cols-2 gap-1.5">
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email Address *"
                        className="w-full rounded-xl border border-brand-primary/15 bg-brand-offwhite/50 px-3 py-1.5 font-sans text-xs text-brand-navy outline-none placeholder:text-brand-navy/40 focus:border-brand-primary focus:bg-white"
                      />
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Phone / WhatsApp *"
                        className="w-full rounded-xl border border-brand-primary/15 bg-brand-offwhite/50 px-3 py-1.5 font-sans text-xs text-brand-navy outline-none placeholder:text-brand-navy/40 focus:border-brand-primary focus:bg-white"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex w-full items-center justify-center gap-2 rounded-full bg-brand-primary px-4 py-2.5 font-sans text-[11px] font-bold uppercase tracking-[0.16em] text-white shadow-2xs transition-all hover:-translate-y-0.5 hover:bg-brand-pink disabled:opacity-50"
                  >
                    <Send className="h-3.5 w-3.5" />
                    <span>{submitting ? 'Submitting...' : 'Request Studio Quotation'}</span>
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
