import React from 'react';
import { useLanguage } from '../../hooks/useLanguage.jsx';

/**
 * Barra de estadísticas: fallos (con dots) y puntuación.
 * El separador "/" siempre queda en línea continua con los números.
 */
export function ScoreBoard({ mistakes, maxMistakes, score }) {
  const { t } = useLanguage();

  return (
    <section className="stats-bar card border-0 shadow-sm mx-auto my-3" aria-label={t('stats.score')}>
      <div className="card-body py-2 px-3">
        <div className="d-flex align-items-center justify-content-center gap-4 flex-wrap text-center">

          {/* FALLOS */}
          <div className="d-flex align-items-center gap-2">
            <span className="small text-secondary fw-semibold text-uppercase">
              {t('stats.mistakes')}:
            </span>

            {/* Número "X / 7" todo en la misma línea */}
            <span
              className={`fw-bold fs-6 ${
                mistakes >= 5 ? 'text-danger' : mistakes >= 3 ? 'text-warning' : 'text-dark'
              }`}
              style={{ display: 'inline-flex', alignItems: 'center', whiteSpace: 'nowrap', lineHeight: 1 }}
            >
              {mistakes}
              <span className="mx-1 text-secondary opacity-75" style={{ lineHeight: 1 }}>/</span>
              {maxMistakes}
            </span>

            {/* Puntos reactivos */}
            <div className="mistake-dots d-flex gap-1" aria-hidden="true">
              {[...Array(maxMistakes)].map((_, i) => (
                <span
                  key={i}
                  className={`mistake-dot ${i < mistakes ? 'dot-filled' : 'dot-empty'}`}
                />
              ))}
            </div>
          </div>

          {/* PUNTUACIÓN */}
          <div className="d-flex align-items-center gap-2">
            <span className="small text-secondary fw-semibold text-uppercase">
              {t('stats.score')}:
            </span>
            <span className="fw-bold fs-5 text-success">{score}</span>
          </div>

        </div>
      </div>
    </section>
  );
}

export default ScoreBoard;
