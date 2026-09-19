import { describe, it, expect } from 'vitest';
import { slugifyTurkish } from '../src/utils/slugify.js';

describe('Turkish Utilities Tests', () => {
  it('correctly converts Turkish special characters in slugify', () => {
    const title = 'Şık Kadın Omuz Çantası & Bej Cüzdan';
    const slug = slugifyTurkish(title);
    expect(slug).toBe('sik-kadin-omuz-cantasi-bej-cuzdan');
  });

  it('handles uppercase dotted and dotless I correctly', () => {
    const title = 'İndirimli Işıltılı Gece Çantası';
    const slug = slugifyTurkish(title);
    expect(slug).toBe('indirimli-isiltili-gece-cantasi');
  });

  it('handles empty and whitespace strings gracefully', () => {
    expect(slugifyTurkish('')).toBe('');
    expect(slugifyTurkish('   ')).toBe('');
  });
});

describe('E-Commerce Business Calculations', () => {
  it('correctly calculates free shipping eligibility threshold', () => {
    const threshold = 1000;
    const standardFee = 79.90;
    
    const cartTotal1 = 850;
    const shippingFee1 = cartTotal1 >= threshold ? 0 : standardFee;
    expect(shippingFee1).toBe(79.90);

    const cartTotal2 = 1200;
    const shippingFee2 = cartTotal2 >= threshold ? 0 : standardFee;
    expect(shippingFee2).toBe(0);
  });

  it('correctly calculates percentage coupon discounts', () => {
    const subtotal = 1200;
    const percentDiscount = 10;
    const discountAmount = (subtotal * percentDiscount) / 100;
    const finalTotal = subtotal - discountAmount;

    expect(discountAmount).toBe(120);
    expect(finalTotal).toBe(1080);
  });
});
