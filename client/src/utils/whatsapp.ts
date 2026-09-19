import { CartItem, Product } from '../types';
import { formatTRY } from './currency';

/**
 * Generate a prefilled WhatsApp link for a single product inquiry
 */
export const getProductWhatsAppLink = (
  product: Product,
  selectedColorName?: string,
  whatsAppNumber: string = '905000000000'
): string => {
  const cleanNumber = whatsAppNumber.replace(/\D/g, '');
  const productUrl = typeof window !== 'undefined' ? `${window.location.origin}/urun/${product.slug}` : '';

  const colorText = selectedColorName ? `\nRenk: ${selectedColorName}` : '';
  const priceText = formatTRY(product.price);

  const message = `Merhaba Nehir Çanta, şu ürün hakkında bilgi almak istiyorum:

👜 Ürün: ${product.title}
🏷️ Ürün Kodu: ${product.sku}${colorText}
💰 Fiyat: ${priceText}

🔗 Ürün Linki:
${productUrl}`;

  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
};

/**
 * Generate a prefilled WhatsApp link for direct cart ordering
 */
export const getCartWhatsAppLink = (
  items: CartItem[],
  subtotal: number,
  shippingFee: number,
  total: number,
  whatsAppNumber: string = '905000000000'
): string => {
  const cleanNumber = whatsAppNumber.replace(/\D/g, '');

  const itemsList = items
    .map((item, index) => {
      const colorStr = item.selectedColor?.name ? ` (${item.selectedColor.name})` : '';
      return `${index + 1}. ${item.product.title}${colorStr} - ${item.quantity} Adet (${formatTRY(item.product.price * item.quantity)})`;
    })
    .join('\n');

  const shippingStr = shippingFee === 0 ? 'Ücretsiz Kargo' : formatTRY(shippingFee);

  const message = `Merhaba Nehir Çanta, web sitenizden aşağıdaki ürünleri sipariş vermek istiyorum:

${itemsList}

-------------------------
📦 Kargo: ${shippingStr}
💳 Toplam Tutar: ${formatTRY(total)}
-------------------------

Siparişimi oluşturmak için yardımcı olabilir misiniz?`;

  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
};

/**
 * Generate general inquiry link
 */
export const getGeneralWhatsAppLink = (
  message: string = 'Merhaba Nehir Çanta, ürünleriniz hakkında bilgi almak istiyorum.',
  whatsAppNumber: string = '905000000000'
): string => {
  const cleanNumber = whatsAppNumber.replace(/\D/g, '');
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
};
