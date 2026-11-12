import { createContext, useContext, useEffect, useMemo, useReducer } from 'react';
import { INSIGNIAS } from '../data/insignias.js';
import { TOTAL_NIVELES } from '../data/niveles.js';

const CLAVE = 'wari_progreso_v2';

const estrellasVacias = () => Object.fromEntries(Array.from({ length: TOTAL_NIVELES }, (_, i) => [i + 1, 0]));

export const ESTADO_INICIAL = {
  version: 2,
  nivelDesbloqueado: 1,
  estrellas: estrellasVacias(),
  semillas: 0,
  insignias: [],
  deco: [], // [{ id, x, y }] en % sobre la escena de Mi laguna
  album: [],
  escenasVistas: [],
  juegoTerminado: false,
  stats: {
    aciertos: 0,
    aprovechable: 0,
    organico: 0,
    no_aprovechable: 0,
    peligroso: 0,
    escaneos: 0,
    quizPerfecto: false,
  },
  ajustes: { voz: true, sonido: true, textoGrande: false },
  nuevas: [], // insignias recién ganadas (no se guarda)
};

export function nivelesCompletos(estado) {
  return Object.values(estado.estrellas).filter((x) => x > 0).length;
}

function cargar() {
  try {
    const crudo = localStorage.getItem(CLAVE);
    if (!crudo) return ESTADO_INICIAL;
    const g = JSON.parse(crudo);
    return {
      ...ESTADO_INICIAL,
      ...g,
      estrellas: { ...estrellasVacias(), ...(g.estrellas || {}) },
      stats: { ...ESTADO_INICIAL.stats, ...(g.stats || {}) },
      ajustes: { ...ESTADO_INICIAL.ajustes, ...(g.ajustes || {}) },
      deco: Array.isArray(g.deco) ? g.deco : [],
      nuevas: [],
    };
  } catch {
    return ESTADO_INICIAL;
  }
}

function guardar(estado) {
  try {
    // eslint-disable-next-line no-unused-vars
    const { nuevas, ...resto } = estado;
    localStorage.setItem(CLAVE, JSON.stringify(resto));
  } catch {
    /* sin almacenamiento: el juego sigue funcionando */
  }
}

function revisarInsignias(estado) {
  const vista = { ...estado, nivelesCompletos: nivelesCompletos(estado) };
  const ganadas = INSIGNIAS.filter((i) => !estado.insignias.includes(i.id) && i.cumple(vista)).map((i) => i.id);
  if (!ganadas.length) return estado;
  return { ...estado, insignias: [...estado.insignias, ...ganadas], nuevas: [...estado.nuevas, ...ganadas] };
}

function reductor(estado, a) {
  switch (a.tipo) {
    case 'ACIERTO': {
      const r = a.residuo;
      return {
        ...estado,
        semillas: estado.semillas + 1,
        album: estado.album.includes(r.id) ? estado.album : [...estado.album, r.id],
        stats: { ...estado.stats, aciertos: estado.stats.aciertos + 1, [r.tacho]: (estado.stats[r.tacho] || 0) + 1 },
      };
    }
    case 'SEMILLAS':
      return { ...estado, semillas: estado.semillas + a.cantidad };
    case 'ESCANEO':
      return { ...estado, stats: { ...estado.stats, escaneos: estado.stats.escaneos + 1 } };
    case 'COMPLETAR_NIVEL':
      return {
        ...estado,
        semillas: estado.semillas + 3,
        nivelDesbloqueado: Math.max(estado.nivelDesbloqueado, Math.min(a.nivel + 1, TOTAL_NIVELES)),
        estrellas: { ...estado.estrellas, [a.nivel]: Math.max(estado.estrellas[a.nivel] || 0, a.estrellas) },
        stats: { ...estado.stats, quizPerfecto: estado.stats.quizPerfecto || !!a.perfecto },
      };
    case 'TERMINAR_JUEGO':
      return { ...estado, juegoTerminado: true };
    case 'VER_ESCENA':
      return estado.escenasVistas.includes(a.id) ? estado : { ...estado, escenasVistas: [...estado.escenasVistas, a.id] };
    case 'COMPRAR_DECO': {
      if (estado.semillas < a.precio) return estado;
      return {
        ...estado,
        semillas: estado.semillas - a.precio,
        deco: [...estado.deco, { id: a.id, x: 15 + Math.random() * 70, y: 56 + Math.random() * 16 }],
      };
    }
    case 'MOVER_DECO':
      return { ...estado, deco: estado.deco.map((d, i) => (i === a.indice ? { ...d, x: a.x, y: a.y } : d)) };
    case 'QUITAR_DECO':
      return {
        ...estado,
        semillas: estado.semillas + (a.precio || 0),
        deco: estado.deco.filter((_, i) => i !== a.indice),
      };
    case 'AJUSTE':
      return { ...estado, ajustes: { ...estado.ajustes, [a.clave]: a.valor } };
    case 'VER_INSIGNIA':
      return { ...estado, nuevas: estado.nuevas.slice(1) };
    case 'BORRAR':
      return { ...ESTADO_INICIAL, ajustes: estado.ajustes };
    default:
      return estado;
  }
}

const SIN_INSIGNIAS = new Set(['BORRAR', 'VER_INSIGNIA', 'AJUSTE', 'VER_ESCENA', 'MOVER_DECO']);

function reductorConInsignias(estado, accion) {
  const siguiente = reductor(estado, accion);
  return SIN_INSIGNIAS.has(accion.tipo) ? siguiente : revisarInsignias(siguiente);
}

const ProgresoContext = createContext(null);

export function ProgresoProvider({ children }) {
  const [estado, dispatch] = useReducer(reductorConInsignias, undefined, cargar);

  useEffect(() => {
    guardar(estado);
  }, [estado]);

  const valor = useMemo(() => {
    const completos = nivelesCompletos(estado);
    return {
      estado,
      completos,
      limpieza: Math.min(100, completos * 10),
      acierto: (residuo) => dispatch({ tipo: 'ACIERTO', residuo }),
      sumarSemillas: (cantidad) => dispatch({ tipo: 'SEMILLAS', cantidad }),
      escaneo: () => dispatch({ tipo: 'ESCANEO' }),
      completarNivel: (nivel, estrellas, perfecto = false) => dispatch({ tipo: 'COMPLETAR_NIVEL', nivel, estrellas, perfecto }),
      terminarJuego: () => dispatch({ tipo: 'TERMINAR_JUEGO' }),
      verEscena: (id) => dispatch({ tipo: 'VER_ESCENA', id }),
      comprarDeco: (id, precio) => dispatch({ tipo: 'COMPRAR_DECO', id, precio }),
      moverDeco: (indice, x, y) => dispatch({ tipo: 'MOVER_DECO', indice, x, y }),
      quitarDeco: (indice, precio) => dispatch({ tipo: 'QUITAR_DECO', indice, precio }),
      ajustar: (clave, valor) => dispatch({ tipo: 'AJUSTE', clave, valor }),
      verInsignia: () => dispatch({ tipo: 'VER_INSIGNIA' }),
      borrar: () => dispatch({ tipo: 'BORRAR' }),
    };
  }, [estado]);

  return <ProgresoContext.Provider value={valor}>{children}</ProgresoContext.Provider>;
}

export function useProgreso() {
  const ctx = useContext(ProgresoContext);
  if (!ctx) throw new Error('useProgreso debe usarse dentro de ProgresoProvider');
  return ctx;
}
