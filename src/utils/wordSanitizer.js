import { MAX_MISTAKES_ALLOWED } from './scoreCalculator.js';

export const GAME_STATES = {
  NOT_STARTED: 'NOT_STARTED',
  IN_PROGRESS: 'IN_PROGRESS',
  WON: 'WON',
  LOST: 'LOST'
};

/**
 * Sanitiza una palabra asegurando mayúsculas y recorte de espacios.
 */
export function sanitizeWord(rawWord) {
  if (typeof rawWord !== 'string') return '';
  return rawWord.trim().toUpperCase();
}

/**
 * Obtiene el conjunto de letras únicas de una palabra.
 */
export function getUniqueLetters(word) {
  if (!word) return [];
  return Array.from(new Set(sanitizeWord(word).split('')));
}

/**
 * Comprueba si una letra existe dentro de la palabra a adivinar.
 */
export function checkLetterInWord(word, letter) {
  if (!word || !letter) return false;
  return sanitizeWord(word).includes(letter.toUpperCase());
}

/**
 * Comprueba si se han descubierto todas las letras únicas de la palabra.
 */
export function checkWin(word, guessedLetters = []) {
  if (!word) return false;
  const uniqueLetters = getUniqueLetters(word);
  return uniqueLetters.every(char => guessedLetters.includes(char));
}

/**
 * Comprueba si se ha alcanzado o superado el límite de fallos permitidos.
 */
export function checkLoss(mistakesCount, maxMistakes = MAX_MISTAKES_ALLOWED) {
  return mistakesCount >= maxMistakes;
}
