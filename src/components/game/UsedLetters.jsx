import React from 'react';
import { useLanguage } from '../../hooks/useLanguage.jsx';

/**
 * Historial visual de letras utilizadas diferenciando claramente aciertos y fallos.
 */
export function UsedLetters({ guessedLetters = [], wrongLetters = [] }) {
  const { t } = useLanguage();
  const hasUsedLetters = guessedLetters.length > 0 || wrongLetters.length > 0;

  if (!hasUsedLetters) {
    return (
      <section className="used-letters-section text-center my-3 opacity-75" aria-label={t('usedLetters.title')}>
        <small className="text-muted fst-italic">
          {t('usedLetters.empty')}
        </small>
      </section>
    );
  }

  return (
    <section className="used-letters-section card border-0 bg-transparent my-3" aria-label={t('usedLetters.title')}>
      <div className="card-body p-2">
        <div className="row g-3 justify-content-center">
          {/* Aciertos */}
          <div className="col-12 col-sm-6 text-center text-sm-end">
            <span className="small fw-bold text-success text-uppercase me-2 d-inline-block">
              <i className="bi bi-check-circle me-1" aria-hidden="true"></i>
              {t('usedLetters.hitsCount', { count: guessedLetters.length })}
            </span>
            <div className="d-inline-flex flex-wrap gap-1 align-items-center">
              {guessedLetters.length === 0 ? (
                <span className="text-muted small fst-italic">—</span>
              ) : (
                guessedLetters.map(letter => (
                  <span key={`guessed-${letter}`} className="letter-pill pill-hit">
                    {letter}
                  </span>
                ))
              )}
            </div>
          </div>

          {/* Fallos */}
          <div className="col-12 col-sm-6 text-center text-sm-start border-start-sm">
            <span className="small fw-bold text-danger text-uppercase me-2 d-inline-block">
              <i className="bi bi-x-circle me-1" aria-hidden="true"></i>
              {t('usedLetters.missesCount', { count: wrongLetters.length })}
            </span>
            <div className="d-inline-flex flex-wrap gap-1 align-items-center">
              {wrongLetters.length === 0 ? (
                <span className="text-muted small fst-italic">—</span>
              ) : (
                wrongLetters.map(letter => (
                  <span key={`wrong-${letter}`} className="letter-pill pill-miss">
                    {letter}
                  </span>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default UsedLetters;
