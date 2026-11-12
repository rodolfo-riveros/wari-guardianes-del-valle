import { motion } from 'framer-motion';
import { useEffect } from 'react';
import Escena from '../components/Escena.jsx';
import Personaje from '../components/Personaje.jsx';
import Confeti from '../components/Confeti.jsx';
import { useProgreso } from '../context/ProgresoContext.jsx';
import { useSonidos } from '../hooks/useSonidos.js';
import { ui } from '../assets.js';

/** Final de la aventura. */
export default function Creditos({ ir }) {
  const { terminarJuego, estado } = useProgreso();
  const sonidos = useSonidos();

  useEffect(() => {
    terminarJuego();
    sonidos.fiesta();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const total = Object.values(estado.estrellas).reduce((a, b) => a + b, 0);

  return (
    <div className="relative min-h-[100dvh] overflow-hidden flex flex-col items-center justify-center px-4 py-8">
      <Escena fondo="laguna_limpia" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/50" />
      <Confeti cantidad={50} alto={900} />
      <motion.div initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 120, damping: 12 }} className="relative text-center">
        <p className="titulo-juego text-2xl sm:text-4xl font-extrabold">¡Lo lograste!</p>
        <h1 className="titulo-juego text-5xl sm:text-7xl font-extrabold leading-none mt-1">¡Salvaste el valle!</h1>
      </motion.div>

      <div className="relative flex items-end justify-center gap-1 sm:gap-4 my-4">
        <Personaje quien="tika" alto="clamp(120px, 24vh, 240px)" voltear />
        <Personaje quien="wari" pose="heroica" alto="clamp(170px, 34vh, 340px)" />
        <Personaje quien="chura" pose="bueno" alto="clamp(110px, 22vh, 220px)" />
        <div className="hidden sm:block">
          <Personaje quien="kuntur" alto="clamp(130px, 26vh, 260px)" />
        </div>
      </div>

      <div className="relative panel max-w-lg w-full p-5 text-center">
        <p className="text-xl font-extrabold">Ahora eres un verdadero Guardián del Valle.</p>
        <p className="text-lg font-bold mt-1 inline-flex items-center gap-2">
          Ganaste {total} de 30 <img src={ui('estrella')} alt="estrellas" className="w-8 h-8" />
        </p>
        <p className="mt-2 text-stone-700">Cada vez que separes tu basura en casa o en la escuela, estarás cuidando la laguna de Wari.</p>
        <p className="mt-1 font-extrabold text-[#c2185b]">¡Tupananchiskama! ¡Hasta pronto!</p>
        <div className="flex flex-wrap justify-center gap-3 mt-4">
          <button type="button" className="btn btn-verde" onClick={() => ir('laguna')}>
            Ver mi laguna
          </button>
          <button type="button" className="btn btn-blanco" onClick={() => ir('mapa')}>
            Volver al mapa
          </button>
        </div>
      </div>
    </div>
  );
}
