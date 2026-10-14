import { getWordsForLanguage } from './languageLoader.js';

/**
 * Servicio desacoplado para la selección y gestión del banco de palabras.
 * Trabaja de forma agnóstica al idioma recibiendo el pool de palabras o el código de idioma.
 */

/**
 * Obtiene la lista inicial de palabras para el idioma indicado.
 * @param {string} langCode - Código de idioma ('es', 'en', etc.).
 * @returns {string[]} Lista de palabras en mayúsculas.
 */
export function getInitialWordPool(langCode = 'es') {
  return getWordsForLanguage(langCode);
}

/**
 * Selecciona una palabra aleatoria de la lista disponible y retorna la palabra
 * junto con la nueva lista reducida.
 * @param {string[]} availableWords - Array de palabras disponibles.
 * @returns {{ selectedWord: string, nextAvailableWords: string[] } | null}
 */
export function selectRandomWord(availableWords) {
  if (!Array.isArray(availableWords) || availableWords.length === 0) {
    return null;
  }

  const randomIndex = Math.floor(Math.random() * availableWords.length);
  const selectedWord = availableWords[randomIndex];
  const nextAvailableWords = availableWords.filter((_, idx) => idx !== randomIndex);

  return {
    selectedWord,
    nextAvailableWords
  };
}

/**
 * Elimina una palabra específica del pool de palabras disponibles.
 * @param {string[]} pool - Lista actual de palabras.
 * @param {string} wordToRemove - Palabra a remover.
 * @returns {string[]} Nueva lista sin la palabra.
 */
export function removeWordFromPool(pool, wordToRemove) {
  if (!Array.isArray(pool)) return [];
  return pool.filter(word => word !== wordToRemove);
}
