import React from 'react';
import { useLanguage } from '../../hooks/useLanguage.jsx';
import { GAME_STATES } from '../../utils/wordSanitizer.js';

/**
 * Componente HERO de la aplicación.
 * Máxima prioridad visual: casillas animadas con Game Juice refinado.
 */
export function WordDisplay({ currentWord, guessedLetters, status, lastAction }) {
  const { t } = useLanguage();

  if (status === GAME_STATES.NOT_STARTED || !currentWord) {
    return (
      <section className="word-hero text-center py-5 my-2" aria-label={t('hero.placeholderPrompt')}>
        <div className="word-tiles-row d-flex justify-content-center gap-2 flex-wrap mb-3 opacity-50">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="letter-tile placeholder-tile" aria-hidden="true">
              <span className="tile-char">_</span>
            </div>
          ))}
        </div>
        <p className="text-secondary small fst-italic mb-0">
          {t('hero.placeholderPrompt')}
        </p>
      </section>
    );
  }

  const letters = currentWord.split('');
  const isLoss = status === GAME_STATES.LOST;
  const isWin = status === GAME_STATES.WON;

  return (
    <section
      className={`word-hero text-center py-4 my-1 ${lastAction === 'miss' ? 'shake-subtle' : ''}`}
      aria-label={t('app.title')}
    >
      <div className="word-meta mb-2">
        <span className="badge text-secondary-emphasis bg-secondary-subtle border border-secondary-subtle rounded-pill px-3 py-1 small fw-normal">
          {t('stats.wordLength', { count: letters.length })}
        </span>
      </div>

      <div className="word-tiles-row d-flex justify-content-center gap-2 gap-sm-3 flex-wrap">
        {letters.map((char, index) => {
          const isGuessed = guessedLetters.includes(char);
          const showChar = isGuessed || isLoss;

          return (
            <div
              key={`${index}-${char}`}
              className={`letter-tile ${
                isGuessed ? 'tile-revealed' : isLoss ? 'tile-loss' : 'tile-hidden'
              } ${isWin ? 'tile-winner' : ''}`}
              style={{ animationDelay: isWin ? `${index * 55}ms` : '0ms' }}
              aria-label={
                showChar
                  ? t('hero.revealedTileAria', { letter: char })
                  : t('hero.hiddenTileAria')
              }
            >
              <span className="tile-char">
                {showChar ? char : ''}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default WordDisplay;
