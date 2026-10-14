import React from 'react';

/**
 * Pie de página estricto y limpio.
 * Muestra única y exclusivamente la línea de copyright requerida sin menciones técnicas.
 */
export function Footer() {
  return (
    <footer className="app-footer mt-auto pt-4 pb-3 border-top text-center text-secondary small">
      <p className="mb-0 text-secondary">
        &copy; 2026 Adivina la palabra.
      </p>
    </footer>
  );
}

export default Footer;
