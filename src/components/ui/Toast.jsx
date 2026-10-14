import React, { useEffect } from 'react';
import { useLanguage } from '../../hooks/useLanguage.jsx';

/**
 * Toast atómico para retroalimentación instantánea de validación y eventos.
 */
export function Toast({ feedback, onDismiss }) {
  const { t } = useLanguage();

  useEffect(() => {
    if (!feedback) return;
    const timer = setTimeout(() => {
      onDismiss();
    }, 4000);
    return () => clearTimeout(timer);
  }, [feedback, onDismiss]);

  if (!feedback) return null;

  const { type, key, params } = feedback;
  const message = t(key, params);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return 'bi-check-circle-fill text-success';
      case 'danger':
        return 'bi-x-circle-fill text-danger';
      case 'warning':
        return 'bi-exclamation-triangle-fill text-warning';
      default:
        return 'bi-info-circle-fill text-primary';
    }
  };

  return (
    <div
      className={`app-toast toast-${type} d-flex align-items-center justify-content-between gap-2 px-3 py-2 shadow-sm my-2 mx-auto`}
      role="alert"
      aria-live="polite"
    >
      <div className="d-flex align-items-center gap-2">
        <i className={`bi ${getIcon()} fs-6`} aria-hidden="true"></i>
        <span className="small fw-medium toast-message">{message}</span>
      </div>
      <button
        type="button"
        className="btn-close btn-close-sm ms-2"
        aria-label={t('modals.btnClose')}
        onClick={onDismiss}
      ></button>
    </div>
  );
}

export default Toast;
