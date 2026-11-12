import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import Escena from '../components/Escena.jsx';
import Hud from '../components/Hud.jsx';
import Guia from '../components/Guia.jsx';
import Confeti from '../components/Confeti.jsx';
import { RESIDUOS } from '../data/residuos.js';
import { img } from '../assets.js';
import { useProgreso } from '../context/ProgresoContext.jsx';
import { useSonidos } from '../hooks/useSonidos.js';

// Solo residuos que flotan (nada peligroso en el río para este nivel).
const FLOTAN = RESIDUOS.filter((r) => r.tacho !== 'peligroso');
const TRUCHA = img('deco/trucha');

/** "Rescate en el río": toca la basura que flota antes de que llegue a la laguna. */
export default function Rio({ nivel, terminar, salir }) {
  const { sumarSemillas } = useProgreso();
  const sonidos = useSonidos();
  const [objetos, setObjetos] = useState([]);
  const [rescatados, setRescatados] = useState(0);
  const [escapados, setEscapados] = useState(0);
  const [truchasTocadas, setTruchasTocadas] = useState(0);
  const [fin, setFin] = useState(false);
  const [guia, setGuia] = useState({ pose: 'seria', texto: '¡Ahí viene la basura! Tócala para sacarla del río. ¡Las truchas déjalas nadar!' });
  const uid = useRef(0);
  const finTimer = useRef(null);
  useEffect(() => () => clearTimeout(finTimer.current), []);
  const meta = nivel.cantidad;

  // Aparecen objetos cada cierto tiempo; se acelera según el avance.
  useEffect(() => {
    if (fin) return;
    const intervalo = Math.max(850, 1600 - rescatados * 45);
    const id = setInterval(() => {
      uid.current += 1;
      const esTrucha = uid.current % 5 === 0;
      setObjetos((o) => [
        ...o,
        {
          uid: uid.current,
          trucha: esTrucha,
          residuo: esTrucha ? null : FLOTAN[Math.floor(Math.random() * FLOTAN.length)],
          y: 46 + Math.random() * 26, // % de la pantalla (franja del río)
          dur: Math.max(4.2, 8 - rescatados * 0.22) + Math.random(),
        },
      ]);
    }, intervalo);
    return () => clearInterval(id);
  }, [fin, rescatados]);

  useEffect(() => {
    if (fin || rescatados < meta) return;
    setFin(true);
    setObjetos([]);
    sonidos.fiesta();
    setGuia({ pose: 'celebrando', texto: '¡Salvamos el río! ¡Mira cómo saltan las truchas!' });
    const errores = truchasTocadas + Math.floor(escapados / 3);
    const estrellas = errores <= 1 ? 3 : errores <= 4 ? 2 : 1;
    finTimer.current = setTimeout(() => terminar({ estrellas, semillas: 0 }), 2400);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rescatados]);

  function tocar(o) {
    if (fin || rescatados >= meta) return;
    if (o.trucha) {
      sonidos.error();
      setTruchasTocadas((n) => n + 1);
      setGuia({ pose: 'pensando', texto: '¡Esa es una trucha! Ella vive aquí. ¡Déjala nadar y saca solo la basura!' });
      return;
    }
    sonidos.pop();
    sumarSemillas(1);
    setRescatados((n) => n + 1);
    setObjetos((lista) => lista.filter((x) => x.uid !== o.uid));
    if ((rescatados + 1) % 4 === 0) setGuia({ pose: 'celebrando', texto: `¡Muy bien! Llevas ${rescatados + 1}. ¡Sigue así!` });
  }

  function salio(o) {
    setObjetos((lista) => lista.filter((x) => x.uid !== o.uid));
    if (!o.trucha && !fin) setEscapados((n) => n + 1);
  }

  return (
    <div className="relative h-[100dvh] flex flex-col overflow-hidden">
      <Escena fondo={nivel.fondo} />
      {fin && <Confeti />}
      <Hud
        titulo={nivel.nombre}
        onVolver={salir}
        extra={
          <span className="chip shrink-0" aria-label={`Rescatados ${rescatados} de ${meta}`}>
            {Math.min(rescatados, meta)}/{meta}
          </span>
        }
      />
      <Guia pose={guia.pose} texto={guia.texto} />

      {/* barra de avance */}
      <div className="relative z-20 mx-auto mt-1 w-[min(90vw,520px)] panel-oscuro px-3 py-1.5">
        <div className="h-4 rounded-full bg-black/40 overflow-hidden">
          <motion.div className="h-full rounded-full bg-gradient-to-r from-sky-400 to-emerald-400" animate={{ width: `${(Math.min(rescatados, meta) / meta) * 100}%` }} />
        </div>
      </div>

      {/* río */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <AnimatePresence>
          {objetos.map((o) => (
            <Flotante key={o.uid} o={o} onTocar={tocar} onSalir={salio} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

function Flotante({ o, onTocar, onSalir }) {
  useEffect(() => {
    const t = setTimeout(() => onSalir(o), o.dur * 1000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <motion.button
      type="button"
      className="absolute pointer-events-auto"
      style={{ top: `${o.y}%`, left: 0 }}
      initial={{ x: '-18vw' }}
      animate={o.trucha ? { x: '110vw', y: [0, -60, 0, 0, -40, 0] } : { x: '110vw', y: [0, -6, 0, 6, 0], rotate: [-8, 8, -8] }}
      exit={{ scale: 0, opacity: 0, y: -50, transition: { duration: 0.3 } }}
      transition={{ x: { duration: o.dur, ease: 'linear' }, y: { duration: o.trucha ? 2 : 2.4, repeat: Infinity }, rotate: { duration: 2, repeat: Infinity } }}
      onPointerDown={() => onTocar(o)}
      aria-label={o.trucha ? 'Trucha' : o.residuo.nombre}
    >
      <img
        src={o.trucha ? TRUCHA : o.residuo.img}
        alt=""
        draggable={false}
        className="w-[clamp(64px,12vh,120px)] h-[clamp(64px,12vh,120px)] object-contain sprite"
        style={o.trucha ? { transform: 'rotate(-60deg)' } : undefined}
      />
    </motion.button>
  );
}
