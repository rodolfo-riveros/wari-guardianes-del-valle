import { AnimatePresence, MotionConfig, motion } from 'framer-motion';
import { useCallback, useEffect, useState } from 'react';
import { useProgreso } from './context/ProgresoContext.jsx';
import { useVoz } from './hooks/useVoz.js';
import ModalInsignia from './components/ModalInsignia.jsx';
import Inicio from './screens/Inicio.jsx';
import Mapa from './screens/Mapa.jsx';
import Nivel1 from './screens/Nivel1.jsx';
import Nivel2 from './screens/Nivel2.jsx';
import Nivel3 from './screens/Nivel3.jsx';
import Nivel4 from './screens/Nivel4.jsx';
import Resultado from './screens/Resultado.jsx';
import MiLaguna from './screens/MiLaguna.jsx';
import Album from './screens/Album.jsx';
import Insignias from './screens/Insignias.jsx';
import Tienda from './screens/Tienda.jsx';
import Ajustes from './screens/Ajustes.jsx';
import ParaProfes from './screens/ParaProfes.jsx';

const PANTALLAS = {
  inicio: Inicio,
  mapa: Mapa,
  nivel1: Nivel1,
  nivel2: Nivel2,
  nivel3: Nivel3,
  nivel4: Nivel4,
  resultado: Resultado,
  laguna: MiLaguna,
  album: Album,
  insignias: Insignias,
  tienda: Tienda,
  ajustes: Ajustes,
  profes: ParaProfes,
};

export default function App() {
  const { estado } = useProgreso();
  const { callar } = useVoz();
  const [nav, setNav] = useState({ pantalla: 'inicio', params: {}, clave: 0 });

  const ir = useCallback(
    (pantalla, params = {}) => {
      callar();
      setNav((n) => ({ pantalla, params, clave: n.clave + 1 }));
      window.scrollTo(0, 0);
    },
    [callar],
  );

  useEffect(() => {
    document.documentElement.classList.toggle('texto-grande', estado.ajustes.textoGrande);
  }, [estado.ajustes.textoGrande]);

  const Pantalla = PANTALLAS[nav.pantalla] || Inicio;

  return (
    <MotionConfig reducedMotion="user">
      <AnimatePresence mode="wait">
        <motion.div
          key={nav.clave}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="min-h-[100dvh]"
        >
          <Pantalla ir={ir} params={nav.params} />
        </motion.div>
      </AnimatePresence>
      <ModalInsignia />
    </MotionConfig>
  );
}
