import { AnimatePresence, MotionConfig, motion } from 'framer-motion';
import { useCallback, useEffect, useState } from 'react';
import { useProgreso } from './context/ProgresoContext.jsx';
import { useVoz } from './hooks/useVoz.js';
import ModalInsignia from './components/ModalInsignia.jsx';
import Protector from './components/Protector.jsx';
import { escenaAntes, escenaDespues } from './data/historia.js';
import Cargando from './screens/Cargando.jsx';
import Inicio from './screens/Inicio.jsx';
import Mapa from './screens/Mapa.jsx';
import Historia from './screens/Historia.jsx';
import Nivel from './screens/Nivel.jsx';
import Resultado from './screens/Resultado.jsx';
import MiLaguna from './screens/MiLaguna.jsx';
import Album from './screens/Album.jsx';
import Insignias from './screens/Insignias.jsx';
import Ajustes from './screens/Ajustes.jsx';
import ParaProfes from './screens/ParaProfes.jsx';
import Creditos from './screens/Creditos.jsx';

const PANTALLAS = {
  cargando: Cargando,
  inicio: Inicio,
  mapa: Mapa,
  historia: Historia,
  nivel: Nivel,
  resultado: Resultado,
  laguna: MiLaguna,
  album: Album,
  insignias: Insignias,
  ajustes: Ajustes,
  profes: ParaProfes,
  creditos: Creditos,
};

export default function App() {
  const { estado } = useProgreso();
  const { callar } = useVoz();
  const [nav, setNav] = useState({ pantalla: 'cargando', params: {}, clave: 0 });

  const ir = useCallback(
    (pantalla, params = {}) => {
      callar();
      setNav((n) => ({ pantalla, params, clave: n.clave + 1 }));
      window.scrollTo(0, 0);
    },
    [callar],
  );

  /** Entra a un nivel, mostrando antes su escena de historia si aún no se vio. */
  const jugarNivel = useCallback(
    (n) => {
      const id = escenaAntes(n);
      if (id && !estado.escenasVistas.includes(id)) ir('historia', { id, luego: { pantalla: 'nivel', params: { n } } });
      else ir('nivel', { n });
    },
    [estado.escenasVistas, ir],
  );

  /** Después del resultado: escena de historia (si toca) y luego el mapa o los créditos. */
  const continuarTras = useCallback(
    (n) => {
      const id = escenaDespues(n);
      const destino = n === 10 ? { pantalla: 'creditos' } : { pantalla: 'mapa', params: { recien: n } };
      if (id && !estado.escenasVistas.includes(id)) ir('historia', { id, luego: destino });
      else ir(destino.pantalla, destino.params);
    },
    [estado.escenasVistas, ir],
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
          transition={{ duration: 0.3 }}
          className="min-h-[100dvh]"
        >
          <Protector key={nav.clave} onReiniciar={() => ir('mapa')}>
            <Pantalla ir={ir} params={nav.params} jugarNivel={jugarNivel} continuarTras={continuarTras} />
          </Protector>
        </motion.div>
      </AnimatePresence>
      {nav.pantalla !== 'historia' && nav.pantalla !== 'cargando' && <ModalInsignia />}
    </MotionConfig>
  );
}
