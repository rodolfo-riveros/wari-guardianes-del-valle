import { useProgreso } from '../context/ProgresoContext.jsx';

export default function Encabezado({ titulo, onVolver, extra }) {
  const { estado } = useProgreso();
  return (
    <header className="relative z-20 flex items-center gap-2 px-3 pt-3 pb-2">
      {onVolver && (
        <button type="button" className="btn btn-blanco !px-0 w-14 shrink-0 text-2xl" onClick={onVolver} aria-label="Volver">
          ⬅️
        </button>
      )}
      <h1 className="flex-1 min-w-0 truncate text-xl sm:text-2xl font-extrabold text-white rounded-2xl bg-black/35 px-3 py-1.5 drop-shadow-[0_2px_2px_rgba(0,0,0,0.6)]">
        {titulo}
      </h1>
      {extra}
      <div
        className="shrink-0 rounded-full bg-white/95 px-4 py-2 font-extrabold text-lg shadow"
        aria-label={`${estado.semillas} semillas`}
      >
        🌱 {estado.semillas}
      </div>
    </header>
  );
}
