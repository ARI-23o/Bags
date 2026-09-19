import { describe, it, expect } from 'vitest';
import { formatTRY } from '../src/utils/currency';
import { getProductWhatsAppLink, getCartWhatsAppLink } from '../src/utils/whatsapp';
import { Product, CartItem } from '../src/types';

describe('Turkish Currency Formatter', () => {
  it('formats whole numbers to Turkish Lira with comma decimal', () => {
    expect(formatTRY(1299)).toBe('₺1.299,00');
  });

  it('formats decimals correctly', () => {
    expect(formatTRY(949.9)).toBe('₺949,90');
    expect(formatTRY(1499.55)).toBe('₺1.499,55');
  });

  it('handles 0, null, and undefined values safely', () => {
    expect(formatTRY(0)).toBe('₺0,00');
    expect(formatTRY(null)).toBe('₺0,00');
    expect(formatTRY(undefined)).toBe('₺0,00');
  });
});

describe('WhatsApp Link Generation', () => {
  const sampleProduct: Product = {
    _id: 'p1',
    title: 'Siyah Kapitone Omuz Çantası',
    slug: 'siyah-kapitone-omuz-cantasi',
    sku: 'NC-OMZ-001',
    category: { _id: 'c1', name: 'Omuz Çantaları', slug: 'omuz-cantalari' },
    price: 1299.90,
    stock: 10,
    images: [],
    primaryImage: 'https://example.com/bag.jpg',
    colors: [{ name: 'Siyah', hexCode: '#000', stock: 10 }],
    status: 'active'
  };

  it('creates product WhatsApp message with title, SKU, color and price', () => {
    const link = getProductWhatsAppLink(sampleProduct, 'Siyah', '905320000000');
    expect(link).toContain('https://wa.me/905320000000?text=');
    expect(link).toContain(encodeURIComponent('Siyah Kapitone Omuz Çantası'));
    expect(link).toContain(encodeURIComponent('NC-OMZ-001'));
  });

  it('creates cart WhatsApp message with item list and total', () => {
    const cartItems: CartItem[] = [
      { product: sampleProduct, selectedColor: { name: 'Siyah', hexCode: '#000', stock: 10 }, quantity: 2 }
    ];
    const link = getCartWhatsAppLink(cartItems, 2599.80, 0, 2599.80, '905320000000');
    expect(link).toContain('https://wa.me/905320000000?text=');
    expect(link).toContain(encodeURIComponent('2 Adet'));
    expect(link).toContain(encodeURIComponent('₺2.599,80'));
  });
});
