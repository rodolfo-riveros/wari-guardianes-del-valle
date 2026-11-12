// 5 capítulos, 10 niveles. Cada nivel limpia un 10 % de la laguna.

export const CAPITULOS = [
  { n: 1, nombre: 'La laguna gris', fondo: 'laguna_sucia' },
  { n: 2, nombre: 'El mercado de Pisac', fondo: 'mercado' },
  { n: 3, nombre: 'El río Vilcanota', fondo: 'rio' },
  { n: 4, nombre: 'La escuela del pueblo', fondo: 'escuela' },
  { n: 5, nombre: 'El corazón del Apu', fondo: 'nevado' },
];

export const NIVELES = [
  {
    n: 1, cap: 1, nombre: 'Los 4 tachos', tipo: 'clasificar', modo: 'tutorial', cantidad: 6, fondo: 'laguna_sucia',
    instruccion: 'Arrastra cada cosa a su tacho. ¡O tócala y luego toca el tacho!',
    mapa: [12, 83],
  },
  {
    n: 2, cap: 1, nombre: 'La orilla sucia', tipo: 'clasificar', modo: 'orilla', cantidad: 10, fondo: 'laguna_sucia',
    instruccion: 'Limpia la orilla: lleva cada basura a su tacho.',
    mapa: [31.6, 82.5],
  },
  {
    n: 3, cap: 2, nombre: 'Lluvia en el mercado', tipo: 'atrapar', cantidad: 12, fondo: 'mercado',
    instruccion: '¡Caen cosas del mercado! Toca el tacho correcto antes de que lleguen al suelo.',
    mapa: [27, 60],
  },
  {
    n: 4, cap: 2, nombre: '¿Cuánto tarda?', tipo: 'quiz', preguntas: ['tiempo', 'tiempo', 'tiempo', 'ideas', 'ideas', 'peligroso', 'tiempo', 'peligroso'],
    anfitrion: 'tika', fondo: 'mercado',
    instruccion: 'Tika te hará preguntas. ¡Toca la respuesta!',
    mapa: [44.5, 69.5],
  },
  {
    n: 5, cap: 3, nombre: 'Rescate en el río', tipo: 'rio', cantidad: 14, fondo: 'rio',
    instruccion: 'Toca la basura que baja por el río antes de que se escape. ¡No toques a las truchas!',
    mapa: [55.5, 56],
  },
  {
    n: 6, cap: 3, nombre: 'Parejas del río', tipo: 'memoria', pares: 6, fondo: 'rio',
    instruccion: 'Voltea dos cartas: junta cada residuo con su tacho.',
    mapa: [72, 77],
  },
  {
    n: 7, cap: 4, nombre: 'Taller de ideas', tipo: 'quiz', preguntas: ['ideas', 'ideas', 'ideas', 'ideas', 'ideas', 'ideas'],
    anfitrion: 'tika', fondo: 'escuela',
    instruccion: '¿Qué podemos crear con esto? ¡Elige la mejor idea!',
    mapa: [75, 45],
  },
  {
    n: 8, cap: 4, nombre: 'Escáner del Guardián', tipo: 'escaner', cantidad: 3, fondo: 'escuela',
    instruccion: 'Busca basura de verdad y muéstrasela a Wari con la cámara.',
    mapa: [63, 31],
  },
  {
    n: 9, cap: 5, nombre: 'Misión peligro', tipo: 'quiz', preguntas: ['adulto', 'adulto', 'peligroso', 'adulto', 'adulto', 'peligroso'],
    anfitrion: 'kuntur', fondo: 'nevado',
    instruccion: '¿Lo puedes botar tú, o debes pedir ayuda a un adulto?',
    mapa: [80, 25],
  },
  {
    n: 10, cap: 5, nombre: "El gran Ch'ura", tipo: 'jefe', cantidad: 14, fondo: 'nevado',
    instruccion: "Ch'ura suelta su basura. ¡Clasifícala rápido para ayudarlo!",
    mapa: [84, 9],
  },
];

export const TOTAL_NIVELES = NIVELES.length;

export function estrellasPorErrores(errores) {
  if (errores <= 1) return 3;
  if (errores <= 4) return 2;
  return 1;
}
