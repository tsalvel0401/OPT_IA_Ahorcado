/**
 * Módulo de validación pura de letras.
 * Desacoplado de la vista y dependiente de claves de traducción para cero textos hardcodeados.
 */

/**
 * Valida la entrada del usuario de acuerdo a las reglas del alfabeto seleccionado.
 *
 * @param {string} raw - Entrada en bruto.
 * @param {string} langCode - Código de idioma ('es', 'en').
 * @returns {{ valid: boolean, letter?: string, reasonKey?: string }}
 */
export function validateLetter(raw, langCode = 'es') {
  if (raw === undefined || raw === null) {
    return { valid: false, reasonKey: 'feedback.invalidEmpty' };
  }

  const str = String(raw).trim();

  if (str.length === 0) {
    return { valid: false, reasonKey: 'feedback.invalidEmpty' };
  }

  if (str.length > 1) {
    return { valid: false, reasonKey: 'feedback.invalidSingle' };
  }

  // Rechazar tildes y diéresis
  if (/[áéíóúüÁÉÍÓÚÜ]/.test(str)) {
    return { valid: false, reasonKey: 'feedback.invalidAccents' };
  }

  // Rechazar números
  if (/[0-9]/.test(str)) {
    return { valid: false, reasonKey: 'feedback.invalidNumbers' };
  }

  // Validación de alfabeto según idioma:
  // Español: A-Z, a-z, Ñ, ñ
  // Otros: A-Z, a-z
  const regex = langCode === 'es' ? /^[a-zA-ZñÑ]$/ : /^[a-zA-Z]$/;

  if (!regex.test(str)) {
    return { valid: false, reasonKey: 'feedback.invalidSymbols' };
  }

  return {
    valid: true,
    letter: str.toUpperCase()
  };
}

/**
 * Comprueba si una letra ya ha sido utilizada anteriormente en la partida.
 *
 * @param {string} letter - Letra normalizada.
 * @param {string[]} guessedLetters - Letras acertadas.
 * @param {string[]} wrongLetters - Letras falladas.
 * @returns {boolean} True si ya fue utilizada.
 */
export function isLetterRepeated(letter, guessedLetters = [], wrongLetters = []) {
  if (!letter) return false;
  const upper = letter.toUpperCase();
  return guessedLetters.includes(upper) || wrongLetters.includes(upper);
}
