import { img } from '../assets.js';

// "Vivero de Wari": con semillas se compran plantas y animales para poner en Mi laguna.
export const VIVERO = [
  { id: 'cantuta', nombre: 'Cantuta', precio: 3, desc: 'La flor sagrada de los Andes.', tam: 13 },
  { id: 'totora', nombre: 'Totora', precio: 3, desc: 'Junco de las lagunas andinas.', tam: 13 },
  { id: 'queuna', nombre: 'Queñua', precio: 5, desc: 'Árbol de las alturas que cuida el agua.', tam: 20 },
  { id: 'rana', nombre: 'Rana', precio: 5, desc: 'Las ranas solo viven en agua limpia.', tam: 10 },
  { id: 'patos', nombre: 'Familia de patos', precio: 6, desc: 'Mamá pata y sus patitos.', tam: 13 },
  { id: 'trucha', nombre: 'Trucha', precio: 6, desc: '¡Salta feliz en el agua limpia!', tam: 11 },
  { id: 'llama', nombre: 'Llama', precio: 8, desc: 'Amiga del valle con sus borlas.', tam: 16 },
  { id: 'taruca', nombre: 'Taruca', precio: 9, desc: 'Venado andino que casi no se ve.', tam: 15 },
  { id: 'flamenco', nombre: 'Parihuana', precio: 10, desc: 'El flamenco andino, de color rosado.', tam: 16 },
].map((v) => ({ ...v, img: img(`deco/${v.id}`) }));

export const VIVERO_POR_ID = Object.fromEntries(VIVERO.map((v) => [v.id, v]));
