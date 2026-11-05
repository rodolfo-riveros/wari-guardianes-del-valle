import { motion } from 'framer-motion';
import { useEffect } from 'react';
import Modal from './Modal.jsx';
import Wari from './Wari.jsx';
import Icono from './Icono.jsx';
import Dialogo from './Dialogo.jsx';
import { INSIGNIAS } from '../data/insignias.js';
import { useProgreso } from '../context/ProgresoContext.jsx';
import { useSonidos } from '../hooks/useSonidos.js';

const COLORES = ['#d6336c', '#e0a63a', '#2E9E4F', '#2a8bbf', '#8b5cf6'];

/** Muestra, una por una, las insignias recién ganadas. */
export default function ModalInsignia() {
  const { estado, verInsignia } = useProgreso();
  const sonidos = useSonidos();
  const id = estado.nuevas[0];
  const insignia = INSIGNIAS.find((i) => i.id === id);

  useEffect(() => {
    if (insignia) sonidos.fiesta();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <Modal abierto={!!insignia} onCerrar={verInsignia} etiqueta="¡Insignia nueva!">
      {insignia && (
        <motion.div
          key={insignia.id}
          initial={{ scale: 0.6, rotate: -6 }}
          animate={{ scale: 1, rotate: 0 }}
          className="tarjeta relative w-full max-w-sm p-5 text-center overflow-hidden"
        >
          {Array.from({ length: 24 }).map((_, i) => (
            <motion.span
              key={i}
              className="absolute w-2.5 h-3.5 rounded-sm pointer-events-none"
              style={{ left: `${(i * 41) % 100}%`, top: -12, background: COLORES[i % COLORES.length] }}
              animate={{ y: [0, 520], rotate: [0, 540] }}
              transition={{ duration: 2.4 + (i % 5) * 0.3, repeat: Infinity, delay: (i % 7) * 0.2, ease: 'linear' }}
            />
          ))}
          <p className="text-lg font-extrabold text-cantuta">¡Insignia nueva!</p>
          <motion.div
            className="my-2 flex justify-center"
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 1.2, repeat: Infinity }}
            aria-hidden="true"
          >
            <Icono nombre={insignia.icono} size={100} />
          </motion.div>
          <h2 className="text-3xl font-extrabold">{insignia.nombre}</h2>
          <p className="text-base text-stone-600 mb-2">{insignia.como}</p>
          <div className="flex items-end justify-center gap-2">
            <Wari mood="celebrando" size={110} />
          </div>
          <Dialogo texto={`¡Ganaste la insignia ${insignia.nombre}! ¡Eres increíble, guardián!`} className="mt-2 text-left" />
          <button type="button" className="btn btn-primario mt-4 w-full" onClick={verInsignia}>
            ¡Genial!
          </button>
        </motion.div>
      )}
    </Modal>
  );
}
