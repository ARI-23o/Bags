/**
 * Form Validation and Input Formatting Utilities for Nehir Çanta
 */

// Turkish-aware name validator (letters, spaces, dots, hyphens)
export const validateName = (name: string): { isValid: boolean; error?: string } => {
  if (!name || name.trim().length < 2) {
    return { isValid: false, error: 'En az 2 karakter girilmelidir.' };
  }
  // Turkish letters + standard letters + space + apostrophe + hyphen
  const nameRegex = /^[a-zA-ZçÇğĞıİöÖşŞüÜ\s'-]+$/;
  if (!nameRegex.test(name.trim())) {
    return { isValid: false, error: 'Sadece harf girilmelidir.' };
  }
  return { isValid: true };
};

// Email validator (RFC compliant)
export const validateEmail = (email: string): { isValid: boolean; error?: string } => {
  if (!email || !email.trim()) {
    return { isValid: false, error: 'E-posta adresi zorunludur.' };
  }
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email.trim())) {
    return { isValid: false, error: 'Geçerli bir e-posta adresi giriniz (örn: isim@mail.com).' };
  }
  return { isValid: true };
};

// Turkish phone number validator (supports 05XX XXX XX XX, 5XX XXX XX XX, +90...)
export const validatePhone = (phone: string): { isValid: boolean; error?: string } => {
  if (!phone || !phone.trim()) {
    return { isValid: false, error: 'Telefon numarası zorunludur.' };
  }
  const cleanPhone = phone.replace(/\D/g, '');
  // Must be 10 digits (5XXXXXXXXX) or 11 digits (05XXXXXXXXX) or 12 digits (905XXXXXXXXX)
  if (
    (cleanPhone.length === 10 && cleanPhone.startsWith('5')) ||
    (cleanPhone.length === 11 && cleanPhone.startsWith('05')) ||
    (cleanPhone.length === 12 && cleanPhone.startsWith('905'))
  ) {
    return { isValid: true };
  }
  return { isValid: false, error: 'Geçerli bir telefon numarası giriniz (örn: 0532 123 45 67).' };
};

// Auto-formatter for Turkish Phone Numbers
export const formatPhoneNumber = (value: string): string => {
  // Strip all non-digits
  const digits = value.replace(/\D/g, '');
  if (!digits) return '';

  // Limit to 11 digits if starting with 0, or 10 if starting with 5
  let clean = digits;
  if (clean.startsWith('90')) clean = clean.slice(2);
  if (clean.length > 11) clean = clean.slice(0, 11);

  if (clean.length === 0) return '';
  if (clean.length <= 4) return clean;
  if (clean.length <= 7) return `${clean.slice(0, 4)} ${clean.slice(4)}`;
  if (clean.length <= 9) return `${clean.slice(0, 4)} ${clean.slice(4, 7)} ${clean.slice(7)}`;
  return `${clean.slice(0, 4)} ${clean.slice(4, 7)} ${clean.slice(7, 9)} ${clean.slice(9, 11)}`;
};

// Address validator
export const validateAddress = (address: string): { isValid: boolean; error?: string } => {
  if (!address || address.trim().length < 10) {
    return { isValid: false, error: 'Lütfen açık ve detaylı teslimat adresi giriniz (en az 10 karakter).' };
  }
  return { isValid: true };
};

// District validator
export const validateDistrict = (district: string): { isValid: boolean; error?: string } => {
  if (!district || district.trim().length < 2) {
    return { isValid: false, error: 'İlçe adı en az 2 karakter olmalıdır.' };
  }
  return { isValid: true };
};

// Turkish Postal Code (5 numeric digits)
export const validatePostalCode = (postalCode: string): { isValid: boolean; error?: string } => {
  if (!postalCode || !postalCode.trim()) return { isValid: true }; // optional
  const clean = postalCode.trim();
  if (!/^\d{5}$/.test(clean)) {
    return { isValid: false, error: 'Posta kodu 5 haneli sayıdan oluşmalıdır (örn: 34365).' };
  }
  return { isValid: true };
};

// Turkish Tax ID (VKN 10 digits or TCKN 11 digits)
export const validateTaxId = (taxId: string): { isValid: boolean; error?: string } => {
  if (!taxId || !taxId.trim()) return { isValid: true }; // optional
  const clean = taxId.trim().replace(/\D/g, '');
  if (clean.length !== 10 && clean.length !== 11) {
    return { isValid: false, error: 'Vergi No (10 hane) veya T.C. Kimlik No (11 hane) giriniz.' };
  }
  return { isValid: true };
};
