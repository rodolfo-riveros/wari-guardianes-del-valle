import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import Hud from '../components/Hud.jsx';
import Modal from '../components/Modal.jsx';
import Personaje from '../components/Personaje.jsx';
import { NIVELES, CAPITULOS } from '../data/niveles.js';
import { HISTORIA } from '../data/historia.js';
import { useProgreso } from '../context/ProgresoContext.jsx';
import { useSonidos } from '../hooks/useSonidos.js';
import { escena, ui, img } from '../assets.js';

const MENU = [
  { p: 'laguna', src: img('deco/cantuta'), txt: 'Mi laguna' },
  { p: 'album', src: ui('cofre'), txt: 'Álbum' },
  { p: 'insignias', src: img('insignias/primer_guardian'), txt: 'Insignias' },
  { p: 'cuentos', src: ui('mapa'), txt: 'Historias' },
  { p: 'ajustes', src: ui('ajustes'), txt: 'Ajustes' },
];

// Etiquetas de capítulo sobre el mapa (en %)
const ETIQUETAS = { 1: [10, 95], 2: [22, 45], 3: [62, 64], 4: [76, 56], 5: [86, 23] };

export default function Mapa({ ir, jugarNivel }) {
  const { estado, completos } = useProgreso();
  const sonidos = useSonidos();
  const scroller = useRef(null);
  const [cuentos, setCuentos] = useState(false);
  const actual = Math.min(estado.nivelDesbloqueado, NIVELES.length);
  const nivelActual = NIVELES[actual - 1];

  // Centra el mapa en el nivel actual (en celulares el mapa se desliza).
  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    const ancho = el.scrollWidth;
    el.scrollTo({ left: (nivelActual.mapa[0] / 100) * ancho - el.clientWidth / 2, behavior: 'smooth' });
  }, [nivelActual]);

  const historiasVistas = Object.entries(HISTORIA).filter(([id]) => estado.escenasVistas.includes(id));

  return (
    <div className="fixed inset-0 bg-[#1d6a92]">
      <div ref={scroller} className="absolute inset-x-0 top-0 bottom-[calc(76px+env(safe-area-inset-bottom))] overflow-x-auto overflow-y-hidden">
        <div className="relative h-full" style={{ aspectRatio: '16 / 9', minWidth: '100%' }}>
          <img src={escena('mapa')} alt="Mapa del Valle Sagrado" className="absolute inset-0 w-full h-full object-cover" draggable={false} />

          {CAPITULOS.map((c) => (
            <div
              key={c.n}
              className="absolute -translate-x-1/2 -translate-y-1/2 panel-oscuro px-3 py-0.5 text-xs sm:text-sm font-extrabold whitespace-nowrap pointer-events-none"
              style={{ left: `${ETIQUETAS[c.n][0]}%`, top: `${ETIQUETAS[c.n][1]}%` }}
            >
              Cap. {c.n} · {c.nombre}
            </div>
          ))}

          {NIVELES.map((nv) => {
            const bloqueado = nv.n > estado.nivelDesbloqueado;
            const esActual = nv.n === actual && !estado.estrellas[nv.n];
            return (
              <div key={nv.n} className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center" style={{ left: `${nv.mapa[0]}%`, top: `${nv.mapa[1]}%` }}>
                {esActual && (
                  <div className="absolute bottom-[85%] pointer-events-none">
                    <Personaje quien="wari" pose="saludando" alto="clamp(70px, 14vh, 130px)" />
                  </div>
                )}
                <motion.button
                  type="button"
                  disabled={bloqueado}
                  onClick={() => {
                    sonidos.pop();
                    jugarNivel(nv.n);
                  }}
                  animate={esActual ? { scale: [1, 1.12, 1] } : {}}
                  transition={{ duration: 1.3, repeat: Infinity }}
                  className={`relative w-[clamp(52px,9vh,84px)] h-[clamp(52px,9vh,84px)] rounded-full grid place-items-center font-extrabold text-2xl sm:text-3xl border-4 shadow-[0_6px_0_rgba(0,0,0,0.35),0_10px_20px_rgba(0,0,0,0.4)] ${
                    bloqueado
                      ? 'bg-stone-500/90 border-stone-300 cursor-not-allowed'
                      : esActual
                        ? 'bg-gradient-to-b from-[#ff6f9c] to-[#c2185b] border-white text-white brillo'
                        : 'bg-gradient-to-b from-[#ffd978] to-[#d18e12] border-white text-[#4a2c05]'
                  }`}
                  aria-label={bloqueado ? `Nivel ${nv.n}: ${nv.nombre}. Bloqueado` : `Nivel ${nv.n}: ${nv.nombre}`}
                >
                  {bloqueado ? <img src={ui('candado')} alt="" className="w-[60%] h-[60%] object-contain" /> : nv.n}
                </motion.button>
                <div className="mt-1 flex">
                  {[1, 2, 3].map((s) => (
                    <img key={s} src={ui('estrella')} alt="" className="w-4 h-4 sm:w-5 sm:h-5" style={{ filter: s <= (estado.estrellas[nv.n] || 0) ? 'none' : 'grayscale(1) brightness(.6) opacity(.7)' }} />
                  ))}
                </div>
                {!bloqueado && (
                  <span className="mt-0.5 panel-oscuro !rounded-full px-2 text-[0.7rem] sm:text-xs font-bold whitespace-nowrap">{nv.nombre}</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="absolute inset-x-0 top-0 z-20">
        <Hud titulo={`Mapa del valle · ${completos}/10`} onVolver={() => ir('inicio')} />
      </div>

      <nav className="absolute inset-x-0 bottom-0 z-20 flex justify-center gap-2 px-2 pb-[max(0.6rem,env(safe-area-inset-bottom))]" aria-label="Menú">
        {MENU.map((m) => (
          <button
            key={m.p}
            type="button"
            className="btn btn-blanco flex-col !gap-0 !px-2 sm:!px-4 py-1 !min-h-[64px] w-[19vw] max-w-[110px]"
            onClick={() => (m.p === 'cuentos' ? setCuentos(true) : ir(m.p))}
          >
            <img src={m.src} alt="" className="w-9 h-9 sm:w-11 sm:h-11 object-contain" />
            <span className="text-[0.72rem] sm:text-sm leading-tight">{m.txt}</span>
          </button>
        ))}
      </nav>

      <Modal abierto={cuentos} onCerrar={() => setCuentos(false)} etiqueta="Historias">
        <div className="panel w-full max-w-md p-5">
          <h2 className="text-2xl font-extrabold text-center mb-3">Historias de Wari</h2>
          {historiasVistas.length === 0 && <p className="text-center font-bold">¡Juega para descubrir la historia!</p>}
          <div className="flex flex-col gap-2 max-h-[60vh] overflow-y-auto">
            {historiasVistas.map(([id, h]) => (
              <button
                key={id}
                type="button"
                className="flex items-center gap-3 rounded-2xl bg-white border-2 border-amber-200 p-2 text-left hover:bg-amber-50"
                onClick={() => ir('historia', { id, luego: { pantalla: 'mapa' } })}
              >
                <img src={escena(h.fondo)} alt="" className="w-20 h-12 rounded-xl object-cover" />
                <span className="font-bold leading-tight">{h.titulo || h.lineas[0].texto.slice(0, 48) + '…'}</span>
              </button>
            ))}
          </div>
          <div className="flex justify-center mt-4">
            <button type="button" className="btn btn-verde" onClick={() => setCuentos(false)}>
              Cerrar
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
