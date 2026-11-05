import { motion } from 'framer-motion';
import { useEffect, useMemo } from 'react';
import Laguna from '../components/Laguna.jsx';
import Wari from '../components/Wari.jsx';
import Dialogo from '../components/Dialogo.jsx';
import Estrellas from '../components/Estrellas.jsx';
import { NIVELES } from '../data/niveles.js';
import { frase } from '../data/frases.js';
import { useSonidos } from '../hooks/useSonidos.js';

export default function Resultado({ ir, params }) {
  const { nivel = 1, estrellas = 3, semillas = 0, antes = 0, despues = 0, extra } = params;
  const sonidos = useSonidos();
  const info = NIVELES.find((n) => n.n === nivel);
  const siguiente = NIVELES.find((n) => n.n === nivel + 1);
  const mensaje = useMemo(() => frase('fin'), []);

  useEffect(() => {
    sonidos.fiesta();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="relative min-h-[100dvh] overflow-hidden">
      <Laguna limpieza={despues} className="fixed inset-0 w-full h-full" />
      <main className="relative z-10 max-w-2xl mx-auto px-4 py-6 flex flex-col items-center gap-4">
        <div className="tarjeta w-full p-5 text-center">
          <p className="text-lg font-bold text-stone-500">Nivel {nivel} · {info?.nombre}</p>
          <h1 className="text-4xl font-extrabold text-cantuta">¡Nivel completado!</h1>
          <div className="flex justify-center my-2">
            <Estrellas cantidad={estrellas} animar size="text-6xl" />
          </div>
          {extra && <p className="text-lg font-bold">{extra}</p>}
          <motion.p
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1.4, type: 'spring' }}
            className="text-2xl font-extrabold text-pasto"
          >
            +{semillas} 🌱 semillas
          </motion.p>
        </div>

        <div className="flex items-end gap-2 w-full">
          <Wari mood="celebrando" size={120} />
          <Dialogo texto={mensaje} className="flex-1 mb-6" />
        </div>

        <div className="tarjeta w-full p-3">
          <p className="text-center font-extrabold text-lg mb-2">Tu laguna: antes y después</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              ['Antes', antes],
              ['Después', despues],
            ].map(([t, v]) => (
              <figure key={t} className="rounded-2xl overflow-hidden border-4 border-stone-200">
                <Laguna limpieza={v} className="w-full aspect-[16/10] block" titulo={t} />
                <figcaption className="text-center font-bold bg-stone-100">
                  {t}: {Math.round(v)} %
                </figcaption>
              </figure>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          {siguiente && (
            <button type="button" className="btn btn-primario btn-grande" onClick={() => ir(siguiente.pantalla)}>
              Siguiente nivel ▶
            </button>
          )}
          <button type="button" className="btn btn-verde" onClick={() => ir('mapa')}>
            🗺️ Ir al mapa
          </button>
          <button type="button" className="btn btn-blanco" onClick={() => ir(info.pantalla)}>
            🔁 Jugar otra vez
          </button>
          {!siguiente && (
            <button type="button" className="btn btn-ocre" onClick={() => ir('laguna')}>
              🏞️ Ver mi laguna
            </button>
          )}
        </div>
      </main>
    </div>
  );
}
