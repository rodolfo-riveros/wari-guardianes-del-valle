import { motion } from 'framer-motion';
import ResiduoIcon from './ResiduoIcon.jsx';
import Icono from './Icono.jsx';
import { TACHO_POR_ID } from '../data/tachos.js';

/** Tarjeta educativa de un residuo. */
export default function TarjetaResiduo({ residuo, compacta = false, children }) {
  const tacho = TACHO_POR_ID[residuo.tacho];
  return (
    <motion.div
      initial={{ scale: 0.85, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0.85, opacity: 0 }}
      className="tarjeta overflow-hidden w-full max-w-md"
      style={{ borderColor: tacho.color }}
    >
      <div className="flex items-center gap-3 px-4 py-3 text-white" style={{ background: tacho.color }}>
        <div className="bg-white rounded-2xl p-1 shrink-0">
          <ResiduoIcon residuo={residuo} size={compacta ? 48 : 64} />
        </div>
        <div className="min-w-0">
          <h3 className="text-xl font-extrabold leading-tight">{residuo.nombre}</h3>
          <p className="text-base font-bold opacity-95">
            <Icono nombre={tacho.icono} className="bg-white rounded-full p-0.5" /> {tacho.nombre} · {tacho.sub}
          </p>
        </div>
      </div>
      <div className="tejido h-2" />
      <ul className="p-4 space-y-2 text-[1rem] leading-snug">
        <li>
          <span className="font-extrabold"><Icono nombre="reloj" /> Tarda en desaparecer:</span> {residuo.tiempo}
        </li>
        <li>
          <span className="font-extrabold"><Icono nombre="idea" /> ¿Sabías que…?</span> {residuo.dato}
        </li>
        {!compacta && (
          <li>
            <span className="font-extrabold"><Icono nombre={residuo.tacho === 'peligroso' ? 'familia' : 'reciclar'} /> {residuo.tacho === 'peligroso' ? 'Qué hacer:' : 'Idea:'}</span>{' '}
            {residuo.reutilizar}
          </li>
        )}
      </ul>
      {children && <div className="px-4 pb-4 flex justify-center gap-3 flex-wrap">{children}</div>}
    </motion.div>
  );
}
