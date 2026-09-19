import React, { createContext, useContext, useEffect, useState } from 'react';
import { CartItem, Product, ColorVariant } from '../types';
import { useSettings } from './SettingsContext';
import api from '../services/api';

interface AppliedCoupon {
  code: string;
  discountType: 'percent' | 'fixed';
  discountValue: number;
  discountAmount: number;
}

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addToCart: (product: Product, color?: ColorVariant, quantity?: number) => void;
  updateQuantity: (productId: string, colorName?: string, quantity?: number) => void;
  removeFromCart: (productId: string, colorName?: string) => void;
  clearCart: () => void;
  subtotal: number;
  shippingFee: number;
  isFreeShipping: boolean;
  freeShippingRemaining: number;
  discountAmount: number;
  appliedCoupon: AppliedCoupon | null;
  applyCoupon: (code: string) => Promise<{ success: boolean; message: string }>;
  removeCoupon: () => void;
  total: number;
  totalItemsCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { settings } = useSettings();
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('nehir_canta_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isOpen, setIsOpen] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem('nehir_canta_cart', JSON.stringify(items));
    } catch (e) {
      console.error(e);
    }
  }, [items]);

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);
  const toggleCart = () => setIsOpen(prev => !prev);

  const addToCart = (product: Product, color?: ColorVariant, quantity: number = 1) => {
    setItems(prevItems => {
      const existingIndex = prevItems.findIndex(
        item => item.product._id === product._id && (item.selectedColor?.name === color?.name)
      );

      if (existingIndex > -1) {
        const updated = [...prevItems];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [...prevItems, { product, selectedColor: color, quantity }];
      }
    });

    setIsOpen(true);
  };

  const updateQuantity = (productId: string, colorName?: string, quantity: number = 1) => {
    if (quantity <= 0) {
      removeFromCart(productId, colorName);
      return;
    }

    setItems(prevItems =>
      prevItems.map(item => {
        if (item.product._id === productId && item.selectedColor?.name === colorName) {
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  const removeFromCart = (productId: string, colorName?: string) => {
    setItems(prevItems =>
      prevItems.filter(
        item => !(item.product._id === productId && item.selectedColor?.name === colorName)
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    setAppliedCoupon(null);
  };

  // Subtotal calculation
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  // Shipping calculation
  const { standardRate = 79.9, freeShippingThreshold = 1000, isFreeShippingEnabled = true } =
    settings.shippingSettings || {};

  const isFreeShipping = isFreeShippingEnabled && subtotal >= freeShippingThreshold;
  const shippingFee = subtotal === 0 ? 0 : (isFreeShipping ? 0 : standardRate);
  const freeShippingRemaining = Math.max(0, freeShippingThreshold - subtotal);

  // Discount calculation
  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === 'percent') {
      discountAmount = (subtotal * appliedCoupon.discountValue) / 100;
    } else {
      discountAmount = Math.min(appliedCoupon.discountValue, subtotal);
    }
  }

  const total = Math.max(0, subtotal + shippingFee - discountAmount);
  const totalItemsCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const applyCoupon = async (code: string) => {
    try {
      const response = await api.post('/coupons/validate', {
        code,
        cartSubtotal: subtotal
      });

      if (response.data.success && response.data.coupon) {
        setAppliedCoupon(response.data.coupon);
        return { success: true, message: 'Kupon uygulandı!' };
      }
      return { success: false, message: response.data.message || 'Geçersiz kupon.' };
    } catch (error: any) {
      return { success: false, message: error.message || 'Kupon uygulanamadı.' };
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        openCart,
        closeCart,
        toggleCart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        subtotal,
        shippingFee,
        isFreeShipping,
        freeShippingRemaining,
        discountAmount,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        total,
        totalItemsCount
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
