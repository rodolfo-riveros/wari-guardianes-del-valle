import { motion } from 'framer-motion';
import Laguna from '../components/Laguna.jsx';
import Icono from '../components/Icono.jsx';
import Encabezado from '../components/Encabezado.jsx';
import Estrellas from '../components/Estrellas.jsx';
import Wari from '../components/Wari.jsx';
import { useProgreso } from '../context/ProgresoContext.jsx';
import { useSonidos } from '../hooks/useSonidos.js';
import { NIVELES } from '../data/niveles.js';

const MENU = [
  { p: 'laguna', icono: 'laguna', txt: 'Mi laguna' },
  { p: 'album', icono: 'album', txt: 'Álbum' },
  { p: 'insignias', icono: 'medalla', txt: 'Insignias' },
  { p: 'tienda', icono: 'tienda', txt: 'Tienda' },
  { p: 'ajustes', icono: 'ajustes', txt: 'Ajustes' },
  { p: 'profes', icono: 'familia', txt: 'Profes' },
];

export default function Mapa({ ir }) {
  const { estado, limpieza } = useProgreso();
  const sonidos = useSonidos();

  return (
    <div className="relative min-h-[100dvh] overflow-hidden">
      <Laguna limpieza={limpieza} className="fixed inset-0 w-full h-full" />
      <div className="relative z-10 max-w-3xl mx-auto pb-8">
        <Encabezado titulo="Mapa del valle" onVolver={() => ir('inicio')} />

        <div className="relative px-4 mt-2">
          {/* camino */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            <path d="M28 8 C 80 20, 80 30, 72 34 C 20 46, 20 56, 28 60 C 80 72, 80 80, 72 88" stroke="#fff6e5" strokeWidth="5" strokeDasharray="2 3" fill="none" vectorEffect="non-scaling-stroke" />
          </svg>

          <div className="relative flex flex-col gap-5">
            {NIVELES.map((nv, i) => {
              const bloqueado = nv.n > estado.nivelDesbloqueado;
              const actual = nv.n === estado.nivelDesbloqueado && !estado.estrellas[nv.n];
              return (
                <motion.div
                  key={nv.n}
                  initial={{ opacity: 0, x: i % 2 ? 40 : -40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={`flex items-center gap-3 ${i % 2 ? 'flex-row-reverse text-right' : ''}`}
                >
                  <motion.button
                    type="button"
                    disabled={bloqueado}
                    onClick={() => {
                      sonidos.pop();
                      ir(nv.pantalla);
                    }}
                    animate={actual ? { scale: [1, 1.08, 1] } : {}}
                    transition={{ duration: 1.4, repeat: Infinity }}
                    className={`shrink-0 w-28 h-28 sm:w-32 sm:h-32 rounded-[45%] grid place-items-center text-5xl shadow-[0_8px_0_rgba(0,0,0,0.3)] border-4 ${
                      bloqueado ? 'bg-stone-400 border-stone-500 cursor-not-allowed' : 'bg-ocre border-white'
                    }`}
                    aria-label={bloqueado ? `Nivel ${nv.n}: ${nv.nombre}. Bloqueado` : `Jugar nivel ${nv.n}: ${nv.nombre}`}
                  >
                    <Icono nombre={bloqueado ? 'candado' : nv.icono} size={64} />
                  </motion.button>
                  <div className={`bg-white/90 rounded-3xl px-4 py-2 shadow-lg min-w-0 ${bloqueado ? 'opacity-80' : ''}`}>
                    <p className="text-sm font-bold text-stone-500">Nivel {nv.n}</p>
                    <p className="text-xl font-extrabold leading-tight">{nv.nombre}</p>
                    <p className="text-sm text-stone-600 leading-tight">{bloqueado ? 'Completa el nivel anterior' : nv.desc}</p>
                    <div className={`mt-1 flex ${i % 2 ? 'justify-end' : ''}`}>
                      <Estrellas cantidad={estado.estrellas[nv.n]} size={28} />
                    </div>
                  </div>
                  {actual && (
                    <div className="hidden sm:block">
                      <Wari mood="feliz" size={80} />
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        <nav className="grid grid-cols-3 gap-3 px-4 mt-8" aria-label="Más opciones">
          {MENU.map((m) => (
            <button key={m.p} type="button" className="btn btn-blanco flex-col !gap-0 py-2" onClick={() => ir(m.p)}>
              <Icono nombre={m.icono} size={40} />
              <span className="text-base">{m.txt}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}
