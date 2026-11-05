import Laguna, { etapaLaguna } from '../components/Laguna.jsx';
import Encabezado from '../components/Encabezado.jsx';
import Wari from '../components/Wari.jsx';
import Dialogo from '../components/Dialogo.jsx';
import { useProgreso } from '../context/ProgresoContext.jsx';

export default function MiLaguna({ ir }) {
  const { limpieza } = useProgreso();
  return (
    <div className="relative min-h-[100dvh] overflow-hidden flex flex-col">
      <Laguna limpieza={limpieza} className="absolute inset-0 w-full h-full" />
      <div className="relative z-10 max-w-3xl w-full mx-auto flex-1 flex flex-col">
        <Encabezado titulo="Mi laguna" onVolver={() => ir('mapa')} />
        <div className="px-4">
          <div className="bg-white/90 rounded-3xl p-3 shadow-lg">
            <p className="font-extrabold text-lg">Limpieza: {Math.round(limpieza)} %</p>
            <div className="h-5 bg-stone-200 rounded-full overflow-hidden" role="progressbar" aria-valuenow={limpieza} aria-valuemin={0} aria-valuemax={100} aria-label="Limpieza de la laguna">
              <div className="h-full bg-gradient-to-r from-laguna to-pasto transition-[width] duration-1000" style={{ width: `${limpieza}%` }} />
            </div>
          </div>
        </div>
        <div className="mt-auto flex items-end gap-2 px-3 pb-6">
          <Wari mood={limpieza >= 100 ? 'celebrando' : 'feliz'} size={150} />
          <Dialogo texto={etapaLaguna(limpieza)} className="flex-1 mb-8" />
        </div>
      </div>
    </div>
  );
}
