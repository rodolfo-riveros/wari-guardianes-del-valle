import { AnimatePresence, motion } from 'framer-motion';
import { useRef, useState } from 'react';
import Escena from '../components/Escena.jsx';
import Hud from '../components/Hud.jsx';
import Personaje from '../components/Personaje.jsx';
import Dialogo from '../components/Dialogo.jsx';
import { VIVERO, VIVERO_POR_ID } from '../data/vivero.js';
import { useProgreso } from '../context/ProgresoContext.jsx';
import { useSonidos } from '../hooks/useSonidos.js';
import { ui } from '../assets.js';

function etapa(l) {
  if (l >= 100) return '¡Mi laguna está cristalina! Gracias, guardián. ¡Decórala con plantas y animales del vivero!';
  if (l >= 60) return 'El agua ya brilla. ¡Sigamos para que vuelvan todos los animales!';
  if (l >= 30) return 'Ya se ve mejor… ¡pero aún falta limpiar!';
  return '¡Uy, cuánta basura! Juega los niveles para limpiar mi laguna.';
}

export default function MiLaguna({ ir }) {
  const { estado, limpieza, comprarDeco, moverDeco, quitarDeco } = useProgreso();
  const sonidos = useSonidos();
  const zona = useRef(null);
  const [vivero, setVivero] = useState(false);
  const [elegido, setElegido] = useState(null); // índice de deco tocada
  const [texto, setTexto] = useState(etapa(limpieza));

  function comprar(v) {
    if (estado.semillas < v.precio) {
      sonidos.error();
      setTexto(`Te faltan ${v.precio - estado.semillas} semillas para ${v.nombre.toLowerCase()}. ¡Juega para ganar más!`);
      return;
    }
    sonidos.fiesta();
    comprarDeco(v.id, v.precio);
    setVivero(false);
    setTexto(`¡Qué lindo! Pusimos ${v.nombre.toLowerCase()} en la laguna. Arrástralo a donde quieras.`);
  }

  function soltar(i, info) {
    const caja = zona.current?.getBoundingClientRect();
    if (!caja) return;
    const x = Math.max(4, Math.min(96, ((info.point.x - caja.left) / caja.width) * 100));
    const y = Math.max(30, Math.min(97, ((info.point.y - caja.top) / caja.height) * 100));
    moverDeco(i, x, y);
  }

  return (
    <div className="relative h-[100dvh] overflow-hidden flex flex-col">
      <Escena fondo="laguna_sucia" limpieza={limpieza} />

      {/* decoraciones */}
      <div ref={zona} className="absolute inset-0 z-10">
        {[...estado.deco]
          .map((d, i) => ({ ...d, i }))
          .sort((a, b) => a.y - b.y)
          .map((d) => {
            const v = VIVERO_POR_ID[d.id];
            if (!v) return null;
            return (
              <motion.button
                key={`${d.i}-${d.x}-${d.y}`}
                type="button"
                drag
                dragMomentum={false}
                dragConstraints={zona}
                onDragEnd={(_, info) => soltar(d.i, info)}
                onTap={() => setElegido(d.i)}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute touch-none"
                style={{ left: `${d.x}%`, top: `${d.y}%`, x: '-50%', y: '-100%', zIndex: Math.round(d.y) }}
                aria-label={v.nombre}
              >
                <img src={v.img} alt="" draggable={false} className="sprite" style={{ height: `${v.tam}vh`, width: 'auto' }} />
              </motion.button>
            );
          })}
      </div>

      <div className="relative z-30">
        <Hud titulo={`Mi laguna · ${Math.round(limpieza)} %`} onVolver={() => ir('mapa')} />
      </div>

      <div className="relative z-30 mt-auto flex items-end gap-2 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] max-w-4xl w-full mx-auto">
        <Personaje quien="wari" pose={limpieza >= 100 ? 'celebrando' : 'feliz'} alto="clamp(110px, 20vh, 200px)" />
        <div className="flex-1 flex flex-col gap-2 mb-2">
          <Dialogo texto={texto} />
          <button type="button" className="btn btn-verde self-start" onClick={() => setVivero(true)}>
            <img src={ui('semilla')} alt="" className="w-8 h-8" /> Vivero de Wari
          </button>
        </div>
      </div>

      {/* Vivero (hoja inferior) */}
      <AnimatePresence>
        {vivero && (
          <motion.div className="fixed inset-0 z-40 bg-black/40 flex items-end justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setVivero(false)}>
            <motion.div
              className="panel w-full max-w-3xl !rounded-b-none p-4 pb-[max(1rem,env(safe-area-inset-bottom))]"
              initial={{ y: 300 }}
              animate={{ y: 0 }}
              exit={{ y: 300 }}
              transition={{ type: 'spring', stiffness: 220, damping: 26 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-2xl font-extrabold">Vivero de Wari</h2>
                <span className="chip">
                  <img src={ui('semilla')} alt="" className="w-7 h-7" />
                  {estado.semillas}
                </span>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 max-h-[55vh] overflow-y-auto p-1">
                {VIVERO.map((v) => (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => comprar(v)}
                    className={`flex flex-col items-center rounded-2xl border-4 bg-white p-2 shadow-[0_4px_0_rgba(0,0,0,0.15)] active:translate-y-1 ${
                      estado.semillas >= v.precio ? 'border-emerald-300' : 'border-stone-200 opacity-70'
                    }`}
                  >
                    <img src={v.img} alt="" className="h-16 sm:h-20 w-auto object-contain" />
                    <span className="font-extrabold leading-tight text-center">{v.nombre}</span>
                    <span className="inline-flex items-center gap-1 font-extrabold text-[#2e7d32]">
                      <img src={ui('semilla')} alt="" className="w-5 h-5" /> {v.precio}
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Opciones de una decoración */}
      <AnimatePresence>
        {elegido !== null && estado.deco[elegido] && (
          <motion.div className="fixed inset-0 z-40 bg-black/40 grid place-items-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setElegido(null)}>
            <motion.div className="panel p-5 text-center max-w-xs w-full" initial={{ scale: 0.8 }} animate={{ scale: 1 }} onClick={(e) => e.stopPropagation()}>
              <img src={VIVERO_POR_ID[estado.deco[elegido].id].img} alt="" className="h-24 mx-auto object-contain" />
              <p className="text-xl font-extrabold">{VIVERO_POR_ID[estado.deco[elegido].id].nombre}</p>
              <p className="text-stone-600 mb-3">{VIVERO_POR_ID[estado.deco[elegido].id].desc}</p>
              <div className="flex flex-col gap-2">
                <button type="button" className="btn btn-verde" onClick={() => setElegido(null)}>
                  ¡Dejarlo aquí!
                </button>
                <button
                  type="button"
                  className="btn btn-blanco"
                  onClick={() => {
                    quitarDeco(elegido, VIVERO_POR_ID[estado.deco[elegido].id].precio);
                    setElegido(null);
                  }}
                >
                  Devolver al vivero
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
