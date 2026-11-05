import { AnimatePresence, motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import Laguna from '../components/Laguna.jsx';
import Icono from '../components/Icono.jsx';
import Encabezado from '../components/Encabezado.jsx';
import Wari from '../components/Wari.jsx';
import Dialogo from '../components/Dialogo.jsx';
import Modal from '../components/Modal.jsx';
import TarjetaResiduo from '../components/TarjetaResiduo.jsx';
import Tacho from '../components/Tacho.jsx';
import { ZonaArrastre, ResiduoArrastrable, TachoSoltable } from '../components/ArrastrarSoltar.jsx';
import { TACHOS } from '../data/tachos.js';
import { barajar, elegir } from '../data/residuos.js';
import { frase } from '../data/frases.js';
import { useProgreso } from '../context/ProgresoContext.jsx';
import { useSonidos } from '../hooks/useSonidos.js';
import { useLimpiezaNivel, useTamTacho } from '../hooks/useNivel.js';

export default function Nivel1({ ir }) {
  const { acierto, completarNivel } = useProgreso();
  const sonidos = useSonidos();
  const tam = useTamTacho();
  const { antes, vivo, despues } = useLimpiezaNivel(1);

  // 6 residuos fáciles que cubren los 4 tachos.
  const lista = useMemo(
    () =>
      barajar([
        ...elegir('aprovechable', 2, [1]),
        ...elegir('organico', 2, [1]),
        ...elegir('no_aprovechable', 1, [1]),
        ...elegir('peligroso', 1, [1]),
      ]),
    [],
  );

  const [fase, setFase] = useState('intro'); // intro | juego
  const [paso, setPaso] = useState(0);
  const [idx, setIdx] = useState(0);
  const [erroresItem, setErroresItem] = useState(0);
  const [pulsos, setPulsos] = useState({});
  const [seleccionado, setSeleccionado] = useState(false);
  const [tarjeta, setTarjeta] = useState(null);
  const [mood, setMood] = useState('saludando');
  const [texto, setTexto] = useState(
    '¡Hola, guardián! Antes de limpiar, te presento a mis amigos: ¡los 4 tachos! Cada uno tiene su color.',
  );

  const actual = lista[idx];
  const aciertos = idx + (tarjeta ? 1 : 0);

  function siguientePaso() {
    sonidos.click();
    if (paso < TACHOS.length) {
      const t = TACHOS[paso];
      setPulsos((p) => ({ ...p, [t.id]: (p[t.id] || 0) + 1 }));
      setTexto(t.presentacion);
      setMood(t.id === 'peligroso' ? 'seria' : 'feliz');
      setPaso(paso + 1);
    } else {
      setFase('juego');
      setMood('feliz');
      setTexto(`¡Ahora te toca! Mira: ${lista[0].nombre.toLowerCase()}. Arrástralo a su tacho, o tócalo y luego toca el tacho.`);
    }
  }

  function clasificar(tachoId) {
    if (!actual || tarjeta) return;
    setSeleccionado(false);
    if (tachoId === actual.tacho) {
      sonidos.acierto();
      acierto(actual);
      setPulsos((p) => ({ ...p, [tachoId]: (p[tachoId] || 0) + 1 }));
      if (actual.tacho === 'peligroso') {
        setMood('seria');
        setTexto(frase('peligroso'));
      } else {
        setMood('feliz');
        setTexto(frase('acierto'));
      }
      setTarjeta(actual);
    } else {
      sonidos.error();
      setErroresItem((e) => e + 1);
      setMood('pensando');
      setTexto(`${frase('error')} ${actual.pista}`);
    }
  }

  function siguiente() {
    sonidos.click();
    setTarjeta(null);
    setErroresItem(0);
    if (idx + 1 >= lista.length) {
      completarNivel(1, 3);
      ir('resultado', { nivel: 1, estrellas: 3, semillas: lista.length + 3, antes, despues });
      return;
    }
    const sig = lista[idx + 1];
    setIdx(idx + 1);
    setMood('feliz');
    setTexto(`¿Y esto? ¡${sig.nombre}! ¿En qué tacho va?`);
  }

  const tachoBrilla = (id) =>
    fase === 'intro' ? paso > 0 && TACHOS[paso - 1].id === id : erroresItem >= 2 && actual?.tacho === id;

  return (
    <div className="relative min-h-[100dvh] flex flex-col overflow-hidden">
      <Laguna limpieza={vivo(aciertos / lista.length)} className="fixed inset-0 w-full h-full" />
      <div className="relative z-10 flex flex-col min-h-[100dvh] max-w-3xl w-full mx-auto">
        <Encabezado titulo="Nivel 1 · Wari me enseña" onVolver={() => ir('mapa')} />

        <section className="flex items-end gap-1 px-3">
          <div className="shrink-0">
            <Wari mood={mood} size={tam > 90 ? 130 : 96} />
          </div>
          <Dialogo texto={texto} className="flex-1 mb-6" />
        </section>

        <ZonaArrastre residuos={actual ? [actual] : []} onSoltar={(_, tachoId) => clasificar(tachoId)}>
          {(activoId) => (
            <>
              <section className="flex-1 grid place-items-center px-4 py-4 min-h-[150px]">
                {fase === 'intro' ? (
                  <button type="button" className="btn btn-primario btn-grande" onClick={siguientePaso}>
                    {paso < TACHOS.length ? (paso === 0 ? '¡Hola, tachos!' : '¡Entendido!') : '¡A jugar!'} <Icono nombre="play" />
                  </button>
                ) : (
                  actual && (
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={actual.id}
                        initial={{ scale: 0, rotate: -20 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0 }}
                        className="flex flex-col items-center gap-1"
                      >
                        {!tarjeta && (
                          <ResiduoArrastrable
                            residuo={actual}
                            size={tam > 90 ? 110 : 90}
                            seleccionado={seleccionado}
                            onTocar={() => setSeleccionado((s) => !s)}
                          />
                        )}
                        <span className="bg-white/90 rounded-full px-4 py-1 font-extrabold text-lg shadow">
                          {actual.nombre}
                        </span>
                        <span className="text-white font-bold drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                          {idx + 1} de {lista.length}
                        </span>
                      </motion.div>
                    </AnimatePresence>
                  )
                )}
              </section>

              <section className="grid grid-cols-4 gap-1.5 px-2 pb-5" aria-label="Tachos">
                {TACHOS.map((t) =>
                  fase === 'intro' ? (
                    <div key={t.id} className="rounded-3xl p-1 bg-white/35 flex justify-center">
                      <Tacho tacho={t} size={tam} pulso={pulsos[t.id] || 0} brillar={tachoBrilla(t.id)} />
                    </div>
                  ) : (
                    <TachoSoltable
                      key={t.id}
                      tacho={t}
                      size={tam}
                      pulso={pulsos[t.id] || 0}
                      brillar={tachoBrilla(t.id) && (activoId || seleccionado || erroresItem >= 2)}
                      onTocar={(id) => (seleccionado ? clasificar(id) : setTexto('Primero toca la basura, y luego el tacho. ¡O arrástrala!'))}
                    />
                  ),
                )}
              </section>
            </>
          )}
        </ZonaArrastre>
      </div>

      <Modal abierto={!!tarjeta} etiqueta="Tarjeta del residuo">
        {tarjeta && (
          <TarjetaResiduo residuo={tarjeta}>
            <button type="button" className="btn btn-verde btn-grande" onClick={siguiente} autoFocus>
              ¡Siguiente! <Icono nombre="play" />
            </button>
          </TarjetaResiduo>
        )}
      </Modal>
    </div>
  );
}
