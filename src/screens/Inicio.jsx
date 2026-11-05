import { motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import Laguna from '../components/Laguna.jsx';
import Icono from '../components/Icono.jsx';
import Wari from '../components/Wari.jsx';
import Dialogo from '../components/Dialogo.jsx';
import { useProgreso } from '../context/ProgresoContext.jsx';
import { useSonidos } from '../hooks/useSonidos.js';
import { frase } from '../data/frases.js';

export default function Inicio({ ir }) {
  const { limpieza } = useProgreso();
  const sonidos = useSonidos();
  const [dormido, setDormido] = useState(false);
  const saludo = useMemo(() => frase('saludo'), []);

  // Si no hay actividad por un rato, Wari se duerme.
  useEffect(() => {
    let t;
    const despertar = () => {
      setDormido(false);
      clearTimeout(t);
      t = setTimeout(() => setDormido(true), 20000);
    };
    despertar();
    const eventos = ['pointerdown', 'pointermove', 'keydown'];
    eventos.forEach((e) => window.addEventListener(e, despertar));
    return () => {
      clearTimeout(t);
      eventos.forEach((e) => window.removeEventListener(e, despertar));
    };
  }, []);

  return (
    <div className="relative min-h-[100dvh] overflow-hidden flex flex-col">
      <Laguna limpieza={limpieza} className="absolute inset-0 w-full h-full" />
      <div className="tejido h-3 relative z-10" />

      <main className="relative z-10 flex-1 flex flex-col items-center justify-between gap-4 px-4 py-6 max-w-3xl mx-auto w-full">
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center bg-white/85 rounded-[2rem] px-6 py-3 shadow-xl border-4 border-ocre"
        >
          <h1 className="text-4xl sm:text-6xl font-extrabold leading-none text-tierra">Wari</h1>
          <p className="text-xl sm:text-3xl font-extrabold text-cantuta leading-tight">y los Guardianes del Valle</p>
        </motion.div>

        <div className="flex flex-col items-center gap-2 w-full">
          <Dialogo
            texto={dormido ? 'Zzz… ¡Toca la pantalla para despertarme!' : saludo}
            autoHablar={false}
            className="max-w-md w-full"
          />
          <Wari mood={dormido ? 'durmiendo' : 'saludando'} size={190} />
        </div>

        <div className="flex flex-col items-center gap-4 w-full">
          <motion.button
            type="button"
            className="btn btn-primario btn-grande"
            animate={{ scale: [1, 1.06, 1] }}
            transition={{ duration: 1.6, repeat: Infinity }}
            onClick={() => {
              sonidos.pop();
              ir('mapa');
            }}
          >
            ¡Jugar! <Icono nombre="play" />
          </motion.button>
          <div className="flex gap-3 flex-wrap justify-center">
            <button type="button" className="btn btn-blanco" onClick={() => ir('ajustes')}>
              <Icono nombre="ajustes" size={28} /> Ajustes
            </button>
            <button type="button" className="btn btn-blanco" onClick={() => ir('profes')}>
              <Icono nombre="familia" size={28} /> Para profes y familias
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
