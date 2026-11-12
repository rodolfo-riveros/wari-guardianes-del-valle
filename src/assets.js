// Rutas a las imágenes del juego (carpeta public/img). Funciona en dev, build y subcarpetas.
const BASE = import.meta.env.BASE_URL;

export const img = (ruta) => `${BASE}img/${ruta}.webp`;
export const personaje = (nombre) => img(`personajes/${nombre}`);
export const escena = (nombre) => img(`escenas/${nombre}`);
export const ui = (nombre) => img(`ui/${nombre}`);

const cache = new Map();
/** Precarga imágenes y avisa el avance (0 a 1). */
export function precargar(rutas, onAvance) {
  let listas = 0;
  return Promise.all(
    rutas.map(
      (src) =>
        new Promise((ok) => {
          const fin = () => {
            listas += 1;
            onAvance?.(listas / rutas.length);
            ok();
          };
          if (cache.has(src)) return fin();
          const im = new Image();
          im.onload = fin;
          im.onerror = fin;
          im.src = src;
          cache.set(src, im);
        }),
    ),
  );
}
