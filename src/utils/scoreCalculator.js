/**
 * Módulo de cálculo puro de puntuación.
 * Totalmente desacoplado de la vista y del estado.
 */

export const MAX_MISTAKES_ALLOWED = 7;

/**
 * Calcula la puntuación de la partida usando la fórmula estricta:
 * Puntuación = Nº de letras únicas acertadas × (Máximo de fallos permitidos - Nº de fallos cometidos)
 *
 * @param {number} distinctGuessedCount - Número de letras distintas acertadas.
 * @param {number} mistakesCount - Número de fallos cometidos.
 * @param {number} maxMistakes - Máximo de fallos permitidos (por defecto 7).
 * @returns {number} Puntuación final (0 si fallos >= 7).
 */
export function calculateScore(
  distinctGuessedCount = 0,
  mistakesCount = 0,
  maxMistakes = MAX_MISTAKES_ALLOWED
) {
  if (mistakesCount >= maxMistakes) {
    return 0;
  }

  const multiplier = Math.max(0, maxMistakes - mistakesCount);
  return Math.max(0, distinctGuessedCount * multiplier);
}
