import { motion, useAnimationControls } from 'framer-motion';
import { useEffect } from 'react';
import Icono from './Icono.jsx';

/**
 * Tacho con "boquita" (tapa) que se abre al recibir un residuo.
 * - abierto: la tapa queda entreabierta (p. ej. cuando arrastras encima)
 * - pulso: número que, al cambiar, hace la animación de "¡ñam!"
 * - brillar: brilla para dar una pista
 */
export default function Tacho({ tacho, abierto = false, pulso = 0, brillar = false, size = 96, mostrarNombre = true }) {
  const tapa = useAnimationControls();
  const cuerpo = useAnimationControls();

  useEffect(() => {
    if (!pulso) return;
    tapa.start({ rotate: [0, -40, -40, 0], transition: { duration: 0.7, times: [0, 0.2, 0.7, 1] } });
    cuerpo.start({ scale: [1, 1.12, 0.95, 1], transition: { duration: 0.6 } });
  }, [pulso, tapa, cuerpo]);

  useEffect(() => {
    tapa.start({ rotate: abierto ? -28 : 0, transition: { type: 'spring', stiffness: 260, damping: 16 } });
  }, [abierto, tapa]);

  return (
    <div className="flex flex-col items-center select-none">
      <motion.div
        className="relative rounded-3xl"
        animate={
          brillar
            ? { boxShadow: [`0 0 0px 0px ${tacho.color}00`, `0 0 26px 10px ${tacho.color}`, `0 0 0px 0px ${tacho.color}00`] }
            : { boxShadow: '0 0 0px 0px rgba(0,0,0,0)' }
        }
        transition={brillar ? { duration: 1.1, repeat: Infinity } : { duration: 0.3 }}
      >
        <motion.svg animate={cuerpo} viewBox="0 0 100 120" width={size} height={size * 1.2} aria-hidden="true" style={{ overflow: 'visible' }}>
          {/* boca (interior visible al abrir) */}
          <ellipse cx="50" cy="34" rx="36" ry="7" fill="#1a1a1a" />
          {/* cuerpo */}
          <path d="M14 34 L86 34 L79 110 Q78 116 72 116 L28 116 Q22 116 21 110 Z" fill={tacho.color} />
          <path d="M34 44 L36 106 M50 44 L50 106 M66 44 L64 106" stroke="#ffffff" strokeOpacity="0.18" strokeWidth="4" />
          {/* carita */}
          <circle cx="38" cy="54" r="5" fill="#fff" />
          <circle cx="62" cy="54" r="5" fill="#fff" />
          <circle cx="38" cy="55" r="2.6" fill="#111" />
          <circle cx="62" cy="55" r="2.6" fill="#111" />
          <path d="M44 62 Q50 67 56 62" stroke="#fff" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          {/* ícono */}
          <circle cx="50" cy="88" r="16" fill="#fff" />
          <Icono nombre={tacho.icono} x="37" y="75" size="26" />
          {/* tapa */}
          <motion.g animate={tapa} style={{ originX: '4%', originY: '100%' }}>
            <rect x="8" y="22" width="84" height="13" rx="6" fill={tacho.oscuro} />
            <rect x="40" y="14" width="20" height="9" rx="4" fill={tacho.oscuro} />
          </motion.g>
        </motion.svg>
      </motion.div>
      {mostrarNombre && (
        <div className="text-center leading-tight mt-1">
          <div className="font-extrabold text-[0.8rem] sm:text-base" style={{ color: tacho.id === 'no_aprovechable' ? '#111' : tacho.oscuro }}>
            {tacho.nombre}
          </div>
          <div className="text-[0.72rem] sm:text-sm font-bold text-stone-700">{tacho.sub}</div>
        </div>
      )}
    </div>
  );
}
