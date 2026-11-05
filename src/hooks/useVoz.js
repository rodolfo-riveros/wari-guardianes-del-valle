import { useCallback, useEffect } from 'react';
import { useProgreso } from '../context/ProgresoContext.jsx';

const soportado = typeof window !== 'undefined' && 'speechSynthesis' in window;
let vozElegida = null;

function elegirVoz() {
  if (!soportado) return null;
  const voces = window.speechSynthesis.getVoices();
  if (!voces.length) return null;
  const es = voces.filter((v) => v.lang && v.lang.toLowerCase().startsWith('es'));
  vozElegida =
    es.find((v) => /pe/i.test(v.lang)) ||
    es.find((v) => /(419|mx|us|co|ar|cl)/i.test(v.lang)) ||
    es[0] ||
    null;
  return vozElegida;
}

if (soportado) {
  elegirVoz();
  window.speechSynthesis.addEventListener?.('voiceschanged', elegirVoz);
}

/** Limpia emojis y símbolos para que la voz lea solo palabras. */
function limpiar(texto) {
  return String(texto)
    .replace(/[\p{Extended_Pictographic}️‍]/gu, '')
    .replace(/\*\*/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function useVoz() {
  const { estado } = useProgreso();
  const activa = estado.ajustes.voz;

  const callar = useCallback(() => {
    if (soportado) window.speechSynthesis.cancel();
  }, []);

  const hablar = useCallback(
    (texto, { forzar = false } = {}) => {
      if (!soportado || (!activa && !forzar) || !texto) return;
      try {
        window.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(limpiar(texto));
        const voz = vozElegida || elegirVoz();
        if (voz) u.voice = voz;
        u.lang = voz?.lang || 'es-PE';
        u.rate = 0.95;
        u.pitch = 1.2;
        u.volume = 0.9;
        window.speechSynthesis.speak(u);
      } catch {
        /* la voz es opcional */
      }
    },
    [activa],
  );

  useEffect(() => {
    if (!activa) callar();
  }, [activa, callar]);

  return { hablar, callar, soportado, activa };
}
