import { useEffect, useRef, useState } from 'react';
import { useProgreso } from '../context/ProgresoContext.jsx';

/** Calcula la limpieza "en vivo" de la laguna mientras se juega un nivel. */
export function useLimpiezaNivel(n) {
  const { estado, limpieza } = useProgreso();
  const inicio = useRef({ total: limpieza, propio: estado.limpiezaNiveles[n] }).current;
  const vivo = (fraccion) => inicio.total - inicio.propio + Math.max(inicio.propio, fraccion * 25);
  return { antes: inicio.total, vivo, despues: inicio.total - inicio.propio + 25 };
}

/** Tamaño de los tachos según el ancho de la pantalla. */
export function useTamTacho(max = 110) {
  const calc = () => Math.max(56, Math.min(max, Math.floor((window.innerWidth - 48) / 4) - 18));
  const [tam, setTam] = useState(calc);
  useEffect(() => {
    const r = () => setTam(calc());
    window.addEventListener('resize', r);
    return () => window.removeEventListener('resize', r);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return tam;
}
