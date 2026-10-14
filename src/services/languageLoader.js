import esLocale from '../locales/es.json' with { type: 'json' };
import enLocale from '../locales/en.json' with { type: 'json' };
import esFlag from '../assets/flags/es.svg';
import enFlag from '../assets/flags/en.svg';

import esWords from '../data/words-es.json' with { type: 'json' };
import enWords from '../data/words-en.json' with { type: 'json' };

const LANGUAGE_RESOURCES = {
  es: {
    locale: esLocale,
    words: esWords,
    name: 'Español',
    flag: esFlag,
    code: 'es'
  },
  en: {
    locale: enLocale,
    words: enWords,
    name: 'English',
    flag: enFlag,
    code: 'en'
  }
};

export const DEFAULT_LANGUAGE = 'es';

/**
 * Retorna la lista de idiomas soportados con sus metadatos visuales.
 */
export function getSupportedLanguages() {
  return Object.values(LANGUAGE_RESOURCES).map(({ code, name, flag }) => ({
    code,
    name,
    flag
  }));
}

/**
 * Obtiene el paquete de cadenas traducibles para un idioma dado.
 */
export function getLocaleStrings(lang = DEFAULT_LANGUAGE) {
  const resource = LANGUAGE_RESOURCES[lang] || LANGUAGE_RESOURCES[DEFAULT_LANGUAGE];
  return resource.locale;
}

/**
 * Obtiene el conjunto de palabras correspondiente al idioma seleccionado.
 */
export function getWordsForLanguage(lang = DEFAULT_LANGUAGE) {
  const resource = LANGUAGE_RESOURCES[lang] || LANGUAGE_RESOURCES[DEFAULT_LANGUAGE];
  return [...resource.words];
}

/**
 * Reemplaza variables interpoladas en cadenas de formato {{variable}}.
 * Soporta navegación por rutas de claves con puntos (ej: 'stats.score').
 */
export function interpolateString(template, params = {}) {
  if (typeof template !== 'string') return '';
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => {
    return params[key] !== undefined ? String(params[key]) : `{{${key}}}`;
  });
}

/**
 * Resuelve una clave de traducción como 'feedback.letterHit' dentro del diccionario de textos.
 */
export function resolveTranslation(localeObject, keyPath, params = {}) {
  if (!localeObject || !keyPath) return keyPath;

  const parts = keyPath.split('.');
  let current = localeObject;

  for (const part of parts) {
    if (current && typeof current === 'object' && part in current) {
      current = current[part];
    } else {
      return keyPath; // Fallback a la clave si no se encuentra
    }
  }

  if (typeof current === 'string') {
    return interpolateString(current, params);
  }

  return current;
}
