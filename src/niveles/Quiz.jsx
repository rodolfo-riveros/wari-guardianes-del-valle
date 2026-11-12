import { AnimatePresence, motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import Escena from '../components/Escena.jsx';
import Hud from '../components/Hud.jsx';
import Guia from '../components/Guia.jsx';
import Confeti from '../components/Confeti.jsx';
import { RESIDUOS, CATEGORIAS_TIEMPO, barajar } from '../data/residuos.js';
import { TACHO_POR_ID } from '../data/tachos.js';
import { frase } from '../data/frases.js';
import { useProgreso } from '../context/ProgresoContext.jsx';
import { useSonidos } from '../hooks/useSonidos.js';
import { ui } from '../assets.js';

const MALAS_IDEAS = [
  'Tirarlo a la laguna para que se lo lleve el agua.',
  'Quemarlo en la chacra.',
  'Enterrarlo junto al río.',
  'Dejarlo en el camino para que otro lo recoja.',
];

function generar(tipos) {
  const usados = new Set();
  const tomar = (filtro) => {
    const r = barajar(RESIDUOS.filter((x) => filtro(x) && !usados.has(x.id)))[0] || barajar(RESIDUOS.filter(filtro))[0];
    usados.add(r.id);
    return r;
  };
  // En "adulto", alternamos residuos peligrosos y no peligrosos.
  let alterna = 0;
  return barajar(tipos).map((tipo) => {
    if (tipo === 'tiempo') {
      const r = tomar((x) => x.tiempoQuiz);
      return {
        tipo, residuo: r,
        pregunta: `¿Cuánto tarda en desaparecer: ${r.nombre.toLowerCase()}?`,
        opciones: Object.entries(CATEGORIAS_TIEMPO).map(([id, txt]) => ({ id, txt })),
        correcta: r.tiempoQuiz,
        explicacion: `${r.nombre}: ${r.tiempo}. ${r.dato}`,
      };
    }
    if (tipo === 'ideas') {
      const r = tomar((x) => x.tacho !== 'peligroso' && !x.reutilizar.startsWith('No se'));
      return {
        tipo, residuo: r,
        pregunta: `¿Qué podemos hacer con: ${r.nombre.toLowerCase()}?`,
        opciones: barajar([{ id: 'ok', txt: r.reutilizar }, ...barajar(MALAS_IDEAS).slice(0, 2).map((m, i) => ({ id: `mal${i}`, txt: m }))]),
        correcta: 'ok',
        explicacion: `${r.reutilizar} ¡Nunca tiremos basura al agua ni la quememos!`,
      };
    }
    if (tipo === 'adulto') {
      alterna += 1;
      const peligroso = alterna % 2 === 1;
      const r = tomar((x) => (peligroso ? x.tacho === 'peligroso' : x.tacho !== 'peligroso'));
      return {
        tipo, residuo: r,
        pregunta: `Encontraste: ${r.nombre.toLowerCase()}. ¿Qué haces?`,
        opciones: [
          { id: 'yo', txt: `Lo boto yo en el ${TACHO_POR_ID[r.tacho].nombre.toLowerCase()}` },
          { id: 'adulto', txt: 'Pido ayuda a un adulto' },
        ],
        correcta: peligroso ? 'adulto' : 'yo',
        explicacion: peligroso
          ? `${r.nombre} es peligroso. Un adulto lo lleva al tacho rojo o a un punto de acopio. ${r.dato}`
          : `${r.nombre} no es peligroso: ¡tú mismo puedes ponerlo en el ${TACHO_POR_ID[r.tacho].nombre.toLowerCase()}!`,
      };
    }
    // 'peligroso': ¿cuál es peligroso?
    const p = tomar((x) => x.tacho === 'peligroso');
    const otros = barajar(RESIDUOS.filter((x) => x.tacho !== 'peligroso')).slice(0, 3);
    return {
      tipo, residuo: p,
      pregunta: '¿Cuál de estos es peligroso?',
      opciones: barajar([p, ...otros]).map((r) => ({ id: r.id, txt: r.nombre, residuo: r })),
      correcta: p.id,
      explicacion: `${p.nombre}: va al tacho rojo. ${p.dato} Pídele ayuda a un adulto.`,
    };
  });
}

export default function Quiz({ nivel, terminar, salir }) {
  const { sumarSemillas, acierto } = useProgreso();
  const sonidos = useSonidos();
  const preguntas = useMemo(() => generar(nivel.preguntas), [nivel.preguntas]);
  const anfitrion = nivel.anfitrion || 'wari';
  const [idx, setIdx] = useState(0);
  const [resp, setResp] = useState(null);
  const [puntos, setPuntos] = useState(0);
  const [guia, setGuia] = useState(null);
  const [fin, setFin] = useState(false);
  const p = preguntas[idx];

  function responder(op) {
    if (resp) return;
    setResp(op.id);
    if (op.id === p.correcta) {
      sonidos.acierto();
      sumarSemillas(1);
      if (p.tipo === 'peligroso' || p.tipo === 'adulto') acierto(p.residuo);
      setPuntos((x) => x + 1);
      setGuia({ pose: 'celebrando', texto: `${frase('quizBien')} ${p.explicacion}` });
    } else {
      sonidos.error();
      setGuia({ pose: 'pensando', texto: `${frase('quizMal')} ${p.explicacion}` });
    }
  }

  function siguiente() {
    sonidos.click();
    if (idx + 1 >= preguntas.length) {
      const total = preguntas.length;
      const estrellas = puntos >= total - 1 ? 3 : puntos >= Math.ceil(total / 2) ? 2 : 1;
      setFin(true);
      sonidos.fiesta();
      setTimeout(() => terminar({ estrellas, perfecto: puntos === total, extra: `Respondiste bien ${puntos} de ${total}.` }), 900);
      return;
    }
    setIdx(idx + 1);
    setResp(null);
    setGuia(null);
  }

  const textoGuia = guia?.texto ?? p.pregunta;
  // El anfitrión pregunta; Wari reacciona a la respuesta.
  const quienHabla = guia ? 'wari' : anfitrion;
  const pose = guia ? guia.pose : 'normal';

  const estilo = (op) => {
    if (!resp) return 'bg-white hover:bg-amber-50 border-amber-200';
    if (op.id === p.correcta) return 'bg-emerald-100 border-emerald-500 ring-4 ring-emerald-300';
    if (op.id === resp) return 'bg-amber-100 border-amber-400';
    return 'bg-white/70 opacity-60 border-stone-200';
  };

  return (
    <div className="relative min-h-[100dvh] flex flex-col overflow-hidden">
      <Escena fondo={nivel.fondo} oscurecer={0.1} />
      {fin && <Confeti />}
      <Hud titulo={nivel.nombre} onVolver={salir} extra={<span className="chip shrink-0">{idx + 1}/{preguntas.length}</span>} />
      <Guia quien={quienHabla} pose={quienHabla === 'wari' ? pose : 'normal'} texto={textoGuia} />

      <AnimatePresence mode="wait">
        <motion.section
          key={idx}
          initial={{ x: 80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -80, opacity: 0 }}
          className="relative z-10 px-3 sm:px-6 py-2 w-full max-w-3xl mx-auto"
        >
          <div className="panel p-4">
            <div className="flex items-center gap-3 mb-3">
              {p.tipo !== 'peligroso' && <img src={p.residuo.img} alt="" className="w-20 h-20 sm:w-28 sm:h-28 object-contain sprite shrink-0" />}
              <h2 className="text-xl sm:text-3xl font-extrabold leading-tight">{p.pregunta}</h2>
            </div>
            <div className={p.tipo === 'peligroso' ? 'grid grid-cols-2 gap-3' : p.tipo === 'adulto' ? 'grid sm:grid-cols-2 gap-3' : 'flex flex-col gap-3'}>
              {p.opciones.map((op) => (
                <button
                  key={op.id}
                  type="button"
                  onClick={() => responder(op)}
                  disabled={!!resp}
                  className={`relative min-h-[64px] rounded-2xl border-4 px-4 py-3 text-lg sm:text-xl font-bold shadow-[0_5px_0_rgba(0,0,0,0.15)] transition active:translate-y-1 ${estilo(op)} ${
                    p.tipo === 'peligroso' ? 'flex flex-col items-center text-center' : 'text-left flex items-center gap-3'
                  }`}
                >
                  {op.residuo && <img src={op.residuo.img} alt="" className="w-20 h-20 sm:w-24 sm:h-24 object-contain sprite" />}
                  {p.tipo === 'adulto' && op.id === 'yo' && (
                    <img src={TACHO_POR_ID[p.residuo.tacho].img} alt="" className="w-12 h-12 object-contain shrink-0" />
                  )}
                  <span className="leading-snug">{op.txt}</span>
                  {resp && op.id === p.correcta && <img src={ui('check')} alt="Correcta" className="absolute -top-3 -right-3 w-10 h-10" />}
                </button>
              ))}
            </div>
            {resp && (
              <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex justify-center mt-4">
                <button type="button" className="btn btn-verde btn-grande" onClick={siguiente} autoFocus>
                  {idx + 1 >= preguntas.length ? '¡Terminar!' : '¡Siguiente!'}
                  <img src={ui('play')} alt="" className="w-9 h-9" />
                </button>
              </motion.div>
            )}
          </div>
        </motion.section>
      </AnimatePresence>
    </div>
  );
}
