import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../../hooks/useLanguage.jsx';

/**
 * Formulario de entrada de letras con respuesta táctil y Game Juice.
 */
export function LetterInput({ onSubmitLetter, disabled, lastAction }) {
  const { t } = useLanguage();
  const [value, setValue] = useState('');
  const inputRef = useRef(null);

  // Mantener el foco activo siempre que la partida esté en curso
  useEffect(() => {
    if (!disabled && inputRef.current) {
      inputRef.current.focus();
    }
  }, [disabled]);

  const handleChange = (e) => {
    const raw = e.target.value;
    if (raw.length > 1) {
      setValue(raw.slice(-1).toUpperCase());
    } else {
      setValue(raw.toUpperCase());
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (disabled) return;

    const trimmed = value.trim();
    if (!trimmed) {
      inputRef.current?.focus();
      return;
    }

    onSubmitLetter(trimmed);
    setValue('');

    setTimeout(() => {
      inputRef.current?.focus();
    }, 25);
  };

  const isInputShaking = lastAction === 'invalid' || lastAction === 'repeat';

  return (
    <section className="letter-input-section my-3 text-center" aria-label={t('input.label')}>
      <form onSubmit={handleSubmit} className="d-inline-flex flex-column align-items-center">
        <div className="input-group-custom d-flex align-items-center justify-content-center gap-2">
          {/* Etiqueta LETRA */}
          <label htmlFor="input-letter-field" className="fw-bold fs-6 text-dark mb-0 letter-tag">
            {t('input.label')}
          </label>

          {/* Campo de texto */}
          <input
            id="input-letter-field"
            ref={inputRef}
            type="text"
            className={`form-control letter-field text-center fw-bold fs-4 ${
              isInputShaking ? 'shake-input' : ''
            }`}
            value={value}
            onChange={handleChange}
            maxLength={1}
            autoComplete="off"
            autoCapitalize="characters"
            spellCheck="false"
            disabled={disabled}
            placeholder={t('input.placeholder')}
            aria-label={t('input.label')}
            aria-describedby="letter-hint-text"
          />

          {/* Botón COMPROBAR */}
          <button
            type="submit"
            className="btn btn-success px-4 py-2 fw-semibold btn-check"
            disabled={disabled || !value}
            aria-label={t('input.submit')}
          >
            <i className="bi bi-check-lg me-1" aria-hidden="true"></i>
            {t('input.submit')}
          </button>
        </div>

        <small id="letter-hint-text" className="text-secondary mt-2 small">
          {disabled ? t('input.hintInactive') : t('input.hintActive')}
        </small>
      </form>
    </section>
  );
}

export default LetterInput;
