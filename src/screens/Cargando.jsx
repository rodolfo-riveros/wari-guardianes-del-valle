import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { precargar, escena, ui, img } from '../assets.js';
import { TODAS_LAS_POSES } from '../data/personajes.js';
import { TACHOS } from '../data/tachos.js';
import { RESIDUOS } from '../data/residuos.js';

const ESENCIALES = [
  escena('laguna_sucia'),
  escena('laguna_limpia'),
  escena('mapa'),
  ...TODAS_LAS_POSES,
  ...TACHOS.map((t) => t.img),
  ...['semilla', 'estrella', 'candado', 'play', 'altavoz', 'check', 'cofre', 'ajustes', 'mapa'].map(ui),
];
const RESTO = [...['mercado', 'rio', 'escuela', 'nevado'].map(escena), ...RESIDUOS.map((r) => r.img), img('deco/trucha')];

/** Pantalla de carga: precarga las imágenes principales antes de empezar. */
export default function Cargando({ ir }) {
  const [avance, setAvance] = useState(0);

  useEffect(() => {
    let vivo = true;
    precargar(ESENCIALES, (a) => vivo && setAvance(a)).then(() => {
      if (!vivo) return;
      precargar(RESTO); // el resto sigue cargando en segundo plano
      setTimeout(() => vivo && ir('inicio'), 350);
    });
    return () => {
      vivo = false;
    };
  }, [ir]);

  return (
    <div className="fixed inset-0 grid place-items-center bg-gradient-to-b from-[#0f3b4f] to-[#1d6a92] p-6">
      <div className="w-full max-w-md text-center">
        <h1 className="titulo-juego text-5xl sm:text-6xl font-extrabold">Wari</h1>
        <p className="titulo-juego text-2xl sm:text-3xl font-extrabold mb-8">y los Guardianes del Valle</p>
        <div className="h-7 rounded-full bg-black/40 border-4 border-[#f2c14e] overflow-hidden">
          <motion.div className="h-full bg-gradient-to-r from-[#6ee08a] to-[#2e9e4f]" animate={{ width: `${Math.round(avance * 100)}%` }} />
        </div>
        <p className="text-white font-bold mt-3">Preparando el valle… {Math.round(avance * 100)} %</p>
      </div>
    </div>
  );
}
