export const NIVELES = [
  { n: 1, nombre: 'Wari me enseña', icono: 'birrete', desc: 'Conoce los 4 tachos', pantalla: 'nivel1' },
  { n: 2, nombre: 'La orilla sucia', icono: 'laguna', desc: 'Limpia la orilla de la laguna', pantalla: 'nivel2' },
  { n: 3, nombre: '¿Cuánto tarda?', icono: 'reloj', desc: 'Quiz del tiempo y las ideas', pantalla: 'nivel3' },
  { n: 4, nombre: 'Escáner del Guardián', icono: 'camara', desc: 'Usa la cámara con un residuo real', pantalla: 'nivel4' },
];

export function estrellasPorErrores(errores) {
  if (errores <= 1) return 3;
  if (errores <= 4) return 2;
  return 1;
}
