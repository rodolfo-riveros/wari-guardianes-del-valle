import { useProgreso } from '../context/ProgresoContext.jsx';
import { ui } from '../assets.js';

/** Barra superior del juego: volver, título, extras y semillas. */
export default function Hud({ titulo, onVolver, extra }) {
  const { estado } = useProgreso();
  return (
    <header className="relative z-30 flex items-center gap-2 px-3 pt-[max(0.75rem,env(safe-area-inset-top))] pb-2">
      {onVolver && (
        <button type="button" className="btn btn-blanco btn-redondo shrink-0" onClick={onVolver} aria-label="Volver">
          <img src={ui('play')} alt="" className="w-9 h-9 rotate-180" />
        </button>
      )}
      {titulo && (
        <h1 className="flex-1 min-w-0 truncate text-lg sm:text-2xl font-extrabold text-white panel-oscuro px-4 py-1.5">{titulo}</h1>
      )}
      {!titulo && <div className="flex-1" />}
      {extra}
      <div className="chip shrink-0" aria-label={`${estado.semillas} semillas`}>
        <img src={ui('semilla')} alt="" className="w-7 h-7" />
        {estado.semillas}
      </div>
    </header>
  );
}
