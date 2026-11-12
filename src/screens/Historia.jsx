import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import Escena from '../components/Escena.jsx';
import Personaje from '../components/Personaje.jsx';
import { useEscritura } from '../components/Dialogo.jsx';
import { HISTORIA } from '../data/historia.js';
import { PERSONAJES } from '../data/personajes.js';
import { useProgreso } from '../context/ProgresoContext.jsx';
import { useVoz } from '../hooks/useVoz.js';
import { useSonidos } from '../hooks/useSonidos.js';
import { ui } from '../assets.js';

/** Escena de historia tipo videojuego: título de capítulo, personajes y diálogos. */
export default function Historia({ ir, params }) {
  const { id, luego } = params;
  const escena = HISTORIA[id];
  const { verEscena } = useProgreso();
  const { hablar, callar } = useVoz();
  const sonidos = useSonidos();
  const [mostrarTitulo, setMostrarTitulo] = useState(!!escena?.titulo);
  const [i, setI] = useState(0);

  const linea = escena.lineas[i];
  const [visible, terminado, completar] = useEscritura(mostrarTitulo ? '' : linea.texto, 22);

  // Fondo vigente: el último "fondo" definido hasta esta línea.
  const fondo = useMemo(() => {
    let f = escena.fondo;
    for (let k = 0; k <= i; k++) if (escena.lineas[k].fondo) f = escena.lineas[k].fondo;
    return f;
  }, [escena, i]);

  // Actores en escena: Wari a la izquierda, el último otro personaje a la derecha.
  const actores = useMemo(() => {
    let wari = null;
    let otro = null;
    for (let k = 0; k <= i; k++) {
      const l = escena.lineas[k];
      if (l.fondo && k > 0) {
        wari = null;
        otro = null;
      }
      if (l.quien === 'wari') wari = { quien: 'wari', pose: l.pose || 'feliz' };
      else if (l.quien !== 'narrador') otro = { quien: l.quien, pose: l.pose || 'normal' };
    }
    return { wari, otro };
  }, [escena, i]);

  useEffect(() => {
    if (!mostrarTitulo) return;
    const t = setTimeout(() => setMostrarTitulo(false), 2600);
    return () => clearTimeout(t);
  }, [mostrarTitulo]);

  useEffect(() => {
    if (mostrarTitulo) return;
    const voz = PERSONAJES[linea.quien]?.voz || { pitch: 1, rate: 0.92 };
    hablar(linea.texto, voz);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i, mostrarTitulo]);

  function salir() {
    callar();
    verEscena(id);
    ir(luego.pantalla, luego.params || {});
  }

  function avanzar() {
    if (mostrarTitulo) return setMostrarTitulo(false);
    if (!terminado) return completar();
    sonidos.click();
    if (i + 1 >= escena.lineas.length) salir();
    else setI(i + 1);
  }

  useEffect(() => {
    const tecla = (e) => {
      if (e.key === ' ' || e.key === 'Enter' || e.key === 'ArrowRight') {
        e.preventDefault();
        avanzar();
      }
    };
    window.addEventListener('keydown', tecla);
    return () => window.removeEventListener('keydown', tecla);
  });

  const habla = linea.quien;
  const info = PERSONAJES[habla];

  return (
    <div className="fixed inset-0 overflow-hidden bg-black" onClick={avanzar} role="presentation">
      <AnimatePresence mode="sync">
        <motion.div key={fondo} className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.9 }}>
          <Escena fondo={fondo} limpieza={fondo === 'laguna_sucia' ? escena.limpieza ?? 0 : undefined} fijo={false} />
        </motion.div>
      </AnimatePresence>
      {/* viñeta de cine */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at center, rgba(0,0,0,0) 45%, rgba(0,0,0,.55) 100%)' }} />
      <div className="absolute inset-x-0 top-0 h-[6vh] bg-black/80" />
      <div className="absolute inset-x-0 bottom-0 h-[3vh] bg-black/80" />

      {/* actores */}
      {!mostrarTitulo && (
        <div className="absolute inset-x-0 bottom-[30vh] sm:bottom-[24vh] flex justify-between items-end px-[2vw] pointer-events-none">
          <div className="transition-all duration-300" style={{ opacity: actores.wari ? 1 : 0, filter: habla === 'wari' ? 'none' : 'brightness(.62) saturate(.8)', transform: habla === 'wari' ? 'scale(1)' : 'scale(.92)', transformOrigin: '50% 100%' }}>
            {actores.wari && <Personaje quien="wari" pose={actores.wari.pose} alto="min(40vh, 52vw)" />}
          </div>
          <div className="transition-all duration-300" style={{ opacity: actores.otro ? 1 : 0, filter: habla === actores.otro?.quien ? 'none' : 'brightness(.62) saturate(.8)', transform: habla === actores.otro?.quien ? 'scale(1)' : 'scale(.92)', transformOrigin: '50% 100%' }}>
            {actores.otro && <Personaje quien={actores.otro.quien} pose={actores.otro.pose} alto={actores.otro.quien === 'chura' ? 'min(46vh, 58vw)' : 'min(42vh, 52vw)'} voltear={actores.otro.quien === 'tika'} />}
          </div>
        </div>
      )}

      {/* título del capítulo */}
      <AnimatePresence>
        {mostrarTitulo && (
          <motion.div className="absolute inset-0 grid place-items-center px-6 bg-black/35" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div initial={{ scale: 0.6, y: 30 }} animate={{ scale: 1, y: 0 }} transition={{ type: 'spring', stiffness: 160, damping: 14 }} className="text-center">
              <div className="tejido h-3 w-48 mx-auto rounded-full mb-3" />
              <h2 className="titulo-juego text-4xl sm:text-6xl font-extrabold leading-tight">{escena.titulo.split(' · ')[0]}</h2>
              <p className="titulo-juego text-3xl sm:text-5xl font-extrabold leading-tight mt-1">{escena.titulo.split(' · ')[1]}</p>
              <div className="tejido h-3 w-48 mx-auto rounded-full mt-3" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* caja de diálogo */}
      {!mostrarTitulo && (
        <motion.div
          key={i}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="absolute inset-x-0 bottom-[3vh] px-3 sm:px-8 pb-[env(safe-area-inset-bottom)]"
        >
          <div className="panel relative max-w-4xl mx-auto px-5 pt-6 pb-4 min-h-[24vh] sm:min-h-[19vh]">
            {info && (
              <div
                className="absolute -top-5 left-5 rounded-full px-5 py-1 text-white font-extrabold text-lg shadow-lg"
                style={{ background: info.color, border: '3px solid #fff' }}
              >
                {info.nombre}
              </div>
            )}
            <p className={`text-lg sm:text-2xl font-bold leading-snug ${habla === 'narrador' ? 'italic text-stone-700' : ''}`}>
              {visible}
              <span className="sr-only">{linea.texto}</span>
            </p>
            {terminado && (
              <motion.div className="absolute right-4 bottom-2 text-[#c2185b] font-extrabold flex items-center gap-1" animate={{ x: [0, 6, 0] }} transition={{ duration: 0.9, repeat: Infinity }}>
                Toca para seguir
                <img src={ui('play')} alt="" className="w-7 h-7" />
              </motion.div>
            )}
          </div>
        </motion.div>
      )}

      {/* controles */}
      <div className="absolute top-[max(0.6rem,env(safe-area-inset-top))] right-3 flex gap-2 z-10">
        <button
          type="button"
          className="btn btn-blanco !min-h-[46px] !px-4 !text-base"
          onClick={(e) => {
            e.stopPropagation();
            hablar(linea.texto, { ...(PERSONAJES[linea.quien]?.voz || {}), forzar: true });
          }}
          aria-label="Escuchar otra vez"
        >
          <img src={ui('altavoz')} alt="" className="w-7 h-7" />
        </button>
        <button
          type="button"
          className="btn btn-blanco !min-h-[46px] !px-4 !text-base"
          onClick={(e) => {
            e.stopPropagation();
            salir();
          }}
        >
          Saltar
        </button>
      </div>
      <div className="absolute top-[max(0.9rem,env(safe-area-inset-top))] left-4 text-white/80 font-bold text-sm">
        {i + 1} / {escena.lineas.length}
      </div>
    </div>
  );
}
