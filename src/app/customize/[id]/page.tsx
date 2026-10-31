'use client';

import { useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowRight,
  Check,
  ChevronRight,
  FileCheck,
  HelpCircle,
  Layers,
  RotateCcw,
  ShoppingBag,
  Sparkles,
  Tag,
} from 'lucide-react';
import ProductViewer3D from '@/components/3d/ProductViewer3D';
import { useStore } from '@/lib/store';
import { calculateCustomizedPrice } from '@/lib/pricing';
import type { CartItem, FontOption, MaterialType, Product, SavedCustomization } from '@/types';
import { formatINR, getProductBySlugOrId, getProductHref } from '@/lib/catalog';
import Reveal from '@/components/ui/Reveal';

export default function CustomizePage() {
  const routeParams = useParams();
  const key = (routeParams?.id as string) || '';
  const { products } = useStore();
  const product = getProductBySlugOrId(products, key);

  if (!product) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-lavender text-brand-primary">
          <Tag className="h-6 w-6" />
        </span>
        <h1 className="mt-5 font-display text-4xl leading-none tracking-[-0.03em] text-brand-navy">
          Design not found.
        </h1>
        <p className="mt-3 max-w-sm text-sm text-brand-navy/50">
          This configurator may have moved. Pick a piece from the catalogue to start again.
        </p>
        <Link
          href="/catalogue"
          className="mt-6 rounded-full bg-brand-primary px-5 py-3 font-mono text-[9px] uppercase tracking-[0.14em] text-white transition-colors hover:bg-brand-pink"
        >
          Back to catalogue
        </Link>
      </div>
    );
  }

  return <Customizer key={product.id} product={product} />;
}

function Customizer({ product }: { product: Product }) {
  const router = useRouter();
  const { addToCart } = useStore();
  const schema = product.customizationSchema;

  const [customText, setCustomText] = useState<string>(schema.defaultText ?? '3D PRINT');
  const [bodyColor, setBodyColor] = useState<string>(schema.supportedColors[0]?.hex ?? '#1c0b60');
  const [textColor, setTextColor] = useState<string>(
    schema.supportedColors.find((color) => color.id === 'gold')?.hex ??
      schema.supportedColors[1]?.hex ??
      '#fed003'
  );
  const [selectedFont, setSelectedFont] = useState<FontOption>(
    schema.supportedFonts?.[0] ?? 'Inter'
  );
  const [selectedMaterial, setSelectedMaterial] = useState<MaterialType>(
    schema.supportedMaterials?.[0] ?? 'PLA'
  );
  const [selectedSizeId, setSelectedSizeId] = useState<string>(
    schema.supportedSizes?.[0]?.id ?? 'standard'
  );
  const [selectedAccessories, setSelectedAccessories] = useState<string[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const customization: SavedCustomization = useMemo(
    () => ({
      text: customText,
      bodyColor,
      textColor,
      font: selectedFont,
      material: selectedMaterial,
      sizeId: selectedSizeId,
      selectedAccessories,
    }),
    [customText, bodyColor, textColor, selectedFont, selectedMaterial, selectedSizeId, selectedAccessories]
  );

  const price = useMemo(
    () => calculateCustomizedPrice(product, customization, quantity),
    [product, customization, quantity]
  );

  const reset = () => {
    setCustomText(schema.defaultText ?? '3D PRINT');
    setBodyColor(schema.supportedColors[0]?.hex ?? '#1c0b60');
    setTextColor(
      schema.supportedColors.find((color) => color.id === 'gold')?.hex ??
        schema.supportedColors[1]?.hex ??
        '#fed003'
    );
    if (schema.supportedFonts) setSelectedFont(schema.supportedFonts[0]);
    if (schema.supportedMaterials) setSelectedMaterial(schema.supportedMaterials[0]);
    if (schema.supportedSizes) setSelectedSizeId(schema.supportedSizes[0].id);
    setSelectedAccessories([]);
    setQuantity(1);
  };

  const addCurrentToCart = () => {
    const item: CartItem = {
      id: `cart-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      productId: product.id,
      productName: product.name,
      modelType: product.modelType,
      imageUrl: product.imageUrl,
      unitPrice: price.unitTotal,
      quantity,
      customization,
      calculatedPriceBreakdown: {
        basePrice: price.basePrice,
        personalizationFee: price.personalizationFee,
        materialSurcharge: price.materialSurcharge,
        sizeSurcharge: price.sizeSurcharge,
        accessoriesFee: price.accessoriesFee,
        unitTotal: price.unitTotal,
      },
    };
    addToCart(item);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 3200);
  };

  const buyNow = () => {
    addCurrentToCart();
    router.push('/checkout');
  };

  const viewSummary = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('dp_preview_product_id', product.id);
      sessionStorage.setItem('dp_preview_customization', JSON.stringify(customization));
      sessionStorage.setItem('dp_preview_quantity', String(quantity));
    }
    router.push('/design-summary');
  };

  const toggleAccessory = (accessoryId: string) => {
    setSelectedAccessories((current) =>
      current.includes(accessoryId)
        ? current.filter((id) => id !== accessoryId)
        : [...current, accessoryId]
    );
  };

  return (
    <div className="w-full bg-brand-offwhite pb-20">
      <div className="mx-auto max-w-[92rem] px-4 pt-6 sm:px-6 sm:pt-8 lg:px-10">
        <nav className="flex items-center gap-2 font-mono text-[8px] uppercase tracking-[0.16em] text-brand-primary/40">
          <Link href="/" className="transition-colors hover:text-brand-primary">
            Home
          </Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/catalogue" className="transition-colors hover:text-brand-primary">
            Catalogue
          </Link>
          <ChevronRight className="h-3 w-3" />
          <Link href={getProductHref(product)} className="transition-colors hover:text-brand-primary">
            {product.name}
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-brand-primary/65">Customize</span>
        </nav>

        <div className="mt-6 grid items-start gap-6 lg:grid-cols-[1.02fr_0.98fr] lg:gap-10">
          <Reveal className="lg:sticky lg:top-28">
            <div className="overflow-hidden rounded-[1.8rem] border border-brand-primary/10 bg-white p-2 shadow-[0_30px_80px_-52px_rgba(28,11,96,0.4)]">
              <div className="flex items-center justify-between px-3 py-2">
                <span className="font-mono text-[8px] uppercase tracking-[0.18em] text-brand-primary/50">
                  {product.name}
                </span>
                <span className="flex items-center gap-1.5 font-mono text-[8px] uppercase tracking-[0.16em] text-brand-teal">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-teal" />
                  Live preview
                </span>
              </div>
              <div className="relative aspect-square overflow-hidden rounded-[1.4rem] sm:aspect-[4/3] lg:aspect-square">
                <ProductViewer3D
                  product={product}
                  customization={customization}
                  className="!min-h-full !rounded-none !border-0"
                />
              </div>
              <div className="grid grid-cols-3 gap-2 p-2">
                {[
                  { label: 'Material', value: selectedMaterial },
                  { label: 'Size', value: schema.supportedSizes?.find((size) => size.id === selectedSizeId)?.name ?? 'Standard' },
                  { label: 'Unit price', value: formatINR(price.unitTotal) },
                ].map((stat) => (
                  <div key={stat.label} className="rounded-xl border border-brand-primary/10 bg-brand-lavender/40 px-2.5 py-2">
                    <span className="block font-mono text-[7px] uppercase tracking-[0.16em] text-brand-primary/40">
                      {stat.label}
                    </span>
                    <span className="mt-1 block truncate font-mono text-[9px] font-semibold uppercase tracking-[0.04em] text-brand-navy/75">
                      {stat.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 px-1">
              <p className="max-w-md font-mono text-[7px] uppercase leading-relaxed tracking-[0.12em] text-brand-navy/35">
                Preview only. The studio confirms geometry, colour and finish before printing.
              </p>
              <button
                type="button"
                onClick={reset}
                className="inline-flex items-center gap-1.5 rounded-full border border-brand-primary/10 bg-white px-3 py-2 font-mono text-[8px] uppercase tracking-[0.12em] text-brand-primary/60 transition-colors hover:border-brand-primary/30 hover:text-brand-primary"
              >
                <RotateCcw className="h-3 w-3" />
                Reset
              </button>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="rounded-[1.8rem] border border-brand-primary/10 bg-white p-4 shadow-[0_30px_80px_-56px_rgba(28,11,96,0.4)] sm:p-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="rounded-full bg-brand-lavender px-2.5 py-1 font-mono text-[8px] uppercase tracking-[0.16em] text-brand-primary">
                    {product.category}
                  </span>
                  <h1 className="mt-3 font-display text-[clamp(2.1rem,4.5vw,3.2rem)] leading-[0.92] tracking-[-0.035em] text-brand-navy">
                    {product.name}
                  </h1>
                  <p className="mt-2 max-w-md text-xs leading-relaxed text-brand-navy/50">
                    {product.shortDescription}
                  </p>
                </div>
                <span className="hidden shrink-0 items-center gap-1 rounded-full border border-brand-teal/20 bg-brand-mint px-2.5 py-1.5 font-mono text-[7px] uppercase tracking-[0.12em] text-brand-pine sm:flex">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-teal" />
                  In stock
                </span>
              </div>

              <div className="mt-6 space-y-6">
                {schema.allowText && (
                  <div>
                    <div className="flex items-center justify-between">
                      <label htmlFor="customize-text" className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.16em] text-brand-primary/55">
                        <Sparkles className="h-3.5 w-3.5 text-brand-pink" />
                        {schema.textLabel ?? 'Personalised text'}
                      </label>
                      <span className="font-mono text-[8px] tabular-nums text-brand-primary/35">
                        {customText.length}/{schema.maxTextLength ?? 14}
                      </span>
                    </div>
                    <input
                      id="customize-text"
                      type="text"
                      maxLength={schema.maxTextLength ?? 14}
                      value={customText}
                      onChange={(event) => setCustomText(event.target.value.toUpperCase())}
                      placeholder="Type your text…"
                      className="mt-2 w-full rounded-xl border border-brand-primary/10 bg-brand-lavender/30 px-4 py-3 font-mono text-sm font-bold uppercase tracking-[0.08em] text-brand-navy outline-none transition-colors placeholder:text-brand-navy/25 focus:border-brand-primary/40 focus:bg-white"
                    />
                    <p className="mt-1.5 font-mono text-[7px] uppercase tracking-[0.12em] text-brand-navy/35">
                      Updates live in the 3D preview.
                    </p>
                  </div>
                )}

                <div className="border-t border-brand-primary/10 pt-5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-brand-primary/55">
                      Body colour
                    </span>
                    <span className="font-mono text-[8px] text-brand-primary/40">
                      {schema.supportedColors.find((color) => color.hex === bodyColor)?.name ?? bodyColor}
                    </span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {schema.supportedColors.map((color) => {
                      const selected = bodyColor.toLowerCase() === color.hex.toLowerCase();
                      return (
                        <button
                          key={color.id}
                          type="button"
                          aria-label={`Select ${color.name}`}
                          onClick={() => setBodyColor(color.hex)}
                          className={`relative flex h-8 w-8 items-center justify-center rounded-full border-2 transition-transform hover:scale-110 ${
                            selected
                              ? 'border-brand-primary ring-2 ring-brand-primary/15 ring-offset-2'
                              : 'border-white shadow-sm'
                          }`}
                          style={{ backgroundColor: color.hex }}
                        >
                          {selected && (
                            <Check
                              className={`h-3.5 w-3.5 ${
                                ['white', 'gold'].includes(color.id) ? 'text-brand-navy' : 'text-white'
                              }`}
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {schema.allowTextColor && (
                  <div className="border-t border-brand-primary/10 pt-5">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-brand-primary/55">
                        Lettering colour
                      </span>
                      <span className="font-mono text-[8px] text-brand-primary/40">
                        {schema.supportedColors.find((color) => color.hex === textColor)?.name ?? textColor}
                      </span>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {schema.supportedColors.map((color) => {
                        const selected = textColor.toLowerCase() === color.hex.toLowerCase();
                        return (
                          <button
                            key={color.id}
                            type="button"
                            aria-label={`Select lettering ${color.name}`}
                            onClick={() => setTextColor(color.hex)}
                            className={`relative flex h-8 w-8 items-center justify-center rounded-full border-2 transition-transform hover:scale-110 ${
                              selected
                                ? 'border-brand-primary ring-2 ring-brand-primary/15 ring-offset-2'
                                : 'border-white shadow-sm'
                            }`}
                            style={{ backgroundColor: color.hex }}
                          >
                            {selected && (
                              <Check
                                className={`h-3.5 w-3.5 ${
                                  ['white', 'gold'].includes(color.id) ? 'text-brand-navy' : 'text-white'
                                }`}
                              />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {schema.supportedFonts && schema.supportedFonts.length > 0 && (
                  <div className="border-t border-brand-primary/10 pt-5">
                    <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-brand-primary/55">
                      Typography
                    </span>
                    <div className="mt-2 grid grid-cols-3 gap-2">
                      {schema.supportedFonts.map((font) => (
                        <button
                          key={font}
                          type="button"
                          onClick={() => setSelectedFont(font)}
                          className={`rounded-xl border px-2 py-2.5 font-mono text-[9px] transition-colors ${
                            selectedFont === font
                              ? 'border-brand-primary bg-brand-primary text-white'
                              : 'border-brand-primary/10 bg-brand-lavender/30 text-brand-navy/55 hover:border-brand-primary/30'
                          }`}
                        >
                          {font}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {schema.supportedMaterials && schema.supportedMaterials.length > 0 && (
                  <div className="border-t border-brand-primary/10 pt-5">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.16em] text-brand-primary/55">
                        <Layers className="h-3.5 w-3.5 text-brand-teal" />
                        Material
                      </span>
                      <span className="font-mono text-[8px] text-brand-primary/40">
                        +{formatINR(schema.pricingRules.materialSurcharges[selectedMaterial] ?? 0)}
                      </span>
                    </div>
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      {schema.supportedMaterials.map((material) => {
                        const surcharge = schema.pricingRules.materialSurcharges[material] ?? 0;
                        return (
                          <button
                            key={material}
                            type="button"
                            onClick={() => setSelectedMaterial(material)}
                            className={`rounded-xl border p-2.5 text-left transition-colors ${
                              selectedMaterial === material
                                ? 'border-brand-primary bg-brand-primary text-white'
                                : 'border-brand-primary/10 bg-brand-lavender/30 text-brand-navy/65 hover:border-brand-primary/30'
                            }`}
                          >
                            <span className="block font-mono text-[9px] font-semibold">{material}</span>
                            <span className={`mt-0.5 block font-mono text-[8px] ${selectedMaterial === material ? 'text-white/50' : 'text-brand-navy/40'}`}>
                              {surcharge > 0 ? `+${formatINR(surcharge)}` : 'Included'}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {schema.supportedSizes && schema.supportedSizes.length > 1 && (
                  <div className="border-t border-brand-primary/10 pt-5">
                    <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-brand-primary/55">
                      Size
                    </span>
                    <div className="mt-2 space-y-2">
                      {schema.supportedSizes.map((size) => (
                        <button
                          key={size.id}
                          type="button"
                          onClick={() => setSelectedSizeId(size.id)}
                          className={`flex w-full items-center justify-between rounded-xl border px-3 py-2.5 text-left transition-colors ${
                            selectedSizeId === size.id
                              ? 'border-brand-primary bg-brand-lavender text-brand-navy'
                              : 'border-brand-primary/10 text-brand-navy/55 hover:border-brand-primary/30'
                          }`}
                        >
                          <span>
                            <span className="block font-mono text-[9px] font-semibold">{size.name}</span>
                            <span className="mt-0.5 block font-mono text-[8px] text-brand-navy/40">
                              {size.dimensionsMm.x} × {size.dimensionsMm.y} × {size.dimensionsMm.z} mm
                            </span>
                          </span>
                          <span className="font-mono text-[9px] font-semibold text-brand-primary">
                            {size.surcharge > 0 ? `+${formatINR(size.surcharge)}` : 'Standard'}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {schema.supportedAccessories && schema.supportedAccessories.length > 0 && (
                  <div className="border-t border-brand-primary/10 pt-5">
                    <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-brand-primary/55">
                      Add-ons
                    </span>
                    <div className="mt-2 space-y-2">
                      {schema.supportedAccessories.map((accessory) => {
                        const checked = selectedAccessories.includes(accessory.id);
                        return (
                          <button
                            key={accessory.id}
                            type="button"
                            onClick={() => toggleAccessory(accessory.id)}
                            className={`flex w-full items-center justify-between gap-3 rounded-xl border px-3 py-2.5 text-left transition-colors ${
                              checked
                                ? 'border-brand-gold/60 bg-brand-cream'
                                : 'border-brand-primary/10 hover:border-brand-primary/30'
                            }`}
                          >
                            <span className="flex items-center gap-2.5">
                              <span
                                className={`flex h-4 w-4 items-center justify-center rounded border ${
                                  checked
                                    ? 'border-brand-primary bg-brand-primary text-white'
                                    : 'border-brand-primary/25'
                                }`}
                              >
                                {checked && <Check className="h-3 w-3" />}
                              </span>
                              <span className="font-mono text-[9px] text-brand-navy/70">{accessory.name}</span>
                            </span>
                            <span className="shrink-0 font-mono text-[9px] font-semibold text-brand-primary">
                              +{formatINR(accessory.price)}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="border-t border-brand-primary/10 pt-5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-brand-primary/55">
                      Quantity
                    </span>
                    <div className="flex items-center gap-3 rounded-full border border-brand-primary/10 bg-brand-lavender/40 p-1">
                      <button
                        type="button"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-sm font-bold text-brand-primary shadow-sm transition-colors hover:bg-brand-primary hover:text-white"
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>
                      <span className="w-5 text-center font-mono text-[10px] font-bold text-brand-navy">{quantity}</span>
                      <button
                        type="button"
                        onClick={() => setQuantity(quantity + 1)}
                        className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-sm font-bold text-brand-primary shadow-sm transition-colors hover:bg-brand-primary hover:text-white"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 rounded-2xl border border-brand-primary/10 bg-brand-lavender/30 p-4">
                    <div className="space-y-1.5 font-mono text-[9px] text-brand-navy/50">
                      <div className="flex justify-between">
                        <span>Base piece</span>
                        <span>{formatINR(price.basePrice)}</span>
                      </div>
                      {price.personalizationFee > 0 && (
                        <div className="flex justify-between">
                          <span>Personalisation</span>
                          <span>+{formatINR(price.personalizationFee)}</span>
                        </div>
                      )}
                      {price.materialSurcharge > 0 && (
                        <div className="flex justify-between">
                          <span>Material ({selectedMaterial})</span>
                          <span>+{formatINR(price.materialSurcharge)}</span>
                        </div>
                      )}
                      {price.sizeSurcharge > 0 && (
                        <div className="flex justify-between">
                          <span>Size upgrade</span>
                          <span>+{formatINR(price.sizeSurcharge)}</span>
                        </div>
                      )}
                      {price.accessoriesFee > 0 && (
                        <div className="flex justify-between">
                          <span>Add-ons</span>
                          <span>+{formatINR(price.accessoriesFee)}</span>
                        </div>
                      )}
                    </div>
                    <div className="mt-3 flex items-end justify-between border-t border-brand-primary/10 pt-3">
                      <div>
                        <span className="font-mono text-[8px] uppercase tracking-[0.16em] text-brand-primary/40">
                          Total {quantity > 1 ? `· ${quantity} pieces` : ''}
                        </span>
                        <div className="mt-1 font-display text-[2.2rem] leading-none tracking-[-0.03em] text-brand-navy">
                          {formatINR(price.totalForQuantity)}
                        </div>
                      </div>
                      <span className="font-mono text-[8px] uppercase tracking-[0.1em] text-brand-primary/35">
                        incl. personalisation
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-5 space-y-2.5">
                <button
                  type="button"
                  onClick={addCurrentToCart}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-brand-primary px-5 py-3.5 font-mono text-[10px] uppercase tracking-[0.15em] text-white transition-all hover:-translate-y-0.5 hover:bg-brand-pink"
                >
                  <ShoppingBag className="h-4 w-4" />
                  Add customised piece to cart
                </button>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={buyNow}
                    className="flex items-center justify-center gap-1.5 rounded-full bg-brand-gold px-4 py-3 font-mono text-[9px] uppercase tracking-[0.13em] text-brand-navy transition-colors hover:bg-white"
                  >
                    Buy now
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={viewSummary}
                    className="flex items-center justify-center gap-1.5 rounded-full border border-brand-primary/15 bg-white px-4 py-3 font-mono text-[9px] uppercase tracking-[0.13em] text-brand-primary transition-colors hover:bg-brand-lavender"
                  >
                    <FileCheck className="h-3.5 w-3.5" />
                    Design summary
                  </button>
                </div>
              </div>

              <div className="mt-4 flex items-start gap-2 rounded-xl border border-brand-primary/10 bg-brand-lavender/30 px-3 py-2.5">
                <HelpCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-primary/40" />
                <p className="font-mono text-[7px] uppercase leading-relaxed tracking-[0.1em] text-brand-navy/40">
                  Rendering is a design preview, not a manufacturing validation. The studio reviews
                  wall thickness, supports and finish before printing.
                </p>
              </div>

              {added && (
                <div className="mt-3 flex items-center justify-between gap-3 rounded-xl border border-brand-teal/20 bg-brand-mint px-3 py-2.5 text-[10px] text-brand-pine">
                  <span className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-brand-teal" />
                    Added to cart.
                  </span>
                  <Link href="/cart" className="font-mono text-[8px] uppercase tracking-[0.12em] underline">
                    View cart
                  </Link>
                </div>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
