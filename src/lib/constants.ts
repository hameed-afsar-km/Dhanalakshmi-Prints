export const BRAND = {
  name: 'Dhanalakshmi Prints',
  tagline: 'Your Ideas. Made Real in 3D.',
  description: 'Premium custom 3D printing, bespoke personalized accessories, and rapid digital fabrication studio.',
  logoUrl: '/assets/logo.png',
  paletteUrl: '/assets/color-palette.png',
  supportEmail: 'contact@dhanalakshmiprints.com',
  phone: '+91 98400 12345',
  whatsappNumber: '919840012345',
  location: 'Chennai, Tamil Nadu, India',
  currency: '₹',
  colors: {
    primaryIndigo: '#1c0b60',
    midnightNavy: '#0d1e3e',
    accentPink: '#e71e64',
    accentRed: '#d42124',
    accentGold: '#fed003',
    accentTeal: '#019c87',
    deepWine: '#87193b',
    electricCoral: '#fc275d',
    pineTeal: '#02665f',
    offWhite: '#f8f8f7',
  }
};

export const DEFAULT_DELIVERY_SLOTS = [
  { id: 'slot-1', label: '9:00 AM – 12:00 PM (Morning Slot)', isAvailable: true },
  { id: 'slot-2', label: '12:00 PM – 3:00 PM (Afternoon Slot)', isAvailable: true },
  { id: 'slot-3', label: '3:00 PM – 6:00 PM (Evening Slot)', isAvailable: true },
  { id: 'slot-4', label: '6:00 PM – 9:00 PM (Night Express)', isAvailable: true },
];

export const AVAILABLE_MATERIALS = [
  { id: 'PLA', name: 'Standard PLA', description: 'Eco-friendly, crisp details, smooth finish' },
  { id: 'Silk PLA', name: 'Silk PLA', description: 'Ultra-glossy metallic sheen with satin touch' },
  { id: 'PETG', name: 'Tough PETG', description: 'Durable, heat-resistant, weather-proof' },
  { id: 'Resin', name: 'High-Detail Resin', description: 'Micron-level resolution for intricate models' },
  { id: 'Carbon Fiber PLA', name: 'Carbon Fiber PLA', description: 'Stiff, lightweight matte architectural finish' },
];

export const STANDARD_SWATCH_COLORS = [
  { id: 'indigo', name: 'Royal Indigo', hex: '#1c0b60', previewHex: '#1c0b60' },
  { id: 'navy', name: 'Midnight Navy', hex: '#0d1e3e', previewHex: '#0d1e3e' },
  { id: 'pink', name: 'Electric Pink', hex: '#e71e64', previewHex: '#e71e64' },
  { id: 'coral', name: 'Neon Coral', hex: '#fc275d', previewHex: '#fc275d' },
  { id: 'red', name: 'Crimson Red', hex: '#d42124', previewHex: '#d42124' },
  { id: 'gold', name: 'Lustrous Gold', hex: '#fed003', previewHex: '#fed003' },
  { id: 'teal', name: 'Cyber Teal', hex: '#019c87', previewHex: '#019c87' },
  { id: 'pine', name: 'Deep Pine', hex: '#02665f', previewHex: '#02665f' },
  { id: 'wine', name: 'Velvet Wine', hex: '#87193b', previewHex: '#87193b' },
  { id: 'white', name: 'Pure White', hex: '#f8f8f7', previewHex: '#f8f8f7' },
  { id: 'black', name: 'Stealth Black', hex: '#111827', previewHex: '#111827' },
];
