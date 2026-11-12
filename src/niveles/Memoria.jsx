import { motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import Escena from '../components/Escena.jsx';
import Hud from '../components/Hud.jsx';
import Guia from '../components/Guia.jsx';
import Confeti from '../components/Confeti.jsx';
import { TACHO_POR_ID } from '../data/tachos.js';
import { barajar, elegir } from '../data/residuos.js';
import { useProgreso } from '../context/ProgresoContext.jsx';
import { useSonidos } from '../hooks/useSonidos.js';

/** "Parejas del río": junta cada residuo con la carta de su tacho. */
export default function Memoria({ nivel, terminar, salir }) {
  const { acierto } = useProgreso();
  const sonidos = useSonidos();

  const cartas = useMemo(() => {
    const res = [...elegir('aprovechable', 2), ...elegir('organico', 2), ...elegir('no_aprovechable', 1), ...elegir('peligroso', 1)].slice(0, nivel.pares);
    return barajar(
      res.flatMap((r) => [
        { key: `r-${r.id}`, tipo: 'residuo', residuo: r },
        { key: `t-${r.id}`, tipo: 'tacho', tacho: TACHO_POR_ID[r.tacho] },
      ]),
    );
  }, [nivel.pares]);

  const [abiertas, setAbiertas] = useState([]); // índices volteados (máx 2)
  const [hechas, setHechas] = useState([]); // índices emparejados
  const [errores, setErrores] = useState(0);
  const [bloqueo, setBloqueo] = useState(false);
  const [guia, setGuia] = useState({ pose: 'feliz', texto: 'Voltea dos cartas. Si un residuo y su tacho se juntan, ¡son pareja!' });
  const fin = hechas.length === cartas.length;

  function voltear(i) {
    if (bloqueo || abiertas.includes(i) || hechas.includes(i) || fin) return;
    sonidos.click();
    const nuevas = [...abiertas, i];
    setAbiertas(nuevas);
    if (nuevas.length < 2) return;

    const [a, b] = nuevas.map((k) => cartas[k]);
    const r = a.tipo === 'residuo' ? a : b.tipo === 'residuo' ? b : null;
    const t = a.tipo === 'tacho' ? a : b.tipo === 'tacho' ? b : null;
    const pareja = r && t && r.residuo.tacho === t.tacho.id;

    setBloqueo(true);
    setTimeout(
      () => {
        if (pareja) {
          sonidos.acierto();
          acierto(r.residuo);
          const total = [...hechas, ...nuevas];
          setHechas(total);
          if (total.length === cartas.length) {
            sonidos.fiesta();
            setGuia({ pose: 'celebrando', texto: '¡Encontraste todas las parejas! ¡Qué memoria de cóndor!' });
            const estrellas = errores <= 3 ? 3 : errores <= 7 ? 2 : 1;
            setTimeout(() => terminar({ estrellas, semillas: nivel.pares }), 2200);
          } else {
            setGuia({ pose: 'celebrando', texto: `¡Pareja! ${r.residuo.nombre} va al ${t.tacho.nombre.toLowerCase()}.` });
          }
        } else {
          sonidos.error();
          setErrores((e) => e + 1);
          if (r && t) setGuia({ pose: 'pensando', texto: `Mmm… ${r.residuo.nombre.toLowerCase()} no va ahí. ${r.residuo.pista}` });
          else setGuia({ pose: 'pensando', texto: 'Busca un residuo y un tacho. ¡Intentemos otra vez!' });
        }
        setAbiertas([]);
        setBloqueo(false);
      },
      pareja ? 450 : 1100,
    );
  }

  return (
    <div className="relative min-h-[100dvh] flex flex-col overflow-hidden">
      <Escena fondo={nivel.fondo} oscurecer={0.15} />
      {fin && <Confeti />}
      <Hud titulo={nivel.nombre} onVolver={salir} extra={<span className="chip shrink-0">{hechas.length / 2}/{cartas.length / 2}</span>} />
      <Guia pose={guia.pose} texto={guia.texto} />

      <section className="relative z-10 flex-1 grid place-items-center px-3 py-3">
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 w-full max-w-[min(96vw,760px)]">
          {cartas.map((c, i) => {
            const visible = abiertas.includes(i) || hechas.includes(i);
            return (
              <button
                key={c.key}
                type="button"
                onClick={() => voltear(i)}
                className="relative aspect-[3/4] [perspective:800px]"
                style={{ width: 'min(29vw, 14.5vh, 160px)' }}
                aria-label={visible ? (c.tipo === 'residuo' ? c.residuo.nombre : c.tacho.nombre) : 'Carta tapada'}
              >
                <motion.div
                  className="absolute inset-0 [transform-style:preserve-3d]"
                  animate={{ rotateY: visible ? 180 : 0, scale: hechas.includes(i) ? 0.94 : 1 }}
                  transition={{ duration: 0.45 }}
                >
                  {/* reverso */}
                  <div className="absolute inset-0 rounded-2xl [backface-visibility:hidden] border-4 border-white shadow-xl overflow-hidden bg-gradient-to-br from-[#c2185b] to-[#7b1fa2] grid place-items-center">
                    <div className="tejido absolute inset-x-0 top-0 h-3" />
                    <div className="tejido absolute inset-x-0 bottom-0 h-3" />
                    <span className="titulo-juego text-4xl sm:text-5xl font-extrabold">?</span>
                  </div>
                  {/* frente */}
                  <div
                    className={`absolute inset-0 rounded-2xl [backface-visibility:hidden] [transform:rotateY(180deg)] border-4 shadow-xl grid place-items-center p-1 ${
                      hechas.includes(i) ? 'border-emerald-400 bg-emerald-50' : 'border-amber-300 bg-white'
                    }`}
                  >
                    {c.tipo === 'residuo' ? (
                      <div className="flex flex-col items-center gap-0.5">
                        <img src={c.residuo.img} alt="" className="w-[78%] aspect-square object-contain sprite" />
                        <span className="text-[0.7rem] sm:text-sm font-extrabold leading-tight text-center">{c.residuo.nombre}</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-0.5">
                        <img src={c.tacho.img} alt="" className="w-[62%] aspect-[3/4] object-contain sprite" />
                        <span className="text-[0.7rem] sm:text-sm font-extrabold leading-tight text-center" style={{ color: c.tacho.oscuro }}>
                          {c.tacho.sub}
                        </span>
                      </div>
                    )}
                  </div>
                </motion.div>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
