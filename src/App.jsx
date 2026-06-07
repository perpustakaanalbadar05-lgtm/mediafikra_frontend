import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';

// Public pages
import HomePage from './pages/HomePage';
import LayananPage from './pages/LayananPage';
import KatalogPage from './pages/KatalogPage';
import DetailBukuPage from './pages/DetailBukuPage';
import TestimoniPage from './pages/TestimoniPage';
import PortofolioPage from './pages/PortofolioPage';
import TentangPage from './pages/TentangPage';
import KontakPage from './pages/KontakPage';
import FAQPage from './pages/FAQPage';
import PromoListPage from './pages/PromoListPage';
import PromoDetailPage from './pages/PromoDetailPage';

// Admin pages
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminBukuPage from './pages/admin/AdminBukuPage';
import AdminPesananPage from './pages/admin/AdminPesananPage';
import AdminTestimoniPage from './pages/admin/AdminTestimoniPage';
import AdminPromoPage from './pages/admin/AdminPromoPage';
import AdminPortofolioPage from './pages/admin/AdminPortofolioPage';
import AdminUserPage from './pages/admin/AdminUserPage';
import AdminSettingPage from './pages/admin/AdminSettingPage';
import AdminKategoriPage from './pages/admin/AdminKategoriPage';
import AdminArtikelPage from './pages/admin/AdminArtikelPage';
import ArtikelListPage from './pages/ArtikelListPage';
import ArtikelDetailPage from './pages/ArtikelDetailPage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public */}
          <Route element={<PublicLayout><HomePage /></PublicLayout>} path="/" />
          <Route element={<PublicLayout><LayananPage /></PublicLayout>} path="/layanan" />
          <Route element={<PublicLayout><KatalogPage /></PublicLayout>} path="/katalog" />
          <Route element={<PublicLayout><DetailBukuPage /></PublicLayout>} path="/katalog/:id" />
          <Route element={<PublicLayout><TestimoniPage /></PublicLayout>} path="/testimoni" />
          <Route element={<PublicLayout><PortofolioPage /></PublicLayout>} path="/portofolio" />
          <Route element={<PublicLayout><PromoListPage /></PublicLayout>} path="/promo" />
          <Route element={<PublicLayout><PromoDetailPage /></PublicLayout>} path="/promo/:id" />
          <Route element={<PublicLayout><ArtikelListPage /></PublicLayout>} path="/artikel" />
          <Route element={<PublicLayout><ArtikelDetailPage /></PublicLayout>} path="/artikel/:slug" />
          <Route element={<PublicLayout><TentangPage /></PublicLayout>} path="/tentang" />
          <Route element={<PublicLayout><KontakPage /></PublicLayout>} path="/kontak" />
          <Route element={<PublicLayout><FAQPage /></PublicLayout>} path="/faq" />

          {/* Admin login (no layout) */}
          <Route path="/admin/login" element={<AdminLoginPage />} />

          {/* Protected Admin */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboardPage />} />
            <Route path="buku" element={<AdminBukuPage />} />
            <Route path="kategori" element={<AdminKategoriPage />} />
            <Route path="pesanan" element={<AdminPesananPage />} />
            <Route path="testimoni" element={<AdminTestimoniPage />} />
            <Route path="promo" element={<AdminPromoPage />} />
            <Route path="artikel" element={<AdminArtikelPage />} />
            <Route path="portofolio" element={<AdminPortofolioPage />} />
            <Route path="pengguna" element={<AdminUserPage />} />
            <Route path="pengaturan" element={<AdminSettingPage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
