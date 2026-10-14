import React from 'react';
import { useLanguage } from '../../hooks/useLanguage.jsx';
import { GAME_STATES } from '../../utils/wordSanitizer.js';

/**
 * Botón CTA único y dinámico según el estado de la partida.
 * - NOT_STARTED  → no se muestra (el botón COMENZAR está en la pantalla de inicio)
 * - IN_PROGRESS  → "NUEVA PALABRA" (solicita confirmación antes de cambiar)
 * - WON / LOST   → "SIGUIENTE RETO" (carga la siguiente sin confirmación)
 * - Sin palabras → deshabilitado
 */
export function GameControls({
  status,
  remainingWords,
  onStartMatch,
  onRequestRestart
}) {
  const { t } = useLanguage();

  // No mostrar nada en la pantalla de inicio
  if (status === GAME_STATES.NOT_STARTED) return null;

  const isOutOfWords = remainingWords === 0;

  const getCtaConfig = () => {
    if (isOutOfWords) {
      return {
        text: t('cta.sessionCompleted'),
        className: 'btn btn-secondary btn-lg',
        disabled: true,
        icon: 'bi-check-all'
      };
    }

    switch (status) {
      case GAME_STATES.IN_PROGRESS:
        return {
          text: t('cta.newWord'),
          className: 'btn btn-outline-primary btn-sm',
          disabled: false,
          icon: 'bi-arrow-repeat',
          onClick: onRequestRestart
        };

      case GAME_STATES.WON:
      case GAME_STATES.LOST:
        return {
          text: t('cta.nextChallenge'),
          className: 'btn btn-primary btn-lg shadow-sm',
          disabled: false,
          icon: 'bi-arrow-right-circle-fill',
          onClick: onStartMatch
        };

      default:
        return null;
    }
  };

  const cta = getCtaConfig();
  if (!cta) return null;

  return (
    <div className="game-controls-container text-center my-3">
      <button
        type="button"
        className={`${cta.className} px-4 py-2 fw-semibold btn-cta-main`}
        onClick={cta.onClick}
        disabled={cta.disabled}
        aria-label={cta.text}
      >
        <i className={`bi ${cta.icon} me-2`} aria-hidden="true"></i>
        {cta.text}
      </button>
    </div>
  );
}

export default GameControls;
