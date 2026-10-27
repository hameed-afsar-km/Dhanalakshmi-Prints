'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  FileText,
  Search,
  CheckCircle2,
  Clock,
  Eye,
  Send,
  X,
  Layers,
  Box,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import AdminLayout from '@/components/layout/AdminLayout';
import ModelUploadViewer3D from '@/components/3d/ModelUploadViewer3D';
import { useStore } from '@/lib/store';
import { CustomPrintRequest, QuotationStatus } from '@/types';
import { BRAND } from '@/lib/constants';

export default function AdminQuotationsPage() {
  const router = useRouter();
  const { quotations, publishQuotation, isAdminLoggedIn } = useStore();

  const [selectedQuote, setSelectedQuote] = useState<CustomPrintRequest | null>(null);
  const [quotedPrice, setQuotedPrice] = useState<number>(1200);
  const [estimatedLeadDays, setEstimatedLeadDays] = useState<number>(3);
  const [validUntilDate, setValidUntilDate] = useState<string>('2026-11-10');
  const [ownerNotes, setOwnerNotes] = useState<string>('High-density gyroid infill configured with 4 perimeter shells.');
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    if (!isAdminLoggedIn) {
      router.push('/admin/login');
    }
  }, [isAdminLoggedIn, router]);

  const handleOpenQuoteModal = (quote: CustomPrintRequest) => {
    setSelectedQuote(quote);
    if (quote.quote) {
      setQuotedPrice(quote.quote.quotedPrice);
      setEstimatedLeadDays(quote.quote.estimatedLeadDays);
      setValidUntilDate(quote.quote.validUntilDate);
      setOwnerNotes(quote.quote.ownerNotes || '');
    } else {
      setQuotedPrice(quote.preferences.quantity * 350 + 200);
      setEstimatedLeadDays(2);
      setValidUntilDate(new Date(Date.now() + 10 * 86400000).toISOString().split('T')[0]);
      setOwnerNotes('Inspected geometry: 0.16mm layer height recommended.');
    }
  };

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedQuote) return;

    publishQuotation(selectedQuote.id, {
      quotedPrice,
      estimatedLeadDays,
      validUntilDate,
      ownerNotes,
    });

    setNotification(`Quotation for #${selectedQuote.requestNumber} published successfully at ${BRAND.currency}${quotedPrice}! Customer page is now updated.`);
    setSelectedQuote(null);
    setTimeout(() => setNotification(null), 4000);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Custom 3D Print Quotations</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Review uploaded CAD models, calculate fabrication pricing, and publish quotes to customers.
          </p>
        </div>

        {notification && (
          <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl text-xs font-semibold text-emerald-900 flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{notification}</span>
          </div>
        )}

        {/* Quotations Table */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 text-slate-500 uppercase tracking-wider text-[10px] border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 font-bold">RFQ Number</th>
                  <th className="py-3 px-4 font-bold">Customer</th>
                  <th className="py-3 px-4 font-bold">3D File</th>
                  <th className="py-3 px-4 font-bold">Material & Qty</th>
                  <th className="py-3 px-4 font-bold">Quoted Price</th>
                  <th className="py-3 px-4 font-bold">Status</th>
                  <th className="py-3 px-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {quotations.map((q) => (
                  <tr key={q.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-indigo-950">
                      {q.requestNumber}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-slate-900 block">{q.customer.fullName}</span>
                      <span className="text-[10px] text-slate-400">{q.customer.email}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-mono text-slate-800 font-semibold block truncate max-w-[160px]">
                        {q.fileInfo.fileName}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {q.fileInfo.fileSizeMb} MB • {q.fileInfo.fileFormat.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-slate-800 block">{q.preferences.material}</span>
                      <span className="text-[10px] text-slate-500">{q.preferences.quantity} units • {q.preferences.scalingPercentage}% scale</span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {q.quote ? `${BRAND.currency}${q.quote.quotedPrice}` : <span className="text-slate-400 font-normal">Pending</span>}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold border ${
                        q.status === 'Quotation Ready'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          : q.status === 'Accepted'
                          ? 'bg-blue-50 text-blue-800 border-blue-300'
                          : 'bg-amber-50 text-amber-800 border-amber-300'
                      }`}>
                        {q.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleOpenQuoteModal(q)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-[#1c0b60] hover:bg-[#28137e] transition-colors shadow-xs inline-flex items-center gap-1.5"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>{q.quote ? 'Revise Quote' : 'Review & Quote'}</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 3D Model Review & Quotation Modal */}
        {selectedQuote && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-4xl w-full p-6 sm:p-7 shadow-2xl border border-slate-200 max-h-[92vh] overflow-y-auto space-y-6 animate-in zoom-in-95">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="font-bold text-base text-slate-900">
                    Review 3D Model & Submit Quotation #{selectedQuote.requestNumber}
                  </h3>
                  <span className="text-xs text-slate-500">
                    Customer: {selectedQuote.customer.fullName} ({selectedQuote.customer.phone})
                  </span>
                </div>
                <button
                  onClick={() => setSelectedQuote(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* 2-Col Modal Layout: 3D Canvas + Quotation Input Form */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                {/* 3D Model Viewer Canvas */}
                <div className="space-y-3">
                  <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                    3D Mesh Geometry Inspection:
                  </span>
                  <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-inner">
                    <ModelUploadViewer3D
                      fileFormat={selectedQuote.fileInfo.fileFormat}
                      filamentColor={selectedQuote.preferences.color}
                      materialType={selectedQuote.preferences.material}
                    />
                  </div>

                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-1">
                    <div className="flex justify-between text-slate-600">
                      <span>File Name:</span>
                      <span className="font-mono font-bold text-slate-800">{selectedQuote.fileInfo.fileName}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Requested Infill:</span>
                      <span className="font-semibold text-slate-800">{selectedQuote.preferences.infillPercentage || 20}%</span>
                    </div>
                    {selectedQuote.preferences.notes && (
                      <div className="pt-1 text-[11px] text-slate-500 italic">
                        Note: &quot;{selectedQuote.preferences.notes}&quot;
                      </div>
                    )}
                  </div>
                </div>

                {/* Quotation Form */}
                <form onSubmit={handlePublish} className="space-y-4 text-xs">
                  <div className="bg-amber-50/70 p-3.5 rounded-2xl border border-amber-200 text-amber-900 text-xs">
                    <span className="font-bold block">Quotation Publishing:</span>
                    Submitting this form immediately publishes the official quotation to the customer account.
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">
                      Quoted Price ({BRAND.currency}) *
                    </label>
                    <input
                      type="number"
                      required
                      min={100}
                      value={quotedPrice}
                      onChange={(e) => setQuotedPrice(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-extrabold text-base text-[#1c0b60] focus:outline-none focus:ring-2 focus:ring-[#1c0b60]"
                    />
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      Total price for all {selectedQuote.preferences.quantity} requested unit(s).
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Estimated Lead Days *</label>
                      <input
                        type="number"
                        required
                        min={1}
                        max={30}
                        value={estimatedLeadDays}
                        onChange={(e) => setEstimatedLeadDays(parseInt(e.target.value) || 1)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-[#1c0b60]"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Valid Until Date *</label>
                      <input
                        type="date"
                        required
                        value={validUntilDate}
                        onChange={(e) => setValidUntilDate(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-[#1c0b60]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Technical Notes for Customer</label>
                    <textarea
                      rows={3}
                      value={ownerNotes}
                      onChange={(e) => setOwnerNotes(e.target.value)}
                      placeholder="e.g. Sliced with 0.16mm layer height and high-temp PETG profile..."
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1c0b60]"
                    />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setSelectedQuote(null)}
                      className="flex-1 py-2.5 rounded-xl border border-slate-300 font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2.5 rounded-xl font-bold text-white bg-[#1c0b60] hover:bg-[#28137e] transition-colors shadow-md flex items-center justify-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Publish Quotation</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
