'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import confetti from 'canvas-confetti';
import {
  ShieldCheck,
  Truck,
  CreditCard,
  Banknote,
  CheckCircle2,
  Clock,
  Calendar,
  AlertCircle,
  Lock,
  ArrowRight,
  ShoppingBag,
  RotateCw,
} from 'lucide-react';
import { useStore } from '@/lib/store';
import { calculateOrderSummary } from '@/lib/pricing';
import { Order, PaymentMethod, PaymentStatus } from '@/types';
import { BRAND } from '@/lib/constants';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, createOrder, deliverySettings } = useStore();

  // Customer Details Form State
  const [fullName, setFullName] = useState('Dhanush Kumar');
  const [email, setEmail] = useState('dhanush.k@example.com');
  const [phone, setPhone] = useState('+91 98401 23456');
  const [address, setAddress] = useState('Flat 3B, Sunshine Towers, Nungambakkam');
  const [city, setCity] = useState('Chennai');
  const [postalCode, setPostalCode] = useState('600034');
  const [deliveryNotes, setDeliveryNotes] = useState('Please ring bell twice upon arrival');

  // Delivery Date & Slot Selection
  const [deliveryDate, setDeliveryDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() + deliverySettings.productionLeadDays);
    return date.toISOString().split('T')[0];
  });
  const [deliverySlot, setDeliverySlot] = useState(deliverySettings.availableSlots[0]?.label || '9:00 AM – 12:00 PM');

  // Payment State
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Cash on Delivery');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentSimulatorOpen, setPaymentSimulatorOpen] = useState(false);
  const [mockPaymentOutcome, setMockPaymentOutcome] = useState<'success' | 'fail'>('success');
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const summary = calculateOrderSummary(
    cart.map((item) => ({ unitPrice: item.unitPrice, quantity: item.quantity })),
    deliverySettings.defaultDeliveryFee,
    deliverySettings.freeDeliveryThreshold
  );

  if (cart.length === 0) {
    return (
      <div className="w-full min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-900 flex items-center justify-center mb-4">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Your cart is empty</h2>
        <p className="text-xs text-slate-500 mt-1 max-w-sm">
          Please add a customizable product to your cart before proceeding to checkout.
        </p>
        <Link
          href="/catalogue"
          className="mt-5 px-6 py-2.5 rounded-xl font-bold text-xs text-white bg-[#1c0b60]"
        >
          Explore Catalog
        </Link>
      </div>
    );
  }

  const handlePlaceOrder = (simulatedStatus: PaymentStatus = 'Pending') => {
    const orderNumber = `DP-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date().toISOString();

    const newOrder: Order = {
      id: `order-${Date.now()}`,
      orderNumber,
      createdAt: now,
      updatedAt: now,
      customer: {
        fullName,
        email,
        phone,
        address,
        city,
        postalCode,
        deliveryNotes,
      },
      items: [...cart],
      subtotal: summary.subtotal,
      deliveryFee: summary.deliveryFee,
      discount: summary.discount,
      total: summary.total,
      deliveryDate,
      deliverySlot,
      paymentMethod,
      paymentStatus: simulatedStatus,
      fulfillmentStatus: simulatedStatus === 'Paid' ? 'Confirmed' : 'Pending',
      statusHistory: [
        {
          status: simulatedStatus === 'Paid' ? 'Confirmed' : 'Pending',
          timestamp: now,
          note: `Order placed via ${paymentMethod} (${simulatedStatus === 'Paid' ? 'Payment Verified' : 'Awaiting COD Confirmation'})`,
        },
      ],
    };

    createOrder(newOrder);

    // Launch celebratory confetti
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch (e) {
      // ignore
    }

    router.push(`/order-confirmation/${newOrder.id}`);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (paymentMethod === 'Cash on Delivery') {
      setIsProcessingPayment(true);
      setTimeout(() => {
        setIsProcessingPayment(false);
        handlePlaceOrder('Pending');
      }, 700);
    } else {
      // Open Mock Payment Simulator Modal
      setPaymentSimulatorOpen(true);
      setPaymentError(null);
    }
  };

  const executeSimulatedPayment = () => {
    setIsProcessingPayment(true);
    setPaymentError(null);

    setTimeout(() => {
      setIsProcessingPayment(false);
      if (mockPaymentOutcome === 'success') {
        setPaymentSimulatorOpen(false);
        handlePlaceOrder('Paid');
      } else {
        setPaymentError('Simulated transaction declined by mock card issuer. Click retry or toggle to Success.');
      }
    }, 1200);
  };

  return (
    <div className="w-full min-h-screen bg-slate-50/70 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold text-slate-900 mb-8 flex items-center gap-3">
          <Lock className="w-7 h-7 text-[#1c0b60]" />
          <span>Secure Checkout</span>
        </h1>

        <form onSubmit={handleFormSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: Customer Details & Slot Picker & Payment */}
          <div className="lg:col-span-8 space-y-6">
            {/* 1. Customer Details */}
            <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#1c0b60] text-white flex items-center justify-center text-xs">1</span>
                Customer & Delivery Address
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1c0b60]"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1c0b60]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-semibold text-slate-700 block mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1c0b60]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-semibold text-slate-700 block mb-1">Street Address *</label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1c0b60]"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">City *</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1c0b60]"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Postal Code *</label>
                  <input
                    type="text"
                    required
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1c0b60]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-semibold text-slate-700 block mb-1">Delivery Instructions (Optional)</label>
                  <input
                    type="text"
                    value={deliveryNotes}
                    onChange={(e) => setDeliveryNotes(e.target.value)}
                    placeholder="e.g. Leave with security or call upon arrival"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1c0b60]"
                  />
                </div>
              </div>
            </div>

            {/* 2. Delivery Date & Time Slot Selection */}
            <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#1c0b60] text-white flex items-center justify-center text-xs">2</span>
                  Delivery Date & Predefined Time Slot
                </h2>
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Slots Available
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-indigo-700" />
                    <span>Target Delivery Date</span>
                  </label>
                  <input
                    type="date"
                    required
                    min="2026-10-27"
                    value={deliveryDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-[#1c0b60]"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    Accounts for {deliverySettings.productionLeadDays}-day precision 3D printing and curing lead time.
                  </p>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-indigo-700" />
                    <span>Select Delivery Time Window</span>
                  </label>
                  <div className="space-y-1.5">
                    {deliverySettings.availableSlots.map((slot) => (
                      <button
                        key={slot.id}
                        type="button"
                        onClick={() => setDeliverySlot(slot.label)}
                        className={`w-full p-2.5 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${
                          deliverySlot === slot.label
                            ? 'bg-indigo-50 border-[#1c0b60] text-indigo-950 font-bold ring-1 ring-[#1c0b60]'
                            : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span>{slot.label}</span>
                        {deliverySlot === slot.label && <CheckCircle2 className="w-4 h-4 text-indigo-900" />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Payment Method Selection */}
            <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#1c0b60] text-white flex items-center justify-center text-xs">3</span>
                Select Payment Option
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Cash on Delivery */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('Cash on Delivery')}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    paymentMethod === 'Cash on Delivery'
                      ? 'bg-indigo-50 border-[#1c0b60] text-indigo-950 ring-2 ring-indigo-200 shadow-sm'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <Banknote className="w-5 h-5 text-emerald-600" />
                    {paymentMethod === 'Cash on Delivery' && <CheckCircle2 className="w-4 h-4 text-indigo-900" />}
                  </div>
                  <h3 className="text-sm font-bold mt-2">Cash on Delivery (COD)</h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">Pay in cash or UPI QR when your order is delivered to your doorstep.</p>
                </button>

                {/* Simulated Online Payment */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('Simulated Online Payment')}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    paymentMethod === 'Simulated Online Payment'
                      ? 'bg-indigo-50 border-[#1c0b60] text-indigo-950 ring-2 ring-indigo-200 shadow-sm'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <CreditCard className="w-5 h-5 text-indigo-600" />
                    {paymentMethod === 'Simulated Online Payment' && <CheckCircle2 className="w-4 h-4 text-indigo-900" />}
                  </div>
                  <h3 className="text-sm font-bold mt-2">Simulated Online Payment</h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">Interactive demo gateway simulation (cards, UPI, net banking).</p>
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT: Order Review Summary & Place Order */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/90 shadow-md space-y-5">
              <h2 className="text-lg font-bold text-slate-900">Final Order Review</h2>

              {/* Items summary */}
              <div className="space-y-3 max-h-56 overflow-y-auto pr-1 text-xs">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between items-start border-b border-slate-100 pb-2">
                    <div>
                      <span className="font-bold text-slate-900">{item.productName}</span>
                      {item.customization.text && (
                        <span className="block text-[11px] font-mono text-indigo-800">
                          &quot;{item.customization.text}&quot;
                        </span>
                      )}
                      <span className="text-[10px] text-slate-400">Qty: {item.quantity}</span>
                    </div>
                    <span className="font-bold text-slate-900">
                      {BRAND.currency}{item.unitPrice * item.quantity}
                    </span>
                  </div>
                ))}
              </div>

              {/* Pricing itemization */}
              <div className="space-y-2 text-xs border-b border-slate-100 pb-4">
                <div className="flex justify-between text-slate-500">
                  <span>Subtotal:</span>
                  <span className="font-semibold text-slate-900">{BRAND.currency}{summary.subtotal}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Delivery Slot:</span>
                  {summary.deliveryFee === 0 ? (
                    <span className="font-bold text-emerald-600">FREE</span>
                  ) : (
                    <span className="font-semibold text-slate-900">{BRAND.currency}{summary.deliveryFee}</span>
                  )}
                </div>
              </div>

              <div className="flex justify-between items-baseline pt-1">
                <span className="text-sm font-bold text-slate-900">Grand Total:</span>
                <span className="text-2xl font-extrabold text-[#1c0b60]">
                  {BRAND.currency}{summary.total}
                </span>
              </div>

              <button
                type="submit"
                disabled={isProcessingPayment}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-white bg-[#1c0b60] hover:bg-[#28137e] transition-all shadow-lg shadow-indigo-950/20 text-sm disabled:opacity-50"
              >
                <span>{isProcessingPayment ? 'Processing...' : `Confirm & Place Order (${BRAND.currency}${summary.total})`}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="pt-2 text-center">
                <span className="text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Encrypted Demo Order Engine</span>
                </span>
              </div>
            </div>
          </div>
        </form>

        {/* Mock Online Payment Modal Simulation */}
        {paymentSimulatorOpen && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-5 animate-in zoom-in-95">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-indigo-700" />
                  <h3 className="font-bold text-slate-900">Simulated Payment Gateway</h3>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                  DEMO MODE
                </span>
              </div>

              <div className="text-xs text-slate-600 leading-relaxed">
                This is a simulated online payment engine for demonstration purposes. No real bank or card transactions are made.
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Merchant:</span>
                  <span className="font-bold text-slate-900">{BRAND.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Amount Due:</span>
                  <span className="font-extrabold text-[#1c0b60] text-sm">{BRAND.currency}{summary.total}</span>
                </div>
              </div>

              {/* Simulation Outcome Controls */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 block">
                  Test Simulation Outcome:
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setMockPaymentOutcome('success')}
                    className={`py-2 px-3 rounded-lg border font-semibold transition-all ${
                      mockPaymentOutcome === 'success'
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-900 ring-1 ring-emerald-500'
                        : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    Simulate Success
                  </button>
                  <button
                    type="button"
                    onClick={() => setMockPaymentOutcome('fail')}
                    className={`py-2 px-3 rounded-lg border font-semibold transition-all ${
                      mockPaymentOutcome === 'fail'
                        ? 'bg-red-50 border-red-500 text-red-900 ring-1 ring-red-500'
                        : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    Simulate Failure
                  </button>
                </div>
              </div>

              {paymentError && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{paymentError}</span>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setPaymentSimulatorOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={executeSimulatedPayment}
                  disabled={isProcessingPayment}
                  className="flex-1 py-2.5 rounded-xl bg-[#1c0b60] hover:bg-[#28137e] text-xs font-bold text-white shadow-md flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  {isProcessingPayment ? (
                    <>
                      <RotateCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <span>Pay {BRAND.currency}{summary.total}</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
