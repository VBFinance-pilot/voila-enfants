import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

// GA4 is gated to production builds with a configured Measurement ID, so it
// never runs in local dev (no polluting the stats) and the ID stays in an
// env var rather than the source.
const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;
const ENABLED = import.meta.env.PROD && Boolean(GA_ID);

export default function Analytics() {
  const { pathname, search } = useLocation();
  const loaded = useRef(false);

  // Load gtag.js once on mount.
  useEffect(() => {
    if (!ENABLED || loaded.current) return;
    loaded.current = true;

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    function gtag() {
      window.dataLayer.push(arguments);
    }
    window.gtag = gtag;
    gtag('js', new Date());
    // Disable the automatic page_view — we send one manually on every route
    // change (incl. first load) so this SPA tracks navigation correctly.
    gtag('config', GA_ID, { send_page_view: false });
  }, []);

  // Send a page_view on each route change (and the initial render).
  useEffect(() => {
    if (!ENABLED || !window.gtag) return;
    window.gtag('event', 'page_view', {
      page_path: pathname + search,
      page_location: window.location.href,
      page_title: document.title,
    });
  }, [pathname, search]);

  return null;
}
