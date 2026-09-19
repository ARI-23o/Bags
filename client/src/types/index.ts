export interface ColorVariant {
  _id?: string;
  name: string;
  hexCode: string;
  stock: number;
  image?: string;
}

export interface Dimensions {
  width: string;
  height: string;
  depth: string;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  order?: number;
  isActive?: boolean;
  productCount?: number;
}

export interface Collection {
  _id: string;
  name: string;
  slug: string;
  subtitle?: string;
  description?: string;
  image?: string;
  bannerImage?: string;
  order?: number;
  isFeatured?: boolean;
  isActive?: boolean;
  productCount?: number;
}

export interface Product {
  _id: string;
  title: string;
  slug: string;
  sku: string;
  category: Category;
  collectionId?: Collection;
  price: number;
  comparePrice?: number | null;
  costPrice?: number;
  stock: number;
  images: string[];
  primaryImage: string;
  secondaryImage?: string;
  colors: ColorVariant[];
  shortDescription?: string;
  description?: string;
  material?: string;
  dimensions?: Dimensions;
  strapType?: string;
  closure?: string;
  interiorDetails?: string;
  careInstructions?: string;
  tags?: string[];
  isNewArrival?: boolean;
  isFeatured?: boolean;
  isSale?: boolean;
  status: 'active' | 'draft' | 'archived';
  discountPercentage?: number;
  stockStatus?: 'in_stock' | 'low_stock' | 'out_of_stock';
  createdAt?: string;
  updatedAt?: string;
}

export interface CartItem {
  product: Product;
  selectedColor?: ColorVariant;
  quantity: number;
}

export interface BankAccount {
  bankName: string;
  accountHolder: string;
  iban: string;
  branchCode?: string;
  accountNumber?: string;
}

export interface ShippingSettings {
  standardRate: number;
  freeShippingThreshold: number;
  isFreeShippingEnabled: boolean;
  estimatedDeliveryDays: string;
}

export interface PaymentMethods {
  havaleEftEnabled: boolean;
  kapidaOdemeEnabled: boolean;
  kapidaOdemeFee: number;
  creditCardEnabled: boolean;
}

export interface AnnouncementBarConfig {
  isEnabled: boolean;
  text: string;
  link: string;
}

export interface SiteSettings {
  _id?: string;
  brandName: string;
  tagline: string;
  logo?: string;
  favicon?: string;
  phone: string;
  whatsAppNumber: string;
  email: string;
  address: string;
  openingHours: string;
  instagramUrl: string;
  currency: {
    code: string;
    symbol: string;
  };
  shippingSettings: ShippingSettings;
  paymentMethods: PaymentMethods;
  bankAccounts: BankAccount[];
  announcementBar: AnnouncementBarConfig;
  trustBadges?: {
    badge1Title?: string;
    badge1Subtitle?: string;
    badge2Title?: string;
    badge2Subtitle?: string;
    badge3Title?: string;
    badge3Subtitle?: string;
    badge4Title?: string;
    badge4Subtitle?: string;
  };
  legalPolicies?: {
    mesafeliSatis?: string;
    gizlilik?: string;
    iade?: string;
    kvkk?: string;
  };
}

export interface OrderItem {
  product: string | Product;
  title: string;
  sku: string;
  color?: { name: string; hexCode: string };
  price: number;
  quantity: number;
  image?: string;
  totalPrice: number;
}

export interface Order {
  _id: string;
  orderNumber: string;
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  shippingAddress: {
    address: string;
    city: string;
    district: string;
    postalCode?: string;
    country: string;
  };
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  discountAmount: number;
  couponCode?: string;
  total: number;
  paymentMethod: 'havale_eft' | 'kapida_odeme' | 'online_kredi_karti' | 'whatsapp_direct';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  orderStatus: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  trackingNumber?: string;
  trackingCarrier?: string;
  notes?: string;
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WholesaleEnquiry {
  _id: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  city: string;
  country: string;
  businessType: string;
  taxId?: string;
  taxOffice?: string;
  instagramHandle?: string;
  website?: string;
  estimatedVolume?: string;
  message: string;
  status: 'pending' | 'contacted' | 'approved' | 'rejected';
  adminNotes?: string;
  createdAt: string;
}

export interface HeroSlide {
  _id: string;
  title: string;
  subtitle?: string;
  tagline?: string;
  image: string;
  mobileImage?: string;
  ctaPrimaryText?: string;
  ctaPrimaryLink?: string;
  ctaSecondaryText?: string;
  ctaSecondaryLink?: string;
  order: number;
  isActive: boolean;
}

export interface InstagramPost {
  _id: string;
  mediaUrl: string;
  permalink: string;
  caption: string;
  likes?: number;
  productSlug?: string;
  order: number;
  isActive: boolean;
}

export interface Coupon {
  _id: string;
  code: string;
  discountType: 'percent' | 'fixed';
  discountValue: number;
  minOrderAmount: number;
  maxDiscountAmount?: number;
  maxUses?: number;
  usedCount: number;
  expiresAt?: string;
  isActive: boolean;
}

export interface Review {
  _id: string;
  product: string | Product;
  name: string;
  email: string;
  rating: number;
  comment: string;
  isVerifiedPurchase?: boolean;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}
