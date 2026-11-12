import { motion, useAnimationControls } from 'framer-motion';
import { useEffect } from 'react';

/**
 * Tacho ilustrado.
 * - abierto: se agranda (cuando arrastras encima)
 * - pulso: al cambiar hace un salto de "¡ñam!"
 * - brillar: brilla para dar una pista
 */
export default function Tacho({ tacho, abierto = false, pulso = 0, brillar = false, alto = 110, mostrarNombre = true }) {
  const ctrl = useAnimationControls();

  useEffect(() => {
    if (!pulso) return;
    ctrl.start({ scale: [1, 1.22, 0.92, 1.05, 1], rotate: [0, -6, 6, 0], transition: { duration: 0.6 } });
  }, [pulso, ctrl]);

  return (
    <div className="flex flex-col items-center select-none">
      <div className="relative" style={{ height: alto }}>
        {brillar && (
          <motion.div
            className="absolute inset-[-14%] rounded-full pointer-events-none"
            style={{ background: `radial-gradient(circle, ${tacho.color}cc 0%, ${tacho.color}00 70%)` }}
            animate={{ opacity: [0.3, 1, 0.3], scale: [0.9, 1.1, 0.9] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        )}
        <motion.div
          className="relative h-full"
          animate={{ scale: abierto ? 1.15 : 1, y: abierto ? -6 : 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 15 }}
          style={{ originY: 1 }}
        >
          <motion.img
            src={tacho.img}
            alt=""
            draggable={false}
            className="h-full w-auto sprite"
            animate={ctrl}
            style={{ originY: 1 }}
          />
        </motion.div>
      </div>
      {mostrarNombre && (
        <div
          className="mt-1 rounded-full px-2 sm:px-3 py-0.5 text-white text-center leading-tight shadow-md"
          style={{ background: tacho.color, border: '2px solid rgba(255,255,255,.85)' }}
        >
          <div className="font-extrabold text-[0.72rem] sm:text-sm">{tacho.sub}</div>
        </div>
      )}
    </div>
  );
}
