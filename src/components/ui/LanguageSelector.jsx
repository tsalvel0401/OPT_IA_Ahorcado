import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../../hooks/useLanguage.jsx';

/**
 * Dropdown accesible para la selección de idioma con banderas SVG.
 */
export function LanguageSelector({ onLanguageSelect, isGameActive }) {
  const { language, languages, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Cerrar al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (code) => {
    setIsOpen(false);
    if (code === language) return;
    onLanguageSelect(code);
  };

  const currentOption = languages.find(l => l.code === language) || languages[0];

  return (
    <div className="language-selector-wrapper position-relative" ref={dropdownRef}>
      <button
        type="button"
        className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-2 language-btn"
        onClick={() => setIsOpen(prev => !prev)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={t('language.select')}
      >
        <img
          src={currentOption.flag}
          alt={currentOption.name}
          className="flag-icon"
          width="22"
          height="15"
          aria-hidden="true"
        />
        <span className="lang-code text-uppercase fw-bold">{currentOption.code}</span>
        <i className={`bi bi-chevron-${isOpen ? 'up' : 'down'} small`} aria-hidden="true"></i>
      </button>

      {isOpen && (
        <ul
          className="dropdown-menu dropdown-menu-end show shadow-sm language-dropdown p-1 m-0 mt-1"
          role="listbox"
          aria-label={t('language.select')}
        >
          {languages.map((item) => {
            const isSelected = item.code === language;
            return (
              <li key={item.code} role="option" aria-selected={isSelected}>
                <button
                  type="button"
                  className={`dropdown-item d-flex align-items-center justify-content-between gap-3 py-2 px-3 rounded-2 ${
                    isSelected ? 'active fw-bold' : ''
                  }`}
                  onClick={() => handleSelect(item.code)}
                >
                  <span className="d-flex align-items-center gap-2">
                    <img
                      src={item.flag}
                      alt={item.name}
                      className="flag-icon"
                      width="22"
                      height="15"
                      aria-hidden="true"
                    />
                    <span>{t(`language.${item.code}`)}</span>
                  </span>
                  {isSelected && (
                    <i className="bi bi-check2 small text-primary" aria-hidden="true"></i>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default LanguageSelector;
