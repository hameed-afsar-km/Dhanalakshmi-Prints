'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  UploadCloud,
  FileCheck,
  CheckCircle2,
  AlertCircle,
  X,
  Layers,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Send,
  Info,
} from 'lucide-react';
import ModelUploadViewer3D from '@/components/3d/ModelUploadViewer3D';
import { useStore } from '@/lib/store';
import { CustomPrintRequest, MaterialType } from '@/types';
import { BRAND, AVAILABLE_MATERIALS, STANDARD_SWATCH_COLORS } from '@/lib/constants';

export default function CustomPrintingPage() {
  const router = useRouter();
  const { submitQuotationRequest } = useStore();

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Uploaded file state
  const [file, setFile] = useState<File | null>(null);
  const [fileFormat, setFileFormat] = useState<'stl' | 'obj' | '3mf'>('stl');
  const [fileError, setFileError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  // Computed 3D Geometry Metrics
  const [modelSpecs, setModelSpecs] = useState<{
    dimensionsMm: { x: number; y: number; z: number };
    triangleCount: number;
    volumeCm3: number;
  } | null>(null);

  // Printing Preferences
  const [material, setMaterial] = useState<MaterialType>('PLA');
  const [filamentColor, setFilamentColor] = useState<string>('#1c0b60');
  const [quantity, setQuantity] = useState<number>(1);
  const [scalingPercentage, setScalingPercentage] = useState<number>(100);
  const [infillPercentage, setInfillPercentage] = useState<number>(20);
  const [notes, setNotes] = useState<string>('');

  // Customer Contact Info
  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [city, setCity] = useState<string>('Chennai');
  const [address, setAddress] = useState<string>('');

  // Form submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRequestId, setSubmittedRequestId] = useState<string | null>(null);

  const handleFileProcess = (selectedFile: File) => {
    setFileError(null);
    const extension = selectedFile.name.split('.').pop()?.toLowerCase();

    if (!['stl', 'obj', '3mf'].includes(extension || '')) {
      setFileError('Unsupported file format. Please upload an .STL, .OBJ, or .3MF 3D CAD file.');
      return;
    }

    if (selectedFile.size > 50 * 1024 * 1024) {
      setFileError('File size exceeds 50MB limit. Please optimize or compress your mesh.');
      return;
    }

    setFile(selectedFile);
    setFileFormat(extension as 'stl' | 'obj' | '3mf');
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileProcess(e.target.files[0]);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setModelSpecs(null);
    setFileError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmitRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !phone) {
      alert('Please fill in your name, email, and phone number.');
      return;
    }

    setIsSubmitting(true);

    const reqNumber = `RFQ-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newRequest: CustomPrintRequest = {
      id: `quote-${Date.now()}`,
      requestNumber: reqNumber,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      customer: {
        fullName,
        email,
        phone,
        address: address || 'Chennai, Tamil Nadu',
        city: city || 'Chennai',
        postalCode: '600001',
      },
      fileInfo: {
        fileName: file ? file.name : 'sample_mechanical_bracket.stl',
        fileSizeMb: file ? Math.round((file.size / (1024 * 1024)) * 10) / 10 : 3.4,
        fileFormat,
        estimatedDimensionsMm: modelSpecs ? modelSpecs.dimensionsMm : { x: 45, y: 45, z: 42 },
        triangleCount: modelSpecs ? modelSpecs.triangleCount : 18400,
      },
      preferences: {
        material,
        color: filamentColor,
        quantity,
        scalingPercentage,
        infillPercentage,
        notes,
      },
      status: 'Submitted',
    };

    submitQuotationRequest(newRequest);
    setIsSubmitting(false);
    setSubmittedRequestId(newRequest.id);
  };

  return (
    <div className="w-full min-h-screen bg-slate-50/60 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10 text-center max-w-3xl mx-auto">
          <span className="text-xs font-bold text-indigo-700 uppercase tracking-widest">
            On-Demand Rapid Fabrication
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-1">
            Custom 3D Model Printing & Quotation
          </h1>
          <p className="text-sm text-slate-500 mt-2 leading-relaxed">
            Upload your CAD file (STL, OBJ, 3MF) for interactive 3D inspection. Select material and infill preferences, and our engineering team will provide a rapid manufacturing quote.
          </p>
        </div>

        {submittedRequestId ? (
          /* Success Screen */
          <div className="max-w-2xl mx-auto bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/90 shadow-xl text-center space-y-6 animate-in zoom-in-95">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Quotation Request Submitted!</h2>
              <p className="text-sm text-slate-600 mt-2">
                Thank you, <span className="font-semibold">{fullName}</span>. Your request has been logged under ID{' '}
                <span className="font-mono font-bold text-indigo-900">#{submittedRequestId}</span>.
              </p>
            </div>

            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 text-xs text-left space-y-2.5">
              <div className="flex justify-between">
                <span className="text-slate-500">Selected Material:</span>
                <span className="font-semibold text-slate-800">{material}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Requested Quantity:</span>
                <span className="font-semibold text-slate-800">{quantity} units</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Status:</span>
                <span className="font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  Submitted • Awaiting Admin Review
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={() => router.push(`/quotations/${submittedRequestId}`)}
                className="flex-1 py-3.5 rounded-xl font-bold text-white bg-[#1c0b60] hover:bg-[#28137e] transition-colors shadow-md text-sm"
              >
                Track Quotation Status
              </button>
              <button
                onClick={() => {
                  setSubmittedRequestId(null);
                  handleRemoveFile();
                }}
                className="px-6 py-3.5 rounded-xl font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors text-sm"
              >
                Submit Another Request
              </button>
            </div>
          </div>
        ) : (
          /* Main 2-Column Upload and Configuration Form */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* LEFT COLUMN: Upload Drag-and-Drop & 3D Viewer */}
            <div className="lg:col-span-7 space-y-6">
              {/* Drag-and-Drop Zone */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`p-6 sm:p-8 rounded-3xl border-2 border-dashed transition-all text-center bg-white ${
                  isDragOver ? 'border-[#1c0b60] bg-indigo-50/50 scale-[1.01]' : 'border-slate-300 hover:border-slate-400'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".stl,.obj,.3mf"
                  onChange={handleFileInputChange}
                  className="hidden"
                  id="model-file-upload"
                />

                <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-[#1c0b60] flex items-center justify-center mx-auto mb-4 border border-indigo-100">
                  <UploadCloud className="w-7 h-7" />
                </div>

                <h3 className="text-base font-bold text-slate-900">
                  Drag and drop your 3D CAD model here
                </h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Supports STL, OBJ, and 3MF geometry files up to 50MB.
                </p>

                <div className="mt-5 flex items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-5 py-2.5 rounded-xl font-semibold text-xs text-white bg-[#1c0b60] hover:bg-[#28137e] shadow-sm transition-all"
                  >
                    Browse Local Files
                  </button>
                </div>

                {file && (
                  <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold">
                    <FileCheck className="w-4 h-4 text-emerald-600" />
                    <span>{file.name}</span>
                    <span className="text-slate-400">({(file.size / (1024 * 1024)).toFixed(1)} MB)</span>
                    <button onClick={handleRemoveFile} className="ml-1 text-slate-500 hover:text-red-600">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {fileError && (
                  <div className="mt-4 flex items-center justify-center gap-2 text-xs font-medium text-red-600 bg-red-50 p-2.5 rounded-xl border border-red-200">
                    <AlertCircle className="w-4 h-4" />
                    <span>{fileError}</span>
                  </div>
                )}
              </div>

              {/* 3D Geometry Viewer */}
              <div className="w-full aspect-[4/3] rounded-3xl overflow-hidden shadow-md">
                <ModelUploadViewer3D
                  fileData={file}
                  fileFormat={fileFormat}
                  filamentColor={filamentColor}
                  materialType={material}
                  onGeometryComputed={(specs) => setModelSpecs(specs)}
                />
              </div>
            </div>

            {/* RIGHT COLUMN: Printing Preferences & Customer Contact Form */}
            <div className="lg:col-span-5">
              <form
                onSubmit={handleSubmitRequest}
                className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/90 shadow-md space-y-6"
              >
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Printing Preferences</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Customize polymer, infill, and scaling preferences.</p>
                </div>

                {/* Material Selection */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                    Preferred Material
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {AVAILABLE_MATERIALS.map((mat) => (
                      <button
                        key={mat.id}
                        type="button"
                        onClick={() => setMaterial(mat.id as MaterialType)}
                        className={`p-2.5 rounded-xl border text-left transition-all ${
                          material === mat.id
                            ? 'bg-indigo-50 border-[#1c0b60] text-indigo-950 font-bold ring-1 ring-[#1c0b60]'
                            : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <div className="text-xs">{mat.name}</div>
                        <div className="text-[10px] text-slate-500 font-normal line-clamp-1">{mat.description}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Filament Color */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Filament Color
                    </label>
                    <span className="text-[11px] font-semibold text-slate-600">
                      {STANDARD_SWATCH_COLORS.find((c) => c.hex === filamentColor)?.name || filamentColor}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {STANDARD_SWATCH_COLORS.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setFilamentColor(c.hex)}
                        title={c.name}
                        className={`w-7 h-7 rounded-full border-2 transition-transform ${
                          filamentColor === c.hex ? 'border-indigo-900 scale-110 shadow-sm ring-2 ring-indigo-200' : 'border-slate-200'
                        }`}
                        style={{ backgroundColor: c.hex }}
                      />
                    ))}
                  </div>
                </div>

                {/* Quantity & Scale */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Quantity (Units)
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={500}
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1c0b60]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Scale ({scalingPercentage}%)
                    </label>
                    <input
                      type="number"
                      min={10}
                      max={500}
                      step={5}
                      value={scalingPercentage}
                      onChange={(e) => setScalingPercentage(Math.max(10, parseInt(e.target.value) || 100))}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1c0b60]"
                    />
                  </div>
                </div>

                {/* Infill Percentage */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <label className="font-bold text-slate-900 uppercase tracking-wider">
                      Internal Infill Density
                    </label>
                    <span className="font-semibold text-indigo-900">{infillPercentage}% Infill</span>
                  </div>
                  <input
                    type="range"
                    min={10}
                    max={100}
                    step={5}
                    value={infillPercentage}
                    onChange={(e) => setInfillPercentage(parseInt(e.target.value))}
                    className="w-full accent-[#1c0b60]"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>10% (Light)</span>
                    <span>40% (Standard Mechanical)</span>
                    <span>100% (Solid)</span>
                  </div>
                </div>

                {/* Customer Contact Details */}
                <div className="pt-4 border-t border-slate-100 space-y-3">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Customer Contact & Delivery Info
                  </h3>

                  <div className="space-y-1">
                    <input
                      type="text"
                      required
                      placeholder="Your Full Name *"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-[#1c0b60] focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="email"
                      required
                      placeholder="Email Address *"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-[#1c0b60] focus:outline-none"
                    />
                    <input
                      type="tel"
                      required
                      placeholder="Phone Number *"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-[#1c0b60] focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <input
                      type="text"
                      placeholder="City / Delivery Location"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-[#1c0b60] focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <textarea
                      rows={2}
                      placeholder="Special instructions or mechanical tolerances (optional)..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-[#1c0b60] focus:outline-none"
                    />
                  </div>
                </div>

                {/* Submit Quotation Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-white bg-[#1c0b60] hover:bg-[#28137e] transition-all shadow-md shadow-indigo-950/20 text-sm disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'Submitting Request...' : 'Submit Quotation Request'}</span>
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
