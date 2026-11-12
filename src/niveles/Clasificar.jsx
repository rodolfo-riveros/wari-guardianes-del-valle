import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';
import Escena from '../components/Escena.jsx';
import Hud from '../components/Hud.jsx';
import Guia from '../components/Guia.jsx';
import Modal from '../components/Modal.jsx';
import Personaje from '../components/Personaje.jsx';
import Confeti from '../components/Confeti.jsx';
import TarjetaResiduo from '../components/TarjetaResiduo.jsx';
import Tacho from '../components/Tacho.jsx';
import { ZonaArrastre, ResiduoArrastrable, TachoSoltable } from '../components/ArrastrarSoltar.jsx';
import { TACHOS } from '../data/tachos.js';
import { barajar, elegir } from '../data/residuos.js';
import { frase } from '../data/frases.js';
import { estrellasPorErrores } from '../data/niveles.js';
import { useProgreso } from '../context/ProgresoContext.jsx';
import { useSonidos } from '../hooks/useSonidos.js';

// Posiciones (en %) para la basura regada en la orilla.
const POS = [
  [14, 22], [40, 16], [66, 24], [88, 14],
  [24, 50], [52, 46], [80, 52],
  [12, 80], [44, 82], [76, 80],
];

const ALTO_TACHO = 'clamp(62px, 13.5vh, 140px)';

function armarLista(modo) {
  if (modo === 'tutorial')
    return barajar([...elegir('aprovechable', 2, [1]), ...elegir('organico', 2, [1]), ...elegir('no_aprovechable', 1, [1]), ...elegir('peligroso', 1, [1])]);
  if (modo === 'orilla')
    return barajar([...elegir('aprovechable', 3, [1, 2]), ...elegir('organico', 3, [1, 2]), ...elegir('no_aprovechable', 2, [1, 2]), ...elegir('peligroso', 2, [1, 2])]).map(
      (r, i) => ({ ...r, pos: POS[i] }),
    );
  return barajar([...elegir('aprovechable', 4), ...elegir('organico', 4), ...elegir('no_aprovechable', 3), ...elegir('peligroso', 3)]);
}

export default function Clasificar({ nivel, terminar, salir, limpiezaInicial }) {
  const modo = nivel.tipo === 'jefe' ? 'jefe' : nivel.modo;
  const { acierto } = useProgreso();
  const sonidos = useSonidos();
  const lista = useMemo(() => armarLista(modo), [modo]);

  const [intro, setIntro] = useState(modo === 'tutorial' ? 0 : -1); // tutorial: presentar tachos
  const [hechos, setHechos] = useState([]);
  const [errores, setErrores] = useState(0);
  const [erroresPor, setErroresPor] = useState({});
  const [seleccionado, setSeleccionado] = useState(null);
  const [pulsos, setPulsos] = useState({});
  const [tarjeta, setTarjeta] = useState(null);
  const [aviso, setAviso] = useState(null);
  const [golpe, setGolpe] = useState(0);
  const [fin, setFin] = useState(false);
  const [guia, setGuia] = useState(() =>
    modo === 'tutorial'
      ? { pose: 'saludando', texto: 'Antes de limpiar, te presento a mis amigos: ¡los cuatro tachos! Cada uno tiene su color.' }
      : modo === 'jefe'
        ? { pose: 'seria', texto: "¡Ch'ura está soltando su basura! Clasifícala y lo ayudaremos a sentirse mejor." }
        : { pose: 'preocupada', texto: '¡Uy, cuánta basura en la orilla! Arrastra cada cosa a su tacho.' },
  );
  const temporizador = useRef(null);
  const finTimer = useRef(null);
  useEffect(
    () => () => {
      clearTimeout(temporizador.current);
      clearTimeout(finTimer.current);
    },
    [],
  );

  const pendientes = lista.filter((r) => !hechos.includes(r.id));
  const actual = modo === 'orilla' ? null : pendientes[0];
  const progreso = hechos.length / lista.length;
  const decir = (texto, pose = 'feliz') => setGuia({ texto, pose });

  // Fin del nivel
  useEffect(() => {
    if (pendientes.length || fin) return;
    if (modo === 'tutorial' && tarjeta) return;
    setFin(true);
    sonidos.fiesta();
    if (modo === 'jefe') decir("¡Lo logramos! Mira a Ch'ura… ¡se está transformando!", 'celebrando');
    else decir('¡Lo lograste! ¡Todo en su lugar!', 'celebrando');
    finTimer.current = setTimeout(
      () => terminar({ estrellas: modo === 'tutorial' ? 3 : estrellasPorErrores(errores), semillas: lista.length }),
      modo === 'jefe' ? 4200 : 2200,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendientes.length, tarjeta]);

  function presentarTacho() {
    sonidos.click();
    if (intro < TACHOS.length) {
      const t = TACHOS[intro];
      setPulsos((p) => ({ ...p, [t.id]: (p[t.id] || 0) + 1 }));
      decir(t.presentacion, t.id === 'peligroso' ? 'seria' : 'feliz');
      setIntro(intro + 1);
    } else {
      setIntro(-1);
      decir(`¡Ahora te toca! Mira: ${lista[0].nombre.toLowerCase()}. Arrástralo a su tacho, o tócalo y luego toca el tacho.`, 'feliz');
    }
  }

  function clasificar(residuoId, tachoId) {
    const r = lista.find((x) => x.id === residuoId);
    if (!r || hechos.includes(r.id) || tarjeta || fin) return;
    setSeleccionado(null);
    if (r.tacho === tachoId) {
      sonidos.acierto();
      acierto(r);
      setHechos((h) => [...h, r.id]);
      setPulsos((p) => ({ ...p, [tachoId]: (p[tachoId] || 0) + 1 }));
      setGolpe((g) => g + 1);
      if (r.tacho === 'peligroso') decir(frase('peligroso'), 'seria');
      else decir(frase('acierto'), 'celebrando');
      if (modo === 'tutorial') setTarjeta(r);
      else {
        setAviso(r);
        clearTimeout(temporizador.current);
        temporizador.current = setTimeout(() => setAviso(null), 3800);
      }
    } else {
      sonidos.error();
      setErrores((e) => e + 1);
      setErroresPor((m) => ({ ...m, [r.id]: (m[r.id] || 0) + 1 }));
      decir(`${frase('error')} ${r.pista}`, 'pensando');
    }
  }

  function siguienteTarjeta() {
    sonidos.click();
    setTarjeta(null);
    const sig = pendientes[0];
    if (sig) decir(`¿Y esto? ¡${sig.nombre}! ¿En qué tacho va?`, 'feliz');
  }

  function tocarTacho(id) {
    if (intro >= 0) return;
    const foco = seleccionado || (modo !== 'orilla' ? actual?.id : null);
    if (foco) clasificar(foco, id);
    else decir('Primero toca una basura, y luego su tacho. ¡O arrástrala!', 'pensando');
  }

  const fondoLaguna = nivel.fondo === 'laguna_sucia';
  const limpiezaVisual = fondoLaguna ? limpiezaInicial + progreso * 10 : undefined;

  return (
    <div className="relative h-[100dvh] flex flex-col overflow-hidden">
      <Escena fondo={nivel.fondo} limpieza={limpiezaVisual} oscurecer={modo === 'jefe' ? 0.1 : 0} />
      {fin && <Confeti />}
      <Hud
        titulo={nivel.nombre}
        onVolver={salir}
        extra={
          <span className="chip shrink-0" aria-label={`${hechos.length} de ${lista.length}`}>
            {hechos.length}/{lista.length}
          </span>
        }
      />
      <Guia pose={guia.pose} texto={guia.texto} />

      <ZonaArrastre residuos={lista} onSoltar={clasificar}>
        {(activoId) => {
          const foco = lista.find((r) => r.id === (activoId || seleccionado || actual?.id));
          const brilla = (t) => (intro > 0 ? TACHOS[intro - 1].id === t.id : !!foco && (erroresPor[foco.id] || 0) >= 2 && foco.tacho === t.id);
          return (
            <>
              <section className="relative z-10 flex-1 min-h-0">
                {/* Tutorial: presentación de tachos */}
                {modo === 'tutorial' && intro >= 0 && (
                  <div className="h-full grid place-items-center">
                    <button type="button" className="btn btn-grande" onClick={presentarTacho}>
                      {intro === 0 ? '¡Hola, tachos!' : intro < TACHOS.length ? '¡Entendido!' : '¡A jugar!'}
                    </button>
                  </div>
                )}

                {/* Tutorial y jefe: un residuo a la vez */}
                {modo !== 'orilla' && intro < 0 && actual && !tarjeta && (
                  <div className="h-full flex items-center justify-center gap-4">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={actual.id}
                        initial={modo === 'jefe' ? { x: 160, y: -60, scale: 0.2, rotate: 180 } : { scale: 0, rotate: -20 }}
                        animate={{ x: 0, y: 0, scale: 1, rotate: 0 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 180, damping: 14 }}
                        className="flex flex-col items-center"
                      >
                        <ResiduoArrastrable
                          residuo={actual}
                          size="clamp(90px, 20vh, 180px)"
                          seleccionado={seleccionado === actual.id}
                          onTocar={(id) => setSeleccionado((s) => (s === id ? null : id))}
                          conNombre
                        />
                      </motion.div>
                    </AnimatePresence>
                    {modo === 'jefe' && <Jefe progreso={progreso} golpe={golpe} />}
                  </div>
                )}
                {modo === 'jefe' && fin && (
                  <div className="h-full flex items-center justify-center">
                    <Jefe progreso={1} golpe={golpe} />
                  </div>
                )}

                {/* Orilla: basura regada */}
                {modo === 'orilla' && (
                  <div className="absolute inset-x-2 inset-y-1">
                    <AnimatePresence>
                      {pendientes.map((r) => (
                        <motion.div
                          key={r.id}
                          className="absolute"
                          style={{ left: `${r.pos[0]}%`, top: `${r.pos[1]}%`, x: '-50%', y: '-50%' }}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1, rotate: [0, -4, 4, 0] }}
                          exit={{ scale: 0, opacity: 0, y: '40%', pointerEvents: 'none' }}
                          transition={{ rotate: { duration: 3, repeat: Infinity, delay: r.pos[0] / 50 } }}
                        >
                          <ResiduoArrastrable
                            residuo={r}
                            size="clamp(58px, 11vh, 110px)"
                            seleccionado={seleccionado === r.id}
                            deshabilitado={hechos.includes(r.id)}
                            onTocar={(id) => {
                              sonidos.click();
                              setSeleccionado((s) => (s === id ? null : id));
                              decir(`${r.nombre}. ¿En qué tacho va?`, 'pensando');
                            }}
                          />
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}

                <AnimatePresence>
                  {aviso && (
                    <motion.div
                      key={aviso.id}
                      className="absolute inset-x-2 top-1 flex justify-center z-30"
                      initial={{ y: -30, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -30, opacity: 0 }}
                      onClick={() => setAviso(null)}
                    >
                      <TarjetaResiduo residuo={aviso} compacta />
                    </motion.div>
                  )}
                </AnimatePresence>
              </section>

              <section className="relative z-20 grid grid-cols-4 gap-1 px-1 sm:px-6 pb-[max(0.75rem,env(safe-area-inset-bottom))] max-w-4xl w-full mx-auto" aria-label="Tachos">
                {TACHOS.map((t) =>
                  intro >= 0 ? (
                    <div key={t.id} className="flex justify-center pt-1">
                      <Tacho tacho={t} alto={ALTO_TACHO} pulso={pulsos[t.id] || 0} brillar={brilla(t)} />
                    </div>
                  ) : (
                    <TachoSoltable key={t.id} tacho={t} alto={ALTO_TACHO} pulso={pulsos[t.id] || 0} brillar={brilla(t)} onTocar={tocarTacho} />
                  ),
                )}
              </section>
            </>
          );
        }}
      </ZonaArrastre>

      <Modal abierto={!!tarjeta} etiqueta="Tarjeta del residuo">
        {tarjeta && (
          <TarjetaResiduo residuo={tarjeta}>
            <button type="button" className="btn btn-verde btn-grande" onClick={siguienteTarjeta} autoFocus>
              ¡Siguiente!
            </button>
          </TarjetaResiduo>
        )}
      </Modal>
    </div>
  );
}

/** Ch'ura con su barra de basura. Se transforma cuando la barra llega a cero. */
function Jefe({ progreso, golpe }) {
  const curado = progreso >= 1;
  return (
    <div className="flex flex-col items-center">
      <div className="panel-oscuro px-3 py-1 mb-1 w-[clamp(140px,32vw,260px)]">
        <p className="text-xs sm:text-sm font-extrabold text-center">{curado ? '¡Ch\'ura está limpio!' : 'Basura de Ch\'ura'}</p>
        <div className="h-3 sm:h-4 rounded-full bg-black/40 overflow-hidden border border-white/40">
          <motion.div
            className="h-full rounded-full"
            style={{ background: curado ? '#5cb83a' : 'linear-gradient(90deg,#8a7a4a,#c9a63a)' }}
            animate={{ width: `${curado ? 100 : (1 - progreso) * 100}%` }}
          />
        </div>
      </div>
      <motion.div key={golpe} animate={curado ? { scale: [0.8, 1.15, 1] } : { x: [0, -12, 12, -6, 0], rotate: [0, -3, 3, 0] }} transition={{ duration: curado ? 1 : 0.45 }}>
        <Personaje quien="chura" pose={curado ? 'bueno' : 'normal'} alto="clamp(130px, 30vh, 300px)" />
      </motion.div>
    </div>
  );
}
