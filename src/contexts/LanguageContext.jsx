import { createContext, useContext, useState, useCallback } from 'react';
import content from '../data/content.json';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('ja');

  const t = useCallback((path) => {
    const keys = path.split('.');
    let result = content[lang];
    for (const key of keys) {
      if (result == null) return path;
      result = result[key];
    }
    return result ?? path;
  }, [lang]);

  const toggleLang = useCallback((newLang) => {
    setLang(newLang);
    document.documentElement.dataset.lang = newLang;
  }, []);

  return (
    <LanguageContext.Provider value={{ lang, setLang: toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLang must be used within LanguageProvider');
  return context;
}
