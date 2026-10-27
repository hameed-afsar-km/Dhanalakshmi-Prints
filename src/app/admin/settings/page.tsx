'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Settings,
  Truck,
  RotateCcw,
  CheckCircle2,
  Clock,
  Banknote,
  ShieldAlert,
} from 'lucide-react';
import AdminLayout from '@/components/layout/AdminLayout';
import { useStore } from '@/lib/store';
import { BRAND } from '@/lib/constants';

export default function AdminSettingsPage() {
  const router = useRouter();
  const { deliverySettings, updateDeliverySettings, resetToDemoData, isAdminLoggedIn } = useStore();

  const [deliveryFee, setDeliveryFee] = useState(deliverySettings.defaultDeliveryFee);
  const [freeThreshold, setFreeThreshold] = useState(deliverySettings.freeDeliveryThreshold);
  const [leadDays, setLeadDays] = useState(deliverySettings.productionLeadDays);
  const [minOrder, setMinOrder] = useState(deliverySettings.minOrderValue);
  const [enableCod, setEnableCod] = useState(deliverySettings.enableCod);
  const [enableOnline, setEnableOnline] = useState(deliverySettings.enableOnlinePayment);
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    if (!isAdminLoggedIn) {
      router.push('/admin/login');
    }
  }, [isAdminLoggedIn, router]);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateDeliverySettings({
      ...deliverySettings,
      defaultDeliveryFee: deliveryFee,
      freeDeliveryThreshold: freeThreshold,
      productionLeadDays: leadDays,
      minOrderValue: minOrder,
      enableCod,
      enableOnlinePayment: enableOnline,
    });

    setNotification('Delivery & pricing rules updated! Storefront and checkout are now using the updated configuration.');
    setTimeout(() => setNotification(null), 3500);
  };

  const handleFactoryReset = () => {
    if (confirm('Are you sure you want to reset all demo data? This restores original products, orders, and quotations.')) {
      resetToDemoData();
      setNotification('Workspace demo data reset to default seed state.');
      setTimeout(() => setNotification(null), 3500);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl space-y-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Delivery & Pricing Configuration</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure delivery fees, lead times, minimum order value, and demo database state.
          </p>
        </div>

        {notification && (
          <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl text-xs font-semibold text-emerald-900 flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{notification}</span>
          </div>
        )}

        <form onSubmit={handleSaveSettings} className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/90 shadow-xs space-y-6">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-100 text-sm font-bold text-slate-900">
            <Truck className="w-4 h-4 text-indigo-700" />
            <span>Delivery & Logistics Rules</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Default Delivery Fee ({BRAND.currency})
              </label>
              <input
                type="number"
                min={0}
                value={deliveryFee}
                onChange={(e) => setDeliveryFee(parseInt(e.target.value) || 0)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1c0b60]"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Free Delivery Order Threshold ({BRAND.currency})
              </label>
              <input
                type="number"
                min={0}
                value={freeThreshold}
                onChange={(e) => setFreeThreshold(parseInt(e.target.value) || 0)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1c0b60]"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Production Lead Time (Days)
              </label>
              <input
                type="number"
                min={1}
                max={14}
                value={leadDays}
                onChange={(e) => setLeadDays(parseInt(e.target.value) || 1)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1c0b60]"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Determines earliest selectable checkout delivery date.
              </span>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Minimum Order Value ({BRAND.currency})
              </label>
              <input
                type="number"
                min={0}
                value={minOrder}
                onChange={(e) => setMinOrder(parseInt(e.target.value) || 0)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1c0b60]"
              />
            </div>
          </div>

          {/* Payment Gateways */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
              Active Payment Gateways
            </span>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <label className="flex items-center gap-2 p-3 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50">
                <input
                  type="checkbox"
                  checked={enableCod}
                  onChange={(e) => setEnableCod(e.target.checked)}
                  className="rounded accent-[#1c0b60]"
                />
                <span className="font-semibold text-slate-800">Cash on Delivery (COD)</span>
              </label>

              <label className="flex items-center gap-2 p-3 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50">
                <input
                  type="checkbox"
                  checked={enableOnline}
                  onChange={(e) => setEnableOnline(e.target.checked)}
                  className="rounded accent-[#1c0b60]"
                />
                <span className="font-semibold text-slate-800">Simulated Online Payment</span>
              </label>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="px-6 py-3 rounded-xl font-bold text-white bg-[#1c0b60] hover:bg-[#28137e] transition-colors shadow-md text-xs"
            >
              Save Configuration Settings
            </button>
          </div>
        </form>

        {/* Demo Data Reset Box */}
        <div className="bg-red-50/60 p-6 rounded-3xl border border-red-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-red-900 font-bold text-sm">
              <ShieldAlert className="w-4 h-4 text-red-600" />
              <span>Reset Demo State</span>
            </div>
            <p className="text-xs text-red-700">
              Restore initial seed catalog, sample orders, and quotation submissions.
            </p>
          </div>

          <button
            onClick={handleFactoryReset}
            className="px-4 py-2.5 rounded-xl font-bold text-xs text-white bg-red-600 hover:bg-red-700 transition-colors shadow-sm flex items-center justify-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Data</span>
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}
