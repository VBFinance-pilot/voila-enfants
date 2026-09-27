import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Scroll to the top on route change, or to the #anchor when the URL has one
// (e.g. /#contact from another page). Retries briefly while the page renders.
export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
      return undefined;
    }
    const id = decodeURIComponent(hash.slice(1));
    let tries = 0;
    let timer;
    const attempt = () => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else if (tries++ < 20) {
        timer = setTimeout(attempt, 50);
      }
    };
    attempt();
    return () => clearTimeout(timer);
  }, [pathname, hash]);

  return null;
}
