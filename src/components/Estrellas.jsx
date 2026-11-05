import { motion } from 'framer-motion';

export default function Estrellas({ cantidad = 0, size = 'text-5xl', animar = false }) {
  return (
    <div className={`flex gap-1 ${size}`} role="img" aria-label={`${cantidad} de 3 estrellas`}>
      {[1, 2, 3].map((n) => (
        <motion.span
          key={n}
          initial={animar ? { scale: 0, rotate: -90 } : false}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: animar ? 0.3 + n * 0.3 : 0, type: 'spring', stiffness: 200 }}
          style={{ filter: n <= cantidad ? 'none' : 'grayscale(1) opacity(0.35)' }}
          aria-hidden="true"
        >
          ⭐
        </motion.span>
      ))}
    </div>
  );
}
