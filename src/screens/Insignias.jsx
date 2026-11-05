import { motion } from 'framer-motion';
import Encabezado from '../components/Encabezado.jsx';
import { INSIGNIAS } from '../data/insignias.js';
import { useProgreso } from '../context/ProgresoContext.jsx';

export default function Insignias({ ir }) {
  const { estado } = useProgreso();
  return (
    <div className="min-h-[100dvh] bg-gradient-to-b from-tierra to-ocre pb-8">
      <div className="max-w-3xl mx-auto">
        <Encabezado titulo="Mis insignias" onVolver={() => ir('mapa')} />
        <p className="px-4 text-white font-bold text-lg drop-shadow">
          Tienes {estado.insignias.length} de {INSIGNIAS.length} insignias.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 px-4 mt-3">
          {INSIGNIAS.map((ins, i) => {
            const tiene = estado.insignias.includes(ins.id);
            return (
              <motion.div
                key={ins.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`rounded-3xl p-3 text-center shadow-lg border-4 ${tiene ? 'bg-white border-ocre' : 'bg-white/60 border-white/50'}`}
              >
                <div className="text-5xl" style={tiene ? undefined : { filter: 'grayscale(1)', opacity: 0.4 }} aria-hidden="true">
                  {ins.icono}
                </div>
                <p className="font-extrabold text-lg leading-tight">{ins.nombre}</p>
                <p className="text-sm text-stone-700 leading-tight">{tiene ? '¡Ganada! ✅' : ins.como}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
