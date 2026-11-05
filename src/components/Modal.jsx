import { AnimatePresence, motion } from 'framer-motion';
import { useEffect } from 'react';

export default function Modal({ abierto, onCerrar, children, etiqueta = 'Ventana' }) {
  useEffect(() => {
    if (!abierto || !onCerrar) return;
    const tecla = (e) => e.key === 'Escape' && onCerrar();
    window.addEventListener('keydown', tecla);
    return () => window.removeEventListener('keydown', tecla);
  }, [abierto, onCerrar]);

  return (
    <AnimatePresence>
      {abierto && (
        <motion.div
          className="fixed inset-0 z-50 bg-black/45 flex items-center justify-center p-4 overflow-y-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onCerrar}
          role="dialog"
          aria-modal="true"
          aria-label={etiqueta}
        >
          <div onClick={(e) => e.stopPropagation()} className="w-full flex justify-center">
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
