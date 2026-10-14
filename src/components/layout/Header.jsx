import React from 'react';
import { useLanguage } from '../../hooks/useLanguage.jsx';
import LanguageSelector from '../ui/LanguageSelector.jsx';

/**
 * Cabecera principal con jerarquía equilibrada, selector de idioma y accesos rápidos.
 */
export function Header({ onLanguageSelect, isGameActive, onOpenRules }) {
  const { t } = useLanguage();

  return (
    <header className="app-header py-3 mb-2 border-bottom">
      <div className="d-flex align-items-center justify-content-between">
        {/* Identidad de la app */}
        <div className="d-flex align-items-center gap-2">
          <span className="brand-icon fs-3" aria-hidden="true">🎯</span>
          <div>
            <h1 className="h4 fw-bold mb-0 text-dark brand-title">
              {t('app.title')}
            </h1>
            <p className="text-secondary small mb-0 d-none d-sm-block">
              {t('app.subtitle')}
            </p>
          </div>
        </div>

        {/* Accesos rápidos y Selector de idioma */}
        <div className="d-flex align-items-center gap-2">
          <button
            type="button"
            className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1"
            onClick={onOpenRules}
            aria-label={t('modals.rulesTitle')}
            title={t('modals.rulesTitle')}
          >
            <i className="bi bi-question-circle" aria-hidden="true"></i>
            <span className="d-none d-md-inline">{t('modals.rulesTitle')}</span>
          </button>

          <LanguageSelector
            onLanguageSelect={onLanguageSelect}
            isGameActive={isGameActive}
          />
        </div>
      </div>
    </header>
  );
}

export default Header;
