import { useState } from 'react';
import Hud from '../components/Hud.jsx';
import Escena from '../components/Escena.jsx';
import Modal from '../components/Modal.jsx';
import Personaje from '../components/Personaje.jsx';
import { useProgreso } from '../context/ProgresoContext.jsx';
import { useVoz } from '../hooks/useVoz.js';
import { useSonidos } from '../hooks/useSonidos.js';
import { ui } from '../assets.js';

function Interruptor({ etiqueta, valor, onCambiar, icono }) {
  return (
    <button type="button" role="switch" aria-checked={valor} onClick={() => onCambiar(!valor)} className="panel w-full flex items-center gap-3 p-4 min-h-[76px]">
      {icono && <img src={icono} alt="" className="w-10 h-10" />}
      <span className="flex-1 text-left text-xl font-extrabold">{etiqueta}</span>
      <span className={`relative w-20 h-11 rounded-full transition-colors shadow-inner ${valor ? 'bg-[#2e9e4f]' : 'bg-stone-300'}`}>
        <span className={`absolute top-1 w-9 h-9 rounded-full bg-white shadow transition-all ${valor ? 'left-10' : 'left-1'}`} />
      </span>
      <span className="w-8 font-extrabold">{valor ? 'Sí' : 'No'}</span>
    </button>
  );
}

export default function Ajustes({ ir, params }) {
  const { estado, ajustar, borrar } = useProgreso();
  const { hablar, soportado } = useVoz();
  const sonidos = useSonidos();
  const [confirmar, setConfirmar] = useState(false);
  const [borrado, setBorrado] = useState(false);
  const a = estado.ajustes;

  return (
    <div className="relative min-h-[100dvh] pb-10">
      <Escena fondo="laguna_limpia" oscurecer={0.35} />
      <div className="relative max-w-xl mx-auto">
        <Hud titulo="Ajustes" onVolver={() => ir(params?.desde || 'mapa')} />
        <div className="px-4 flex flex-col gap-3 mt-2">
          <Interruptor etiqueta="Voz de los personajes" icono={ui('altavoz')} valor={a.voz} onCambiar={(v) => ajustar('voz', v)} />
          {!soportado && <p className="text-white font-bold texto-sombra">Este navegador no tiene voz. ¡Igual puedes leer los diálogos!</p>}
          {soportado && (
            <button type="button" className="btn btn-blanco" onClick={() => hablar('¡Hola! Así suena mi voz.', { forzar: true })}>
              Probar voz
            </button>
          )}
          <Interruptor etiqueta="Sonidos" icono={ui('estrella')} valor={a.sonido} onCambiar={(v) => ajustar('sonido', v)} />
          <button type="button" className="btn btn-blanco" onClick={sonidos.acierto}>
            Probar sonido
          </button>
          <Interruptor etiqueta="Letra grande" icono={ui('check')} valor={a.textoGrande} onCambiar={(v) => ajustar('textoGrande', v)} />

          <button type="button" className="btn btn-azul mt-2" onClick={() => ir('profes', { desde: params?.desde || 'mapa' })}>
            Para profes y familias
          </button>

          <div className="panel p-4 mt-4">
            <p className="font-extrabold text-lg">Borrar progreso</p>
            <p className="text-base text-stone-700 mb-2">Se borran las estrellas, semillas, insignias, álbum, historias vistas y tu laguna decorada.</p>
            <button type="button" className="btn" onClick={() => setConfirmar(true)}>
              Borrar progreso
            </button>
            {borrado && <p className="font-bold text-emerald-700 mt-2">¡Listo! La aventura empieza de nuevo.</p>}
          </div>
        </div>
      </div>

      <Modal abierto={confirmar} onCerrar={() => setConfirmar(false)} etiqueta="Confirmar borrar progreso">
        <div className="panel p-5 text-center max-w-sm">
          <div className="flex justify-center">
            <Personaje quien="wari" pose="preocupada" alto={140} />
          </div>
          <p className="text-xl font-extrabold my-2">¿Seguro? Pide ayuda a un adulto.</p>
          <p className="text-base mb-4">Se borrará todo tu avance. No se puede deshacer.</p>
          <div className="flex gap-3 justify-center flex-wrap">
            <button type="button" className="btn btn-verde" onClick={() => setConfirmar(false)} autoFocus>
              No, mejor no
            </button>
            <button
              type="button"
              className="btn"
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
