import { useState, useEffect, useCallback, useRef } from 'react';
import { getInitialWordPool, selectRandomWord } from '../services/wordService.js';
import { validateLetter, isLetterRepeated } from '../utils/letterValidator.js';
import { calculateScore, MAX_MISTAKES_ALLOWED } from '../utils/scoreCalculator.js';
import { GAME_STATES, checkLetterInWord, checkWin, checkLoss } from '../utils/wordSanitizer.js';

const STORAGE_KEY_PREFIX = 'adivina_palabra_game_session_v3_';

export function useGame(language = 'es') {
  // Inicialización de estado por idioma
  const [gameState, setGameState] = useState(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}${language}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.availableWords) && parsed.availableWords.length > 0) {
          return {
            availableWords: parsed.availableWords,
            currentWord: parsed.currentWord || null,
            status: parsed.status || GAME_STATES.NOT_STARTED,
            guessedLetters: parsed.guessedLetters || [],
            wrongLetters: parsed.wrongLetters || [],
            mistakes: parsed.mistakes || 0,
            score: parsed.score || 0,
            lastAction: null
          };
        }
      }
    } catch (e) {
      // Ignorar
    }

    return {
      availableWords: getInitialWordPool(language),
      currentWord: null,
      status: GAME_STATES.NOT_STARTED,
      guessedLetters: [],
      wrongLetters: [],
      mistakes: 0,
      score: 0,
      lastAction: null
    };
  });

  // Notificación activa (clave de traducción + parámetros)
  const [feedback, setFeedback] = useState(null);

  // Diálogo modal activo
  const [modal, setModal] = useState({
    isOpen: false,
    type: null, // 'win' | 'loss' | 'confirmRestart' | 'confirmChangeLanguage' | 'rules'
    data: {}
  });

  // Guardar en localStorage
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY_PREFIX}${language}`, JSON.stringify(gameState));
    } catch (e) {
      // Ignorar
    }
  }, [gameState, language]);

  // Si cambia el idioma y no hay partida iniciada, cargar el pool de ese idioma
  const prevLangRef = useRef(language);
  useEffect(() => {
    if (prevLangRef.current !== language) {
      prevLangRef.current = language;
      const newPool = getInitialWordPool(language);
      setGameState({
        availableWords: newPool,
        currentWord: null,
        status: GAME_STATES.NOT_STARTED,
        guessedLetters: [],
        wrongLetters: [],
        mistakes: 0,
        score: 0,
        lastAction: null
      });
      setModal(m => ({ ...m, isOpen: false }));
    }
  }, [language]);

  const triggerFeedback = useCallback((type, key, params = {}) => {
    setFeedback({ type, key, params, id: Date.now() });
  }, []);

  const clearFeedback = useCallback(() => {
    setFeedback(null);
  }, []);

  /**
   * Inicia una nueva partida con una palabra seleccionada al azar del pool.
   */
  const startMatch = useCallback(() => {
    setGameState(prev => {
      const selection = selectRandomWord(prev.availableWords);

      if (!selection) {
        triggerFeedback('warning', 'feedback.allWordsCompleted');
        return prev;
      }

      setModal(m => ({ ...m, isOpen: false }));

      return {
        ...prev,
        availableWords: selection.nextAvailableWords,
        currentWord: selection.selectedWord,
        status: GAME_STATES.IN_PROGRESS,
        guessedLetters: [],
        wrongLetters: [],
        mistakes: 0,
        score: 0,
        lastAction: 'start'
      };
    });

    triggerFeedback('info', 'feedback.gameStarted');
  }, [triggerFeedback]);

  /**
   * Solicita reiniciar la partida. Si está en curso, abre diálogo de confirmación.
   */
  const requestRestart = useCallback(() => {
    if (gameState.status === GAME_STATES.IN_PROGRESS) {
      setModal({
        isOpen: true,
        type: 'confirmRestart',
        data: {}
      });
    } else {
      startMatch();
    }
  }, [gameState.status, startMatch]);

  /**
   * Fuerza el reinicio inmediato tras confirmación del usuario.
   */
  const confirmRestart = useCallback(() => {
    setModal(m => ({ ...m, isOpen: false }));
    startMatch();
    triggerFeedback('info', 'feedback.gameRestarted');
  }, [startMatch, triggerFeedback]);

  /**
   * Procesa la letra introducida.
   */
  const submitLetter = useCallback((rawInput) => {
    if (gameState.status !== GAME_STATES.IN_PROGRESS || !gameState.currentWord) {
      if (gameState.status === GAME_STATES.NOT_STARTED) {
        triggerFeedback('warning', 'feedback.notActive');
      } else {
        triggerFeedback('info', 'feedback.alreadyFinished');
      }
      return { handled: false };
    }

    // 1. Validación pura
    const validation = validateLetter(rawInput, language);
    if (!validation.valid) {
      triggerFeedback('warning', validation.reasonKey);
      setGameState(prev => ({ ...prev, lastAction: 'invalid' }));
      return { handled: false, invalid: true };
    }

    const letter = validation.letter;

    // 2. Control de letras repetidas
    if (isLetterRepeated(letter, gameState.guessedLetters, gameState.wrongLetters)) {
      triggerFeedback('warning', 'feedback.letterRepeated', { letter });
      setGameState(prev => ({ ...prev, lastAction: 'repeat' }));
      return { handled: false, repeated: true };
    }

    // 3. Comprobación en la palabra
    const isHit = checkLetterInWord(gameState.currentWord, letter);

    if (isHit) {
      const nextGuessed = [...gameState.guessedLetters, letter];
      const nextScore = calculateScore(nextGuessed.length, gameState.mistakes);
      const isWon = checkWin(gameState.currentWord, nextGuessed);

      if (isWon) {
        setGameState(prev => ({
          ...prev,
          guessedLetters: nextGuessed,
          score: nextScore,
          status: GAME_STATES.WON,
          lastAction: 'win'
        }));

        setModal({
          isOpen: true,
          type: 'win',
          data: {
            word: gameState.currentWord,
            score: nextScore,
            mistakes: gameState.mistakes
          }
        });
      } else {
        setGameState(prev => ({
          ...prev,
          guessedLetters: nextGuessed,
          score: nextScore,
          lastAction: 'hit'
        }));

        triggerFeedback('success', 'feedback.letterHit', { letter });
      }

      return { handled: true, hit: true, letter };
    } else {
      const nextWrong = [...gameState.wrongLetters, letter];
      const nextMistakes = gameState.mistakes + 1;
      const isLoss = checkLoss(nextMistakes);
      const nextScore = isLoss ? 0 : calculateScore(gameState.guessedLetters.length, nextMistakes);

      if (isLoss) {
        setGameState(prev => ({
          ...prev,
          wrongLetters: nextWrong,
          mistakes: nextMistakes,
          score: 0,
          status: GAME_STATES.LOST,
          lastAction: 'loss'
        }));

        setModal({
          isOpen: true,
          type: 'loss',
          data: {
            word: gameState.currentWord,
            score: 0,
            mistakes: MAX_MISTAKES_ALLOWED
          }
        });
      } else {
        setGameState(prev => ({
          ...prev,
          wrongLetters: nextWrong,
          mistakes: nextMistakes,
          score: nextScore,
          lastAction: 'miss'
        }));

        triggerFeedback('danger', 'feedback.letterMiss', {
          letter,
          current: nextMistakes,
          max: MAX_MISTAKES_ALLOWED
        });
      }

      return { handled: true, hit: false, letter };
    }
  }, [gameState, language, triggerFeedback]);

  const openRulesModal = useCallback(() => {
    setModal({
      isOpen: true,
      type: 'rules',
      data: {}
    });
  }, []);

  const closeModal = useCallback(() => {
    setModal(prev => ({ ...prev, isOpen: false }));
  }, []);

  const resetSession = useCallback(() => {
    const fullPool = getInitialWordPool(language);
    setGameState({
      availableWords: fullPool,
      currentWord: null,
      status: GAME_STATES.NOT_STARTED,
      guessedLetters: [],
      wrongLetters: [],
      mistakes: 0,
      score: 0,
      lastAction: null
    });
    setModal(m => ({ ...m, isOpen: false }));
    try {
      localStorage.removeItem(`${STORAGE_KEY_PREFIX}${language}`);
    } catch (e) {
      // Ignorar
    }
    triggerFeedback('info', 'feedback.sessionReset', { count: fullPool.length });
  }, [language, triggerFeedback]);

  return {
    availableWords: gameState.availableWords,
    remainingWordsCount: gameState.availableWords.length,
    currentWord: gameState.currentWord,
    status: gameState.status,
    guessedLetters: gameState.guessedLetters,
    wrongLetters: gameState.wrongLetters,
    mistakes: gameState.mistakes,
    score: gameState.score,
    maxMistakes: MAX_MISTAKES_ALLOWED,
    lastAction: gameState.lastAction,
    feedback,
    modal,
    startMatch,
    requestRestart,
    confirmRestart,
    submitLetter,
    openRulesModal,
    closeModal,
    clearFeedback,
    resetSession
  };
}

export default useGame;
