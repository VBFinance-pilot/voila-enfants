/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import content from '../data/content.json';

export const LANGS = ['ja', 'en', 'fr'];
const STORAGE_KEY = 'voila-lang';

const LanguageContext = createContext();

function initialLang() {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (LANGS.includes(saved)) return saved;
  } catch {
    // storage unavailable (private mode, blocked) — fall through
  }
  return 'ja';
}

// Walk a dotted path in one language tree; undefined when missing.
function lookup(tree, path) {
  let result = tree;
  for (const key of path.split('.')) {
    if (result == null) return undefined;
    result = result[key];
  }
  return result;
}

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(initialLang);

  useEffect(() => {
    document.documentElement.dataset.lang = lang;
    document.documentElement.lang = lang;
  }, [lang]);

  // Legacy content.json lookup (legal pages, admin). French falls back to
  // English, then Japanese, when a key has not been translated.
  const t = useCallback((path) => {
    return lookup(content[lang], path)
      ?? lookup(content.en, path)
      ?? lookup(content.ja, path)
      ?? path;
  }, [lang]);

  // Pick the active language from a { ja, en, fr } object (new site copy).
  const tx = useCallback((obj) => {
    if (obj == null || typeof obj !== 'object') return obj;
    return obj[lang] ?? obj.en ?? obj.ja ?? '';
  }, [lang]);

  const setLang = useCallback((newLang) => {
    if (!LANGS.includes(newLang)) return;
    setLangState(newLang);
    try {
      window.localStorage.setItem(STORAGE_KEY, newLang);
    } catch {
      // ignore storage errors
    }
  }, []);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, tx }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLang must be used within LanguageProvider');
  return context;
}
