import { personaje } from '../assets.js';

// Reparto de la historia. `voz` ajusta el tono de speechSynthesis para cada personaje.
export const PERSONAJES = {
  wari: {
    nombre: 'Wari',
    color: '#d6336c',
    voz: { pitch: 1.35, rate: 1 },
    poses: {
      saludando: personaje('wari_saludando'),
      feliz: personaje('wari_feliz'),
      celebrando: personaje('wari_celebrando'),
      pensando: personaje('wari_pensando'),
      seria: personaje('wari_seria'),
      preocupada: personaje('wari_preocupada'),
      heroica: personaje('wari_heroica'),
      durmiendo: personaje('wari_durmiendo'),
    },
  },
  kuntur: {
    nombre: 'Apu Kuntur',
    color: '#3b3b3b',
    voz: { pitch: 0.6, rate: 0.88 },
    poses: { normal: personaje('kuntur') },
  },
  tika: {
    nombre: 'Tika',
    color: '#c2185b',
    voz: { pitch: 1.6, rate: 1.05 },
    poses: { normal: personaje('tika') },
  },
  chura: {
    nombre: "Ch'ura",
    color: '#6d6d4a',
    voz: { pitch: 0.4, rate: 0.85 },
    poses: { normal: personaje('chura'), bueno: personaje('chura_bueno') },
  },
};

export function imagenDe(quien, pose) {
  const p = PERSONAJES[quien];
  if (!p) return null;
  return p.poses[pose] || Object.values(p.poses)[0];
}

export const TODAS_LAS_POSES = Object.values(PERSONAJES).flatMap((p) => Object.values(p.poses));
