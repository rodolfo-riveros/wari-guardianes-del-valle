import { motion } from 'framer-motion';
import Icono from './Icono.jsx';

export default function Estrellas({ cantidad = 0, size = 48, animar = false }) {
  return (
    <div className="flex gap-1" role="img" aria-label={`${cantidad} de 3 estrellas`}>
      {[1, 2, 3].map((n) => (
        <motion.span
          key={n}
          initial={animar ? { scale: 0, rotate: -90 } : false}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: animar ? 0.3 + n * 0.3 : 0, type: 'spring', stiffness: 200 }}
          className="inline-flex"
        >
          <Icono nombre="estrella" size={size} gris={n > cantidad} />
        </motion.span>
      ))}
    </div>
  );
}
