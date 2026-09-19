import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

// Context Providers
import { SettingsProvider } from './context/SettingsContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';

// Layouts
import { Layout } from './components/layout/Layout';
import { AdminLayout } from './admin/AdminLayout';

// Customer Pages
import { Home } from './pages/Home';
import { Shop } from './pages/Shop';
import { CategoryPage } from './pages/CategoryPage';
import { CollectionPage } from './pages/CollectionPage';
import { ProductDetail } from './pages/ProductDetail';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderSuccessPage } from './pages/OrderSuccessPage';
import { TrackOrderPage } from './pages/TrackOrderPage';
import { WholesalePage } from './pages/WholesalePage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { FAQPage } from './pages/FAQPage';
import { PolicyPage } from './pages/PolicyPage';
import { WishlistPage } from './pages/WishlistPage';
import { NotFoundPage } from './pages/NotFoundPage';

// Admin Pages
import { AdminLogin } from './admin/AdminLogin';
import { AdminDashboard } from './admin/AdminDashboard';
import { ManageProducts } from './admin/ManageProducts';
import { ManageOrders } from './admin/ManageOrders';
import { ManageCategories } from './admin/ManageCategories';
import { ManageCollections } from './admin/ManageCollections';
import { ManageWholesale } from './admin/ManageWholesale';
import { ManageContact } from './admin/ManageContact';
import { ManageCoupons } from './admin/ManageCoupons';
import { ManageHero } from './admin/ManageHero';
import { ManageInstagram } from './admin/ManageInstagram';
import { ManageReviews } from './admin/ManageReviews';
import { ManageSettings } from './admin/ManageSettings';
import { AuditLogsView } from './admin/AuditLogsView';

// Protected Admin Route component
const ProtectedAdmin: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAdminLoggedIn, adminLoading } = useAuth();

  if (adminLoading) {
    return (
      <div className="h-screen bg-slate-950 flex items-center justify-center text-amber-400 font-semibold text-xs">
        Yükleniyor...
      </div>
    );
  }

  if (!isAdminLoggedIn) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
};

export const App: React.FC = () => {
  return (
    <HelmetProvider>
      <SettingsProvider>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <BrowserRouter>
                <Routes>
                  {/* Customer Storefront Routes */}
                  <Route
                    path="/"
                    element={
                      <Layout>
                        <Home />
                      </Layout>
                    }
                  />
                  <Route
                    path="/shop"
                    element={
                      <Layout>
                        <Shop />
                      </Layout>
                    }
                  />
                  <Route
                    path="/yeni-gelenler"
                    element={
                      <Layout>
                        <Shop />
                      </Layout>
                    }
                  />
                  <Route
                    path="/indirim"
                    element={
                      <Layout>
                        <Shop />
                      </Layout>
                    }
                  />
                  <Route
                    path="/kategori/:slug"
                    element={
                      <Layout>
                        <CategoryPage />
                      </Layout>
                    }
                  />
                  <Route
                    path="/koleksiyonlar"
                    element={
                      <Layout>
                        <CollectionPage />
                      </Layout>
                    }
                  />
                  <Route
                    path="/koleksiyon/:slug"
                    element={
                      <Layout>
                        <CollectionPage />
                      </Layout>
                    }
                  />
                  <Route
                    path="/urun/:slug"
                    element={
                      <Layout>
                        <ProductDetail />
                      </Layout>
                    }
                  />
                  <Route
                    path="/product/:slug"
                    element={
                      <Layout>
                        <ProductDetail />
                      </Layout>
                    }
                  />
                  <Route
                    path="/sepet"
                    element={
                      <Layout>
                        <CartPage />
                      </Layout>
                    }
                  />
                  <Route
                    path="/cart"
                    element={
                      <Layout>
                        <CartPage />
                      </Layout>
                    }
                  />
                  <Route
                    path="/odeme"
                    element={
                      <Layout>
                        <CheckoutPage />
                      </Layout>
                    }
                  />
                  <Route
                    path="/checkout"
                    element={
                      <Layout>
                        <CheckoutPage />
                      </Layout>
                    }
                  />
                  <Route
                    path="/siparis-basarili"
                    element={
                      <Layout>
                        <OrderSuccessPage />
                      </Layout>
                    }
                  />
                  <Route
                    path="/order-success"
                    element={
                      <Layout>
                        <OrderSuccessPage />
                      </Layout>
                    }
                  />
                  <Route
                    path="/siparis-takip"
                    element={
                      <Layout>
                        <TrackOrderPage />
                      </Layout>
                    }
                  />
                  <Route
                    path="/toptan"
                    element={
                      <Layout>
                        <WholesalePage />
                      </Layout>
                    }
                  />
                  <Route
                    path="/wholesale"
                    element={
                      <Layout>
                        <WholesalePage />
                      </Layout>
                    }
                  />
                  <Route
                    path="/hakkimizda"
                    element={
                      <Layout>
                        <AboutPage />
                      </Layout>
                    }
                  />
                  <Route
                    path="/about"
                    element={
                      <Layout>
                        <AboutPage />
                      </Layout>
                    }
                  />
                  <Route
                    path="/iletisim"
                    element={
                      <Layout>
                        <ContactPage />
                      </Layout>
                    }
                  />
                  <Route
                    path="/contact"
                    element={
                      <Layout>
                        <ContactPage />
                      </Layout>
                    }
                  />
                  <Route
                    path="/sss"
                    element={
                      <Layout>
                        <FAQPage />
                      </Layout>
                    }
                  />
                  <Route
                    path="/faq"
                    element={
                      <Layout>
                        <FAQPage />
                      </Layout>
                    }
                  />
                  <Route
                    path="/favoriler"
                    element={
                      <Layout>
                        <WishlistPage />
                      </Layout>
                    }
                  />
                  <Route
                    path="/wishlist"
                    element={
                      <Layout>
                        <WishlistPage />
                      </Layout>
                    }
                  />

                  {/* Policy Routes */}
                  <Route
                    path="/kargo-ve-teslimat"
                    element={
                      <Layout>
                        <PolicyPage />
                      </Layout>
                    }
                  />
                  <Route
                    path="/shipping"
                    element={
                      <Layout>
                        <PolicyPage />
                      </Layout>
                    }
                  />
                  <Route
                    path="/iade-ve-degisim"
                    element={
                      <Layout>
                        <PolicyPage />
                      </Layout>
                    }
                  />
                  <Route
                    path="/returns"
                    element={
                      <Layout>
                        <PolicyPage />
                      </Layout>
                    }
                  />
                  <Route
                    path="/gizlilik-politikasi"
                    element={
                      <Layout>
                        <PolicyPage />
                      </Layout>
                    }
                  />
                  <Route
                    path="/privacy"
                    element={
                      <Layout>
                        <PolicyPage />
                      </Layout>
                    }
                  />
                  <Route
                    path="/mesafeli-satis-sozlesmesi"
                    element={
                      <Layout>
                        <PolicyPage />
                      </Layout>
                    }
                  />
                  <Route
                    path="/terms"
                    element={
                      <Layout>
                        <PolicyPage />
                      </Layout>
                    }
                  />
                  <Route
                    path="/cerez-politikasi"
                    element={
                      <Layout>
                        <PolicyPage />
                      </Layout>
                    }
                  />
                  <Route
                    path="/cookie-policy"
                    element={
                      <Layout>
                        <PolicyPage />
                      </Layout>
                    }
                  />
                  <Route
                    path="/kvkk-aydinlatma-metni"
                    element={
                      <Layout>
                        <PolicyPage />
                      </Layout>
                    }
                  />

                  {/* Admin Auth */}
                  <Route path="/admin/login" element={<AdminLogin />} />

                  {/* Admin Dashboard Protected Routes */}
                  <Route
                    path="/admin"
                    element={
                      <ProtectedAdmin>
                        <AdminLayout />
                      </ProtectedAdmin>
                    }
                  >
                    <Route index element={<AdminDashboard />} />
                    <Route path="products" element={<ManageProducts />} />
                    <Route path="orders" element={<ManageOrders />} />
                    <Route path="categories" element={<ManageCategories />} />
                    <Route path="collections" element={<ManageCollections />} />
                    <Route path="wholesale" element={<ManageWholesale />} />
                    <Route path="contact" element={<ManageContact />} />
                    <Route path="coupons" element={<ManageCoupons />} />
                    <Route path="hero" element={<ManageHero />} />
                    <Route path="instagram" element={<ManageInstagram />} />
                    <Route path="reviews" element={<ManageReviews />} />
                    <Route path="settings" element={<ManageSettings />} />
                    <Route path="audit-logs" element={<AuditLogsView />} />
                  </Route>

                  {/* 404 Route */}
                  <Route
                    path="*"
                    element={
                      <Layout>
                        <NotFoundPage />
                      </Layout>
                    }
                  />
                </Routes>
              </BrowserRouter>
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </SettingsProvider>
    </HelmetProvider>
  );
};

export default App;
