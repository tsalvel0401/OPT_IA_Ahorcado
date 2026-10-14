import { getInitialWordPool, selectRandomWord } from '../src/services/wordService.js';
import { validateLetter, isLetterRepeated } from '../src/utils/letterValidator.js';
import { calculateScore, MAX_MISTAKES_ALLOWED } from '../src/utils/scoreCalculator.js';
import { checkLetterInWord, checkWin, checkLoss, GAME_STATES } from '../src/utils/wordSanitizer.js';
import { resolveTranslation, getLocaleStrings } from '../src/services/languageLoader.js';

console.log('=== TEST INTEGRAL DE SIMULACIÓN (ARQUITECTURA DE PRODUCCIÓN & I18N) ===');

function simulate() {
  const esStrings = getLocaleStrings('es');
  let available = getInitialWordPool('es');
  console.log(`Palabras iniciales cargadas: ${available.length}`);

  let currentWord = null;
  let status = GAME_STATES.NOT_STARTED;
  let guessed = [];
  let wrong = [];
  let mistakes = 0;
  let score = 0;

  const start = () => {
    const sel = selectRandomWord(available);
    if (!sel) return false;
    currentWord = sel.selectedWord;
    available = sel.nextAvailableWords;
    status = GAME_STATES.IN_PROGRESS;
    guessed = [];
    wrong = [];
    mistakes = 0;
    score = 0;
    return true;
  };

  const attempt = (raw) => {
    const v = validateLetter(raw, 'es');
    if (!v.valid) {
      const msg = resolveTranslation(esStrings, v.reasonKey);
      return { invalid: true, msg };
    }
    const letter = v.letter;
    if (isLetterRepeated(letter, guessed, wrong)) {
      const msg = resolveTranslation(esStrings, 'feedback.letterRepeated', { letter });
      return { repeated: true, msg };
    }

    if (checkLetterInWord(currentWord, letter)) {
      guessed.push(letter);
      score = calculateScore(guessed.length, mistakes);
      if (checkWin(currentWord, guessed)) {
        status = GAME_STATES.WON;
      }
      return { hit: true, score };
    } else {
      wrong.push(letter);
      mistakes += 1;
      const isLoss = checkLoss(mistakes);
      score = isLoss ? 0 : calculateScore(guessed.length, mistakes);
      if (isLoss) {
        status = GAME_STATES.LOST;
      }
      return { hit: false, score, isLoss };
    }
  };

  // 1. Iniciar partida
  const countBefore = available.length;
  start();
  console.log(`1. Partida iniciada con palabra "${currentWord}", disponibles restantes: ${available.length}`);
  if (available.length !== countBefore - 1) throw new Error('Palabra no extraída');

  // 2. Entradas inválidas
  const inv = attempt('12');
  if (!inv.invalid) throw new Error('Entrada inválida no interceptada');
  console.log(`2. Feedback de entrada inválida interpolado: "${inv.msg}"`);

  // 3. Acierto
  const firstChar = currentWord[0];
  const hitRes = attempt(firstChar);
  if (!hitRes.hit || score !== 7) throw new Error('Fallo en acierto');
  console.log(`3. Acierto de letra "${firstChar}": Puntuación = 1 × (7 - 0) = ${score}`);

  // 4. Letra repetida
  const repRes = attempt(firstChar);
  if (!repRes.repeated) throw new Error('Letra repetida no interceptada');
  console.log(`4. Feedback de letra repetida interpolado: "${repRes.msg}"`);

  // 5. Fallo
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  const missChar = alphabet.find(c => !currentWord.includes(c));
  const missRes = attempt(missChar);
  if (missRes.hit || mistakes !== 1 || score !== 6) throw new Error('Fallo no contabilizado');
  console.log(`5. Letra fallada "${missChar}": Fallos = 1, Puntuación = 1 × (7 - 1) = ${score}`);

  // 6. Victoria
  for (const c of currentWord.split('')) {
    if (!guessed.includes(c)) {
      attempt(c);
    }
  }
  if (status !== GAME_STATES.WON) throw new Error('No se alcanzó estado WON');
  console.log(`6. Victoria alcanzada. Puntuación final: ${score}`);

  // 7. Derrota en nueva partida
  start();
  console.log(`7. Nueva partida iniciada con palabra "${currentWord}"`);
  const missChars = alphabet.filter(c => !currentWord.includes(c));
  for (let i = 0; i < 7; i++) {
    attempt(missChars[i]);
  }
  if (mistakes !== 7 || status !== GAME_STATES.LOST || score !== 0) {
    throw new Error('Derrota no procesada correctamente tras 7 fallos');
  }
  console.log(`8. Derrota tras 7 fallos confirmada: score = 0, status = LOST.`);

  console.log('✓ Simulación completa exitosa.');
}

simulate();
