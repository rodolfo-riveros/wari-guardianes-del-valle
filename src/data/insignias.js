import { img } from '../assets.js';

// Insignias: cada una con su medalla y su condición.
export const INSIGNIAS = [
  { id: 'primer_guardian', nombre: 'Primer guardián', como: 'Clasifica tu primer residuo.', cumple: (e) => e.stats.aciertos >= 1 },
  { id: 'experto_plastico', nombre: 'Experto en reciclaje', como: 'Pon 10 residuos en el tacho verde.', cumple: (e) => e.stats.aprovechable >= 10 },
  { id: 'amigo_organico', nombre: 'Amigo de lo orgánico', como: 'Pon 10 residuos en el tacho marrón.', cumple: (e) => e.stats.organico >= 10 },
  { id: 'heroe_pilas', nombre: 'Héroe de las pilas', como: 'Pon 5 residuos en el tacho rojo.', cumple: (e) => e.stats.peligroso >= 5 },
  { id: 'sabio_tiempo', nombre: 'Sabio del tiempo', como: 'Responde todo bien en un quiz.', cumple: (e) => e.stats.quizPerfecto },
  { id: 'ojo_condor', nombre: 'Ojo de cóndor', como: 'Escanea 3 residuos con la cámara.', cumple: (e) => e.stats.escaneos >= 3 },
  { id: 'laguna_limpia', nombre: 'Laguna limpia', como: 'Deja la laguna 100 % limpia.', cumple: (e) => e.nivelesCompletos >= 10 },
  { id: 'guardian_total', nombre: 'Guardián total', como: 'Gana 3 estrellas en todos los niveles.', cumple: (e) => Object.values(e.estrellas).filter((x) => x === 3).length >= 10 },
  { id: 'coleccionista', nombre: 'Coleccionista', como: 'Junta 20 cartas en tu álbum.', cumple: (e) => e.album.length >= 20 },
  { id: 'poncho', nombre: 'Poncho del Guardián', como: 'Termina la historia de Wari.', cumple: (e) => e.juegoTerminado },
  { id: 'jardinero', nombre: 'Jardinero del valle', como: 'Pon 5 plantas o animales en tu laguna.', cumple: (e) => e.deco.length >= 5 },
  { id: 'heroe_valle', nombre: 'Héroe del valle', como: 'Llega al pie del gran nevado.', cumple: (e) => e.nivelesCompletos >= 8 },
].map((i) => ({ ...i, img: img(`insignias/${i.id}`) }));
