import { motion } from 'framer-motion';
import { useState } from 'react';
import Escena from '../components/Escena.jsx';
import Hud from '../components/Hud.jsx';
import Guia from '../components/Guia.jsx';
import Tacho from '../components/Tacho.jsx';
import TarjetaResiduo from '../components/TarjetaResiduo.jsx';
import Confeti from '../components/Confeti.jsx';
import { TACHOS } from '../data/tachos.js';
import { RESIDUOS } from '../data/residuos.js';
import { frase } from '../data/frases.js';
import { estrellasPorErrores } from '../data/niveles.js';
import { useProgreso } from '../context/ProgresoContext.jsx';
import { useSonidos } from '../hooks/useSonidos.js';
import { useCamara } from '../hooks/useCamara.js';
import { useClasificador } from '../hooks/useClasificador.js';
import { ui } from '../assets.js';

/**
 * "Escáner del Guardián": la cámara + MobileNet en el navegador.
 * Las imágenes nunca se guardan ni se envían. Si no hay cámara, se elige a mano.
 */
export default function Escaner({ nivel, terminar, salir }) {
  const META = nivel.cantidad;
  const { acierto, escaneo } = useProgreso();
  const sonidos = useSonidos();
  const camara = useCamara();
  const clasificador = useClasificador();

  // aviso | cargando | escanear | pensando | confirmar | elegir | tacho | tarjeta
  const [paso, setPaso] = useState('aviso');
  const [manual, setManual] = useState(false);
  const [candidato, setCandidato] = useState(null);
  const [residuo, setResiduo] = useState(null);
  const [hechos, setHechos] = useState([]);
  const [errores, setErrores] = useState(0);
  const [errItem, setErrItem] = useState(0);
  const [pulsos, setPulsos] = useState({});
  const [guia, setGuia] = useState({
    pose: 'saludando',
    texto: '¡Busca basura de verdad en tu casa o en el aula! Vamos a usar la cámara. Las fotos no se guardan ni se envían a ningún lado.',
  });
  const decir = (texto, pose = 'feliz') => setGuia({ texto, pose });

  function aManual(msg) {
    setManual(true);
    setPaso('elegir');
    decir(msg || 'Elige el residuo que tienes en tu mano.');
  }

  async function usarCamara() {
    sonidos.click();
    setPaso('cargando');
    decir('Me estoy poniendo mis lentes mágicos…', 'pensando');
    const [okCam, okModelo] = await Promise.all([camara.iniciar(), clasificador.cargar()]);
    if (!okCam) {
      camara.detener();
      return aManual('No pude abrir la cámara, ¡pero no importa! Elige el residuo que tienes en tu mano.');
    }
    if (!okModelo) {
      camara.detener();
      return aManual('Mis lentes no cargaron (quizá falta internet). ¡No importa! Elige el residuo que tienes en tu mano.');
    }
    setPaso('escanear');
    decir('Pon tu residuo frente a la cámara, con buena luz, y toca «¡Escanear!».');
  }

  async function escanear() {
    sonidos.pop();
    const cuadro = camara.capturar();
    if (!cuadro) return decir('La cámara todavía se está despertando… ¡intenta otra vez!', 'pensando');
    setPaso('pensando');
    decir('Mmm… déjame mirar bien…', 'pensando');
    try {
      const { residuo: r, confianza } = await clasificador.clasificar(cuadro);
      if (r && confianza >= 0.5) {
        setCandidato(r);
        setPaso('confirmar');
        decir(`¡Creo que es: ${r.nombre.toLowerCase()}! ¿Es correcto?`);
        return;
      }
    } catch {
      /* si falla, pasamos a elegir */
    }
    setPaso('elegir');
    decir('No estoy segura… ¿Qué es? Elígelo aquí abajo.', 'pensando');
  }

  function confirmar(r) {
    sonidos.click();
    if (hechos.includes(r.id)) {
      decir(`¡Ya revisamos ${r.nombre.toLowerCase()}! Busca otro residuo distinto.`, 'pensando');
      setPaso(manual ? 'elegir' : 'escanear');
      return;
    }
    setResiduo(r);
    setErrItem(0);
    setPaso('tacho');
    decir(`${r.nombre}. ¿En qué tacho va? ¡Tú decides!`);
  }

  function elegirTacho(id) {
    if (id === residuo.tacho) {
      sonidos.acierto();
      acierto(residuo);
      escaneo();
      setPulsos((p) => ({ ...p, [id]: (p[id] || 0) + 1 }));
      setHechos((h) => [...h, residuo.id]);
      setPaso('tarjeta');
      if (residuo.tacho === 'peligroso') decir(frase('peligroso'), 'seria');
      else decir(frase('acierto'), 'celebrando');
    } else {
      sonidos.error();
      setErrores((e) => e + 1);
      setErrItem((e) => e + 1);
      decir(`${frase('error')} ${residuo.pista}`, 'pensando');
    }
  }

  function siguiente() {
    sonidos.click();
    if (hechos.length >= META) {
      camara.detener();
      return terminar({ estrellas: estrellasPorErrores(errores), semillas: hechos.length });
    }
    setResiduo(null);
    setCandidato(null);
    const faltan = META - hechos.length;
    setPaso(manual ? 'elegir' : 'escanear');
    decir(`¡Muy bien! Trae otro residuo distinto. Faltan ${faltan}.`);
  }

  return (
    <div className="relative min-h-[100dvh] flex flex-col overflow-hidden">
      <Escena fondo={nivel.fondo} oscurecer={0.15} />
      {hechos.length >= META && paso === 'tarjeta' && <Confeti />}
      <Hud
        titulo={nivel.nombre}
        onVolver={() => {
          camara.detener();
          salir();
        }}
        extra={<span className="chip shrink-0">{hechos.length}/{META}</span>}
      />
      <Guia pose={guia.pose} texto={guia.texto} />

      <section className="relative z-10 px-3 py-2 flex flex-col items-center gap-4 w-full max-w-3xl mx-auto">
        {paso === 'aviso' && (
          <div className="panel p-5 text-center max-w-md">
            <p className="text-xl font-extrabold">Vamos a usar la cámara para ver tu residuo.</p>
            <p className="text-lg font-bold text-[#c2185b] mt-1">Las fotos no se guardan ni se envían a ningún lado.</p>
            <p className="text-base text-stone-600 mt-1">Pide permiso a un adulto antes de usar la cámara.</p>
            <div className="flex flex-col gap-3 mt-4">
              <button type="button" className="btn btn-grande" onClick={usarCamara}>
                ¡Usar la cámara!
              </button>
              <button type="button" className="btn btn-blanco" onClick={() => aManual()}>
                Mejor elijo yo (sin cámara)
              </button>
            </div>
          </div>
        )}

        {paso === 'cargando' && (
          <div className="panel p-6 text-center">
            <motion.div className="mx-auto w-16 h-16 rounded-full border-8 border-amber-200 border-t-[#c2185b]" animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} />
            <p className="text-xl font-extrabold mt-3">Wari se está poniendo sus lentes…</p>
            <p className="text-base text-stone-600">La primera vez puede tardar un ratito.</p>
          </div>
        )}

        <div className={`${['escanear', 'pensando'].includes(paso) && camara.estado === 'lista' ? 'flex' : 'hidden'} flex-col items-center gap-3 w-full`}>
          <div className="relative w-full max-w-sm aspect-square rounded-[2rem] overflow-hidden border-8 border-white shadow-2xl bg-black">
            <video ref={camara.videoRef} playsInline muted autoPlay className="w-full h-full object-cover" aria-label="Vista de la cámara" />
            <div className="absolute inset-6 border-4 border-dashed border-white/80 rounded-2xl pointer-events-none" />
            {paso === 'pensando' && (
              <motion.div className="absolute inset-x-0 h-1.5 bg-emerald-300 shadow-[0_0_20px_6px_rgba(110,231,183,.8)]" animate={{ top: ['8%', '92%', '8%'] }} transition={{ duration: 1.6, repeat: Infinity }} />
            )}
          </div>
          <div className="flex gap-3 flex-wrap justify-center">
            <button type="button" className="btn btn-grande" onClick={escanear} disabled={paso === 'pensando'}>
              ¡Escanear!
            </button>
            <button
              type="button"
              className="btn btn-blanco"
              onClick={() => {
                setPaso('elegir');
                decir('Elige el residuo que tienes en tu mano.');
              }}
            >
              Elegir yo
            </button>
          </div>
        </div>

        {paso === 'confirmar' && candidato && (
          <div className="panel p-5 text-center">
            <img src={candidato.img} alt="" className="w-32 h-32 mx-auto object-contain sprite" />
            <p className="text-2xl font-extrabold">{candidato.nombre}</p>
            <p className="text-lg font-bold mb-3">¿Es correcto?</p>
            <div className="flex gap-4 justify-center">
              <button type="button" className="btn btn-verde btn-grande" onClick={() => confirmar(candidato)}>
                Sí
              </button>
              <button
                type="button"
                className="btn btn-ocre btn-grande"
                onClick={() => {
                  setPaso('elegir');
                  decir('No estoy segura… ¿Qué es? Elígelo aquí abajo.', 'pensando');
                }}
              >
                No
              </button>
            </div>
          </div>
        )}

        {paso === 'elegir' && (
          <div className="panel p-3 w-full">
            <p className="text-lg font-extrabold text-center mb-2">Elige el residuo que tienes en tu mano</p>
            <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-6 gap-2 max-h-[46vh] overflow-y-auto p-1">
              {RESIDUOS.map((r) => {
                const hecho = hechos.includes(r.id);
                return (
                  <button
                    key={r.id}
                    type="button"
                    disabled={hecho}
                    onClick={() => confirmar(r)}
                    className="relative flex flex-col items-center rounded-2xl border-2 border-amber-200 bg-white p-1.5 min-h-[56px] hover:bg-amber-50 disabled:opacity-40 shadow-sm"
                  >
                    <img src={r.img} alt="" className="w-14 h-14 object-contain" />
                    <span className="text-[0.75rem] font-bold leading-tight text-center">{r.nombre}</span>
                    {hecho && <img src={ui('check')} alt="Listo" className="absolute top-0.5 right-0.5 w-6 h-6" />}
                  </button>
                );
              })}
            </div>
            {!manual && camara.estado === 'lista' && (
              <div className="flex justify-center mt-3">
                <button
                  type="button"
                  className="btn btn-azul"
                  onClick={() => {
                    setPaso('escanear');
                    decir('¡Probemos otra vez con la cámara!');
                  }}
                >
                  Volver a escanear
                </button>
              </div>
            )}
          </div>
        )}

        {paso === 'tacho' && residuo && (
          <>
            <motion.img initial={{ scale: 0 }} animate={{ scale: 1 }} src={residuo.img} alt={residuo.nombre} className="w-32 h-32 object-contain sprite" />
            <div className="grid grid-cols-4 gap-1 w-full">
              {TACHOS.map((t) => (
                <button key={t.id} type="button" className="flex justify-center active:scale-95 transition" onClick={() => elegirTacho(t.id)} aria-label={`${t.nombre}: ${t.sub}`}>
                  <Tacho tacho={t} alto="clamp(70px, 15vh, 140px)" pulso={pulsos[t.id] || 0} brillar={errItem >= 2 && t.id === residuo.tacho} />
                </button>
              ))}
            </div>
          </>
        )}

        {paso === 'tarjeta' && residuo && (
          <TarjetaResiduo residuo={residuo}>
            <button type="button" className="btn btn-verde btn-grande" onClick={siguiente} autoFocus>
              {hechos.length >= META ? '¡Terminar!' : '¡Siguiente!'}
            </button>
          </TarjetaResiduo>
        )}
      </section>
    </div>
  );
}
