import { motion } from 'framer-motion';
import { TACHO_POR_ID } from '../data/tachos.js';

/** Tarjeta educativa de un residuo (imagen + datos). */
export default function TarjetaResiduo({ residuo, compacta = false, children }) {
  const tacho = TACHO_POR_ID[residuo.tacho];
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0, y: 30 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0.85, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 240, damping: 20 }}
      className="panel overflow-hidden w-full max-w-md"
      style={{ borderColor: tacho.color }}
    >
      <div
        className="relative flex items-center gap-3 px-4 py-3 text-white"
        style={{ background: `linear-gradient(135deg, ${tacho.color}, ${tacho.oscuro})` }}
      >
        <div className="shrink-0 rounded-2xl bg-white/95 p-1.5 shadow-inner">
          <img src={residuo.img} alt="" className={`${compacta ? 'w-14 h-14' : 'w-20 h-20'} object-contain`} />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-xl sm:text-2xl font-extrabold leading-tight texto-sombra">{residuo.nombre}</h3>
          <p className="font-bold opacity-95">
            {tacho.nombre} · {tacho.sub}
          </p>
        </div>
        <img src={tacho.img} alt="" className="h-14 sm:h-16 w-auto shrink-0 sprite" />
      </div>
      <div className="tejido h-2" />
      <ul className="p-4 space-y-2 text-[0.98rem] sm:text-base leading-snug">
        <li className="flex gap-2">
          <span className="shrink-0 rounded-lg bg-amber-100 px-2 font-extrabold">Tarda</span>
          <span>{residuo.tiempo}</span>
        </li>
        <li className="flex gap-2">
          <span className="shrink-0 rounded-lg bg-sky-100 px-2 font-extrabold">Dato</span>
          <span>{residuo.dato}</span>
        </li>
        {!compacta && (
          <li className="flex gap-2">
            <span className={`shrink-0 rounded-lg px-2 font-extrabold ${residuo.tacho === 'peligroso' ? 'bg-red-100' : 'bg-green-100'}`}>
              {residuo.tacho === 'peligroso' ? 'Ojo' : 'Idea'}
            </span>
            <span>{residuo.reutilizar}</span>
          </li>
        )}
      </ul>
      {children && <div className="px-4 pb-5 flex justify-center gap-3 flex-wrap">{children}</div>}
    </motion.div>
  );
}
