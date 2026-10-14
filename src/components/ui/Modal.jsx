import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { useLanguage } from '../../hooks/useLanguage.jsx';

/**
 * Componente modal multi-propósito reutilizable:
 * - Victoria / Derrota
 * - Confirmación de reinicio
 * - Confirmación de cambio de idioma
 * - Reglas del juego
 */
export function Modal({ modalState, onClose, onConfirm, onStartNext, isSessionCompleted }) {
  const { t } = useLanguage();
  const { isOpen, type, data } = modalState;

  // Efecto de confeti sutil en victoria
  useEffect(() => {
    if (isOpen && type === 'win') {
      try {
        confetti({
          particleCount: 65,
          spread: 60,
          origin: { y: 0.6 },
          disableForReducedMotion: true
        });
      } catch (e) {
        // Silencioso
      }
    }
  }, [isOpen, type]);

  // Teclado: Escape cierra el modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const renderContent = () => {
    switch (type) {
      case 'win': {
        const { word, score, mistakes } = data || {};
        return (
          <>
            <div className="modal-header border-0 pb-0 text-success">
              <div className="d-flex align-items-center gap-2">
                <i className="bi bi-trophy-fill text-warning fs-3" aria-hidden="true"></i>
                <h2 className="modal-title h5 fw-bold mb-0 text-dark" id="modal-title">
                  {t('modals.victoryTitle')}
                </h2>
              </div>
              <button
                type="button"
                className="btn-close"
                aria-label={t('modals.btnClose')}
                onClick={onClose}
              ></button>
            </div>
            <div className="modal-body text-center px-4 py-3">
              <p className="text-secondary small mb-1">
                {t('modals.victorySubtitle')}
              </p>
              <div className="modal-word-reveal my-3 py-2 px-3 fw-bold fs-3 text-success bg-success-subtle rounded-3">
                {word}
              </div>
              <div className="d-flex justify-content-center gap-4 my-3 py-2 border-top border-bottom">
                <div>
                  <span className="d-block text-secondary small text-uppercase">
                    {t('modals.victoryMistakes')}
                  </span>
                  <span className="fw-bold fs-5 text-dark">
                    {mistakes}
                  </span>
                </div>
                <div className="border-start ps-4">
                  <span className="d-block text-secondary small text-uppercase">
                    {t('modals.victoryScore')}
                  </span>
                  <span className="fw-bold fs-5 text-success">
                    {score}
                  </span>
                </div>
              </div>
            </div>
            <div className="modal-footer border-0 pt-0 justify-content-center">
              <button
                type="button"
                className="btn btn-success px-4 py-2 fw-semibold shadow-sm"
                onClick={() => {
                  onClose();
                  onStartNext();
                }}
                disabled={isSessionCompleted}
                autoFocus
              >
                <i className="bi bi-play-circle-fill me-2" aria-hidden="true"></i>
                {t('modals.btnPlayAgain')}
              </button>
            </div>
          </>
        );
      }

      case 'loss': {
        const { word, score, mistakes } = data || {};
        return (
          <>
            <div className="modal-header border-0 pb-0 text-danger">
              <div className="d-flex align-items-center gap-2">
                <i className="bi bi-heartbreak-fill fs-3" aria-hidden="true"></i>
                <h2 className="modal-title h5 fw-bold mb-0 text-dark" id="modal-title">
                  {t('modals.defeatTitle')}
                </h2>
              </div>
              <button
                type="button"
                className="btn-close"
                aria-label={t('modals.btnClose')}
                onClick={onClose}
              ></button>
            </div>
            <div className="modal-body text-center px-4 py-3">
              <p className="text-secondary small mb-1">
                {t('modals.defeatSubtitle')}
              </p>
              <div className="modal-word-reveal my-3 py-2 px-3 fw-bold fs-3 text-danger bg-danger-subtle rounded-3">
                {word}
              </div>
              <div className="d-flex justify-content-center gap-4 my-3 py-2 border-top border-bottom">
                <div>
                  <span className="d-block text-secondary small text-uppercase">
                    {t('modals.defeatMistakes')}
                  </span>
                  <span className="fw-bold fs-5 text-dark">
                    {mistakes} / 7
                  </span>
                </div>
                <div className="border-start ps-4">
                  <span className="d-block text-secondary small text-uppercase">
                    {t('modals.defeatScore')}
                  </span>
                  <span className="fw-bold fs-5 text-secondary">
                    {score}
                  </span>
                </div>
              </div>
            </div>
            <div className="modal-footer border-0 pt-0 justify-content-center">
              <button
                type="button"
                className="btn btn-primary px-4 py-2 fw-semibold shadow-sm"
                onClick={() => {
                  onClose();
                  onStartNext();
                }}
                disabled={isSessionCompleted}
                autoFocus
              >
                <i className="bi bi-play-circle-fill me-2" aria-hidden="true"></i>
                {t('modals.btnPlayAgain')}
              </button>
            </div>
          </>
        );
      }

      case 'confirmRestart':
        return (
          <>
            <div className="modal-header border-0 pb-0">
              <h2 className="modal-title h5 fw-bold text-dark" id="modal-title">
                {t('modals.confirmRestartTitle')}
              </h2>
              <button
                type="button"
                className="btn-close"
                aria-label={t('modals.btnClose')}
                onClick={onClose}
              ></button>
            </div>
            <div className="modal-body text-secondary py-3">
              <p className="mb-0">{t('modals.confirmRestartMessage')}</p>
            </div>
            <div className="modal-footer border-0 pt-0">
              <button type="button" className="btn btn-outline-secondary" onClick={onClose}>
                {t('modals.btnCancel')}
              </button>
              <button type="button" className="btn btn-danger" onClick={onConfirm}>
                {t('modals.btnConfirm')}
              </button>
            </div>
          </>
        );

      case 'confirmChangeLanguage':
        return (
          <>
            <div className="modal-header border-0 pb-0">
              <h2 className="modal-title h5 fw-bold text-dark" id="modal-title">
                {t('modals.confirmChangeLanguageTitle')}
              </h2>
              <button
                type="button"
                className="btn-close"
                aria-label={t('modals.btnClose')}
                onClick={onClose}
              ></button>
            </div>
            <div className="modal-body text-secondary py-3">
              <p className="mb-0">{t('modals.confirmChangeLanguageMessage')}</p>
            </div>
            <div className="modal-footer border-0 pt-0">
              <button type="button" className="btn btn-outline-secondary" onClick={onClose}>
                {t('modals.btnCancel')}
              </button>
              <button type="button" className="btn btn-primary" onClick={onConfirm}>
                {t('modals.btnConfirm')}
              </button>
            </div>
          </>
        );

      case 'rules': {
        const rulesList = t('modals.rulesList');
        return (
          <>
            <div className="modal-header border-0 pb-0">
              <div className="d-flex align-items-center gap-2">
                <i className="bi bi-journal-text text-primary fs-4" aria-hidden="true"></i>
                <h2 className="modal-title h5 fw-bold text-dark mb-0" id="modal-title">
                  {t('modals.rulesTitle')}
                </h2>
              </div>
              <button
                type="button"
                className="btn-close"
                aria-label={t('modals.btnClose')}
                onClick={onClose}
              ></button>
            </div>
            <div className="modal-body text-secondary py-3">
              <p className="mb-3 small">{t('modals.rulesIntro')}</p>
              <ul className="list-unstyled d-flex flex-column gap-2 mb-0 small">
                {Array.isArray(rulesList) && rulesList.map((rule, idx) => (
                  <li key={idx} className="d-flex align-items-start gap-2">
                    <i className="bi bi-check2-circle text-primary mt-1" aria-hidden="true"></i>
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="modal-footer border-0 pt-0 justify-content-end">
              <button type="button" className="btn btn-primary" onClick={onClose}>
                {t('modals.btnClose')}
              </button>
            </div>
          </>
        );
      }

      default:
        return null;
    }
  };

  return (
    <>
      <div className="modal-backdrop fade show" onClick={onClose} aria-hidden="true"></div>
      <div
        className="modal fade show d-block"
        tabIndex="-1"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="modal-dialog modal-dialog-centered modal-dialog-custom">
          <div className="modal-content border-0 shadow-lg modal-app-card">
            {renderContent()}
          </div>
        </div>
      </div>
    </>
  );
}

export default Modal;
