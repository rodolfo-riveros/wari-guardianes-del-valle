import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import Escena from '../components/Escena.jsx';
import Personaje from '../components/Personaje.jsx';
import { NIVELES, CAPITULOS } from '../data/niveles.js';
import { TACHOS } from '../data/tachos.js';
import { useProgreso } from '../context/ProgresoContext.jsx';
import { useVoz } from '../hooks/useVoz.js';
import { useSonidos } from '../hooks/useSonidos.js';
import { ui } from '../assets.js';
import Clasificar from '../niveles/Clasificar.jsx';
import Atrapar from '../niveles/Atrapar.jsx';
import Rio from '../niveles/Rio.jsx';
import Memoria from '../niveles/Memoria.jsx';
import Quiz from '../niveles/Quiz.jsx';
import Escaner from '../niveles/Escaner.jsx';

const TIPOS = { clasificar: Clasificar, jefe: Clasificar, atrapar: Atrapar, rio: Rio, memoria: Memoria, quiz: Quiz, escaner: Escaner };

/** Marco común: pantalla "Cómo jugar" + el minijuego + fin del nivel. */
export default function Nivel({ ir, params }) {
  const nivel = NIVELES.find((x) => x.n === params.n) || NIVELES[0];
  const cap = CAPITULOS.find((c) => c.n === nivel.cap);
  const { completarNivel, limpieza } = useProgreso();
  const { hablar } = useVoz();
  const sonidos = useSonidos();
  const antes = useRef(limpieza).current;
  const [jugando, setJugando] = useState(false);
  const Juego = TIPOS[nivel.tipo];
  const vivo = useRef(true);
  const terminado = useRef(false);
  useEffect(() => {
    vivo.current = true;
    return () => {
      vivo.current = false;
    };
  }, []);

  function terminar({ estrellas, perfecto = false, extra, semillas = 0 }) {
    // Ignora llamadas tardías (si ya salió del nivel) o repetidas.
    if (!vivo.current || terminado.current) return;
    terminado.current = true;
    completarNivel(nivel.n, estrellas, perfecto);
    ir('resultado', { n: nivel.n, estrellas, extra, semillas: semillas + 3, antes });
  }

  if (!jugando) {
    return (
      <div className="relative min-h-[100dvh] flex items-center justify-center p-4">
        <Escena fondo={nivel.fondo} limpieza={antes} oscurecer={0.35} />
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 18 }}
          className="panel relative w-full max-w-lg p-5 pt-8 text-center"
        >
          <div className="absolute -top-5 left-1/2 -translate-x-1/2 rounded-full px-5 py-1 font-extrabold text-white shadow-lg bg-[#c2185b] border-[3px] border-white whitespace-nowrap">
            Capítulo {cap.n} · Nivel {nivel.n}
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight">{nivel.nombre}</h1>
          <div className="flex items-end justify-center gap-3 my-3">
            <Personaje quien={nivel.anfitrion || "wari"} pose={nivel.anfitrion ? "normal" : "pensando"} alto="clamp(110px, 22vh, 190px)" voltear={nivel.anfitrion === "tika"} />
            {['clasificar', 'jefe', 'atrapar'].includes(nivel.tipo) && (
              <div className="flex items-end gap-1">
                {TACHOS.map((t) => (
                  <img key={t.id} src={t.img} alt="" className="h-14 sm:h-20 w-auto sprite" />
                ))}
              </div>
            )}
          </div>
          <div className="rounded-2xl bg-amber-50 border-2 border-amber-200 p-3 flex gap-3 items-center text-left">
            <div className="flex-1">
              <span className="inline-block rounded-xl bg-[#2a8bbf] text-white font-extrabold px-2 py-0.5 mb-1">Cómo jugar</span>
              <p className="text-lg font-bold leading-snug">{nivel.instruccion}</p>
            </div>
            <button
              type="button"
              className="shrink-0 w-11 h-11 rounded-full grid place-items-center bg-white shadow"
              onClick={() => hablar(nivel.instruccion, { forzar: true })}
              aria-label="Escuchar instrucciones"
            >
              <img src={ui('altavoz')} alt="" className="w-8 h-8" />
            </button>
          </div>
          <div className="flex flex-wrap justify-center gap-3 mt-5">
            <button
              type="button"
              className="btn btn-verde btn-grande"
              onClick={() => {
                sonidos.pop();
                setJugando(true);
              }}
              autoFocus
            >
              ¡A jugar!
              <img src={ui('play')} alt="" className="w-9 h-9" />
            </button>
            <button type="button" className="btn btn-blanco" onClick={() => ir('mapa')}>
              Volver al mapa
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return <Juego nivel={nivel} terminar={terminar} salir={() => ir('mapa')} limpiezaInicial={antes} />;
}
