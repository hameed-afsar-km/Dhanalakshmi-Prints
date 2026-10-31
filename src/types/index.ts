export type MaterialType = 'PLA' | 'PETG' | 'ABS' | 'Resin' | 'Silk PLA' | 'Carbon Fiber PLA';

export type FontOption = 'Inter' | 'Montserrat' | 'Playfair' | 'Bebas Neue' | 'Fira Code' | 'Orbitron' | 'Dancing Script' | 'Pacifico' | 'Caveat';

export interface ColorOption {
  id: string;
  name: string;
  hex: string;
  previewHex: string;
}

export interface AccessoryOption {
  id: string;
  name: string;
  price: number;
  description?: string;
}

export interface SizeOption {
  id: string;
  name: string;
  multiplier: number;
  dimensionsMm: { x: number; y: number; z: number };
  surcharge: number;
}

export interface ProductCustomizationSchema {
  allowText: boolean;
  textLabel?: string;
  maxTextLength?: number;
  defaultText?: string;
  textPositions?: Array<{ id: string; name: string }>;
  allowTextColor: boolean;
  allowBodyColor: boolean;
  supportedColors: ColorOption[];
  supportedFonts?: FontOption[];
  supportedMaterials?: MaterialType[];
  supportedSizes?: SizeOption[];
  supportedAccessories?: AccessoryOption[];
  pricingRules: {
    basePrice: number;
    personalizationFee: number;
    materialSurcharges: Record<string, number>;
    accessoryPrices: Record<string, number>;
  };
}

export type ProductCategory =
  | 'Keychains'
  | 'Personalized Gifts'
  | 'Miniatures'
  | 'Desk Accessories'
  | 'Home Decor'
  | 'Custom Creations';

export type ProductModelType =
  | 'plate-keychain'
  | 'name-keychain'
  | 'desk-nameplate'
  | 'bag-tag'
  | 'decorative-miniature'
  | 'lithophane-lamp'
  | 'figurine';

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: ProductCategory;
  shortDescription: string;
  description: string;
  basePrice: number;
  startingPrice: number;
  imageUrl: string;
  gallery?: string[];
  modelType: ProductModelType;
  customizable: boolean;
  isPublished: boolean;
  inStock: boolean;
  tags: string[];
  dimensionsMm: { x: number; y: number; z: number };
  customizationSchema: ProductCustomizationSchema;
  badge?: string;
  rating?: number;
  reviewCount?: number;
  productionDays?: number;
  highlights?: string[];
  specifications?: Array<{ label: string; value: string }>;
}

export interface SavedCustomization {
  text?: string;
  font?: FontOption;
  textColor?: string;
  bodyColor?: string;
  accentColor?: string;
  sizeId?: string;
  material?: MaterialType;
  selectedAccessories?: string[];
  notes?: string;
}

export interface CartItem {
  id: string;
  productId: string;
  productName: string;
  modelType: ProductModelType;
  imageUrl: string;
  unitPrice: number;
  quantity: number;
  customization: SavedCustomization;
  calculatedPriceBreakdown: {
    basePrice: number;
    personalizationFee: number;
    materialSurcharge: number;
    sizeSurcharge: number;
    accessoriesFee: number;
    unitTotal: number;
  };
}

export type OrderFulfillmentStatus = 
  | 'Pending'
  | 'Confirmed'
  | 'Printing'
  | 'Ready'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Cancelled';

export type PaymentMethod = 'Cash on Delivery' | 'Simulated Online Payment';
export type PaymentStatus = 'Pending' | 'Paid' | 'Failed' | 'Refunded';

export interface CustomerDetails {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  deliveryNotes?: string;
}

export interface DeliverySlot {
  id: string;
  label: string; // e.g. "9:00 AM - 12:00 PM"
  isAvailable: boolean;
}

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  updatedAt: string;
  customer: CustomerDetails;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  deliveryDate: string;
  deliverySlot: string;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  fulfillmentStatus: OrderFulfillmentStatus;
  statusHistory: Array<{
    status: OrderFulfillmentStatus;
    timestamp: string;
    note?: string;
  }>;
}

export type QuotationStatus = 
  | 'Draft'
  | 'Submitted'
  | 'Under Review'
  | 'Quotation Ready'
  | 'Accepted'
  | 'Rejected'
  | 'Expired';

export interface CustomPrintRequest {
  id: string;
  requestNumber: string;
  createdAt: string;
  updatedAt: string;
  customer: CustomerDetails;
  fileInfo: {
    fileName: string;
    fileSizeMb: number;
    fileFormat: 'stl' | 'obj' | 'glb' | 'gltf';
    storagePath?: string;
    rawGeometryDataUrl?: string; // base64 or object URL for demo preview
    estimatedDimensionsMm?: { x: number; y: number; z: number };
    triangleCount?: number;
  };
  preferences: {
    material: MaterialType;
    color: string;
    quantity: number;
    scalingPercentage: number;
    infillPercentage?: number;
    notes?: string;
  };
  status: QuotationStatus;
  quote?: {
    quotedPrice: number;
    estimatedLeadDays: number;
    validUntilDate: string;
    ownerNotes?: string;
    publishedAt?: string;
  };
}

export interface DeliverySettings {
  defaultDeliveryFee: number;
  freeDeliveryThreshold: number;
  productionLeadDays: number;
  availableSlots: DeliverySlot[];
  minOrderValue: number;
  enableCod: boolean;
  enableOnlinePayment: boolean;
}
