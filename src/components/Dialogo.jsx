import { useEffect, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { useVoz } from '../hooks/useVoz.js';
import { PERSONAJES } from '../data/personajes.js';
import { ui } from '../assets.js';

/** Escribe el texto letra por letra. Devuelve [visible, terminado, completar]. */
export function useEscritura(texto, velocidad = 24) {
  const reducir = useReducedMotion();
  const [n, setN] = useState(0);
  useEffect(() => {
    setN(reducir ? texto.length : 0);
    if (reducir || !texto) return;
    const id = setInterval(() => {
      setN((x) => {
        if (x >= texto.length) {
          clearInterval(id);
          return x;
        }
        return x + 1;
      });
    }, velocidad);
    return () => clearInterval(id);
  }, [texto, reducir, velocidad]);
  return [texto.slice(0, n), n >= texto.length, () => setN(texto.length)];
}

/** Globo de diálogo (dentro de los niveles). Lee en voz alta con la voz del personaje. */
export default function Dialogo({ texto, quien = 'wari', autoHablar = true, className = '' }) {
  const { hablar, soportado } = useVoz();
  const [visible] = useEscritura(texto || '');
  const voz = PERSONAJES[quien]?.voz || {};

  useEffect(() => {
    if (autoHablar && texto) hablar(texto, voz);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [texto, autoHablar, hablar]);

  if (!texto) return null;

  return (
    <div className={`panel relative px-4 py-3 ${className}`} aria-live="polite">
      <p className={`${soportado ? 'pr-12' : ''} text-base sm:text-lg font-bold leading-snug min-h-[2.6em]`}>
        <span aria-hidden="true">{visible}</span>
        <span className="sr-only">{texto}</span>
      </p>
      {soportado && (
        <button
          type="button"
          onClick={() => hablar(texto, { ...voz, forzar: true })}
          className="absolute right-2 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full grid place-items-center bg-white shadow active:scale-95"
          aria-label="Escuchar otra vez"
        >
          <img src={ui('altavoz')} alt="" className="w-8 h-8" />
        </button>
      )}
    </div>
  );
}
