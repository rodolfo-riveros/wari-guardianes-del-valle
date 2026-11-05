import { createContext, useContext, useEffect, useMemo, useReducer } from 'react';
import { INSIGNIAS, limpiezaTotal } from '../data/insignias.js';

const CLAVE = 'wari_progreso_v1';

export const ESTADO_INICIAL = {
  version: 1,
  nivelDesbloqueado: 1, // el nivel más alto que se puede jugar
  estrellas: { 1: 0, 2: 0, 3: 0, 4: 0 },
  limpiezaNiveles: { 1: 0, 2: 0, 3: 0, 4: 0 }, // cada nivel aporta hasta 25 %
  semillas: 0,
  insignias: [],
  comprados: [],
  equipados: [],
  album: [],
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

function cargar() {
  try {
    const crudo = localStorage.getItem(CLAVE);
    if (!crudo) return ESTADO_INICIAL;
    const g = JSON.parse(crudo);
    return {
      ...ESTADO_INICIAL,
      ...g,
      estrellas: { ...ESTADO_INICIAL.estrellas, ...(g.estrellas || {}) },
      limpiezaNiveles: { ...ESTADO_INICIAL.limpiezaNiveles, ...(g.limpiezaNiveles || {}) },
      stats: { ...ESTADO_INICIAL.stats, ...(g.stats || {}) },
      ajustes: { ...ESTADO_INICIAL.ajustes, ...(g.ajustes || {}) },
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
    /* sin almacenamiento disponible: el juego sigue funcionando */
  }
}

function revisarInsignias(estado) {
  const ganadas = INSIGNIAS.filter((i) => !estado.insignias.includes(i.id) && i.cumple(estado)).map(
    (i) => i.id,
  );
  if (!ganadas.length) return estado;
  return {
    ...estado,
    insignias: [...estado.insignias, ...ganadas],
    nuevas: [...estado.nuevas, ...ganadas],
  };
}

function reductor(estado, accion) {
  switch (accion.tipo) {
    case 'ACIERTO': {
      const r = accion.residuo;
      return {
        ...estado,
        semillas: estado.semillas + 1,
        album: estado.album.includes(r.id) ? estado.album : [...estado.album, r.id],
        stats: {
          ...estado.stats,
          aciertos: estado.stats.aciertos + 1,
          [r.tacho]: (estado.stats[r.tacho] || 0) + 1,
        },
      };
    }
    case 'SEMILLAS':
      return { ...estado, semillas: estado.semillas + accion.cantidad };
    case 'ESCANEO':
      return { ...estado, stats: { ...estado.stats, escaneos: estado.stats.escaneos + 1 } };
    case 'COMPLETAR_NIVEL': {
      const n = accion.nivel;
      return {
        ...estado,
        semillas: estado.semillas + 3,
        nivelDesbloqueado: Math.max(estado.nivelDesbloqueado, Math.min(n + 1, 4)),
        estrellas: { ...estado.estrellas, [n]: Math.max(estado.estrellas[n] || 0, accion.estrellas) },
        limpiezaNiveles: { ...estado.limpiezaNiveles, [n]: 25 },
        stats: {
          ...estado.stats,
          quizPerfecto: estado.stats.quizPerfecto || !!accion.perfecto,
        },
      };
    }
    case 'COMPRAR': {
      if (estado.comprados.includes(accion.id) || estado.semillas < accion.precio) return estado;
      return {
        ...estado,
        semillas: estado.semillas - accion.precio,
        comprados: [...estado.comprados, accion.id],
        equipados: [...estado.equipados, accion.id],
      };
    }
    case 'EQUIPAR': {
      if (!estado.comprados.includes(accion.id)) return estado;
      const puesto = estado.equipados.includes(accion.id);
      return {
        ...estado,
        equipados: puesto
          ? estado.equipados.filter((x) => x !== accion.id)
          : [...estado.equipados, accion.id],
      };
    }
    case 'AJUSTE':
      return { ...estado, ajustes: { ...estado.ajustes, [accion.clave]: accion.valor } };
    case 'VER_INSIGNIA':
      return { ...estado, nuevas: estado.nuevas.slice(1) };
    case 'BORRAR':
      return { ...ESTADO_INICIAL, ajustes: estado.ajustes };
    default:
      return estado;
  }
}

function reductorConInsignias(estado, accion) {
  const siguiente = reductor(estado, accion);
  if (accion.tipo === 'BORRAR' || accion.tipo === 'VER_INSIGNIA' || accion.tipo === 'AJUSTE') {
    return siguiente;
  }
  return revisarInsignias(siguiente);
}

const ProgresoContext = createContext(null);

export function ProgresoProvider({ children }) {
  const [estado, dispatch] = useReducer(reductorConInsignias, undefined, cargar);

  useEffect(() => {
    guardar(estado);
  }, [estado]);

  const valor = useMemo(
    () => ({
      estado,
      limpieza: limpiezaTotal(estado),
      acierto: (residuo) => dispatch({ tipo: 'ACIERTO', residuo }),
      sumarSemillas: (cantidad) => dispatch({ tipo: 'SEMILLAS', cantidad }),
      escaneo: () => dispatch({ tipo: 'ESCANEO' }),
      completarNivel: (nivel, estrellas, perfecto = false) =>
        dispatch({ tipo: 'COMPLETAR_NIVEL', nivel, estrellas, perfecto }),
      comprar: (id, precio) => dispatch({ tipo: 'COMPRAR', id, precio }),
      equipar: (id) => dispatch({ tipo: 'EQUIPAR', id }),
      ajustar: (clave, valor) => dispatch({ tipo: 'AJUSTE', clave, valor }),
      verInsignia: () => dispatch({ tipo: 'VER_INSIGNIA' }),
      borrar: () => dispatch({ tipo: 'BORRAR' }),
    }),
    [estado],
  );

  return <ProgresoContext.Provider value={valor}>{children}</ProgresoContext.Provider>;
}

export function useProgreso() {
  const ctx = useContext(ProgresoContext);
  if (!ctx) throw new Error('useProgreso debe usarse dentro de ProgresoProvider');
  return ctx;
}
