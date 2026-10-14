import { validateLetter, isLetterRepeated } from '../src/utils/letterValidator.js';
import { calculateScore, MAX_MISTAKES_ALLOWED } from '../src/utils/scoreCalculator.js';
import { checkLetterInWord, checkWin, checkLoss } from '../src/utils/wordSanitizer.js';

console.log('--- TEST DE MÓDULOS UTILS PUROS ---');

// 1. letterValidator
const testCasesEs = [
  { input: 'a', expectedValid: true, letter: 'A' },
  { input: 'Z', expectedValid: true, letter: 'Z' },
  { input: 'ñ', expectedValid: true, letter: 'Ñ' },
  { input: 'Ñ', expectedValid: true, letter: 'Ñ' },
  { input: ' m ', expectedValid: true, letter: 'M' },
  { input: '', expectedValid: false, key: 'feedback.invalidEmpty' },
  { input: '12', expectedValid: false, key: 'feedback.invalidSingle' },
  { input: '1', expectedValid: false, key: 'feedback.invalidNumbers' },
  { input: 'á', expectedValid: false, key: 'feedback.invalidAccents' },
  { input: '@', expectedValid: false, key: 'feedback.invalidSymbols' }
];

for (const tc of testCasesEs) {
  const res = validateLetter(tc.input, 'es');
  if (res.valid !== tc.expectedValid) {
    throw new Error(`Validación fallida en "${tc.input}": esperado ${tc.expectedValid}, obtenido ${res.valid}`);
  }
  if (res.valid && res.letter !== tc.letter) {
    throw new Error(`Transformación fallida en "${tc.input}": esperado ${tc.letter}, obtenido ${res.letter}`);
  }
  if (!res.valid && res.reasonKey !== tc.key) {
    throw new Error(`Clave de traducción errónea en "${tc.input}": esperado ${tc.key}, obtenido ${res.reasonKey}`);
  }
}
console.log('✓ letterValidator (ES): todas las pruebas pasadas.');

// 2. isLetterRepeated
if (!isLetterRepeated('A', ['A'], [])) throw new Error('Fallo en detección de letra acertada repetida');
if (!isLetterRepeated('B', [], ['B'])) throw new Error('Fallo en detección de letra fallada repetida');
if (isLetterRepeated('C', ['A'], ['B'])) throw new Error('Falso positivo en detección de letra repetida');
console.log('✓ isLetterRepeated: verificado.');

// 3. scoreCalculator
// Fórmula: Nº letras acertadas × (7 - Fallos cometidos)
const scoreA = calculateScore(4, 2);
if (scoreA !== 20) throw new Error(`Puntuación errónea: esperado 20, obtenido ${scoreA}`);

const scoreDefeat = calculateScore(4, 7);
if (scoreDefeat !== 0) throw new Error(`Puntuación con 7 fallos errónea: esperado 0, obtenido ${scoreDefeat}`);
console.log('✓ scoreCalculator: fórmula exacta 4 × (7 - 2) = 20 y derrota = 0 verificadas.');

// 4. wordSanitizer
if (!checkLetterInWord('ORDENADOR', 'O')) throw new Error('Fallo en checkLetterInWord con acierto');
if (checkLetterInWord('ORDENADOR', 'Z')) throw new Error('Fallo en checkLetterInWord con fallo');
if (!checkWin('CABALLO', ['C', 'A', 'B', 'L', 'O'])) throw new Error('Fallo en checkWin');
if (checkWin('CABALLO', ['C', 'A', 'B', 'L'])) throw new Error('Falso positivo en checkWin');
if (!checkLoss(7)) throw new Error('Fallo en checkLoss(7)');
if (checkLoss(6)) throw new Error('Falso positivo en checkLoss(6)');
console.log('✓ wordSanitizer: verificado con éxito.');

console.log('✓ Todas las funciones utilitarias puras pasaron el 100% de las pruebas.');
