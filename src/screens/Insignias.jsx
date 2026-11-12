import { motion } from 'framer-motion';
import Hud from '../components/Hud.jsx';
import Escena from '../components/Escena.jsx';
import { INSIGNIAS } from '../data/insignias.js';
import { useProgreso } from '../context/ProgresoContext.jsx';

export default function Insignias({ ir }) {
  const { estado } = useProgreso();
  return (
    <div className="relative min-h-[100dvh] pb-10">
      <Escena fondo="nevado" oscurecer={0.4} />
      <div className="relative max-w-4xl mx-auto">
        <Hud titulo={`Insignias · ${estado.insignias.length}/${INSIGNIAS.length}`} onVolver={() => ir('mapa')} />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 px-3 mt-2">
          {INSIGNIAS.map((ins, i) => {
            const tiene = estado.insignias.includes(ins.id);
            return (
              <motion.div
                key={ins.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className={`rounded-3xl p-3 text-center ${tiene ? 'panel' : 'panel-oscuro'}`}
              >
                <motion.img
                  src={ins.img}
                  alt=""
                  className="w-24 h-24 sm:w-28 sm:h-28 mx-auto object-contain"
                  style={tiene ? undefined : { filter: 'grayscale(1) brightness(.6)', opacity: 0.6 }}
                  animate={tiene ? { rotate: [0, -4, 4, 0] } : {}}
                  transition={{ duration: 3, repeat: Infinity, delay: i * 0.2 }}
                />
                <p className="font-extrabold text-lg leading-tight mt-1">{ins.nombre}</p>
                <p className={`text-sm leading-tight ${tiene ? 'text-emerald-700 font-extrabold' : 'text-white/85'}`}>{tiene ? '¡Ganada!' : ins.como}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
