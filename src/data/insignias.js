// Insignias. Cada una tiene una condición que se revisa con el progreso actual.
export function limpiezaTotal(estado) {
  return Object.values(estado.limpiezaNiveles).reduce((a, b) => a + b, 0);
}

export const INSIGNIAS = [
  {
    id: 'primer_guardian',
    nombre: 'Primer guardián',
    icono: '🛡️',
    como: 'Clasifica tu primer residuo.',
    cumple: (e) => e.stats.aciertos >= 1,
  },
  {
    id: 'experto_plastico',
    nombre: 'Experto en reciclaje',
    icono: '♻️',
    como: 'Pon 5 residuos en el tacho verde.',
    cumple: (e) => e.stats.aprovechable >= 5,
  },
  {
    id: 'amigo_organico',
    nombre: 'Amigo de lo orgánico',
    icono: '🌽',
    como: 'Pon 5 residuos en el tacho marrón.',
    cumple: (e) => e.stats.organico >= 5,
  },
  {
    id: 'heroe_pilas',
    nombre: 'Héroe de las pilas',
    icono: '🔋',
    como: 'Pon 3 residuos peligrosos en el tacho rojo.',
    cumple: (e) => e.stats.peligroso >= 3,
  },
  {
    id: 'sabio_tiempo',
    nombre: 'Sabio del tiempo',
    icono: '⏳',
    como: 'Responde bien todo el quiz del nivel 3.',
    cumple: (e) => e.stats.quizPerfecto,
  },
  {
    id: 'ojo_condor',
    nombre: 'Ojo de cóndor',
    icono: '🦅',
    como: 'Escanea 3 residuos en el nivel 4.',
    cumple: (e) => e.stats.escaneos >= 3,
  },
  {
    id: 'laguna_limpia',
    nombre: 'Laguna limpia',
    icono: '💧',
    como: 'Deja la laguna 100 % limpia.',
    cumple: (e) => limpiezaTotal(e) >= 100,
  },
  {
    id: 'guardian_total',
    nombre: 'Guardián total',
    icono: '👑',
    como: 'Gana 3 estrellas en los 4 niveles.',
    cumple: (e) => [1, 2, 3, 4].every((n) => e.estrellas[n] === 3),
  },
  {
    id: 'coleccionista',
    nombre: 'Coleccionista',
    icono: '📚',
    como: 'Junta 15 cartitas en tu álbum.',
    cumple: (e) => e.album.length >= 15,
  },
  {
    id: 'wari_moda',
    nombre: 'Wari a la moda',
    icono: '🧣',
    como: 'Compra un accesorio para Wari.',
    cumple: (e) => e.comprados.length >= 1,
  },
];
