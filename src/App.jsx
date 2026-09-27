import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import ScrollToTop from './components/ScrollToTop';
import Analytics from './components/Analytics';
import HomePage from './site/HomePage';
import { HomestayPage, FranchisePage, CareersPage } from './site/SubPages';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import Legal from './pages/Legal';

const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const QRCode = lazy(() => import('./pages/QRCode'));
const BusinessCards = lazy(() => import('./pages/BusinessCards'));

export default function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <ScrollToTop />
        <Analytics />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/homestay" element={<HomestayPage />} />
          <Route path="/franchise" element={<FranchisePage />} />
          <Route path="/careers" element={<CareersPage />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/legal" element={<Legal />} />
          <Route
            path="/qrcode"
            element={
              <Suspense fallback={<div style={{ padding: '40vh 0', textAlign: 'center' }}>Loading...</div>}>
                <QRCode />
              </Suspense>
            }
          />
          <Route
            path="/cards"
            element={
              <Suspense fallback={<div style={{ padding: '40vh 0', textAlign: 'center' }}>Loading...</div>}>
                <BusinessCards />
              </Suspense>
            }
          />
          <Route
            path="/admin"
            element={
              <Suspense fallback={<div style={{ padding: '40vh 0', textAlign: 'center' }}>Loading...</div>}>
                <AdminDashboard />
              </Suspense>
            }
          />
        </Routes>
      </LanguageProvider>
    </BrowserRouter>
  );
}
