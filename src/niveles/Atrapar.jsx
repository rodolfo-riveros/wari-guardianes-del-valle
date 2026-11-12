import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';
import Escena from '../components/Escena.jsx';
import Hud from '../components/Hud.jsx';
import Guia from '../components/Guia.jsx';
import Tacho from '../components/Tacho.jsx';
import Confeti from '../components/Confeti.jsx';
import { TACHOS } from '../data/tachos.js';
import { RESIDUOS, barajar } from '../data/residuos.js';
import { frase } from '../data/frases.js';
import { estrellasPorErrores } from '../data/niveles.js';
import { useProgreso } from '../context/ProgresoContext.jsx';
import { useSonidos } from '../hooks/useSonidos.js';

/** "Lluvia en el mercado": toca el tacho correcto antes de que el residuo llegue al suelo. */
export default function Atrapar({ nivel, terminar, salir }) {
  const { acierto } = useProgreso();
  const sonidos = useSonidos();
  const lista = useMemo(() => barajar(RESIDUOS).slice(0, nivel.cantidad), [nivel.cantidad]);
  const zona = useRef(null);
  const [alto, setAlto] = useState(400);
  const [idx, setIdx] = useState(0);
  const [intento, setIntento] = useState(0); // reinicia la caída
  const [errores, setErrores] = useState(0);
  const [errItem, setErrItem] = useState(0);
  const [pulsos, setPulsos] = useState({});
  const [atrapado, setAtrapado] = useState(null); // { residuo, tacho }
  const [guia, setGuia] = useState({ pose: 'feliz', texto: '¡Ahí viene! Toca el tacho correcto antes de que caiga al suelo.' });
  const [fin, setFin] = useState(false);

  useEffect(() => {
    const medir = () => setAlto(zona.current?.clientHeight || 400);
    medir();
    window.addEventListener('resize', medir);
    return () => window.removeEventListener('resize', medir);
  }, []);

  const actual = lista[idx];
  // Empieza lento (7 s) y acelera hasta 3.6 s.
  const duracion = Math.max(3.6, 7 - idx * 0.32);
  const x = useMemo(() => 22 + ((idx * 37 + intento * 23) % 56), [idx, intento]);

  function elegir(tachoId) {
    if (!actual || atrapado || fin) return;
    if (tachoId === actual.tacho) {
      sonidos.acierto();
      acierto(actual);
      setPulsos((p) => ({ ...p, [tachoId]: (p[tachoId] || 0) + 1 }));
      setAtrapado({ residuo: actual, tacho: tachoId });
      setGuia({ pose: actual.tacho === 'peligroso' ? 'seria' : 'celebrando', texto: actual.tacho === 'peligroso' ? frase('peligroso') : frase('acierto') });
      setTimeout(() => {
        setAtrapado(null);
        setErrItem(0);
        if (idx + 1 >= lista.length) {
          setFin(true);
          sonidos.fiesta();
          setGuia({ pose: 'celebrando', texto: '¡Increíble! ¡Atrapaste toda la lluvia del mercado!' });
          setTimeout(() => terminar({ estrellas: estrellasPorErrores(errores), semillas: lista.length }), 2200);
        } else setIdx((i) => i + 1);
      }, 650);
    } else {
      sonidos.error();
      setErrores((e) => e + 1);
      setErrItem((e) => e + 1);
      setGuia({ pose: 'pensando', texto: `${frase('error')} ${actual.pista}` });
    }
  }

  function llegoAlSuelo() {
    if (atrapado || fin) return;
    sonidos.error();
    setErrores((e) => e + 1);
    setErrItem((e) => e + 1);
    setGuia({ pose: 'pensando', texto: `¡Uy, se cayó! No pasa nada, vuelve a caer. Pista: ${actual.pista}` });
    setIntento((n) => n + 1);
  }

  return (
    <div className="relative h-[100dvh] flex flex-col overflow-hidden">
      <Escena fondo={nivel.fondo} />
      {fin && <Confeti />}
      <Hud titulo={nivel.nombre} onVolver={salir} extra={<span className="chip shrink-0">{idx + (atrapado ? 1 : 0)}/{lista.length}</span>} />
      <Guia pose={guia.pose} texto={guia.texto} />

      <section ref={zona} className="relative z-10 flex-1 min-h-0">
        <AnimatePresence>
          {actual && !fin && (
            <motion.div
              key={`${actual.id}-${intento}`}
              className="absolute flex flex-col items-center"
              style={{ left: `${x}%`, x: '-50%' }}
              initial={{ y: -40, rotate: -10, opacity: 0 }}
              animate={
                atrapado
                  ? { y: alto + 20, scale: 0.2, rotate: 360, opacity: 0, transition: { duration: 0.55, ease: 'easeIn' } }
                  : { y: alto - 90, rotate: [-10, 10, -10], opacity: 1, transition: { y: { duration: duracion, ease: 'linear' }, rotate: { duration: 1.5, repeat: Infinity }, opacity: { duration: 0.3 } } }
              }
              exit={{ opacity: 0 }}
              onAnimationComplete={() => !atrapado && llegoAlSuelo()}
            >
              <img src={actual.img} alt={actual.nombre} className="w-[clamp(80px,14vh,140px)] h-[clamp(80px,14vh,140px)] object-contain sprite rounded-full p-2" style={{ background: "radial-gradient(circle, rgba(255,255,255,.95) 0%, rgba(255,255,255,.7) 55%, rgba(255,255,255,0) 72%)" }} />
              <span className="chip !text-sm !py-0">{actual.nombre}</span>
            </motion.div>
          )}
        </AnimatePresence>
        {/* suelo */}
        <div className="absolute inset-x-0 bottom-0 h-3 bg-gradient-to-t from-black/30 to-transparent" />
      </section>

      <section className="relative z-20 grid grid-cols-4 gap-1 px-1 sm:px-6 pb-[max(0.75rem,env(safe-area-inset-bottom))] max-w-4xl w-full mx-auto">
        {TACHOS.map((t) => (
          <button key={t.id} type="button" className="flex justify-center pt-1 rounded-3xl active:scale-95 transition" onClick={() => elegir(t.id)} aria-label={`${t.nombre}: ${t.sub}`}>
            <Tacho tacho={t} alto="clamp(62px, 13.5vh, 140px)" pulso={pulsos[t.id] || 0} brillar={errItem >= 2 && actual?.tacho === t.id} />
          </button>
        ))}
      </section>
    </div>
  );
}
