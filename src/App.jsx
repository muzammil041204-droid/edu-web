import { lazy, Suspense, useEffect, useRef } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router';
import Footer from './components/Footer.jsx';
import Header from './components/Header.jsx';
import LeadDialog from './components/LeadDialog.jsx';
import { LoadingBlock } from './components/ui.jsx';
import WhatsAppButton from './components/WhatsAppButton.jsx';
import { ScrollTrigger } from './lib/gsap.js';
import { LeadProvider } from './lib/leadContext.jsx';
import { scrollToElement, scrollToTop, SmoothScroll } from './lib/smoothScroll.jsx';
import About from './pages/About.jsx';
import CareerGuidance from './pages/CareerGuidance.jsx';
import CollegeDetail from './pages/CollegeDetail.jsx';
import Colleges from './pages/Colleges.jsx';
import Contact from './pages/Contact.jsx';
import Engineering from './pages/Engineering.jsx';
import Home from './pages/Home.jsx';
import { Privacy, Terms } from './pages/Legal.jsx';
import Medical from './pages/Medical.jsx';
import NotFound from './pages/NotFound.jsx';
import StudyAbroad from './pages/StudyAbroad.jsx';

// The admin panel is a separate bundle: visitors never download it.
const AdminApp = lazy(() => import('./pages/admin/AdminApp.jsx'));

export default function App() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <LeadProvider>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <SmoothScroll enabled={!isAdmin} />
      <RouteEffects />
      {isAdmin ? (
        <Suspense fallback={<LoadingBlock label="Opening the admin panel…" className="min-h-dvh" />}>
          <Routes>
            <Route path="/admin/*" element={<AdminApp />} />
          </Routes>
        </Suspense>
      ) : (
        <>
          <Header />
          <main id="main" tabIndex={-1} className="outline-none">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/colleges" element={<Colleges />} />
              <Route path="/colleges/:slug" element={<CollegeDetail />} />
              <Route path="/career-guidance" element={<CareerGuidance />} />
              <Route path="/medical" element={<Medical />} />
              <Route path="/engineering" element={<Engineering />} />
              <Route path="/study-abroad" element={<StudyAbroad />} />
              <Route path="/mbbs-in-india" element={<Navigate to="/medical" replace />} />
              <Route path="/mbbs-abroad" element={<Navigate to="/study-abroad" replace />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
          <WhatsAppButton />
          <LeadDialog />
        </>
      )}
    </LeadProvider>
  );
}

// On page change: start at the top (or at #anchor), move focus to the main
// content for keyboard and screen-reader users, and re-measure scroll effects.
function RouteEffects() {
  const { pathname, hash } = useLocation();
  const first = useRef(true);

  useEffect(() => {
    const isFirst = first.current;
    first.current = false;
    const timer = window.setTimeout(() => {
      const target = hash ? document.getElementById(decodeURIComponent(hash.slice(1))) : null;
      if (target) scrollToElement(target, { immediate: isFirst });
      else if (!isFirst) scrollToTop();
      if (!isFirst && !hash) document.getElementById('main')?.focus({ preventScroll: true });
      ScrollTrigger.refresh();
    }, 60);
    return () => window.clearTimeout(timer);
  }, [pathname, hash]);

  return null;
}
