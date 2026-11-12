import { motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import Escena from '../components/Escena.jsx';
import Personaje from '../components/Personaje.jsx';
import Dialogo from '../components/Dialogo.jsx';
import { useProgreso } from '../context/ProgresoContext.jsx';
import { useSonidos } from '../hooks/useSonidos.js';
import { frase } from '../data/frases.js';
import { ui } from '../assets.js';

export default function Inicio({ ir, jugarNivel }) {
  const { estado, limpieza, completos } = useProgreso();
  const sonidos = useSonidos();
  const [dormido, setDormido] = useState(false);
  const saludo = useMemo(() => frase('saludo'), []);
  const nuevo = completos === 0 && !estado.escenasVistas.includes('prologo');

  // Si nadie toca la pantalla, Wari se duerme.
  useEffect(() => {
    let t;
    const despertar = () => {
      setDormido(false);
      clearTimeout(t);
      t = setTimeout(() => setDormido(true), 20000);
    };
    despertar();
    const ev = ['pointerdown', 'keydown'];
    ev.forEach((e) => window.addEventListener(e, despertar));
    return () => {
      clearTimeout(t);
      ev.forEach((e) => window.removeEventListener(e, despertar));
    };
  }, []);

  return (
    <div className="relative h-[100dvh] overflow-hidden flex flex-col">
      <Escena fondo="laguna_sucia" limpieza={limpieza} />
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/40 pointer-events-none" />

      <main className="relative z-10 flex-1 flex flex-col items-center justify-between px-4 pt-[max(1.5rem,env(safe-area-inset-top))] pb-[max(1.25rem,env(safe-area-inset-bottom))] max-w-5xl mx-auto w-full">
        <motion.div initial={{ y: -40, opacity: 0, scale: 0.8 }} animate={{ y: 0, opacity: 1, scale: 1 }} transition={{ type: 'spring', stiffness: 140, damping: 12 }} className="text-center">
          <h1 className="titulo-juego text-6xl sm:text-8xl font-extrabold leading-none">Wari</h1>
          <p className="titulo-juego text-2xl sm:text-4xl font-extrabold leading-tight mt-1">y los Guardianes del Valle</p>
          <div className="tejido h-3 w-56 sm:w-80 mx-auto rounded-full mt-3 shadow" />
        </motion.div>

        <div className="flex flex-col sm:flex-row items-center sm:items-end gap-2 w-full justify-center">
          <Dialogo
            texto={dormido ? 'Zzz… ¡Toca la pantalla para despertarme!' : saludo}
            autoHablar={false}
            className="w-full max-w-sm sm:order-2 sm:mb-16"
          />
          <Personaje quien="wari" pose={dormido ? 'durmiendo' : 'saludando'} alto="clamp(170px, 34vh, 380px)" className="sm:order-1" />
        </div>

        <div className="flex flex-col items-center gap-3 w-full">
          <motion.button
            type="button"
            className="btn btn-verde btn-grande"
            animate={{ scale: [1, 1.06, 1] }}
            transition={{ duration: 1.6, repeat: Infinity }}
            onClick={() => {
              sonidos.pop();
              if (nuevo) jugarNivel(1);
              else ir('mapa');
            }}
          >
            {nuevo ? '¡Empezar la aventura!' : '¡Continuar!'}
            <img src={ui('play')} alt="" className="w-10 h-10" />
          </motion.button>
          <div className="flex gap-3 flex-wrap justify-center">
            <button type="button" className="btn btn-blanco" onClick={() => ir('ajustes', { desde: 'inicio' })}>
              <img src={ui('ajustes')} alt="" className="w-8 h-8" /> Ajustes
            </button>
            <button type="button" className="btn btn-blanco" onClick={() => ir('profes', { desde: 'inicio' })}>
              Para profes y familias
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
