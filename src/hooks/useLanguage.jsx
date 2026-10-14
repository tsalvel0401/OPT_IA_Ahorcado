import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import {
  getSupportedLanguages,
  getLocaleStrings,
  resolveTranslation,
  DEFAULT_LANGUAGE
} from '../services/languageLoader.js';

const LANGUAGE_STORAGE_KEY = 'adivina_palabra_locale_pref_v2';

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [currentLang, setCurrentLang] = useState(() => {
    try {
      const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (saved && (saved === 'es' || saved === 'en')) {
        return saved;
      }
    } catch (e) {
      // Ignorar error de acceso a storage
    }
    return DEFAULT_LANGUAGE;
  });

  const localeStrings = useMemo(() => {
    return getLocaleStrings(currentLang);
  }, [currentLang]);

  useEffect(() => {
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, currentLang);
    } catch (e) {
      // Ignorar
    }
  }, [currentLang]);

  const t = useCallback((keyPath, params = {}) => {
    return resolveTranslation(localeStrings, keyPath, params);
  }, [localeStrings]);

  const changeLanguage = useCallback((newLangCode) => {
    if (newLangCode && (newLangCode === 'es' || newLangCode === 'en')) {
      setCurrentLang(newLangCode);
    }
  }, []);

  const value = useMemo(() => ({
    language: currentLang,
    languages: getSupportedLanguages(),
    changeLanguage,
    t
  }), [currentLang, changeLanguage, t]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage debe ser utilizado dentro de un LanguageProvider');
  }
  return context;
}

export default useLanguage;
