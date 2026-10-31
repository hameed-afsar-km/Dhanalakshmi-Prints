'use client';

import { useState, useEffect } from 'react';
import { Product, CartItem, Order, CustomPrintRequest, DeliverySettings, OrderFulfillmentStatus } from '@/types';
import { INITIAL_PRODUCTS, INITIAL_ORDERS, INITIAL_QUOTATIONS, INITIAL_DELIVERY_SETTINGS } from './seed-data';

const STORAGE_KEYS = {
  PRODUCTS: 'dp_products_v2',
  CART: 'dp_cart_v2',
  ORDERS: 'dp_orders_v2',
  QUOTATIONS: 'dp_quotations_v2',
  DELIVERY_SETTINGS: 'dp_delivery_settings_v2',
  ADMIN_AUTH: 'dp_admin_auth_v2',
};

// In-memory cache
let stateCache = {
  products: INITIAL_PRODUCTS,
  cart: [] as CartItem[],
  orders: INITIAL_ORDERS,
  quotations: INITIAL_QUOTATIONS,
  deliverySettings: INITIAL_DELIVERY_SETTINGS,
  isAdminLoggedIn: false,
};

// Event listeners for reactive state updates
type Listener = () => void;
const listeners = new Set<Listener>();

function notify() {
  listeners.forEach((listener) => listener());
}

function loadFromStorage() {
  if (typeof window === 'undefined') return;
  try {
    const storedProducts = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    if (storedProducts) stateCache.products = JSON.parse(storedProducts);

    const storedCart = localStorage.getItem(STORAGE_KEYS.CART);
    if (storedCart) stateCache.cart = JSON.parse(storedCart);

    const storedOrders = localStorage.getItem(STORAGE_KEYS.ORDERS);
    if (storedOrders) stateCache.orders = JSON.parse(storedOrders);

    const storedQuotations = localStorage.getItem(STORAGE_KEYS.QUOTATIONS);
    if (storedQuotations) stateCache.quotations = JSON.parse(storedQuotations);

    const storedSettings = localStorage.getItem(STORAGE_KEYS.DELIVERY_SETTINGS);
    if (storedSettings) stateCache.deliverySettings = JSON.parse(storedSettings);

    const storedAdmin = localStorage.getItem(STORAGE_KEYS.ADMIN_AUTH);
    if (storedAdmin) stateCache.isAdminLoggedIn = JSON.parse(storedAdmin);
  } catch (err) {
    console.error('Error loading state from localStorage:', err);
  }
}

function saveToStorage(key: string, value: unknown) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error('Error saving state to localStorage:', err);
  }
}

// Initialize on client load
if (typeof window !== 'undefined') {
  loadFromStorage();
}

export const store = {
  getState() {
    return stateCache;
  },

  // Cart operations
  addToCart(item: CartItem) {
    const existingIndex = stateCache.cart.findIndex(
      (c) => c.productId === item.productId && JSON.stringify(c.customization) === JSON.stringify(item.customization)
    );

    if (existingIndex >= 0) {
      stateCache.cart[existingIndex].quantity += item.quantity;
    } else {
      stateCache.cart.push(item);
    }

    saveToStorage(STORAGE_KEYS.CART, stateCache.cart);
    notify();
  },

  updateCartQuantity(itemId: string, quantity: number) {
    if (quantity <= 0) {
      this.removeFromCart(itemId);
      return;
    }
    stateCache.cart = stateCache.cart.map((item) =>
      item.id === itemId ? { ...item, quantity } : item
    );
    saveToStorage(STORAGE_KEYS.CART, stateCache.cart);
    notify();
  },

  removeFromCart(itemId: string) {
    stateCache.cart = stateCache.cart.filter((item) => item.id !== itemId);
    saveToStorage(STORAGE_KEYS.CART, stateCache.cart);
    notify();
  },

  clearCart() {
    stateCache.cart = [];
    saveToStorage(STORAGE_KEYS.CART, stateCache.cart);
    notify();
  },

  // Orders
  createOrder(order: Order): Order {
    stateCache.orders = [order, ...stateCache.orders];
    saveToStorage(STORAGE_KEYS.ORDERS, stateCache.orders);
    this.clearCart();
    notify();
    return order;
  },

  updateOrderStatus(orderId: string, newStatus: OrderFulfillmentStatus, note?: string) {
    const now = new Date().toISOString();
    stateCache.orders = stateCache.orders.map((ord) => {
      if (ord.id === orderId) {
        return {
          ...ord,
          fulfillmentStatus: newStatus,
          updatedAt: now,
          statusHistory: [
            ...ord.statusHistory,
            {
              status: newStatus,
              timestamp: now,
              note: note || `Order marked as ${newStatus} by admin`,
            },
          ],
        };
      }
      return ord;
    });
    saveToStorage(STORAGE_KEYS.ORDERS, stateCache.orders);
    notify();
  },

  // Quotations
  submitQuotationRequest(request: CustomPrintRequest): CustomPrintRequest {
    stateCache.quotations = [request, ...stateCache.quotations];
    saveToStorage(STORAGE_KEYS.QUOTATIONS, stateCache.quotations);
    notify();
    return request;
  },

  publishQuotation(
    quoteId: string,
    quote: {
      quotedPrice: number;
      estimatedLeadDays: number;
      validUntilDate: string;
      ownerNotes?: string;
    }
  ) {
    const now = new Date().toISOString();
    stateCache.quotations = stateCache.quotations.map((q) => {
      if (q.id === quoteId) {
        return {
          ...q,
          status: 'Quotation Ready' as const,
          updatedAt: now,
          quote: {
            ...quote,
            publishedAt: now,
          },
        };
      }
      return q;
    });
    saveToStorage(STORAGE_KEYS.QUOTATIONS, stateCache.quotations);
    notify();
  },

  acceptQuotation(quoteId: string) {
    stateCache.quotations = stateCache.quotations.map((q) => {
      if (q.id === quoteId) {
        return {
          ...q,
          status: 'Accepted' as const,
          updatedAt: new Date().toISOString(),
        };
      }
      return q;
    });
    saveToStorage(STORAGE_KEYS.QUOTATIONS, stateCache.quotations);
    notify();
  },

  rejectQuotation(quoteId: string) {
    stateCache.quotations = stateCache.quotations.map((q) => {
      if (q.id === quoteId) {
        return {
          ...q,
          status: 'Rejected' as const,
          updatedAt: new Date().toISOString(),
        };
      }
      return q;
    });
    saveToStorage(STORAGE_KEYS.QUOTATIONS, stateCache.quotations);
    notify();
  },

  // Products
  updateProduct(productId: string, updates: Partial<Product>) {
    stateCache.products = stateCache.products.map((p) =>
      p.id === productId ? { ...p, ...updates } : p
    );
    saveToStorage(STORAGE_KEYS.PRODUCTS, stateCache.products);
    notify();
  },

  addProduct(product: Product) {
    stateCache.products = [product, ...stateCache.products];
    saveToStorage(STORAGE_KEYS.PRODUCTS, stateCache.products);
    notify();
  },

  // Delivery Settings
  updateDeliverySettings(settings: DeliverySettings) {
    stateCache.deliverySettings = settings;
    saveToStorage(STORAGE_KEYS.DELIVERY_SETTINGS, stateCache.deliverySettings);
    notify();
  },

  // Admin Auth
  setAdminLoggedIn(status: boolean) {
    stateCache.isAdminLoggedIn = status;
    saveToStorage(STORAGE_KEYS.ADMIN_AUTH, status);
    notify();
  },

  // Reset to Demo Data
  resetToDemoData() {
    stateCache = {
      products: INITIAL_PRODUCTS,
      cart: [],
      orders: INITIAL_ORDERS,
      quotations: INITIAL_QUOTATIONS,
      deliverySettings: INITIAL_DELIVERY_SETTINGS,
      isAdminLoggedIn: true,
    };
    if (typeof window !== 'undefined') {
      localStorage.clear();
      saveToStorage(STORAGE_KEYS.PRODUCTS, stateCache.products);
      saveToStorage(STORAGE_KEYS.ORDERS, stateCache.orders);
      saveToStorage(STORAGE_KEYS.QUOTATIONS, stateCache.quotations);
      saveToStorage(STORAGE_KEYS.DELIVERY_SETTINGS, stateCache.deliverySettings);
      saveToStorage(STORAGE_KEYS.ADMIN_AUTH, stateCache.isAdminLoggedIn);
    }
    notify();
  },
};

// React Hook
export function useStore() {
  const [state, setState] = useState(() => store.getState());

  useEffect(() => {
    loadFromStorage();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState({ ...store.getState() });

    const handleUpdate = () => {
      setState({ ...store.getState() });
    };

    listeners.add(handleUpdate);
    return () => {
      listeners.delete(handleUpdate);
    };
  }, []);

  return {
    ...state,
    addToCart: store.addToCart.bind(store),
    updateCartQuantity: store.updateCartQuantity.bind(store),
    removeFromCart: store.removeFromCart.bind(store),
    clearCart: store.clearCart.bind(store),
    createOrder: store.createOrder.bind(store),
    updateOrderStatus: store.updateOrderStatus.bind(store),
    submitQuotationRequest: store.submitQuotationRequest.bind(store),
    publishQuotation: store.publishQuotation.bind(store),
    acceptQuotation: store.acceptQuotation.bind(store),
    rejectQuotation: store.rejectQuotation.bind(store),
    updateProduct: store.updateProduct.bind(store),
    addProduct: store.addProduct.bind(store),
    updateDeliverySettings: store.updateDeliverySettings.bind(store),
    setAdminLoggedIn: store.setAdminLoggedIn.bind(store),
    resetToDemoData: store.resetToDemoData.bind(store),
  };
}
