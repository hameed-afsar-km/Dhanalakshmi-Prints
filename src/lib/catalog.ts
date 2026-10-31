import type { Product, ProductCategory, ProductModelType, SavedCustomization } from '@/types';

export const PRODUCT_CATEGORIES: ProductCategory[] = [
  'Keychains',
  'Personalized Gifts',
  'Miniatures',
  'Desk Accessories',
  'Home Decor',
  'Custom Creations',
];

export const CATEGORY_META: Record<
  ProductCategory,
  { blurb: string; accent: string; tint: string }
> = {
  Keychains: {
    blurb: 'Pocket-sized keepsakes with crisp, durable lettering.',
    accent: 'text-brand-primary',
    tint: 'bg-brand-lavender',
  },
  'Personalized Gifts': {
    blurb: 'Names, dates and inside jokes — made tangible.',
    accent: 'text-brand-pink',
    tint: 'bg-brand-blush',
  },
  Miniatures: {
    blurb: 'Sculptural pieces that show what additive printing can do.',
    accent: 'text-brand-teal',
    tint: 'bg-brand-mint',
  },
  'Desk Accessories': {
    blurb: 'Considered objects for a workspace that feels like yours.',
    accent: 'text-brand-navy',
    tint: 'bg-brand-cream',
  },
  'Home Decor': {
    blurb: 'Warm, light-catching objects for the rooms you live in.',
    accent: 'text-brand-wine',
    tint: 'bg-brand-blush',
  },
  'Custom Creations': {
    blurb: 'One-off commissions shaped around your story.',
    accent: 'text-brand-royal',
    tint: 'bg-brand-lavender',
  },
};

export function formatINR(value: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
}

export function getProductBySlugOrId(products: Product[], key: string) {
  const decoded = decodeURIComponent(key).toLowerCase();
  return products.find(
    (product) =>
      product.slug.toLowerCase() === decoded || product.id.toLowerCase() === decoded
  );
}

export function getProductHref(product: Pick<Product, 'slug'>) {
  return `/products/${product.slug}`;
}

export function getCustomizeHref(product: Pick<Product, 'slug'>) {
  return `/customize/${product.slug}`;
}

export function getDefaultCustomization(product: Product): SavedCustomization {
  const schema = product.customizationSchema;
  return {
    text: schema.defaultText ?? '',
    bodyColor: schema.supportedColors[0]?.hex ?? '#1c0b60',
    textColor: schema.supportedColors.find((color) => color.id === 'gold')?.hex ?? '#fed003',
    material: schema.supportedMaterials?.[0] ?? 'PLA',
    sizeId: schema.supportedSizes?.[0]?.id,
    selectedAccessories: [],
  };
}

export function getRelatedProducts(products: Product[], product: Product, limit = 3) {
  return products
    .filter((item) => item.id !== product.id && item.isPublished)
    .sort((a, b) => {
      const aScore = a.category === product.category ? 2 : 0;
      const bScore = b.category === product.category ? 2 : 0;
      return bScore - aScore;
    })
    .slice(0, limit);
}

export function getProductHighlights(product: Product) {
  if (product.highlights?.length) return product.highlights;

  const schema = product.customizationSchema;
  const highlights: string[] = [];

  if (schema.allowText) {
    highlights.push(
      `Personalised ${schema.textLabel?.toLowerCase() ?? 'lettering'} printed directly into the piece`
    );
  }
  if (schema.supportedMaterials?.length) {
    highlights.push(`Choose from ${schema.supportedMaterials.length} studio materials`);
  }
  if (schema.supportedSizes?.length) {
    highlights.push(`${schema.supportedSizes.length} size options with live price updates`);
  }
  highlights.push('Designed, printed and finished in our Chennai studio');
  highlights.push('Preview renders are indicative — final print finish may vary slightly');

  return highlights.slice(0, 4);
}

export function getProductSpecifications(product: Product) {
  const schema = product.customizationSchema;
  const dims = product.dimensionsMm;

  const specs = [
    { label: 'Footprint', value: `${dims.x} x ${dims.y} x ${dims.z} mm` },
    {
      label: 'Materials',
      value: schema.supportedMaterials?.length
        ? schema.supportedMaterials.join(', ')
        : 'Studio PLA',
    },
    {
      label: 'Personalisation',
      value: schema.allowText ? 'Text personalisation available' : 'Colour and finish options',
    },
    {
      label: 'Lead time',
      value: `${product.productionDays ?? 3}–${(product.productionDays ?? 3) + 2} working days`,
    },
    { label: 'Finishing', value: 'Hand-checked, de-burred and packed with protective foam' },
  ];

  if (product.specifications?.length) {
    return [...product.specifications, ...specs];
  }
  return specs;
}

export function getModelTypeLabel(modelType: ProductModelType) {
  const labels: Record<ProductModelType, string> = {
    'plate-keychain': 'Automotive plate keychain',
    'name-keychain': 'Extruded name keychain',
    'desk-nameplate': 'Weighted desk nameplate',
    'bag-tag': 'Travel bag tag',
    'decorative-miniature': 'Sculptural miniature',
    'lithophane-lamp': 'Lithophane photo lamp',
    figurine: 'Bespoke figurine',
  };
  return labels[modelType];
}
