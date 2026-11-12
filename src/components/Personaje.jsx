import { AnimatePresence, motion } from 'framer-motion';
import { imagenDe, PERSONAJES } from '../data/personajes.js';
import { useProgreso } from '../context/ProgresoContext.jsx';

const ANIM = {
  celebrando: { y: [0, -26, 0], rotate: [0, -3, 3, 0], transition: { duration: 0.9, repeat: Infinity } },
  saludando: { rotate: [0, -2, 2, 0], transition: { duration: 2.4, repeat: Infinity } },
  pensando: { rotate: [0, 3, 0], transition: { duration: 3, repeat: Infinity } },
  seria: { scale: [1, 1.02, 1], transition: { duration: 2, repeat: Infinity } },
  durmiendo: { scale: [1, 1.03, 1], transition: { duration: 3.2, repeat: Infinity } },
  preocupada: { x: [0, -2, 2, 0], transition: { duration: 2.6, repeat: Infinity } },
  heroica: { y: [0, -6, 0], transition: { duration: 2.2, repeat: Infinity } },
  default: { y: [0, -7, 0], transition: { duration: 2.6, repeat: Infinity, ease: 'easeInOut' } },
};

/**
 * Personaje ilustrado. `alto` es la altura CSS (ej. '40vh' o 180).
 * Wari usa la pose "heroica" como su pose feliz una vez que termina la historia.
 */
export default function Personaje({ quien = 'wari', pose = 'feliz', alto = 200, voltear = false, className = '', etiqueta }) {
  const { estado } = useProgreso();
  let poseFinal = pose;
  if (quien === 'wari' && estado.juegoTerminado && (pose === 'feliz' || pose === 'saludando')) poseFinal = 'heroica';
  const src = imagenDe(quien, poseFinal);
  const nombre = PERSONAJES[quien]?.nombre || '';

  return (
    <div className={`relative ${className}`} style={{ height: alto }}>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.div
          key={src}
          className="h-full"
          style={{ scaleX: voltear ? -1 : 1 }}
          initial={{ opacity: 0, scale: 0.85, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        >
          <motion.img
            src={src}
            alt={etiqueta || `${nombre}`}
            draggable={false}
            className="h-full w-auto max-w-none sprite"
            style={{ originX: 0.5, originY: 1 }}
            animate={ANIM[poseFinal] || ANIM.default}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
