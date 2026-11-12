// Historia del juego. Cada escena: fondo + líneas de diálogo.
// Línea: { quien: 'wari'|'kuntur'|'tika'|'chura'|'narrador', pose?, texto }
// Regla ética: Wari nunca culpa al niño; la tristeza es solo hacia la basura.

export const HISTORIA = {
  // ───────── CAPÍTULO 1 · La laguna gris ─────────
  prologo: {
    titulo: 'Capítulo 1 · La laguna gris',
    fondo: 'laguna_limpia',
    lineas: [
      { quien: 'narrador', texto: 'En lo alto del Valle Sagrado había una laguna turquesa, donde vivía una vizcacha pequeñita llamada Wari.' },
      { quien: 'wari', pose: 'durmiendo', texto: 'Zzz… mmm… qué rico duermo junto a mi qocha…' },
      { quien: 'narrador', fondo: 'laguna_sucia', texto: 'Pero una noche llovió fuerte, y el agua bajó del pueblo trayendo mucha, mucha basura.' },
      { quien: 'wari', pose: 'preocupada', texto: '¡Achachaw! ¿Qué le pasó a mi laguna? ¡Uy, cuánta basura! Los patos se fueron… y el agua está gris.' },
      { quien: 'wari', pose: 'preocupada', texto: 'Yo quiero limpiarla… pero soy muy pequeña. ¿Qué puede hacer una vizcacha tan chiquita?' },
      { quien: 'kuntur', texto: 'Wari, pequeña. Soy el Apu Kuntur, guardián de estas montañas. Para cuidar la tierra no hay que ser grande: hay que saber.' },
      { quien: 'kuntur', texto: 'Y no estás sola. Mira: llegó un nuevo Guardián del Valle para ayudarte.' },
      { quien: 'wari', pose: 'saludando', texto: '¿Tú? ¡Napaykullayki, guardián! ¿Me ayudas a salvar mi laguna? ¡Juntos podemos!' },
      { quien: 'kuntur', texto: 'Primero deben conocer a los cuatro tachos. Cada basura tiene su casa.' },
    ],
  },
  despues1: {
    fondo: 'laguna_sucia',
    lineas: [
      { quien: 'wari', pose: 'celebrando', texto: '¡Ya me sé los cuatro tachos! Verde, marrón, negro y rojo. ¡Gracias, guardián!' },
      { quien: 'kuntur', texto: 'Bien. Ahora la orilla los necesita. Cada cosa en su tacho, y la laguna volverá a respirar.' },
    ],
  },
  despues2: {
    fondo: 'laguna_sucia',
    limpieza: 20,
    lineas: [
      { quien: 'wari', pose: 'feliz', texto: '¡Mira! La orilla ya está limpia. ¡Sulpayki, guardián!' },
      { quien: 'wari', pose: 'pensando', texto: 'Pero… si limpiamos y sigue llegando basura, la laguna se volverá a ensuciar. ¿De dónde viene?' },
      { quien: 'kuntur', texto: 'Buena pregunta, Wari. La basura baja desde el pueblo, desde el mercado de Pisac. Sigan el camino.' },
      { quien: 'wari', pose: 'seria', texto: 'Me da un poquito de miedo ir tan lejos… pero contigo, guardián, ¡me animo! ¡Haku!' },
    ],
  },

  // ───────── CAPÍTULO 2 · El mercado de Pisac ─────────
  antes3: {
    titulo: 'Capítulo 2 · El mercado de Pisac',
    fondo: 'mercado',
    lineas: [
      { quien: 'narrador', texto: 'Wari y el guardián bajaron por el camino de piedra hasta el colorido mercado del pueblo.' },
      { quien: 'tika', texto: '¡Hola! ¡Una vizcacha con chullo! Yo soy Tika. Mi mamá vende papas y choclos aquí.' },
      { quien: 'wari', pose: 'saludando', texto: '¡Hola, Tika! Yo soy Wari. La basura del mercado está llegando a mi laguna…' },
      { quien: 'tika', texto: '¡Ay, no sabía! Aquí todos botan todo junto, en una sola bolsa. ¿Cómo se hace bien?' },
      { quien: 'wari', pose: 'feliz', texto: '¡Nosotros te enseñamos! Ahora mismo está cayendo de todo de los puestos. ¡Rápido, guardián!' },
    ],
  },
  despues3: {
    fondo: 'mercado',
    lineas: [
      { quien: 'tika', texto: '¡Qué rápidos son! Ahora quiero aprender más. ¿Sabían que algunas cosas tardan muchísimo en desaparecer?' },
      { quien: 'wari', pose: 'pensando', texto: '¿Cuánto tarda una botella? ¿Y una cáscara? Mmm… ¡pregúntanos, Tika!' },
    ],
  },
  despues4: {
    fondo: 'mercado',
    limpieza: 40,
    lineas: [
      { quien: 'tika', texto: '¡Ahora sé un montón! Les voy a enseñar a mi mamá y a las caseras del mercado.' },
      { quien: 'wari', pose: 'feliz', texto: 'Tika, ¿quieres ser guardiana del valle con nosotros?' },
      { quien: 'tika', texto: '¡Sí! Pero miren… por el río Vilcanota sigue bajando basura. ¡Vamos!' },
    ],
  },

  // ───────── CAPÍTULO 3 · El río Vilcanota ─────────
  antes5: {
    titulo: 'Capítulo 3 · El río Vilcanota',
    fondo: 'rio',
    lineas: [
      { quien: 'narrador', texto: 'Los tres amigos llegaron al gran río. El agua corría rápido… y llevaba botellas y bolsas.' },
      { quien: 'wari', pose: 'preocupada', texto: '¡Uy! Toda esa basura va directo a mi laguna. ¡Hay que sacarla antes de que se escape!' },
      { quien: 'tika', texto: '¡Cuidado con las truchas! Ellas viven aquí. ¡Solo saquemos la basura!' },
    ],
  },
  despues5: {
    fondo: 'rio',
    lineas: [
      { quien: 'wari', pose: 'celebrando', texto: '¡Salvamos el río! Las truchas están saltando de alegría.' },
      { quien: 'kuntur', texto: 'Wari, te veo distinta. Ya no tiemblas. Tu corazón se está haciendo grande.' },
      { quien: 'wari', pose: 'feliz', texto: '¡Es que aprendí mucho con el guardián! Apu, ¿nos ayudas a recordar dónde va cada cosa?' },
      { quien: 'kuntur', texto: 'Jueguen a las parejas. La memoria también es un tesoro.' },
    ],
  },
  despues6: {
    fondo: 'rio',
    limpieza: 60,
    lineas: [
      { quien: 'tika', texto: '¡Qué buena memoria! Oigan… en mi escuela nadie sabe nada de esto. ¿Vienen conmigo?' },
      { quien: 'wari', pose: 'pensando', texto: '¿Yo… enseñar a otros niños? Mmm… Antes yo no sabía nada. Pero ahora sí sé. ¡Vamos!' },
    ],
  },

  // ───────── CAPÍTULO 4 · La escuela del pueblo ─────────
  antes7: {
    titulo: 'Capítulo 4 · La escuela del pueblo',
    fondo: 'escuela',
    lineas: [
      { quien: 'narrador', texto: 'En el patio de la escuela, los niños miraban curiosos a la vizcacha del chullo rojo.' },
      { quien: 'wari', pose: 'saludando', texto: '¡Hola, amigos! Soy Wari. Hoy les quiero enseñar algo: ¡la basura puede tener otra vida!' },
      { quien: 'tika', texto: 'En el taller tenemos botellas, latas y cajas. ¿Qué podemos crear con ellas?' },
    ],
  },
  despues7: {
    fondo: 'escuela',
    lineas: [
      { quien: 'tika', texto: '¡Hicimos macetas, lapiceros y juguetes! A todos les encantó.' },
      { quien: 'wari', pose: 'feliz', texto: 'Ahora quiero que busquen basura de verdad en sus casas. ¡Yo la reviso con mis lentes mágicos!' },
    ],
  },
  despues8: {
    fondo: 'escuela',
    limpieza: 80,
    lineas: [
      { quien: 'kuntur', texto: 'Wari. Guardián. Tengo noticias. En lo alto del nevado se ha formado una montaña de basura… y tiene vida.' },
      { quien: 'kuntur', texto: "Se llama Ch'ura. Está gruñón, triste y solo. Toda la basura que nadie separó terminó con él." },
      { quien: 'wari', pose: 'seria', texto: 'Entonces vamos. No a pelear… sino a ayudarlo. ¡Él también merece estar limpio!' },
    ],
  },

  // ───────── CAPÍTULO 5 · El corazón del Apu ─────────
  antes9: {
    titulo: 'Capítulo 5 · El corazón del Apu',
    fondo: 'nevado',
    lineas: [
      { quien: 'narrador', texto: 'Subieron y subieron hasta el pie del gran nevado. Hacía frío y el cielo se pintaba de morado.' },
      { quien: 'kuntur', texto: 'Antes de acercarse a Ch\'ura, deben aprender algo importante: algunas cosas son peligrosas.' },
      { quien: 'kuntur', texto: 'Un guardián valiente también sabe cuándo pedir ayuda a un adulto.' },
    ],
  },
  despues9: {
    fondo: 'nevado',
    lineas: [
      { quien: 'wari', pose: 'seria', texto: 'Ya estamos listos. Pilas, focos y medicinas… siempre con un adulto.' },
      { quien: 'chura', texto: '¡Grrrr! ¿Quién anda ahí? ¡Váyanse! ¡Nadie me quiere! Me botaron aquí y me olvidaron…' },
      { quien: 'wari', pose: 'feliz', texto: "Ch'ura, no venimos a pelear. Venimos a ayudarte a separar todo eso que llevas encima." },
      { quien: 'chura', texto: '¿Ayudarme… a mí? Hmmm… bueno… ¡pero tendrán que ser muy rápidos!' },
    ],
  },
  final: {
    fondo: 'nevado',
    limpieza: 100,
    lineas: [
      { quien: 'chura', pose: 'bueno', texto: '¡Oh! ¡Me siento ligero! ¡Mírenme… tengo flores y hojitas!' },
      { quien: 'chura', pose: 'bueno', texto: 'Gracias, Wari. Gracias, guardián. Desde hoy cuidaré las plantas del nevado.' },
      { quien: 'kuntur', texto: 'Wari. Cuando empezamos, dijiste que eras muy pequeña. Hoy salvaste el valle entero.' },
      { quien: 'kuntur', texto: 'Por eso te entrego este poncho. Desde ahora eres Guardiana del Valle.' },
      { quien: 'wari', pose: 'heroica', texto: '¡Allinmi! Pero no lo hice sola. ¡Este poncho es también de mi amigo, el guardián!' },
      { quien: 'narrador', fondo: 'laguna_limpia', texto: 'La laguna volvió a ser turquesa. Regresaron los patos, las ranas y las truchas.' },
      { quien: 'wari', pose: 'celebrando', texto: 'Sulpayki, guardián. Cada vez que separes tu basura, ¡estarás cuidando mi laguna! Tupananchiskama, ¡hasta pronto!' },
    ],
  },
};

/** Escena que se muestra ANTES de entrar al nivel n (o null). */
export function escenaAntes(n) {
  if (n === 1) return 'prologo';
  return HISTORIA[`antes${n}`] ? `antes${n}` : null;
}

/** Escena que se muestra DESPUÉS de completar el nivel n. */
export function escenaDespues(n) {
  if (n === 10) return 'final';
  return HISTORIA[`despues${n}`] ? `despues${n}` : null;
}
