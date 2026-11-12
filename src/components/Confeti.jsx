import { motion } from 'framer-motion';

const COLORES = ['#d6336c', '#f2b12e', '#2E9E4F', '#2a8bbf', '#8b5cf6', '#ff7a45'];

/** Lluvia de confeti decorativa (no bloquea toques). */
export default function Confeti({ cantidad = 36, alto = 700 }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {Array.from({ length: cantidad }).map((_, i) => (
        <motion.span
          key={i}
          className="absolute rounded-sm"
          style={{
            left: `${(i * 37) % 100}%`,
            top: -20,
            width: 8 + (i % 3) * 3,
            height: 12 + (i % 4) * 2,
            background: COLORES[i % COLORES.length],
          }}
          animate={{ y: [0, alto], rotate: [0, 360 + i * 20], x: [0, (i % 2 ? 1 : -1) * 30] }}
          transition={{ duration: 2.2 + (i % 5) * 0.35, repeat: Infinity, delay: (i % 9) * 0.18, ease: 'linear' }}
        />
      ))}
    </div>
  );
}
