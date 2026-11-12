import { motion } from 'framer-motion';
import { useEffect } from 'react';
import Modal from './Modal.jsx';
import Personaje from './Personaje.jsx';
import Dialogo from './Dialogo.jsx';
import Confeti from './Confeti.jsx';
import { INSIGNIAS } from '../data/insignias.js';
import { useProgreso } from '../context/ProgresoContext.jsx';
import { useSonidos } from '../hooks/useSonidos.js';

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
          initial={{ scale: 0.5, rotate: -8 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 14 }}
          className="panel relative w-full max-w-sm p-5 text-center overflow-hidden"
        >
          <Confeti cantidad={28} alto={600} />
          <p className="relative text-xl font-extrabold text-[#c2185b]">¡Insignia nueva!</p>
          <div className="relative my-2 grid place-items-center h-40">
            <motion.div
              className="absolute w-48 h-48 rounded-full"
              style={{ background: 'conic-gradient(from 0deg, #ffe08a55, #ffffff00 15%, #ffe08a55 30%, #ffffff00 45%, #ffe08a55 60%, #ffffff00 75%, #ffe08a55 90%, #ffffff00)' }}
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
            />
            <motion.img
              src={insignia.img}
              alt=""
              className="relative h-36 w-36 object-contain sprite"
              animate={{ scale: [1, 1.08, 1], rotate: [0, -4, 4, 0] }}
              transition={{ duration: 1.6, repeat: Infinity }}
            />
          </div>
          <h2 className="relative text-3xl font-extrabold leading-tight">{insignia.nombre}</h2>
          <p className="relative text-base text-stone-600 mb-1">{insignia.como}</p>
          <div className="relative flex items-end gap-2 text-left">
            <Personaje quien="wari" pose="celebrando" alto={110} />
            <Dialogo texto={`¡Ganaste "${insignia.nombre}"! ¡Eres increíble, guardián!`} className="flex-1 mb-3 !py-2" />
          </div>
          <button type="button" className="btn btn-verde btn-grande mt-3 w-full relative" onClick={verInsignia}>
            ¡Genial!
          </button>
        </motion.div>
      )}
    </Modal>
  );
}
