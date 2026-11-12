import { motion } from 'framer-motion';
import { escena } from '../assets.js';

/**
 * Fondo de escena a pantalla completa.
 * Si el fondo es la laguna, `limpieza` (0–100) mezcla la laguna sucia con la limpia.
 */
export default function Escena({ fondo = 'laguna_sucia', limpieza, oscurecer = 0, className = '', fijo = true, children }) {
  const esLaguna = fondo === 'laguna_sucia' || fondo === 'laguna_limpia';
  const mezcla = esLaguna && typeof limpieza === 'number' ? Math.max(0, Math.min(1, limpieza / 100)) : fondo === 'laguna_limpia' ? 1 : 0;
  const base = esLaguna ? 'laguna_sucia' : fondo;

  return (
    <div className={`${fijo ? 'fixed' : 'absolute'} inset-0 overflow-hidden ${className}`} aria-hidden="true">
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1.08 }}
        animate={{ scale: 1 }}
        transition={{ duration: 8, ease: 'easeOut' }}
      >
        <img src={escena(base)} alt="" className="absolute inset-0 w-full h-full object-cover" />
        {esLaguna && (
          <img
            src={escena('laguna_limpia')}
            alt=""
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-[1500ms]"
            style={{ opacity: mezcla }}
          />
        )}
      </motion.div>
      {oscurecer > 0 && <div className="absolute inset-0 bg-black" style={{ opacity: oscurecer }} />}
      {children}
    </div>
  );
}
