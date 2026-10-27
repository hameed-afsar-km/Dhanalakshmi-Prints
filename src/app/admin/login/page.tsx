'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Shield, Lock, Mail, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useStore } from '@/lib/store';
import { BRAND } from '@/lib/constants';

export default function AdminLoginPage() {
  const router = useRouter();
  const { setAdminLoggedIn } = useStore();

  const [email, setEmail] = useState('admin@dhanalakshmiprints.com');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === 'admin@dhanalakshmiprints.com' && password === 'admin123') {
      setAdminLoggedIn(true);
      router.push('/admin');
    } else {
      setError('Invalid credentials. Use the demo credentials provided below.');
    }
  };

  const handleDemoQuickLogin = () => {
    setEmail('admin@dhanalakshmiprints.com');
    setPassword('admin123');
    setAdminLoggedIn(true);
    router.push('/admin');
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 shadow-2xl border border-slate-200/90 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-slate-50 p-2 mx-auto border border-slate-200 shadow-sm">
            <Image
              src="/assets/logo.png"
              alt="Dhanalakshmi Prints Official Logo"
              fill
              className="object-contain p-1"
            />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">{BRAND.name}</h1>
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mt-0.5">
              Owner Administration Portal
            </p>
          </div>
        </div>

        {/* Demo Notice */}
        <div className="bg-indigo-50 border border-indigo-200 p-3.5 rounded-2xl text-xs space-y-1.5">
          <div className="flex items-center gap-1.5 font-bold text-indigo-900">
            <Shield className="w-3.5 h-3.5 text-indigo-700" />
            <span>Demonstration Access Credentials</span>
          </div>
          <div className="text-[11px] text-indigo-800 space-y-0.5 font-mono">
            <div>Email: admin@dhanalakshmiprints.com</div>
            <div>Password: admin123</div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 p-3 rounded-xl border border-red-200 text-xs font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div>
            <label className="font-bold text-slate-700 block mb-1">Admin Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#1c0b60]"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#1c0b60]"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-white bg-[#1c0b60] hover:bg-[#28137e] transition-colors shadow-md text-sm"
          >
            <span>Sign In to Admin Portal</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* 1-Click Fast Login for Demonstration */}
        <div className="pt-2">
          <button
            type="button"
            onClick={handleDemoQuickLogin}
            className="w-full py-2.5 rounded-xl font-semibold text-xs text-indigo-900 bg-indigo-50 hover:bg-indigo-100 transition-colors border border-indigo-200 flex items-center justify-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4 text-indigo-700" />
            <span>1-Click Demo Login</span>
          </button>
        </div>
      </div>
    </div>
  );
}
