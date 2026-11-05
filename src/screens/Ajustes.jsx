import { useState } from 'react';
import Encabezado from '../components/Encabezado.jsx';
import Icono from '../components/Icono.jsx';
import Modal from '../components/Modal.jsx';
import Wari from '../components/Wari.jsx';
import { useProgreso } from '../context/ProgresoContext.jsx';
import { useVoz } from '../hooks/useVoz.js';
import { useSonidos } from '../hooks/useSonidos.js';

function Interruptor({ etiqueta, icono, valor, onCambiar }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={valor}
      onClick={() => onCambiar(!valor)}
      className="w-full flex items-center gap-3 bg-white rounded-3xl p-4 shadow-md min-h-[72px]"
    >
      <Icono nombre={icono} size={40} />
      <span className="flex-1 text-left text-xl font-extrabold">{etiqueta}</span>
      <span className={`relative w-20 h-11 rounded-full transition-colors ${valor ? 'bg-pasto' : 'bg-stone-300'}`}>
        <span className={`absolute top-1 w-9 h-9 rounded-full bg-white shadow transition-all ${valor ? 'left-10' : 'left-1'}`} />
      </span>
      <span className="w-10 font-bold">{valor ? 'Sí' : 'No'}</span>
    </button>
  );
}

export default function Ajustes({ ir }) {
  const { estado, ajustar, borrar } = useProgreso();
  const { hablar, soportado } = useVoz();
  const sonidos = useSonidos();
  const [confirmar, setConfirmar] = useState(false);
  const [borrado, setBorrado] = useState(false);
  const a = estado.ajustes;

  return (
    <div className="min-h-[100dvh] bg-gradient-to-b from-laguna to-[#bfe6ff] pb-8">
      <div className="max-w-xl mx-auto">
        <Encabezado titulo="Ajustes" onVolver={() => ir('mapa')} />
        <div className="px-4 flex flex-col gap-3 mt-2">
          <Interruptor etiqueta="Voz de Wari" icono="voz" valor={a.voz} onCambiar={(v) => ajustar('voz', v)} />
          {!soportado && <p className="text-white font-bold">Este navegador no tiene voz. ¡Igual puedes leer los diálogos!</p>}
          {soportado && (
            <button type="button" className="btn btn-blanco" onClick={() => hablar('¡Hola! Así suena mi voz.', { forzar: true })}>
              <Icono nombre="altavoz" size={26} className="text-laguna" /> Probar voz
            </button>
          )}
          <Interruptor
            etiqueta="Sonidos"
            icono="musica"
            valor={a.sonido}
            onCambiar={(v) => {
              ajustar('sonido', v);
            }}
          />
          <button type="button" className="btn btn-blanco" onClick={sonidos.acierto}>
            <Icono nombre="musica" size={26} /> Probar sonido
          </button>
          <Interruptor etiqueta="Letra grande" icono="letra" valor={a.textoGrande} onCambiar={(v) => ajustar('textoGrande', v)} />

          <div className="bg-white/80 rounded-3xl p-4 mt-4">
            <p className="font-extrabold text-lg">Borrar progreso</p>
            <p className="text-base text-stone-700 mb-2">Se borran las estrellas, semillas, insignias, álbum y accesorios.</p>
            <button type="button" className="btn btn-primario" onClick={() => setConfirmar(true)}>
              <Icono nombre="borrar" size={28} className="bg-white rounded-lg p-0.5" /> Borrar progreso
            </button>
            {borrado && <p className="font-bold text-pasto mt-2">¡Listo! El juego empieza de nuevo.</p>}
          </div>
        </div>
      </div>

      <Modal abierto={confirmar} onCerrar={() => setConfirmar(false)} etiqueta="Confirmar borrar progreso">
        <div className="tarjeta p-5 text-center max-w-sm">
          <Wari mood="pensando" size={110} />
          <p className="text-xl font-extrabold my-2">¿Seguro? Pide ayuda a un adulto.</p>
          <p className="text-base mb-4">Se borrará todo tu avance. No se puede deshacer.</p>
          <div className="flex gap-3 justify-center flex-wrap">
            <button type="button" className="btn btn-verde" onClick={() => setConfirmar(false)} autoFocus>
              No, mejor no
            </button>
            <button
              type="button"
              className="btn btn-primario"
              onClick={() => {
                borrar();
                setConfirmar(false);
                setBorrado(true);
              }}
            >
              Sí, borrar
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
