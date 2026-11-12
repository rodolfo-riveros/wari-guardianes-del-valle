import { motion } from 'framer-motion';
import { ui } from '../assets.js';

export default function Estrellas({ cantidad = 0, size = 48, animar = false }) {
  return (
    <div className="flex gap-1 items-end" role="img" aria-label={`${cantidad} de 3 estrellas`}>
      {[1, 2, 3].map((n) => (
        <motion.img
          key={n}
          src={ui('estrella')}
          alt=""
          draggable={false}
          initial={animar ? { scale: 0, rotate: -120 } : false}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: animar ? 0.3 + n * 0.35 : 0, type: 'spring', stiffness: 220, damping: 12 }}
          style={{
            width: n === 2 ? size * 1.2 : size,
            height: n === 2 ? size * 1.2 : size,
            filter: n <= cantidad ? 'drop-shadow(0 3px 4px rgba(0,0,0,.35))' : 'grayscale(1) brightness(0.55) opacity(0.55)',
          }}
        />
      ))}
    </div>
  );
}
