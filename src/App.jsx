import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import ScrollToTop from './components/ScrollToTop';
import HomePage from './pages/HomePage';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import Legal from './pages/Legal';

const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const QRCode = lazy(() => import('./pages/QRCode'));

export default function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<HomePage />} />
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
