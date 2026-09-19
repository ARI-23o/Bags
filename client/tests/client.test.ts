import { describe, it, expect } from 'vitest';
import { formatTRY } from '../src/utils/currency';
import { getProductWhatsAppLink, getCartWhatsAppLink } from '../src/utils/whatsapp';
import {
  validateName,
  validateEmail,
  validatePhone,
  formatPhoneNumber,
  validateAddress,
  validatePostalCode,
  validateTaxId
} from '../src/utils/validators';
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

describe('Form Validation & Masking Rules', () => {
  it('validates Turkish names strictly and rejects numbers/symbols', () => {
    expect(validateName('Ayşe').isValid).toBe(true);
    expect(validateName('Mehmet Ali').isValid).toBe(true);
    expect(validateName('Şule Çelik').isValid).toBe(true);
    expect(validateName('Ömer Faruk-Güneş').isValid).toBe(true);

    // Invalid names
    expect(validateName('A').isValid).toBe(false);
    expect(validateName('').isValid).toBe(false);
    expect(validateName('Ayse123').isValid).toBe(false);
    expect(validateName('John!@#').isValid).toBe(false);
  });

  it('validates RFC email addresses and rejects gibberish text', () => {
    expect(validateEmail('ayse@example.com').isValid).toBe(true);
    expect(validateEmail('info.musteri@nehircanta.com.tr').isValid).toBe(true);

    // Invalid emails
    expect(validateEmail('DFGFFDFGFGFD').isValid).toBe(false);
    expect(validateEmail('test@').isValid).toBe(false);
    expect(validateEmail('test@domain').isValid).toBe(false);
    expect(validateEmail('').isValid).toBe(false);
  });

  it('validates and auto-formats Turkish phone numbers', () => {
    expect(validatePhone('0532 123 45 67').isValid).toBe(true);
    expect(validatePhone('5321234567').isValid).toBe(true);
    expect(validatePhone('+90 532 123 45 67').isValid).toBe(true);

    // Invalid phones
    expect(validatePhone('DFGFDFGDGFDFG').isValid).toBe(false);
    expect(validatePhone('12345').isValid).toBe(false);
    expect(validatePhone('0212 000 00 00').isValid).toBe(false); // Mobile expected

    // Formatter
    expect(formatPhoneNumber('05321234567')).toBe('0532 123 45 67');
  });

  it('validates full address length and postal codes', () => {
    expect(validateAddress('Kısa').isValid).toBe(false);
    expect(validateAddress('Teşvikiye Mah. Valikonağı Cad. No: 42 Daire: 5').isValid).toBe(true);

    expect(validatePostalCode('34365').isValid).toBe(true);
    expect(validatePostalCode('DFG').isValid).toBe(false);
    expect(validatePostalCode('1234').isValid).toBe(false);
  });

  it('validates tax identifiers (VKN / TCKN)', () => {
    expect(validateTaxId('1234567890').isValid).toBe(true); // 10 digits
    expect(validateTaxId('12345678901').isValid).toBe(true); // 11 digits
    expect(validateTaxId('12345').isValid).toBe(false);
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
