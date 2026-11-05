import { useEffect, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { useVoz } from '../hooks/useVoz.js';

/** Globo de diálogo de Wari: texto letra por letra + lectura en voz alta. */
export default function Dialogo({ texto, autoHablar = true, className = '' }) {
  const [visible, setVisible] = useState('');
  const { hablar, soportado } = useVoz();
  const reducir = useReducedMotion();

  useEffect(() => {
    if (!texto) return;
    if (reducir) {
      setVisible(texto);
    } else {
      setVisible('');
      let i = 0;
      const id = setInterval(() => {
        i += 1;
        setVisible(texto.slice(0, i));
        if (i >= texto.length) clearInterval(id);
      }, 22);
      return () => clearInterval(id);
    }
  }, [texto, reducir]);

  useEffect(() => {
    if (autoHablar && texto) hablar(texto);
  }, [texto, autoHablar, hablar]);

  if (!texto) return null;

  return (
    <div className={`globo relative ${className}`} aria-live="polite">
      <p className="pr-12 text-[1.05rem] sm:text-lg font-semibold leading-snug min-h-[4.1em] sm:min-h-[2.6em]">
        <span aria-hidden="true">{visible}</span>
        <span className="sr-only">{texto}</span>
      </p>
      {soportado && (
        <button
          type="button"
          onClick={() => hablar(texto, { forzar: true })}
          className="absolute right-2 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-laguna text-white text-xl grid place-items-center shadow active:scale-95"
          aria-label="Escuchar otra vez"
        >
          🔊
        </button>
      )}
    </div>
  );
}
