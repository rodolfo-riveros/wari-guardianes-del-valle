// Banco de frases de Wari. Wari nunca culpa al niño: si hay un error, se confunde y da una pista.
export const FRASES = {
  saludo: [
    '¡Napaykullayki! Soy Wari. ¿Me ayudas a limpiar mi laguna?',
    '¡Hola, guardián! ¡Uy, cuánta basura bajó a mi qocha! ¿Me ayudas?',
    '¡Imaynalla! Qué bueno verte. ¡Haku, vamos a cuidar el valle!',
  ],
  acierto: [
    '¡Allinmi! ¡Muy bien, guardián!',
    '¡Sulpayki! Gracias por cuidar mi laguna.',
    '¡Kusa! ¡Eso es, al tacho correcto!',
    '¡Añay! Mi laguna está más limpia gracias a ti.',
    '¡Lo lograste! ¡Eres un gran guardián del valle!',
    '¡Genial! Mira cómo brilla el agua.',
  ],
  error: [
    'Mmm… creo que esto va en otro tacho. ¡Intentemos juntos!',
    '¡Uy, me confundí! Pensemos otra vez…',
    'Mmm… ese tacho no es su casa. ¡Busquemos otro!',
    'Casi casi… ¡probemos con otro tacho!',
  ],
  peligroso: [
    '¡Cuidado! Esto es peligroso. Pídele ayuda a un adulto para botarlo.',
    '¡Bien hecho! Esto es peligroso: siempre con ayuda de un adulto.',
    'Esto va al tacho rojo. ¡Nunca lo toques si está roto, avisa a un adulto!',
  ],
  quizBien: [
    '¡Allinmi! ¡Respuesta correcta!',
    '¡Kusa! ¡Qué sabio eres!',
    '¡Sí! ¡Eso es!',
  ],
  quizMal: [
    '¡Uy, casi! Te cuento…',
    'Mmm… esa no era, pero ahora lo sabemos juntos.',
    '¡Uy! Pensemos juntos… Mira:',
  ],
  fin: [
    '¡Lo hiciste genial! Mi laguna está feliz.',
    '¡Sulpayki, guardián! ¡Mira cómo cambió el valle!',
    '¡Haku! ¡Sigamos cuidando el valle!',
  ],
};

const ultimo = {};

/** Devuelve una frase al azar del tipo pedido, sin repetir la anterior. */
export function frase(tipo) {
  const lista = FRASES[tipo] || [''];
  let i = Math.floor(Math.random() * lista.length);
  if (lista.length > 1 && i === ultimo[tipo]) i = (i + 1) % lista.length;
  ultimo[tipo] = i;
  return lista[i];
}
