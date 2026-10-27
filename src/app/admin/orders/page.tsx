'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  ShoppingBag,
  Search,
  Filter,
  Eye,
  CheckCircle2,
  Clock,
  Layers,
  Truck,
  X,
  ChevronDown,
  Calendar,
  MapPin,
  Sparkles,
} from 'lucide-react';
import AdminLayout from '@/components/layout/AdminLayout';
import { useStore } from '@/lib/store';
import { Order, OrderFulfillmentStatus } from '@/types';
import { BRAND } from '@/lib/constants';

const FULFILLMENT_OPTIONS: OrderFulfillmentStatus[] = [
  'Pending',
  'Confirmed',
  'Printing',
  'Ready',
  'Out for Delivery',
  'Delivered',
  'Cancelled',
];

export default function AdminOrdersPage() {
  const router = useRouter();
  const { orders, updateOrderStatus, isAdminLoggedIn } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [statusNote, setStatusNote] = useState('');
  const [updateFeedback, setUpdateFeedback] = useState<string | null>(null);

  useEffect(() => {
    if (!isAdminLoggedIn) {
      router.push('/admin/login');
    }
  }, [isAdminLoggedIn, router]);

  const filteredOrders = orders.filter((ord) => {
    if (statusFilter !== 'All' && ord.fulfillmentStatus !== statusFilter) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchNum = ord.orderNumber.toLowerCase().includes(q);
      const matchCust = ord.customer.fullName.toLowerCase().includes(q);
      const matchEmail = ord.customer.email.toLowerCase().includes(q);
      return matchNum || matchCust || matchEmail;
    }
    return true;
  });

  const handleUpdateStatus = (orderId: string, newStatus: OrderFulfillmentStatus) => {
    updateOrderStatus(orderId, newStatus, statusNote || `Status updated to ${newStatus} by workshop admin`);
    setStatusNote('');
    setUpdateFeedback(`Order status successfully updated to ${newStatus}! Customer tracking view is now updated.`);

    // Refresh selected order if open
    if (selectedOrder && selectedOrder.id === orderId) {
      const refreshed = orders.find((o) => o.id === orderId);
      if (refreshed) setSelectedOrder({ ...refreshed, fulfillmentStatus: newStatus });
    }

    setTimeout(() => setUpdateFeedback(null), 3500);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Delivered':
        return 'bg-emerald-50 text-emerald-800 border-emerald-300';
      case 'Printing':
        return 'bg-indigo-50 text-indigo-800 border-indigo-300 font-bold';
      case 'Ready':
        return 'bg-blue-50 text-blue-800 border-blue-300';
      case 'Confirmed':
        return 'bg-amber-50 text-amber-800 border-amber-300';
      case 'Out for Delivery':
        return 'bg-purple-50 text-purple-800 border-purple-300';
      case 'Cancelled':
        return 'bg-red-50 text-red-800 border-red-300';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Order Management</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage customer manufacturing queues, update fulfillment statuses, and inspect design configs.
          </p>
        </div>

        {updateFeedback && (
          <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl text-xs font-semibold text-emerald-900 flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{updateFeedback}</span>
          </div>
        )}

        {/* Filter and Search Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by order ID, customer name, email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#1c0b60] focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Filter:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 bg-white focus:ring-2 focus:ring-[#1c0b60] focus:outline-none"
            >
              <option value="All">All Statuses</option>
              {FULFILLMENT_OPTIONS.map((st) => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 text-slate-500 uppercase tracking-wider text-[10px] border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 font-bold">Order ID</th>
                  <th className="py-3 px-4 font-bold">Customer</th>
                  <th className="py-3 px-4 font-bold">Date & Slot</th>
                  <th className="py-3 px-4 font-bold">Item Summary</th>
                  <th className="py-3 px-4 font-bold">Total</th>
                  <th className="py-3 px-4 font-bold">Payment</th>
                  <th className="py-3 px-4 font-bold">Fulfillment Status</th>
                  <th className="py-3 px-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-slate-400">
                      No orders found matching your search.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-indigo-950">
                        {ord.orderNumber}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-slate-900 block">{ord.customer.fullName}</span>
                        <span className="text-[10px] text-slate-400">{ord.customer.email}</span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">
                        <span className="block font-medium">{ord.deliveryDate}</span>
                        <span className="text-[10px] text-slate-400 block truncate max-w-[130px]">{ord.deliverySlot}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-medium text-slate-800 line-clamp-1">
                          {ord.items.map((i) => `${i.productName} (x${i.quantity})`).join(', ')}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        {BRAND.currency}{ord.total}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          ord.paymentStatus === 'Paid' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                        }`}>
                          {ord.paymentStatus}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <select
                          value={ord.fulfillmentStatus}
                          onChange={(e) => handleUpdateStatus(ord.id, e.target.value as OrderFulfillmentStatus)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${getStatusBadge(ord.fulfillmentStatus)} cursor-pointer focus:outline-none`}
                        >
                          {FULFILLMENT_OPTIONS.map((opt) => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => setSelectedOrder(ord)}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors inline-flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5 text-indigo-700" />
                          <span>Inspect</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detailed Order Inspect Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto space-y-5 animate-in zoom-in-95">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="font-bold text-base text-slate-900">
                    Order Details #{selectedOrder.orderNumber}
                  </h3>
                  <span className="text-xs text-slate-400">
                    Placed on {new Date(selectedOrder.createdAt).toLocaleString()}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Status Transition Control */}
              <div className="bg-indigo-50/60 border border-indigo-200/80 p-4 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-950 uppercase tracking-wider">
                    Update Order Fulfillment Status:
                  </span>
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${getStatusBadge(selectedOrder.fulfillmentStatus)}`}>
                    {selectedOrder.fulfillmentStatus}
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {FULFILLMENT_OPTIONS.map((status) => (
                    <button
                      key={status}
                      onClick={() => handleUpdateStatus(selectedOrder.id, status)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        selectedOrder.fulfillmentStatus === status
                          ? 'bg-[#1c0b60] text-white shadow-sm'
                          : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>

                <div className="pt-2">
                  <input
                    type="text"
                    placeholder="Optional production log note (e.g. Bed 4 printed, QC passed)..."
                    value={statusNote}
                    onChange={(e) => setStatusNote(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-[#1c0b60]"
                  />
                </div>
              </div>

              {/* Customer and Delivery Details */}
              <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Customer Contact:</span>
                  <span className="font-bold text-slate-900 block text-sm mt-0.5">{selectedOrder.customer.fullName}</span>
                  <span className="text-slate-600 block">{selectedOrder.customer.email}</span>
                  <span className="text-slate-600 block">{selectedOrder.customer.phone}</span>
                </div>

                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Delivery Destination:</span>
                  <span className="font-semibold text-slate-800 block mt-0.5">
                    {selectedOrder.customer.address}, {selectedOrder.customer.city} - {selectedOrder.customer.postalCode}
                  </span>
                  <span className="text-indigo-900 font-bold block mt-1">Slot: {selectedOrder.deliverySlot}</span>
                </div>
              </div>

              {/* Items & Custom Specifications */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                  Manufactured 3D Design Specifications:
                </span>
                <div className="space-y-2.5">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="p-3.5 rounded-2xl bg-white border border-slate-200 flex gap-4 items-start text-xs">
                      <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-200">
                        <Image src={item.imageUrl} alt={item.productName} fill className="object-cover" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex justify-between">
                          <span className="font-bold text-slate-900">{item.productName}</span>
                          <span className="font-bold text-slate-900">{BRAND.currency}{item.unitPrice * item.quantity}</span>
                        </div>
                        {item.customization.text && (
                          <div className="font-mono font-bold text-indigo-950 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200 inline-block">
                            Text: &quot;{item.customization.text}&quot;
                          </div>
                        )}
                        <div className="flex flex-wrap gap-2 text-[11px] text-slate-600 pt-0.5">
                          <span>Body: {item.customization.bodyColor}</span>
                          <span>•</span>
                          <span>Text: {item.customization.textColor}</span>
                          <span>•</span>
                          <span>Material: {item.customization.material}</span>
                          <span>•</span>
                          <span>Qty: {item.quantity}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="px-5 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
