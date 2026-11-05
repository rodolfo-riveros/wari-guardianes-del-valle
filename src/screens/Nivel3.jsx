import { AnimatePresence, motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import Laguna from '../components/Laguna.jsx';
import Icono from '../components/Icono.jsx';
import Encabezado from '../components/Encabezado.jsx';
import Wari from '../components/Wari.jsx';
import Dialogo from '../components/Dialogo.jsx';
import ResiduoIcon from '../components/ResiduoIcon.jsx';
import { RESIDUOS, CATEGORIAS_TIEMPO, barajar } from '../data/residuos.js';
import { frase } from '../data/frases.js';
import { useProgreso } from '../context/ProgresoContext.jsx';
import { useSonidos } from '../hooks/useSonidos.js';
import { useLimpiezaNivel } from '../hooks/useNivel.js';

const MALAS_IDEAS = [
  'Tirarlo a la laguna para que se lo lleve el agua.',
  'Quemarlo en la chacra.',
  'Enterrarlo junto al río.',
  'Dejarlo en el camino para que otro lo recoja.',
];

function generarPreguntas() {
  const usados = new Set();
  const tomar = (filtro) => {
    const r = barajar(RESIDUOS.filter((x) => filtro(x) && !usados.has(x.id)))[0];
    if (r) usados.add(r.id);
    return r;
  };
  const tipos = barajar([1, 1, 1, 2, 2, 2, 3, 3]);

  return tipos.map((tipo) => {
    if (tipo === 1) {
      const r = tomar((x) => x.tiempoQuiz);
      return {
        tipo,
        residuo: r,
        pregunta: `¿Cuánto tarda en desaparecer: ${r.nombre.toLowerCase()}?`,
        opciones: Object.entries(CATEGORIAS_TIEMPO).map(([id, txt]) => ({ id, txt })),
        correcta: r.tiempoQuiz,
        explicacion: `${r.nombre}: ${r.tiempo}. ${r.dato}`,
      };
    }
    if (tipo === 2) {
      const r = tomar((x) => x.tacho !== 'peligroso' && !x.reutilizar.startsWith('No se'));
      const malas = barajar(MALAS_IDEAS).slice(0, 2);
      return {
        tipo,
        residuo: r,
        pregunta: `¿Qué puedes hacer con: ${r.nombre.toLowerCase()}?`,
        opciones: barajar([{ id: 'ok', txt: r.reutilizar }, ...malas.map((m, i) => ({ id: `mal${i}`, txt: m }))]),
        correcta: 'ok',
        explicacion: `${r.reutilizar} ¡Nunca tiremos basura a la laguna ni la quememos!`,
      };
    }
    const peligroso = tomar((x) => x.tacho === 'peligroso');
    const otros = barajar(RESIDUOS.filter((x) => x.tacho !== 'peligroso')).slice(0, 3);
    return {
      tipo,
      residuo: peligroso,
      pregunta: '¿Cuál de estos es peligroso?',
      opciones: barajar([peligroso, ...otros]).map((r) => ({ id: r.id, txt: r.nombre, residuo: r })),
      correcta: peligroso.id,
      explicacion: `${peligroso.nombre}: va al tacho rojo. ${peligroso.dato} Pídele ayuda a un adulto.`,
    };
  });
}

export default function Nivel3({ ir }) {
  const { sumarSemillas, completarNivel } = useProgreso();
  const sonidos = useSonidos();
  const { antes, vivo, despues } = useLimpiezaNivel(3);
  const preguntas = useMemo(generarPreguntas, []);

  const [idx, setIdx] = useState(0);
  const [respuesta, setRespuesta] = useState(null);
  const [puntos, setPuntos] = useState(0);
  const [mood, setMood] = useState('saludando');
  const [texto, setTexto] = useState(null);

  const p = preguntas[idx];
  const textoWari = texto ?? p.pregunta;

  function responder(op) {
    if (respuesta) return;
    setRespuesta(op.id);
    if (op.id === p.correcta) {
      sonidos.acierto();
      sumarSemillas(1);
      setPuntos((x) => x + 1);
      setMood('celebrando');
      setTexto(`${frase('quizBien')} ${p.explicacion}`);
    } else {
      sonidos.error();
      setMood('pensando');
      setTexto(`${frase('quizMal')} ${p.explicacion}`);
    }
  }

  function siguiente() {
    sonidos.click();
    if (idx + 1 >= preguntas.length) {
      const perfecto = puntos === preguntas.length;
      const estrellas = puntos >= 7 ? 3 : puntos >= 4 ? 2 : 1;
      completarNivel(3, estrellas, perfecto);
      ir('resultado', { nivel: 3, estrellas, semillas: puntos + 3, antes, despues, extra: `Respondiste bien ${puntos} de ${preguntas.length}.` });
      return;
    }
    setIdx(idx + 1);
    setRespuesta(null);
    setTexto(null);
    setMood('feliz');
  }

  const estilo = (op) => {
    if (!respuesta) return 'bg-white hover:bg-amber-50';
    if (op.id === p.correcta) return 'bg-green-100 ring-4 ring-green-500';
    if (op.id === respuesta) return 'bg-amber-100 ring-4 ring-amber-400';
    return 'bg-white opacity-60';
  };

  return (
    <div className="relative min-h-[100dvh] flex flex-col overflow-hidden">
      <Laguna limpieza={vivo((idx + (respuesta ? 1 : 0)) / preguntas.length)} className="fixed inset-0 w-full h-full" />
      <div className="relative z-10 flex flex-col min-h-[100dvh] max-w-3xl w-full mx-auto pb-6">
        <Encabezado titulo="Nivel 3 · ¿Cuánto tarda?" onVolver={() => ir('mapa')} />

        <div className="px-4">
          <div className="h-4 bg-white/60 rounded-full overflow-hidden" role="progressbar" aria-valuemin={0} aria-valuemax={preguntas.length} aria-valuenow={idx + 1} aria-label="Avance del quiz">
            <div className="h-full bg-cantuta transition-[width] duration-500" style={{ width: `${((idx + (respuesta ? 1 : 0)) / preguntas.length) * 100}%` }} />
          </div>
          <p className="text-white font-bold mt-1 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
            Pregunta {idx + 1} de {preguntas.length}
          </p>
        </div>

        <section className="flex items-end gap-1 px-3 mt-1">
          <div className="shrink-0">
            <Wari mood={mood} size={100} />
          </div>
          <Dialogo texto={textoWari} className="flex-1 mb-4" />
        </section>

        <AnimatePresence mode="wait">
          <motion.section
            key={idx}
            initial={{ x: 60, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -60, opacity: 0 }}
            className="px-4 mt-2"
          >
            <div className="tarjeta p-4">
              <div className="flex items-center gap-3 mb-3">
                {p.tipo !== 3 && <ResiduoIcon residuo={p.residuo} size={72} />}
                <h2 className="text-2xl font-extrabold leading-tight">{p.pregunta}</h2>
              </div>
              <div className={p.tipo === 3 ? 'grid grid-cols-2 gap-3' : 'flex flex-col gap-3'}>
                {p.opciones.map((op) => (
                  <button
                    key={op.id}
                    type="button"
                    onClick={() => responder(op)}
                    disabled={!!respuesta}
                    className={`min-h-[64px] rounded-2xl border-4 border-stone-200 px-4 py-3 text-left text-lg font-bold shadow-[0_4px_0_rgba(0,0,0,0.15)] transition ${estilo(op)} ${
                      p.tipo === 3 ? 'flex flex-col items-center text-center' : ''
                    }`}
                  >
                    {op.residuo && <ResiduoIcon residuo={op.residuo} size={64} />}
                    <span>
                      {respuesta && op.id === p.correcta && <Icono nombre="check" className="mr-1" />}
                      {op.txt}
                    </span>
                  </button>
                ))}
              </div>
              {respuesta && (
                <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex justify-center mt-4">
                  <button type="button" className="btn btn-verde btn-grande" onClick={siguiente} autoFocus>
                    {idx + 1 >= preguntas.length ? <>¡Terminar! <Icono nombre="fiesta" /></> : <>¡Siguiente! <Icono nombre="play" /></>}
                  </button>
                </motion.div>
              )}
            </div>
          </motion.section>
        </AnimatePresence>
      </div>
    </div>
  );
}
