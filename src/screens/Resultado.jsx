import { motion } from 'framer-motion';
import { useEffect, useMemo } from 'react';
import Escena from '../components/Escena.jsx';
import Personaje from '../components/Personaje.jsx';
import Dialogo from '../components/Dialogo.jsx';
import Estrellas from '../components/Estrellas.jsx';
import Confeti from '../components/Confeti.jsx';
import { NIVELES } from '../data/niveles.js';
import { frase } from '../data/frases.js';
import { useProgreso } from '../context/ProgresoContext.jsx';
import { useSonidos } from '../hooks/useSonidos.js';
import { ui } from '../assets.js';

export default function Resultado({ ir, params, jugarNivel, continuarTras }) {
  const { n = 1, estrellas = 3, semillas = 0, antes = 0, extra } = params;
  const { limpieza } = useProgreso();
  const sonidos = useSonidos();
  const info = NIVELES.find((x) => x.n === n);
  const mensaje = useMemo(() => frase('fin'), []);

  useEffect(() => {
    sonidos.fiesta();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="relative min-h-[100dvh] overflow-hidden">
      <Escena fondo="laguna_sucia" limpieza={limpieza} oscurecer={0.25} />
      <Confeti />
      <main className="relative z-10 max-w-3xl mx-auto px-4 py-6 flex flex-col items-center gap-3">
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 180, damping: 14 }}
          className="panel w-full p-5 pt-7 text-center relative"
        >
          <div className="absolute -top-5 left-1/2 -translate-x-1/2 rounded-full px-5 py-1 font-extrabold text-white bg-[#c2185b] border-[3px] border-white whitespace-nowrap shadow-lg">
            Nivel {n} · {info?.nombre}
          </div>
          <h1 className="titulo-juego text-4xl sm:text-5xl font-extrabold">¡Nivel completado!</h1>
          <div className="flex justify-center my-3">
            <Estrellas cantidad={estrellas} animar size={64} />
          </div>
          {extra && <p className="text-lg font-bold">{extra}</p>}
          <motion.p initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.5, type: 'spring' }} className="inline-flex items-center gap-2 chip !text-2xl mt-1">
            +{semillas}
            <img src={ui('semilla')} alt="" className="w-9 h-9" />
            semillas
          </motion.p>
        </motion.div>

        <div className="flex items-end gap-2 w-full">
          <Personaje quien="wari" pose="celebrando" alto="clamp(120px, 22vh, 200px)" />
          <Dialogo texto={mensaje} className="flex-1 mb-6" />
        </div>

        <div className="panel w-full p-3">
          <p className="text-center font-extrabold text-lg mb-2">Mi laguna: antes y después</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              ['Antes', antes],
              ['Ahora', limpieza],
            ].map(([t, v]) => (
              <figure key={t} className="rounded-2xl overflow-hidden border-4 border-white shadow">
                <div className="relative aspect-[16/9]">
                  <Escena fondo="laguna_sucia" limpieza={v} fijo={false} />
                </div>
                <figcaption className="text-center font-extrabold bg-amber-50">
                  {t}: {Math.round(v)} %
                </figcaption>
              </figure>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-3 pb-4">
          <button type="button" className="btn btn-verde btn-grande" onClick={() => continuarTras(n)} autoFocus>
            Continuar
            <img src={ui('play')} alt="" className="w-9 h-9" />
          </button>
          <button type="button" className="btn btn-blanco" onClick={() => jugarNivel(n)}>
            Jugar otra vez
          </button>
        </div>
      </main>
    </div>
  );
}
