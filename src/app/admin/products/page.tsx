'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Package,
  Edit2,
  Plus,
  CheckCircle2,
  X,
  Sparkles,
  Tag,
  ArrowRight,
  Eye,
} from 'lucide-react';
import AdminLayout from '@/components/layout/AdminLayout';
import { useStore } from '@/lib/store';
import { Product } from '@/types';
import { BRAND } from '@/lib/constants';

export default function AdminProductsPage() {
  const router = useRouter();
  const { products, updateProduct, isAdminLoggedIn } = useStore();

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [name, setName] = useState('');
  const [basePrice, setBasePrice] = useState(199);
  const [startingPrice, setStartingPrice] = useState(199);
  const [shortDescription, setShortDescription] = useState('');
  const [isPublished, setIsPublished] = useState(true);
  const [inStock, setInStock] = useState(true);
  const [customizable, setCustomizable] = useState(true);
  const [personalizationFee, setPersonalizationFee] = useState(30);
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    if (!isAdminLoggedIn) {
      router.push('/admin/login');
    }
  }, [isAdminLoggedIn, router]);

  const handleEditClick = (p: Product) => {
    setEditingProduct(p);
    setName(p.name);
    setBasePrice(p.basePrice);
    setStartingPrice(p.startingPrice);
    setShortDescription(p.shortDescription);
    setIsPublished(p.isPublished);
    setInStock(p.inStock);
    setCustomizable(p.customizable);
    setPersonalizationFee(p.customizationSchema.pricingRules.personalizationFee);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    updateProduct(editingProduct.id, {
      name,
      basePrice,
      startingPrice,
      shortDescription,
      isPublished,
      inStock,
      customizable,
      customizationSchema: {
        ...editingProduct.customizationSchema,
        pricingRules: {
          ...editingProduct.customizationSchema.pricingRules,
          basePrice,
          personalizationFee,
        },
      },
    });

    setNotification(`Product "${name}" updated successfully! Storefront will reflect these changes immediately.`);
    setEditingProduct(null);
    setTimeout(() => setNotification(null), 3500);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">Product Catalog Management</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Edit product pricing, toggle live customization, and manage storefront publication.
            </p>
          </div>
        </div>

        {notification && (
          <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl text-xs font-semibold text-emerald-900 flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{notification}</span>
          </div>
        )}

        {/* Product Cards Table */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 text-slate-500 uppercase tracking-wider text-[10px] border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 font-bold">Product</th>
                  <th className="py-3 px-4 font-bold">Category</th>
                  <th className="py-3 px-4 font-bold">Base Price</th>
                  <th className="py-3 px-4 font-bold">Starting Price</th>
                  <th className="py-3 px-4 font-bold">3D Configurator</th>
                  <th className="py-3 px-4 font-bold">Status</th>
                  <th className="py-3 px-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-200">
                          <Image src={p.imageUrl} alt={p.name} fill className="object-cover" />
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 block">{p.name}</span>
                          <span className="text-[10px] text-slate-400 font-mono">ID: {p.id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-700">{p.category}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">{BRAND.currency}{p.basePrice}</td>
                    <td className="py-3.5 px-4 font-bold text-indigo-900">{BRAND.currency}{p.startingPrice}</td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        p.customizable ? 'bg-indigo-50 text-indigo-800' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {p.customizable ? 'Enabled' : 'Disabled'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        p.isPublished ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-800'
                      }`}>
                        {p.isPublished ? 'Published' : 'Hidden'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleEditClick(p)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors inline-flex items-center gap-1"
                      >
                        <Edit2 className="w-3.5 h-3.5 text-indigo-700" />
                        <span>Edit</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Edit Product Modal */}
        {editingProduct && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto space-y-5 animate-in zoom-in-95">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-bold text-base text-slate-900">
                  Edit Product #{editingProduct.id}
                </h3>
                <button
                  onClick={() => setEditingProduct(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Product Title</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-[#1c0b60]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Base Price ({BRAND.currency})</label>
                    <input
                      type="number"
                      required
                      min={10}
                      value={basePrice}
                      onChange={(e) => setBasePrice(parseInt(e.target.value) || 0)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-[#1c0b60]"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Starting Display Price ({BRAND.currency})</label>
                    <input
                      type="number"
                      required
                      min={10}
                      value={startingPrice}
                      onChange={(e) => setStartingPrice(parseInt(e.target.value) || 0)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-[#1c0b60]"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Personalization Surcharge ({BRAND.currency})</label>
                  <input
                    type="number"
                    min={0}
                    value={personalizationFee}
                    onChange={(e) => setPersonalizationFee(parseInt(e.target.value) || 0)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-[#1c0b60]"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Short Description</label>
                  <textarea
                    rows={2}
                    value={shortDescription}
                    onChange={(e) => setShortDescription(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1c0b60]"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2 pt-2">
                  <label className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50">
                    <input
                      type="checkbox"
                      checked={isPublished}
                      onChange={(e) => setIsPublished(e.target.checked)}
                      className="rounded accent-[#1c0b60]"
                    />
                    <span className="font-semibold text-slate-800">Published</span>
                  </label>

                  <label className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50">
                    <input
                      type="checkbox"
                      checked={inStock}
                      onChange={(e) => setInStock(e.target.checked)}
                      className="rounded accent-[#1c0b60]"
                    />
                    <span className="font-semibold text-slate-800">In Stock</span>
                  </label>

                  <label className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50">
                    <input
                      type="checkbox"
                      checked={customizable}
                      onChange={(e) => setCustomizable(e.target.checked)}
                      className="rounded accent-[#1c0b60]"
                    />
                    <span className="font-semibold text-slate-800">3D Customizer</span>
                  </label>
                </div>

                <div className="flex gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setEditingProduct(null)}
                    className="flex-1 py-2.5 rounded-xl border border-slate-300 font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl font-bold text-white bg-[#1c0b60] hover:bg-[#28137e] transition-colors shadow-md"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
