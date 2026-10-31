'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertCircle,
  ArrowRight,
  Box,
  CheckCircle2,
  Cpu,
  FileCheck2,
  FileUp,
  Layers,
  RotateCw,
  Send,
  ShieldCheck,
  Sparkles,
  UploadCloud,
  X,
} from 'lucide-react';
import ModelUploadViewer3D from '@/components/3d/ModelUploadViewer3D';
import { useStore } from '@/lib/store';
import type { CustomPrintRequest, MaterialType } from '@/types';
import { AVAILABLE_MATERIALS } from '@/lib/constants';
import SectionHeading from '@/components/ui/SectionHeading';
import Reveal from '@/components/ui/Reveal';

const ACCEPTED_EXTENSIONS = ['.stl', '.obj', '.glb', '.gltf', '.3mf'];

const MATERIALS_INFO: { id: MaterialType; name: string; tag: string; description: string }[] = [
  { id: 'PLA', name: 'Standard PLA', tag: 'Eco Polymer', description: 'Crisp detailing & rigid build for decorative models' },
  { id: 'Silk PLA', name: 'Silk PLA', tag: 'High Sheen', description: 'Silky metallic gloss finish with hidden layer lines' },
  { id: 'PETG', name: 'Industrial PETG', tag: 'Durable', description: 'Impact-resistant & heat-resistant functional strength' },
  { id: 'Resin', name: 'Micron Resin', tag: 'Ultra Fine', description: 'Liquid resin curing for miniature jewelry-level precision' },
  { id: 'Carbon Fiber PLA', name: 'Carbon Fiber PLA', tag: 'Rigid Tech', description: 'Carbon reinforced composite with matte texture' },
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
    if (!file) {
      setFileError('Please select or drop a 3D CAD file first.');
      return;
    }
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
        address: 'Chennai, Tamil Nadu',
        city: 'Chennai',
        postalCode: '600001',
      },
      fileInfo: {
        fileName: file.name,
        fileSizeMb: Math.round((file.size / (1024 * 1024)) * 10) / 10,
        fileFormat,
        estimatedDimensionsMm: specs?.dimensionsMm ?? { x: 50, y: 50, z: 45 },
        triangleCount: specs?.triangleCount ?? 24500,
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
    <section id="upload" className="relative overflow-hidden py-18 sm:py-22 lg:py-26 bg-[#fbfaff]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(100%_70%_at_100%_0%,rgba(1,156,135,0.08),transparent_50%),radial-gradient(80%_60%_at_0%_100%,rgba(231,30,100,0.08),transparent_50%)]" />

      <div className="relative mx-auto max-w-[92rem] px-4 sm:px-6 lg:px-10">
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
            description="Upload your CAD file (STL, OBJ, GLB, or 3MF) for an instant in-browser 3D preview. Our print engineers will inspect mesh integrity, compute print time, and provide an exact fixed quotation."
            action={
              <Link
                href="/custom-printing"
                className="group inline-flex items-center gap-3 rounded-full border border-brand-primary/15 bg-white px-5 py-3.5 font-sans text-[11px] font-bold uppercase tracking-[0.14em] text-brand-primary shadow-sm transition-all hover:-translate-y-0.5 hover:border-brand-primary hover:bg-brand-primary hover:text-white"
              >
                Advanced Studio Mode
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            }
          />
        </Reveal>

        {/* Feature Highlights */}
        <Reveal delay={0.05} className="mt-8">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:gap-4">
            {[
              { label: 'SUPPORTED FORMATS', val: 'STL · OBJ · GLB · 3MF' },
              { label: 'LAYER RESOLUTION', val: 'Down to 0.05 mm' },
              { label: 'STUDIO FLEET', val: 'FDM & SLA Resin' },
              { label: 'ESTIMATE SPEED', val: 'Instant preview' },
            ].map((stat, i) => (
              <div
                key={i}
                className="rounded-2xl border border-brand-primary/10 bg-white/70 p-3.5 backdrop-blur-sm sm:p-4"
              >
                <span className="block font-sans text-[9px] font-semibold uppercase tracking-[0.18em] text-brand-primary/50">
                  {stat.label}
                </span>
                <span className="mt-1 block font-nechlas text-[15px] uppercase tracking-[0.02em] text-brand-navy sm:text-[17px]">
                  {stat.val}
                </span>
              </div>
            ))}
          </div>
        </Reveal>

        {/* Main interactive workstation */}
        <div className="mt-8 overflow-hidden rounded-[2rem] border border-brand-primary/15 bg-white shadow-[0_30px_80px_-40px_rgba(28,11,96,0.35)]">
          {submitted ? (
            <div className="flex min-h-[500px] flex-col items-center justify-center p-8 text-center sm:p-12">
              <span className="flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-50 text-emerald-600 shadow-sm ring-8 ring-emerald-50/50">
                <CheckCircle2 className="h-10 w-10" />
              </span>
              <h3 className="mt-6 font-nechlas text-3xl uppercase tracking-[0.02em] text-brand-navy sm:text-4xl">
                Quotation Request Received!
              </h3>
              <p className="mt-3 max-w-md font-sans text-sm leading-relaxed text-brand-navy/70">
                Thank you, <strong className="text-brand-navy">{submitted.customer.fullName}</strong>. Your custom request is logged as{' '}
                <span className="font-bold text-brand-primary">#{submitted.requestNumber}</span>. Our Chennai studio engineers are reviewing your file.
              </p>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href={`/quotations/${submitted.id}`}
                  className="rounded-full bg-brand-primary px-6 py-3.5 font-sans text-[11px] font-bold uppercase tracking-[0.14em] text-white shadow-md transition-colors hover:bg-brand-pink"
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
                  className="rounded-full border border-brand-primary/20 bg-white px-6 py-3.5 font-sans text-[11px] font-bold uppercase tracking-[0.14em] text-brand-primary transition-colors hover:bg-brand-lavender"
                >
                  Upload Another File
                </button>
              </div>
            </div>
          ) : (
            <div className="grid gap-0 lg:grid-cols-12">
              {/* Left Column: Dropzone & 3D Viewer */}
              <div className="border-b border-brand-primary/10 p-5 sm:p-8 lg:col-span-7 lg:border-b-0 lg:border-r">
                {!file ? (
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
                    onClick={() => inputRef.current?.click()}
                    className={`group relative flex min-h-[380px] cursor-pointer flex-col items-center justify-center rounded-[1.6rem] border-2 border-dashed p-8 text-center transition-all sm:min-h-[460px] ${
                      dragOver
                        ? 'border-brand-primary bg-brand-lavender/50 scale-[0.99]'
                        : 'border-brand-primary/20 bg-brand-offwhite/50 hover:border-brand-primary/50 hover:bg-white'
                    }`}
                  >
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

                    <div className="flex h-18 w-18 items-center justify-center rounded-2xl bg-white shadow-md transition-transform duration-300 group-hover:scale-110">
                      <UploadCloud className="h-9 w-9 text-brand-primary" />
                    </div>

                    <h4 className="mt-5 font-nechlas text-2xl uppercase tracking-[0.02em] text-brand-navy">
                      Drag & Drop Your 3D File Here
                    </h4>
                    <p className="mt-2 max-w-sm font-sans text-xs leading-relaxed text-brand-navy/60">
                      Accepts STL, OBJ, GLB, GLTF, and 3MF files up to 50 MB. Instant mesh rendering in your browser.
                    </p>

                    <span className="mt-5 inline-flex items-center gap-2 rounded-full bg-brand-primary px-5 py-2.5 font-sans text-[11px] font-bold uppercase tracking-[0.14em] text-white shadow-sm transition-transform group-hover:-translate-y-0.5">
                      <FileUp className="h-4 w-4" />
                      Browse Files
                    </span>

                    {fileError && (
                      <p className="mt-4 flex items-center gap-1.5 font-sans text-xs font-semibold text-rose-600">
                        <AlertCircle className="h-4 w-4 shrink-0" />
                        {fileError}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between rounded-xl bg-brand-offwhite p-3">
                      <div className="flex items-center gap-3 truncate">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-primary text-white">
                          <Box className="h-5 w-5" />
                        </span>
                        <div className="truncate">
                          <p className="truncate font-sans text-xs font-bold text-brand-navy">
                            {file.name}
                          </p>
                          <p className="font-sans text-[10px] text-brand-navy/50">
                            {(file.size / (1024 * 1024)).toFixed(2)} MB · {fileFormat.toUpperCase()}
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setFile(null);
                          setSpecs(null);
                        }}
                        className="rounded-lg border border-brand-primary/10 bg-white p-2 text-brand-navy/60 transition-colors hover:bg-rose-50 hover:text-rose-600"
                        title="Remove file"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>

                    {/* 3D Model viewer */}
                    <div className="relative h-[340px] overflow-hidden rounded-[1.4rem] border border-brand-primary/10 bg-[#0d1e3e] sm:h-[400px]">
                      <ModelUploadViewer3D
                        fileData={file}
                        fileFormat={fileFormat}
                        filamentColor="#fed003"
                        materialType={material}
                        onGeometryComputed={(computed) => setSpecs(computed)}
                        className="h-full w-full"
                      />
                    </div>

                    {/* Computed Geometry Specs */}
                    {specs && (
                      <div className="grid grid-cols-3 gap-2 pt-2">
                        <div className="rounded-xl border border-brand-primary/10 bg-brand-offwhite/80 p-3 text-center">
                          <span className="block font-sans text-[9px] font-semibold uppercase tracking-[0.12em] text-brand-navy/50">
                            Bounding Size
                          </span>
                          <span className="mt-1 block font-sans text-xs font-bold text-brand-navy">
                            {specs.dimensionsMm.x} × {specs.dimensionsMm.y} × {specs.dimensionsMm.z} mm
                          </span>
                        </div>
                        <div className="rounded-xl border border-brand-primary/10 bg-brand-offwhite/80 p-3 text-center">
                          <span className="block font-sans text-[9px] font-semibold uppercase tracking-[0.12em] text-brand-navy/50">
                            Part Volume
                          </span>
                          <span className="mt-1 block font-sans text-xs font-bold text-brand-navy">
                            {specs.volumeCm3} cm³
                          </span>
                        </div>
                        <div className="rounded-xl border border-brand-primary/10 bg-brand-offwhite/80 p-3 text-center">
                          <span className="block font-sans text-[9px] font-semibold uppercase tracking-[0.12em] text-brand-navy/50">
                            Mesh Facets
                          </span>
                          <span className="mt-1 block font-sans text-xs font-bold text-brand-navy">
                            {specs.triangleCount.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Right Column: Material & Quotation Details */}
              <div className="p-5 sm:p-8 lg:col-span-5">
                <form onSubmit={handleSubmit} className="space-y-5">
                  <h4 className="font-nechlas text-xl uppercase tracking-[0.02em] text-brand-navy">
                    Production Preferences
                  </h4>

                  {/* Material selection */}
                  <div>
                    <label className="block font-sans text-[10px] font-bold uppercase tracking-[0.16em] text-brand-navy/60">
                      Select Filament Material
                    </label>
                    <div className="mt-2 space-y-2">
                      {MATERIALS_INFO.map((mat) => {
                        const isSelected = material === mat.id;
                        return (
                          <div
                            key={mat.id}
                            onClick={() => setMaterial(mat.id)}
                            className={`flex cursor-pointer items-start justify-between rounded-xl border p-3 transition-all ${
                              isSelected
                                ? 'border-brand-primary bg-brand-lavender/40 shadow-xs'
                                : 'border-brand-primary/10 bg-white hover:border-brand-primary/30'
                            }`}
                          >
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-sans text-xs font-bold text-brand-navy">
                                  {mat.name}
                                </span>
                                <span className="rounded-full bg-brand-primary/10 px-2 py-0.5 font-sans text-[9px] font-semibold uppercase text-brand-primary">
                                  {mat.tag}
                                </span>
                              </div>
                              <p className="mt-0.5 font-sans text-[11px] text-brand-navy/60">
                                {mat.description}
                              </p>
                            </div>
                            <span
                              className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                                isSelected
                                  ? 'border-brand-primary bg-brand-primary text-white'
                                  : 'border-brand-primary/20'
                              }`}
                            >
                              {isSelected && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Quantity & Infill */}
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="block font-sans text-[10px] font-bold uppercase tracking-[0.16em] text-brand-navy/60">
                        Quantity
                      </label>
                      <div className="mt-1.5 flex items-center rounded-xl border border-brand-primary/15 bg-white p-1">
                        <button
                          type="button"
                          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                          className="flex h-8 w-8 items-center justify-center rounded-lg font-bold text-brand-navy hover:bg-brand-lavender"
                        >
                          -
                        </button>
                        <span className="flex-1 text-center font-sans text-xs font-bold text-brand-navy">
                          {quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => setQuantity((q) => q + 1)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg font-bold text-brand-navy hover:bg-brand-lavender"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block font-sans text-[10px] font-bold uppercase tracking-[0.16em] text-brand-navy/60">
                        Infill Density
                      </label>
                      <select
                        value={infill}
                        onChange={(e) => setInfill(Number(e.target.value))}
                        className="mt-1.5 w-full rounded-xl border border-brand-primary/15 bg-white px-3 py-2 font-sans text-xs font-medium text-brand-navy outline-none"
                      >
                        <option value={20}>20% (Standard Light)</option>
                        <option value={40}>40% (Medium Rigid)</option>
                        <option value={70}>70% (High Mechanical)</option>
                        <option value={100}>100% (Solid Dense)</option>
                      </select>
                    </div>
                  </div>

                  {/* Contact Fields */}
                  <div className="space-y-3 border-t border-brand-primary/10 pt-4">
                    <h5 className="font-nechlas text-base uppercase tracking-[0.02em] text-brand-navy">
                      Contact Information
                    </h5>

                    <div>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Your Full Name *"
                        className="w-full rounded-xl border border-brand-primary/15 bg-brand-offwhite/50 px-3.5 py-2.5 font-sans text-xs text-brand-navy outline-none placeholder:text-brand-navy/40 focus:border-brand-primary focus:bg-white"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email Address *"
                        className="w-full rounded-xl border border-brand-primary/15 bg-brand-offwhite/50 px-3.5 py-2.5 font-sans text-xs text-brand-navy outline-none placeholder:text-brand-navy/40 focus:border-brand-primary focus:bg-white"
                      />
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Phone / WhatsApp *"
                        className="w-full rounded-xl border border-brand-primary/15 bg-brand-offwhite/50 px-3.5 py-2.5 font-sans text-xs text-brand-navy outline-none placeholder:text-brand-navy/40 focus:border-brand-primary focus:bg-white"
                      />
                    </div>

                    <div>
                      <textarea
                        rows={2}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Special instructions or deadline (optional)..."
                        className="w-full rounded-xl border border-brand-primary/15 bg-brand-offwhite/50 px-3.5 py-2 font-sans text-xs text-brand-navy outline-none placeholder:text-brand-navy/40 focus:border-brand-primary focus:bg-white"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex w-full items-center justify-center gap-2 rounded-full bg-brand-primary px-6 py-4 font-sans text-[11px] font-bold uppercase tracking-[0.16em] text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-brand-pink disabled:opacity-50"
                  >
                    <Send className="h-4 w-4" />
                    <span>{submitting ? 'Submitting Request...' : 'Request Studio Quotation'}</span>
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
