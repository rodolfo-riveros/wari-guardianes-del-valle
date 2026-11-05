import { motion } from 'framer-motion';
import { useState } from 'react';
import Laguna from '../components/Laguna.jsx';
import Icono from '../components/Icono.jsx';
import Encabezado from '../components/Encabezado.jsx';
import Wari from '../components/Wari.jsx';
import Dialogo from '../components/Dialogo.jsx';
import Tacho from '../components/Tacho.jsx';
import ResiduoIcon from '../components/ResiduoIcon.jsx';
import TarjetaResiduo from '../components/TarjetaResiduo.jsx';
import { TACHOS } from '../data/tachos.js';
import { RESIDUOS } from '../data/residuos.js';
import { frase } from '../data/frases.js';
import { estrellasPorErrores } from '../data/niveles.js';
import { useProgreso } from '../context/ProgresoContext.jsx';
import { useSonidos } from '../hooks/useSonidos.js';
import { useCamara } from '../hooks/useCamara.js';
import { useClasificador } from '../hooks/useClasificador.js';
import { useLimpiezaNivel, useTamTacho } from '../hooks/useNivel.js';

const META = 3;

export default function Nivel4({ ir }) {
  const { acierto, escaneo, completarNivel } = useProgreso();
  const sonidos = useSonidos();
  const tam = useTamTacho(100);
  const { antes, vivo, despues } = useLimpiezaNivel(4);
  const camara = useCamara();
  const clasificador = useClasificador();

  // aviso | cargando | escanear | pensando | confirmar | elegir | tacho | tarjeta
  const [paso, setPaso] = useState('aviso');
  const [manual, setManual] = useState(false);
  const [candidato, setCandidato] = useState(null);
  const [residuo, setResiduo] = useState(null);
  const [hechos, setHechos] = useState([]);
  const [errores, setErrores] = useState(0);
  const [erroresItem, setErroresItem] = useState(0);
  const [pulsos, setPulsos] = useState({});
  const [mood, setMood] = useState('saludando');
  const [texto, setTexto] = useState(
    '¡Ahora busca basura de verdad! Vamos a usar la cámara para ver tu residuo. Las fotos no se guardan ni se envían a ningún lado.',
  );

  function decir(t, m = 'feliz') {
    setTexto(t);
    setMood(m);
  }

  function irAManual(msg) {
    setManual(true);
    setPaso('elegir');
    decir(msg || 'Elige el residuo que tienes en tu mano.', 'feliz');
  }

  async function usarCamara() {
    sonidos.click();
    setPaso('cargando');
    decir('Wari se está poniendo sus lentes…', 'pensando');
    const [okCam, okModelo] = await Promise.all([camara.iniciar(), clasificador.cargar()]);
    if (!okCam) {
      camara.detener();
      irAManual('No pude abrir la cámara, ¡pero no importa! Elige el residuo que tienes en tu mano.');
      return;
    }
    if (!okModelo) {
      camara.detener();
      irAManual('Mis lentes no cargaron (quizá falta internet). ¡No importa! Elige el residuo que tienes en tu mano.');
      return;
    }
    setPaso('escanear');
    decir('Pon tu residuo frente a la cámara, con buena luz, y toca «¡Escanear!».');
  }

  async function escanear() {
    sonidos.pop();
    const cuadro = camara.capturar();
    if (!cuadro) {
      decir('La cámara todavía se está despertando… ¡intenta otra vez!', 'pensando');
      return;
    }
    setPaso('pensando');
    decir('Mmm… déjame mirar bien…', 'pensando');
    try {
      const { residuo: r, confianza } = await clasificador.clasificar(cuadro);
      if (r && confianza >= 0.5) {
        setCandidato(r);
        setPaso('confirmar');
        decir(`¡Creo que es: ${r.nombre.toLowerCase()}! ¿Es correcto?`, 'feliz');
      } else {
        setPaso('elegir');
        decir('No estoy segura… ¿Qué es? Elígelo aquí abajo.', 'pensando');
      }
    } catch {
      setPaso('elegir');
      decir('No estoy segura… ¿Qué es? Elígelo aquí abajo.', 'pensando');
    }
  }

  function confirmar(r) {
    sonidos.click();
    if (hechos.includes(r.id)) {
      decir(`¡Ya escaneamos ${r.nombre.toLowerCase()}! Busca otro residuo distinto.`, 'pensando');
      setPaso(manual ? 'elegir' : 'escanear');
      return;
    }
    setResiduo(r);
    setErroresItem(0);
    setPaso('tacho');
    decir(`${r.nombre}. ¿En qué tacho va? ¡Tú decides!`, 'feliz');
  }

  function elegirTacho(tachoId) {
    if (tachoId === residuo.tacho) {
      sonidos.acierto();
      acierto(residuo);
      escaneo();
      setPulsos((p) => ({ ...p, [tachoId]: (p[tachoId] || 0) + 1 }));
      setHechos((h) => [...h, residuo.id]);
      setPaso('tarjeta');
      if (residuo.tacho === 'peligroso') decir(frase('peligroso'), 'seria');
      else decir(frase('acierto'), 'celebrando');
    } else {
      sonidos.error();
      setErrores((e) => e + 1);
      setErroresItem((e) => e + 1);
      decir(`${frase('error')} ${residuo.pista}`, 'pensando');
    }
  }

  function siguiente() {
    sonidos.click();
    if (hechos.length >= META) {
      camara.detener();
      const estrellas = estrellasPorErrores(errores);
      completarNivel(4, estrellas);
      ir('resultado', { nivel: 4, estrellas, semillas: hechos.length + 3, antes, despues });
      return;
    }
    setResiduo(null);
    setCandidato(null);
    const faltan = META - hechos.length;
    if (manual) {
      setPaso('elegir');
      decir(`¡Muy bien! Busca otro residuo. Faltan ${faltan}.`);
    } else {
      setPaso('escanear');
      decir(`¡Muy bien! Trae otro residuo distinto. Faltan ${faltan}.`);
    }
  }

  const salir = () => {
    camara.detener();
    ir('mapa');
  };

  return (
    <div className="relative min-h-[100dvh] flex flex-col overflow-hidden">
      <Laguna limpieza={vivo(hechos.length / META)} className="fixed inset-0 w-full h-full" />
      <div className="relative z-10 flex flex-col min-h-[100dvh] max-w-3xl w-full mx-auto pb-6">
        <Encabezado
          titulo="Nivel 4 · Escáner"
          onVolver={salir}
          extra={
            <span className="shrink-0 rounded-full bg-white/95 px-3 py-2 font-extrabold shadow" aria-label={`${hechos.length} de ${META} residuos`}>
              <Icono nombre="lupa" size={24} /> {hechos.length}/{META}
            </span>
          }
        />

        <section className="flex items-end gap-1 px-3">
          <div className="shrink-0">
            <Wari mood={mood} size={100} />
          </div>
          <Dialogo texto={texto} className="flex-1 mb-4" />
        </section>

        <section className="px-4 mt-2 flex flex-col items-center gap-4">
          {paso === 'aviso' && (
            <div className="tarjeta p-5 text-center max-w-md">
              <div className="flex justify-center mb-2"><Icono nombre="camara" size={72} /></div>
              <p className="text-lg font-bold">
                Vamos a usar la cámara para ver tu residuo.{' '}
                <span className="text-cantuta">Las fotos no se guardan ni se envían a ningún lado.</span>
              </p>
              <p className="text-base text-stone-600 mt-1">Pide permiso a un adulto antes de usar la cámara.</p>
              <div className="flex flex-col gap-3 mt-4">
                <button type="button" className="btn btn-primario btn-grande" onClick={usarCamara}>
                  ¡Usar la cámara!
                </button>
                <button type="button" className="btn btn-blanco border-2 border-stone-300" onClick={() => irAManual()}>
                  Mejor elijo yo (sin cámara)
                </button>
              </div>
            </div>
          )}

          {paso === 'cargando' && (
            <div className="tarjeta p-6 text-center">
              <motion.div className="text-6xl" animate={{ rotate: [0, 15, -15, 0] }} transition={{ duration: 1.2, repeat: Infinity }} aria-hidden="true">
                <Icono nombre="lentes" size={80} />
              </motion.div>
              <p className="text-xl font-extrabold mt-2">Wari se está poniendo sus lentes…</p>
              <p className="text-base text-stone-600">Esto puede tardar un ratito la primera vez.</p>
            </div>
          )}

          {/* El video siempre está montado mientras la cámara esté activa */}
          <div className={`${['escanear', 'pensando'].includes(paso) && camara.estado === 'lista' ? 'flex' : 'hidden'} flex-col items-center gap-3 w-full`}>
            <div className="relative w-full max-w-sm aspect-square rounded-3xl overflow-hidden border-8 border-white shadow-xl bg-black">
              <video ref={camara.videoRef} playsInline muted autoPlay className="w-full h-full object-cover" aria-label="Vista de la cámara" />
              <div className="absolute inset-6 border-4 border-dashed border-white/80 rounded-2xl pointer-events-none" />
              {paso === 'pensando' && (
                <div className="absolute inset-0 grid place-items-center bg-black/30">
                  <motion.span className="text-6xl" animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 0.8, repeat: Infinity }}>
                    <Icono nombre="lupa" size={72} />
                  </motion.span>
                </div>
              )}
            </div>
            <div className="flex gap-3 flex-wrap justify-center">
              <button type="button" className="btn btn-primario btn-grande" onClick={escanear} disabled={paso === 'pensando'}>
                <Icono nombre="camara" size={32} /> ¡Escanear!
              </button>
              <button type="button" className="btn btn-blanco" onClick={() => { setPaso('elegir'); decir('Elige el residuo que tienes en tu mano.'); }}>
                Elegir yo
              </button>
            </div>
          </div>

          {paso === 'confirmar' && candidato && (
            <div className="tarjeta p-5 text-center">
              <ResiduoIcon residuo={candidato} size={100} />
              <p className="text-2xl font-extrabold">{candidato.nombre}</p>
              <p className="text-lg font-bold mb-3">¿Es correcto?</p>
              <div className="flex gap-4 justify-center">
                <button type="button" className="btn btn-verde btn-grande" onClick={() => confirmar(candidato)}>
                  <Icono nombre="check" size={32} /> Sí
                </button>
                <button
                  type="button"
                  className="btn btn-ocre btn-grande"
                  onClick={() => {
                    setPaso('elegir');
                    decir('No estoy segura… ¿Qué es? Elígelo aquí abajo.', 'pensando');
                  }}
                >
                  <Icono nombre="no" size={32} /> No
                </button>
              </div>
            </div>
          )}

          {paso === 'elegir' && (
            <div className="tarjeta p-3 w-full">
              <p className="text-lg font-extrabold text-center mb-2">Elige el residuo que tienes en tu mano</p>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {RESIDUOS.map((r) => {
                  const hecho = hechos.includes(r.id);
                  return (
                    <button
                      key={r.id}
                      type="button"
                      disabled={hecho}
                      onClick={() => confirmar(r)}
                      className="relative flex flex-col items-center rounded-2xl border-2 border-stone-200 bg-white p-1 min-h-[56px] hover:bg-amber-50 disabled:opacity-40"
                    >
                      <ResiduoIcon residuo={r} size={52} />
                      <span className="text-[0.78rem] font-bold leading-tight text-center">{r.nombre}</span>
                      {hecho && <span className="absolute top-0.5 right-0.5"><Icono nombre="check" size={22} /></span>}
                    </button>
                  );
                })}
              </div>
              {!manual && camara.estado === 'lista' && (
                <div className="flex justify-center mt-3">
                  <button type="button" className="btn btn-azul" onClick={() => { setPaso('escanear'); decir('¡Probemos otra vez con la cámara!'); }}>
                    <Icono nombre="camara" size={28} /> Volver a escanear
                  </button>
                </div>
              )}
            </div>
          )}

          {paso === 'tacho' && residuo && (
            <>
              <div className="pieza">
                <ResiduoIcon residuo={residuo} size={100} />
                <span className="font-extrabold">{residuo.nombre}</span>
              </div>
              <div className="grid grid-cols-4 gap-1.5 w-full">
                {TACHOS.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    className="rounded-3xl p-1 bg-white/40 hover:bg-white/70"
                    onClick={() => elegirTacho(t.id)}
                    aria-label={`${t.nombre}: ${t.sub}`}
                  >
                    <Tacho tacho={t} size={tam} pulso={pulsos[t.id] || 0} brillar={erroresItem >= 2 && t.id === residuo.tacho} />
                  </button>
                ))}
              </div>
            </>
          )}

          {paso === 'tarjeta' && residuo && (
            <TarjetaResiduo residuo={residuo}>
              <button type="button" className="btn btn-verde btn-grande" onClick={siguiente} autoFocus>
                {hechos.length >= META ? <>¡Terminar! <Icono nombre="fiesta" /></> : <>¡Siguiente! <Icono nombre="play" /></>}
              </button>
            </TarjetaResiduo>
          )}
        </section>
      </div>
    </div>
  );
}
