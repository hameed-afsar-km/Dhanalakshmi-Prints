import { Product, SavedCustomization, SizeOption } from '@/types';

export interface PriceBreakdown {
  basePrice: number;
  personalizationFee: number;
  materialSurcharge: number;
  sizeSurcharge: number;
  accessoriesFee: number;
  unitTotal: number;
  totalForQuantity: number;
}

export function calculateCustomizedPrice(
  product: Product,
  customization: SavedCustomization,
  quantity: number = 1
): PriceBreakdown {
  const schema = product.customizationSchema;
  const basePrice = product.basePrice || product.startingPrice || 199;

  // Personalization fee (applied if custom text differs from default or has non-empty text)
  let personalizationFee = 0;
  if (schema.allowText && customization.text && customization.text.trim().length > 0) {
    personalizationFee = schema.pricingRules.personalizationFee || 0;
  }

  // Material surcharge
  let materialSurcharge = 0;
  if (customization.material && schema.pricingRules.materialSurcharges[customization.material]) {
    materialSurcharge = schema.pricingRules.materialSurcharges[customization.material];
  }

  // Size surcharge
  let sizeSurcharge = 0;
  if (customization.sizeId && schema.supportedSizes) {
    const matchedSize = schema.supportedSizes.find((s: SizeOption) => s.id === customization.sizeId);
    if (matchedSize) {
      sizeSurcharge = matchedSize.surcharge || 0;
    }
  }

  // Accessories fee
  let accessoriesFee = 0;
  if (customization.selectedAccessories && customization.selectedAccessories.length > 0) {
    customization.selectedAccessories.forEach((accId) => {
      const fee = schema.pricingRules.accessoryPrices[accId] || 0;
      accessoriesFee += fee;
    });
  }

  const unitTotal = Math.max(0, basePrice + personalizationFee + materialSurcharge + sizeSurcharge + accessoriesFee);
  const totalForQuantity = unitTotal * Math.max(1, quantity);

  return {
    basePrice,
    personalizationFee,
    materialSurcharge,
    sizeSurcharge,
    accessoriesFee,
    unitTotal,
    totalForQuantity,
  };
}

export function calculateOrderSummary(
  items: Array<{ unitPrice: number; quantity: number }>,
  deliveryFee: number = 60,
  freeThreshold: number = 999
) {
  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const appliedDelivery = subtotal >= freeThreshold || items.length === 0 ? 0 : deliveryFee;
  const discount = 0;
  const total = subtotal + appliedDelivery - discount;

  return {
    subtotal,
    deliveryFee: appliedDelivery,
    discount,
    total,
    isFreeDelivery: subtotal >= freeThreshold && items.length > 0,
  };
}
