'use client';

import React, { useState, useMemo } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import {
  Sparkles,
  ShoppingBag,
  ArrowRight,
  RotateCcw,
  Check,
  Layers,
  HelpCircle,
  FileCheck,
  ChevronRight,
  ShieldCheck,
  Tag,
} from 'lucide-react';
import ProductViewer3D from '@/components/3d/ProductViewer3D';
import { useStore } from '@/lib/store';
import { calculateCustomizedPrice } from '@/lib/pricing';
import { SavedCustomization, CartItem, FontOption, MaterialType } from '@/types';
import { BRAND, AVAILABLE_MATERIALS } from '@/lib/constants';

export default function CustomizePage() {
  const router = useRouter();
  const routeParams = useParams();
  const id = (routeParams?.id as string) || 'prod-1';
  const { products, addToCart } = useStore();

  const product = products.find((p) => p.id === id) || products[0];
  const schema = product.customizationSchema;

  // Customization Form State
  const [customText, setCustomText] = useState<string>(schema.defaultText || '3D PRINT');
  const [bodyColor, setBodyColor] = useState<string>(
    schema.supportedColors[0]?.hex || '#1c0b60'
  );
  const [textColor, setTextColor] = useState<string>(
    schema.supportedColors[3]?.hex || '#fed003'
  );
  const [selectedFont, setSelectedFont] = useState<FontOption>(
    (schema.supportedFonts && schema.supportedFonts[0]) || 'Inter'
  );
  const [selectedMaterial, setSelectedMaterial] = useState<MaterialType>(
    (schema.supportedMaterials && schema.supportedMaterials[0]) || 'PLA'
  );
  const [selectedSizeId, setSelectedSizeId] = useState<string>(
    (schema.supportedSizes && schema.supportedSizes[0]?.id) || 'standard'
  );
  const [selectedAccessories, setSelectedAccessories] = useState<string[]>([]);
  const [quantity, setQuantity] = useState<number>(1);
  const [isAddedToast, setIsAddedToast] = useState(false);

  // Current customization object
  const currentCustomization: SavedCustomization = useMemo(() => {
    return {
      text: customText,
      bodyColor,
      textColor,
      font: selectedFont,
      material: selectedMaterial,
      sizeId: selectedSizeId,
      selectedAccessories,
    };
  }, [customText, bodyColor, textColor, selectedFont, selectedMaterial, selectedSizeId, selectedAccessories]);

  // Deterministic live price calculation
  const priceBreakdown = useMemo(() => {
    return calculateCustomizedPrice(product, currentCustomization, quantity);
  }, [product, currentCustomization, quantity]);

  const toggleAccessory = (accId: string) => {
    if (selectedAccessories.includes(accId)) {
      setSelectedAccessories(selectedAccessories.filter((id) => id !== accId));
    } else {
      setSelectedAccessories([...selectedAccessories, accId]);
    }
  };

  const handleReset = () => {
    setCustomText(schema.defaultText || '3D PRINT');
    setBodyColor(schema.supportedColors[0]?.hex || '#1c0b60');
    setTextColor(schema.supportedColors[3]?.hex || '#fed003');
    if (schema.supportedFonts) setSelectedFont(schema.supportedFonts[0]);
    if (schema.supportedMaterials) setSelectedMaterial(schema.supportedMaterials[0]);
    if (schema.supportedSizes) setSelectedSizeId(schema.supportedSizes[0].id);
    setSelectedAccessories([]);
    setQuantity(1);
  };

  const handleAddToCart = () => {
    const cartItem: CartItem = {
      id: `cart-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      productId: product.id,
      productName: product.name,
      modelType: product.modelType,
      imageUrl: product.imageUrl,
      unitPrice: priceBreakdown.unitTotal,
      quantity,
      customization: currentCustomization,
      calculatedPriceBreakdown: {
        basePrice: priceBreakdown.basePrice,
        personalizationFee: priceBreakdown.personalizationFee,
        materialSurcharge: priceBreakdown.materialSurcharge,
        sizeSurcharge: priceBreakdown.sizeSurcharge,
        accessoriesFee: priceBreakdown.accessoriesFee,
        unitTotal: priceBreakdown.unitTotal,
      },
    };

    addToCart(cartItem);
    setIsAddedToast(true);
    setTimeout(() => setIsAddedToast(false), 3000);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push('/checkout');
  };

  const handleViewDesignSummary = () => {
    // Store active preview customization in session for the summary page
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('dp_preview_product_id', product.id);
      sessionStorage.setItem('dp_preview_customization', JSON.stringify(currentCustomization));
      sessionStorage.setItem('dp_preview_quantity', quantity.toString());
    }
    router.push('/design-summary');
  };

  return (
    <div className="w-full min-h-screen bg-slate-50/70 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6">
          <Link href="/" className="hover:text-slate-900">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/shop" className="hover:text-slate-900">Shop Catalog</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-900 font-semibold truncate">{product.name}</span>
        </nav>

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN: Large 3D Preview Canvas */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="w-full aspect-square sm:aspect-[4/3] lg:aspect-[5/4] max-h-[620px]">
              <ProductViewer3D
                product={product}
                customization={currentCustomization}
                className="shadow-md"
              />
            </div>

            {/* Product Key Specifications */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-wrap items-center justify-between gap-4 text-xs">
              <div>
                <span className="text-slate-400 block font-medium">Standard Dimensions</span>
                <span className="font-bold text-slate-900">
                  {product.dimensionsMm.x} × {product.dimensionsMm.y} × {product.dimensionsMm.z} mm
                </span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Print Technology</span>
                <span className="font-bold text-indigo-900">Dual-Extrusion Precision FDM</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Lead Time</span>
                <span className="font-bold text-emerald-700">1 – 2 Business Days</span>
              </div>
              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 font-medium transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Defaults</span>
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN: Customization Controls Panel */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/90 shadow-md space-y-6">
              {/* Product Header */}
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider">
                    {product.category}
                  </span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    In Stock & Custom Ready
                  </span>
                </div>
                <h1 className="text-2xl font-extrabold text-slate-900 mt-1">{product.name}</h1>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">{product.description}</p>
              </div>

              {/* 1. Personalized Text Input */}
              {schema.allowText && (
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      {schema.textLabel || 'Personalized Text'}
                    </label>
                    <span className="text-[11px] font-medium text-slate-400">
                      {customText.length}/{schema.maxTextLength || 14} characters
                    </span>
                  </div>
                  <input
                    type="text"
                    maxLength={schema.maxTextLength || 14}
                    value={customText}
                    onChange={(e) => setCustomText(e.target.value.toUpperCase())}
                    placeholder="Enter your custom text..."
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 font-mono font-bold text-slate-900 text-sm tracking-wider focus:outline-none focus:ring-2 focus:ring-[#1c0b60] focus:border-transparent uppercase bg-slate-50/50"
                  />
                  <p className="text-[11px] text-slate-400">
                    Text updates live in 3D above with realistic extruded layer geometry.
                  </p>
                </div>
              )}

              {/* 2. Color Swatches: Body Color & Text Color */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                {/* Body Color */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Base / Body Color
                    </label>
                    <span className="text-[11px] font-semibold text-slate-600">
                      {schema.supportedColors.find((c) => c.hex === bodyColor)?.name || bodyColor}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {schema.supportedColors.map((color) => {
                      const isSelected = bodyColor.toLowerCase() === color.hex.toLowerCase();
                      return (
                        <button
                          key={color.id}
                          onClick={() => setBodyColor(color.hex)}
                          title={color.name}
                          className={`relative w-8 h-8 rounded-full border-2 transition-transform ${
                            isSelected
                              ? 'border-indigo-900 scale-110 shadow-md ring-2 ring-indigo-200'
                              : 'border-slate-200 hover:scale-105'
                          }`}
                          style={{ backgroundColor: color.hex }}
                        >
                          {isSelected && (
                            <Check className={`w-4 h-4 mx-auto ${['#f8f8f7', '#fed003'].includes(color.hex) ? 'text-slate-900' : 'text-white'}`} />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Text Color (if allowed) */}
                {schema.allowTextColor && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                        Embossed Lettering Color
                      </label>
                      <span className="text-[11px] font-semibold text-slate-600">
                        {schema.supportedColors.find((c) => c.hex === textColor)?.name || textColor}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {schema.supportedColors.map((color) => {
                        const isSelected = textColor.toLowerCase() === color.hex.toLowerCase();
                        return (
                          <button
                            key={color.id}
                            onClick={() => setTextColor(color.hex)}
                            title={color.name}
                            className={`relative w-8 h-8 rounded-full border-2 transition-transform ${
                              isSelected
                                ? 'border-indigo-900 scale-110 shadow-md ring-2 ring-indigo-200'
                                : 'border-slate-200 hover:scale-105'
                            }`}
                            style={{ backgroundColor: color.hex }}
                          >
                            {isSelected && (
                              <Check className={`w-4 h-4 mx-auto ${['#f8f8f7', '#fed003'].includes(color.hex) ? 'text-slate-900' : 'text-white'}`} />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* 3. Font Selection */}
              {schema.supportedFonts && schema.supportedFonts.length > 0 && (
                <div className="space-y-2 pt-4 border-t border-slate-100">
                  <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                    Typography Style
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {schema.supportedFonts.map((font) => (
                      <button
                        key={font}
                        onClick={() => setSelectedFont(font)}
                        className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
                          selectedFont === font
                            ? 'bg-indigo-50 border-indigo-900 text-indigo-950 shadow-xs'
                            : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {font}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 4. Filament Material Selection */}
              {schema.supportedMaterials && schema.supportedMaterials.length > 0 && (
                <div className="space-y-2 pt-4 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Polymer Material
                    </label>
                    <span className="text-[11px] text-indigo-700 font-semibold">
                      +{BRAND.currency}{schema.pricingRules.materialSurcharges[selectedMaterial] || 0}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {schema.supportedMaterials.map((mat) => {
                      const surcharge = schema.pricingRules.materialSurcharges[mat] || 0;
                      return (
                        <button
                          key={mat}
                          onClick={() => setSelectedMaterial(mat)}
                          className={`p-3 rounded-xl border text-left transition-all ${
                            selectedMaterial === mat
                              ? 'bg-indigo-50/80 border-[#1c0b60] text-indigo-950 shadow-xs ring-1 ring-[#1c0b60]'
                              : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <div className="font-bold text-xs">{mat}</div>
                          <div className="text-[10px] text-slate-500 mt-0.5">
                            {surcharge > 0 ? `+${BRAND.currency}${surcharge}` : 'Included in base'}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 5. Supported Sizes */}
              {schema.supportedSizes && schema.supportedSizes.length > 1 && (
                <div className="space-y-2 pt-4 border-t border-slate-100">
                  <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                    Product Dimensions / Scale
                  </label>
                  <div className="space-y-2">
                    {schema.supportedSizes.map((size) => (
                      <button
                        key={size.id}
                        onClick={() => setSelectedSizeId(size.id)}
                        className={`w-full p-3 rounded-xl border flex items-center justify-between text-xs transition-all ${
                          selectedSizeId === size.id
                            ? 'bg-indigo-50/80 border-[#1c0b60] text-indigo-950 font-semibold'
                            : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span>{size.name}</span>
                        <span className="font-bold">
                          {size.surcharge > 0 ? `+${BRAND.currency}${size.surcharge}` : 'Standard'}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 6. Optional Accessories */}
              {schema.supportedAccessories && schema.supportedAccessories.length > 0 && (
                <div className="space-y-2 pt-4 border-t border-slate-100">
                  <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                    Hardware Attachments & Add-ons
                  </label>
                  <div className="space-y-2">
                    {schema.supportedAccessories.map((acc) => {
                      const isChecked = selectedAccessories.includes(acc.id);
                      return (
                        <button
                          key={acc.id}
                          onClick={() => toggleAccessory(acc.id)}
                          className={`w-full p-3 rounded-xl border flex items-center justify-between text-xs transition-all ${
                            isChecked
                              ? 'bg-amber-50/70 border-amber-500 text-amber-950 font-semibold'
                              : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span className={`w-4 h-4 rounded flex items-center justify-center border ${isChecked ? 'bg-amber-500 border-amber-600 text-white' : 'border-slate-300'}`}>
                              {isChecked && <Check className="w-3 h-3" />}
                            </span>
                            <span>{acc.name}</span>
                          </div>
                          <span className="font-bold text-slate-900">+{BRAND.currency}{acc.price}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 7. Quantity and Live Dynamic Price Breakdown */}
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">Quantity</span>
                  <div className="flex items-center gap-3 bg-slate-100 p-1 rounded-xl border border-slate-200">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-7 h-7 flex items-center justify-center bg-white rounded-lg text-slate-700 hover:bg-slate-200 font-bold text-sm shadow-xs"
                    >
                      -
                    </button>
                    <span className="text-xs font-bold text-slate-900 w-6 text-center">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-7 h-7 flex items-center justify-center bg-white rounded-lg text-slate-700 hover:bg-slate-200 font-bold text-sm shadow-xs"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Price Summary Itemization Box */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-500">
                    <span>Base Model Price:</span>
                    <span>{BRAND.currency}{priceBreakdown.basePrice}</span>
                  </div>
                  {priceBreakdown.personalizationFee > 0 && (
                    <div className="flex justify-between text-slate-500">
                      <span>3D Raised Personalization:</span>
                      <span>+{BRAND.currency}{priceBreakdown.personalizationFee}</span>
                    </div>
                  )}
                  {priceBreakdown.materialSurcharge > 0 && (
                    <div className="flex justify-between text-slate-500">
                      <span>Material Surcharge ({selectedMaterial}):</span>
                      <span>+{BRAND.currency}{priceBreakdown.materialSurcharge}</span>
                    </div>
                  )}
                  {priceBreakdown.sizeSurcharge > 0 && (
                    <div className="flex justify-between text-slate-500">
                      <span>Size Upgrade:</span>
                      <span>+{BRAND.currency}{priceBreakdown.sizeSurcharge}</span>
                    </div>
                  )}
                  {priceBreakdown.accessoriesFee > 0 && (
                    <div className="flex justify-between text-slate-500">
                      <span>Hardware Attachments:</span>
                      <span>+{BRAND.currency}{priceBreakdown.accessoriesFee}</span>
                    </div>
                  )}
                  <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline">
                    <div>
                      <span className="text-slate-900 font-bold text-sm">Total Unit Price:</span>
                      {quantity > 1 && (
                        <span className="text-[11px] text-slate-500 ml-1">× {quantity} items</span>
                      )}
                    </div>
                    <div className="text-xl font-extrabold text-[#1c0b60]">
                      {BRAND.currency}{priceBreakdown.totalForQuantity}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons: Add to Cart, Buy Now, Design Summary */}
              <div className="space-y-2.5 pt-2">
                <button
                  onClick={handleAddToCart}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-white bg-[#1c0b60] hover:bg-[#28137e] shadow-md shadow-indigo-950/15 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add Customized Item to Cart</span>
                </button>

                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    onClick={handleBuyNow}
                    className="flex items-center justify-center gap-1.5 py-3 rounded-xl font-bold text-slate-950 bg-[#fed003] hover:bg-[#ffd926] shadow-sm transition-colors text-xs"
                  >
                    <span>Instant Checkout</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={handleViewDesignSummary}
                    className="flex items-center justify-center gap-1.5 py-3 rounded-xl font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 transition-colors text-xs"
                  >
                    <FileCheck className="w-3.5 h-3.5 text-indigo-700" />
                    <span>View Design Summary</span>
                  </button>
                </div>
              </div>

              {/* Toast Feedback */}
              {isAddedToast && (
                <div className="bg-emerald-50 text-emerald-900 p-3 rounded-xl border border-emerald-200 flex items-center justify-between text-xs animate-in fade-in slide-in-from-bottom-2">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Customized item successfully added to cart!</span>
                  </div>
                  <Link href="/cart" className="font-bold underline hover:text-emerald-950">
                    View Cart
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
