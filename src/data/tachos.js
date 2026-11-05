// Los 4 tachos según el código de colores peruano (NTP 900.058).
export const TACHOS = [
  {
    id: 'aprovechable',
    color: '#2E9E4F',
    oscuro: '#1f7438',
    nombre: 'Tacho verde',
    sub: 'Se recicla',
    icono: '♻️',
    que: 'Plástico limpio, papel, cartón, vidrio y latas',
    presentacion:
      'Este es el tacho verde. Aquí van las cosas que se reciclan: botellas, papel, cartón, vidrio y latas. ¡Siempre limpios!',
  },
  {
    id: 'organico',
    color: '#8B5A2B',
    oscuro: '#69421d',
    nombre: 'Tacho marrón',
    sub: 'Orgánico',
    icono: '🍌',
    que: 'Cáscaras, restos de comida y hojas',
    presentacion:
      'Este es el tacho marrón. Aquí van las cáscaras, los restos de comida y las hojas. ¡Se convierten en abono para las plantas!',
  },
  {
    id: 'no_aprovechable',
    color: '#2B2B2B',
    oscuro: '#111111',
    nombre: 'Tacho negro',
    sub: 'No se recicla',
    icono: '🗑️',
    que: 'Envolturas sucias, papel higiénico, tecnopor sucio y chicle',
    presentacion:
      'Este es el tacho negro. Aquí va lo que ya no se puede reciclar: envolturas sucias, papel higiénico, chicle y tecnopor con comida.',
  },
  {
    id: 'peligroso',
    color: '#D93A3A',
    oscuro: '#a82626',
    nombre: 'Tacho rojo',
    sub: '¡Peligroso!',
    icono: '⚠️',
    que: 'Pilas, focos, medicinas, aerosoles y celulares viejos',
    presentacion:
      'Y este es el tacho rojo. ¡Cuidado! Aquí van las cosas peligrosas: pilas, focos, medicinas, aerosoles y celulares viejos. Siempre con ayuda de un adulto.',
  },
];

export const TACHO_POR_ID = Object.fromEntries(TACHOS.map((t) => [t.id, t]));
