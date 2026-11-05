import { useMemo } from 'react';
import { useProgreso } from '../context/ProgresoContext.jsx';

// Efectos cortos generados con Web Audio API (sin archivos externos).
let ctx = null;
function audio() {
  if (typeof window === 'undefined') return null;
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return null;
  if (!ctx) ctx = new AC();
  if (ctx.state === 'suspended') ctx.resume().catch(() => {});
  return ctx;
}

function nota(frecuencia, inicio, duracion, { tipo = 'sine', volumen = 0.1 } = {}) {
  const a = audio();
  if (!a) return;
  const t = a.currentTime + inicio;
  const osc = a.createOscillator();
  const gan = a.createGain();
  osc.type = tipo;
  osc.frequency.setValueAtTime(frecuencia, t);
  gan.gain.setValueAtTime(0.0001, t);
  gan.gain.exponentialRampToValueAtTime(volumen, t + 0.02);
  gan.gain.exponentialRampToValueAtTime(0.0001, t + duracion);
  osc.connect(gan).connect(a.destination);
  osc.start(t);
  osc.stop(t + duracion + 0.05);
}

const EFECTOS = {
  click: () => nota(660, 0, 0.08, { tipo: 'triangle', volumen: 0.06 }),
  pop: () => {
    nota(520, 0, 0.1, { tipo: 'sine', volumen: 0.08 });
    nota(780, 0.05, 0.1, { tipo: 'sine', volumen: 0.06 });
  },
  acierto: () => {
    nota(523, 0, 0.15, { tipo: 'triangle', volumen: 0.1 });
    nota(659, 0.1, 0.15, { tipo: 'triangle', volumen: 0.1 });
    nota(784, 0.2, 0.25, { tipo: 'triangle', volumen: 0.1 });
  },
  // Sonido suave y amable, nada de "buzzer".
  error: () => {
    nota(392, 0, 0.18, { tipo: 'sine', volumen: 0.07 });
    nota(349, 0.14, 0.22, { tipo: 'sine', volumen: 0.06 });
  },
  fiesta: () => {
    [523, 659, 784, 1047, 784, 1047].forEach((f, i) =>
      nota(f, i * 0.11, 0.2, { tipo: 'triangle', volumen: 0.09 }),
    );
  },
};

export function useSonidos() {
  const { estado } = useProgreso();
  const activo = estado.ajustes.sonido;
  return useMemo(() => {
    const envolver = (fn) => () => {
      if (!activo) return;
      try {
        fn();
      } catch {
        /* sonido opcional */
      }
    };
    return Object.fromEntries(Object.entries(EFECTOS).map(([k, fn]) => [k, envolver(fn)]));
  }, [activo]);
}
