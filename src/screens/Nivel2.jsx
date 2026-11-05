import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';
import Laguna from '../components/Laguna.jsx';
import Encabezado from '../components/Encabezado.jsx';
import Wari from '../components/Wari.jsx';
import Dialogo from '../components/Dialogo.jsx';
import TarjetaResiduo from '../components/TarjetaResiduo.jsx';
import { ZonaArrastre, ResiduoArrastrable, TachoSoltable } from '../components/ArrastrarSoltar.jsx';
import { TACHOS } from '../data/tachos.js';
import { barajar, elegir } from '../data/residuos.js';
import { frase } from '../data/frases.js';
import { estrellasPorErrores } from '../data/niveles.js';
import { useProgreso } from '../context/ProgresoContext.jsx';
import { useSonidos } from '../hooks/useSonidos.js';
import { useLimpiezaNivel, useTamTacho } from '../hooks/useNivel.js';

// Posiciones (en %) sobre la orilla de la laguna.
const POS = [
  [13, 40], [38, 38], [63, 40], [87, 38],
  [25, 63], [50, 65], [75, 63],
  [13, 86], [50, 87], [87, 86],
];

export default function Nivel2({ ir }) {
  const { acierto, completarNivel } = useProgreso();
  const sonidos = useSonidos();
  const tam = useTamTacho(100);
  const { antes, vivo, despues } = useLimpiezaNivel(2);

  const lista = useMemo(() => {
    const elegidos = barajar([
      ...elegir('aprovechable', 3, [1, 2]),
      ...elegir('organico', 3, [1, 2]),
      ...elegir('no_aprovechable', 2, [1, 2]),
      ...elegir('peligroso', 2, [1, 2]),
    ]);
    return elegidos.map((r, i) => ({ ...r, pos: POS[i] }));
  }, []);

  const [limpios, setLimpios] = useState([]);
  const [errores, setErrores] = useState(0);
  const [erroresPor, setErroresPor] = useState({});
  const [seleccionado, setSeleccionado] = useState(null);
  const [pulsos, setPulsos] = useState({});
  const [mood, setMood] = useState('saludando');
  const [texto, setTexto] = useState('¡Uy, cuánta basura en la orilla de mi laguna! Arrastra cada cosa a su tacho.');
  const [aviso, setAviso] = useState(null);
  const temporizador = useRef(null);

  useEffect(() => () => clearTimeout(temporizador.current), []);

  const pendientes = lista.filter((r) => !limpios.includes(r.id));
  const terminado = pendientes.length === 0;

  useEffect(() => {
    if (!terminado) return;
    const t = setTimeout(() => {
      const estrellas = estrellasPorErrores(errores);
      completarNivel(2, estrellas);
      ir('resultado', { nivel: 2, estrellas, semillas: lista.length + 3, antes, despues });
    }, 2200);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [terminado]);

  function clasificar(residuoId, tachoId) {
    const r = lista.find((x) => x.id === residuoId);
    if (!r || limpios.includes(r.id)) return;
    setSeleccionado(null);
    if (r.tacho === tachoId) {
      sonidos.acierto();
      acierto(r);
      setLimpios((l) => [...l, r.id]);
      setPulsos((p) => ({ ...p, [tachoId]: (p[tachoId] || 0) + 1 }));
      const fin = pendientes.length === 1;
      if (r.tacho === 'peligroso') {
        setMood('seria');
        setTexto(frase('peligroso'));
      } else {
        setMood(fin ? 'celebrando' : 'feliz');
        setTexto(fin ? '¡Lo lograste! ¡La orilla está limpiecita!' : frase('acierto'));
      }
      setAviso(r);
      clearTimeout(temporizador.current);
      temporizador.current = setTimeout(() => setAviso(null), 4500);
    } else {
      sonidos.error();
      setErrores((e) => e + 1);
      setErroresPor((m) => ({ ...m, [r.id]: (m[r.id] || 0) + 1 }));
      setMood('pensando');
      setTexto(`${frase('error')} ${r.pista}`);
    }
  }

  return (
    <div className="relative min-h-[100dvh] flex flex-col overflow-hidden bg-[#3b6b3a]">
      <div className="relative z-10 flex flex-col min-h-[100dvh] max-w-3xl w-full mx-auto">
        <Encabezado
          titulo="Nivel 2 · La orilla sucia"
          onVolver={() => ir('mapa')}
          extra={
            <span className="shrink-0 rounded-full bg-white/95 px-3 py-2 font-extrabold shadow" aria-label={`Faltan ${pendientes.length}`}>
              🗑️ {pendientes.length}
            </span>
          }
        />

        <section className="flex items-end gap-1 px-3">
          <div className="shrink-0">
            <Wari mood={mood} size={tam > 80 ? 110 : 84} />
          </div>
          <Dialogo texto={texto} className="flex-1 mb-4" />
        </section>

        <ZonaArrastre residuos={lista} onSoltar={clasificar}>
          {(activoId) => {
            const foco = activoId || seleccionado;
            const itemFoco = lista.find((r) => r.id === foco);
            return (
              <>
                <section className="px-3 pt-2">
                  <div className="relative w-full aspect-square sm:aspect-[16/10] rounded-3xl overflow-hidden border-4 border-white shadow-xl">
                    <Laguna limpieza={vivo(limpios.length / lista.length)} className="absolute inset-0 w-full h-full" />
                    {/* parches limpios */}
                    {lista
                      .filter((r) => limpios.includes(r.id))
                      .map((r) => (
                        <motion.div
                          key={`l${r.id}`}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute text-3xl pointer-events-none"
                          style={{ left: `${r.pos[0]}%`, top: `${r.pos[1]}%`, x: "-50%", y: "-50%" }}
                          aria-hidden="true"
                        >
                          {r.tacho === 'organico' ? '🌱' : r.tacho === 'peligroso' ? '🌼' : '🌺'}
                        </motion.div>
                      ))}
                    {/* basura */}
                    <AnimatePresence>
                      {pendientes.map((r) => (
                        <motion.div
                          key={r.id}
                          className="absolute"
                          style={{ left: `${r.pos[0]}%`, top: `${r.pos[1]}%`, x: "-50%", y: "-50%" }}
                          exit={{ scale: 0, opacity: 0, pointerEvents: 'none' }}
                        >
                          <ResiduoArrastrable
                            residuo={r}
                            size={tam > 80 ? 64 : 50}
                            seleccionado={seleccionado === r.id}
                            deshabilitado={limpios.includes(r.id)}
                            onTocar={(id) => {
                              if (limpios.includes(id)) return;
                              sonidos.click();
                              setSeleccionado((s) => (s === id ? null : id));
                              setTexto(`${r.nombre}. ¿En qué tacho va?`);
                              setMood('feliz');
                            }}
                          />
                        </motion.div>
                      ))}
                    </AnimatePresence>

                    <AnimatePresence>
                      {aviso && (
                        <motion.div
                          key={aviso.id}
                          className="absolute inset-x-2 top-2 flex justify-center"
                          initial={{ y: -40, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={{ y: -40, opacity: 0 }}
                          onClick={() => setAviso(null)}
                        >
                          <TarjetaResiduo residuo={aviso} compacta />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </section>

                <section className="grid grid-cols-4 gap-1.5 px-2 pt-3 pb-5 mt-auto" aria-label="Tachos">
                  {TACHOS.map((t) => (
                    <TachoSoltable
                      key={t.id}
                      tacho={t}
                      size={tam}
                      pulso={pulsos[t.id] || 0}
                      brillar={!!itemFoco && (erroresPor[itemFoco.id] || 0) >= 2 && itemFoco.tacho === t.id}
                      onTocar={(id) =>
                        seleccionado
                          ? clasificar(seleccionado, id)
                          : setTexto('Primero toca una basura de la orilla, y luego su tacho. ¡O arrástrala!')
                      }
                    />
                  ))}
                </section>
              </>
            );
          }}
        </ZonaArrastre>
      </div>
    </div>
  );
}
