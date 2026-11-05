// Set de íconos SVG propios del juego (reemplazan a los emojis).
// Uso: <Icono nombre="semilla" size={28} />
// Los íconos "de interfaz" (volver, play, altavoz, repetir…) usan currentColor
// para tomar el color del texto del botón.

const O = '#2b2118'; // contorno
const C = { stroke: O, strokeWidth: 2.5, strokeLinejoin: 'round', strokeLinecap: 'round' };

const ICONOS = {
  // ───── Interfaz ─────
  volver: (
    <g fill="none" stroke="currentColor" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M26 11 L13 24 L26 37" />
      <path d="M14 24 H37" />
    </g>
  ),
  play: <path d="M15 9 L39 24 L15 39 Z" fill="currentColor" strokeLinejoin="round" stroke="currentColor" strokeWidth="3" />,
  altavoz: (
    <g fill="currentColor" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 19 H15 L25 10 V38 L15 29 H8 Z" />
      <path d="M31 18 Q35 24 31 30 M35 13 Q43 24 35 35" fill="none" />
    </g>
  ),
  repetir: (
    <g fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M37 22 A14 14 0 1 0 33 33" />
      <path d="M38 12 V22 H28" />
    </g>
  ),
  check: (
    <g>
      <circle cx="24" cy="24" r="19" fill="#2E9E4F" {...C} />
      <path d="M15 24 L21 31 L34 17" fill="none" stroke="#fff" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
    </g>
  ),
  no: (
    <g>
      <circle cx="24" cy="24" r="19" fill="#e0a63a" {...C} />
      <path d="M17 17 L31 31 M31 17 L17 31" stroke="#fff" strokeWidth="5" strokeLinecap="round" />
    </g>
  ),
  estrella: (
    <path
      d="M24 4 L29.6 16.6 L43 17.8 L32.8 26.8 L35.9 40 L24 33 L12.1 40 L15.2 26.8 L5 17.8 L18.4 16.6 Z"
      fill="#ffc83d"
      stroke="#c98a00"
      strokeWidth="2.5"
      strokeLinejoin="round"
    />
  ),
  candado: (
    <g>
      <path d="M15 22 V15 A9 9 0 0 1 33 15 V22" fill="none" stroke="#8a8a8a" strokeWidth="5" />
      <rect x="10" y="21" width="28" height="22" rx="5" fill="#e0a63a" {...C} />
      <circle cx="24" cy="30" r="3.5" fill={O} />
      <rect x="22.5" y="31" width="3" height="7" rx="1.5" fill={O} />
    </g>
  ),
  semilla: (
    <g>
      <path d="M24 42 V24" stroke="#2f7a28" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M24 26 Q10 26 8 12 Q22 12 24 26 Z" fill="#5cb83a" {...C} />
      <path d="M24 22 Q38 22 40 8 Q26 8 24 22 Z" fill="#4f9d3a" {...C} />
      <ellipse cx="24" cy="42" rx="9" ry="4" fill="#8b5a2b" {...C} />
    </g>
  ),
  ajustes: (
    <g>
      {[0, 45, 90, 135].map((a) => (
        <rect key={a} x="20" y="3" width="8" height="42" rx="3" fill="#7d8a96" stroke={O} strokeWidth="2" transform={`rotate(${a} 24 24)`} />
      ))}
      <circle cx="24" cy="24" r="14" fill="#9aa7b3" {...C} />
      <circle cx="24" cy="24" r="6" fill="#fff6e5" {...C} />
    </g>
  ),
  familia: (
    <g>
      <circle cx="17" cy="12" r="7" fill="#e8b48a" {...C} />
      <path d="M5 44 V32 Q5 22 17 22 Q29 22 29 32 V44 Z" fill="#2a8bbf" {...C} />
      <circle cx="35" cy="22" r="5.5" fill="#e8b48a" {...C} />
      <path d="M26 44 V37 Q26 30 35 30 Q44 30 44 37 V44 Z" fill="#d6336c" {...C} />
    </g>
  ),
  camara: (
    <g>
      <path d="M15 12 L18 7 H30 L33 12 Z" fill="#555" {...C} />
      <rect x="4" y="12" width="40" height="28" rx="6" fill="#3c3c3c" {...C} />
      <circle cx="24" cy="26" r="10" fill="#2a8bbf" {...C} />
      <circle cx="24" cy="26" r="5" fill="#9fd6f2" />
      <circle cx="37" cy="18" r="2.5" fill="#ffd34d" />
    </g>
  ),
  lupa: (
    <g>
      <path d="M30 30 L42 42" stroke="#8b5a2b" strokeWidth="7" strokeLinecap="round" />
      <circle cx="20" cy="20" r="14" fill="#cdeeff" stroke={O} strokeWidth="3" />
      <path d="M12 18 Q14 12 20 11" stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round" />
    </g>
  ),
  lentes: (
    <g fill="#cdeeff" stroke={O} strokeWidth="3.5">
      <circle cx="13" cy="26" r="9" />
      <circle cx="35" cy="26" r="9" />
      <path d="M22 25 Q24 21 26 25 M4 24 L2 18 M44 24 L46 18" fill="none" strokeLinecap="round" />
    </g>
  ),
  reloj: (
    <g>
      <rect x="9" y="4" width="30" height="5" rx="2" fill="#8b5a2b" {...C} />
      <rect x="9" y="39" width="30" height="5" rx="2" fill="#8b5a2b" {...C} />
      <path d="M13 9 H35 Q35 20 24 24 Q35 28 35 39 H13 Q13 28 24 24 Q13 20 13 9 Z" fill="#e9f6fb" {...C} />
      <path d="M17 13 H31 Q30 18 24 21 Q18 18 17 13 Z" fill="#e0a63a" />
      <path d="M16 37 Q18 31 24 29 Q30 31 32 37 Z" fill="#e0a63a" />
    </g>
  ),
  idea: (
    <g>
      <path d="M24 4 A14 14 0 0 1 32 30 V34 H16 V30 A14 14 0 0 1 24 4 Z" fill="#ffd34d" {...C} />
      <rect x="16" y="34" width="16" height="8" rx="2" fill="#9a9a9a" {...C} />
      <path d="M20 46 H28" stroke={O} strokeWidth="3" strokeLinecap="round" />
      <path d="M18 14 Q20 9 25 9" stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round" />
    </g>
  ),
  reciclar: (
    <g>
      {[0, 120, 240].map((a) => (
        <g key={a} transform={`rotate(${a} 24 26)`}>
          <path d="M14 15 Q20 6 29 9" fill="none" stroke="#2E9E4F" strokeWidth="6" strokeLinecap="round" />
          <path d="M27 3 L36 11 L25 15 Z" fill="#2E9E4F" stroke="#1f7438" strokeWidth="1.5" strokeLinejoin="round" />
        </g>
      ))}
    </g>
  ),
  organico: (
    <g>
      <path d="M24 16 Q14 10 8 18 Q3 30 12 41 Q18 47 24 43 Q30 47 36 41 Q45 30 40 18 Q34 10 24 16 Z" fill="#d93a3a" {...C} />
      <path d="M24 16 Q24 9 28 5" stroke="#6b4a2a" strokeWidth="3.5" fill="none" strokeLinecap="round" />
      <path d="M26 10 Q32 2 41 5 Q37 13 26 10 Z" fill="#5cb83a" {...C} />
      <path d="M13 24 Q14 19 19 18" stroke="#fff" strokeWidth="3.5" fill="none" strokeLinecap="round" opacity="0.8" />
    </g>
  ),
  basura: (
    <g>
      <rect x="9" y="9" width="30" height="6" rx="2" fill="#555" {...C} />
      <rect x="19" y="4" width="10" height="5" rx="2" fill="#555" {...C} />
      <path d="M12 15 H36 L33 44 H15 Z" fill="#777" {...C} />
      <path d="M20 20 V39 M28 20 V39" stroke="#bbb" strokeWidth="2.5" strokeLinecap="round" />
    </g>
  ),
  borrar: (
    <g>
      <rect x="9" y="9" width="30" height="6" rx="2" fill="#a82626" {...C} />
      <rect x="19" y="4" width="10" height="5" rx="2" fill="#a82626" {...C} />
      <path d="M12 15 H36 L33 44 H15 Z" fill="#D93A3A" {...C} />
      <path d="M20 20 V39 M28 20 V39" stroke="#ffc9c9" strokeWidth="2.5" strokeLinecap="round" />
    </g>
  ),
  advertencia: (
    <g>
      <path d="M24 4 L45 41 H3 Z" fill="#ffd34d" stroke={O} strokeWidth="3" strokeLinejoin="round" />
      <rect x="21.5" y="16" width="5" height="14" rx="2.5" fill={O} />
      <circle cx="24" cy="35" r="3" fill={O} />
    </g>
  ),
  mapa: (
    <g>
      <path d="M4 10 L16 6 L32 10 L44 6 V38 L32 42 L16 38 L4 42 Z" fill="#f6e1b4" {...C} />
      <path d="M16 6 V38 M32 10 V42" stroke={O} strokeWidth="2" />
      <path d="M8 34 Q14 26 22 28 T36 18" fill="none" stroke="#d6336c" strokeWidth="2.5" strokeDasharray="3 3" />
      <circle cx="37" cy="17" r="4" fill="#D93A3A" {...C} />
    </g>
  ),
  laguna: (
    <g>
      <rect x="3" y="6" width="42" height="36" rx="7" fill="#bfe6ff" {...C} />
      <circle cx="35" cy="15" r="5" fill="#ffd34d" />
      <path d="M5 32 L17 14 L29 32 Z" fill="#8ea2ba" />
      <path d="M13 20 L17 14 L21 20 Z" fill="#fff" />
      <path d="M4 30 Q24 26 44 30 V36 Q44 41 39 41 H9 Q4 41 4 36 Z" fill="#2f9fd6" />
      <path d="M12 35 H20 M27 37 H35" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
    </g>
  ),
  album: (
    <g>
      <rect x="10" y="5" width="30" height="38" rx="3" fill="#2a8bbf" {...C} />
      <rect x="7" y="8" width="30" height="38" rx="3" fill="#3c9fd6" {...C} />
      <rect x="13" y="14" width="18" height="13" rx="2" fill="#fff" {...C} />
      <path d="M15 24 L20 18 L24 22 L27 19 L30 24 Z" fill="#5cb83a" />
      <path d="M13 33 H31 M13 38 H25" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
    </g>
  ),
  libros: (
    <g>
      <rect x="6" y="32" width="36" height="9" rx="2" fill="#d63a3a" {...C} />
      <rect x="9" y="22" width="32" height="10" rx="2" fill="#2E9E4F" {...C} />
      <rect x="7" y="12" width="30" height="10" rx="2" fill="#2a8bbf" {...C} />
      <path d="M12 36 H36 M14 27 H34 M12 17 H32" stroke="#fff" strokeWidth="2" opacity="0.7" />
    </g>
  ),
  medalla: (
    <g>
      <path d="M14 4 L22 22 L16 24 L8 6 Z" fill="#2a8bbf" {...C} />
      <path d="M34 4 L26 22 L32 24 L40 6 Z" fill="#d63a3a" {...C} />
      <circle cx="24" cy="31" r="13" fill="#ffc83d" stroke="#c98a00" strokeWidth="3" />
      <path d="M24 23 L26.5 28.5 L32 29 L27.8 32.6 L29 38 L24 35 L19 38 L20.2 32.6 L16 29 L21.5 28.5 Z" fill="#fff6c9" />
    </g>
  ),
  tienda: (
    <g>
      <path d="M16 16 V12 A8 8 0 0 1 32 12 V16" fill="none" stroke={O} strokeWidth="3" />
      <path d="M7 16 H41 L38 44 H10 Z" fill="#d6336c" {...C} />
      <path d="M10 22 H38" stroke="#e0a63a" strokeWidth="3" />
      <path d="M12 27 l3 -3 l3 3 l3 -3 l3 3 l3 -3 l3 3 l3 -3 l3 3 l3 -3" stroke="#fff" strokeWidth="2" fill="none" />
    </g>
  ),
  musica: (
    <g>
      <path d="M18 34 V8 L40 4 V30" fill="none" stroke={O} strokeWidth="3.5" strokeLinejoin="round" />
      <ellipse cx="13" cy="35" rx="7" ry="5.5" fill="#8b5cf6" {...C} />
      <ellipse cx="35" cy="31" rx="7" ry="5.5" fill="#8b5cf6" {...C} />
      <path d="M18 14 L40 10" stroke={O} strokeWidth="3.5" />
    </g>
  ),
  voz: (
    <g>
      <path d="M6 8 H42 Q45 8 45 11 V30 Q45 33 42 33 H20 L10 42 V33 H6 Q3 33 3 30 V11 Q3 8 6 8 Z" fill="#fff" {...C} />
      <path d="M11 16 H37 M11 24 H29" stroke="#2a8bbf" strokeWidth="3.5" strokeLinecap="round" />
    </g>
  ),
  letra: (
    <g>
      <rect x="3" y="6" width="42" height="36" rx="8" fill="#fff6e5" {...C} />
      <text x="24" y="34" textAnchor="middle" fontSize="24" fontWeight="800" fill={O} fontFamily="'Baloo 2', sans-serif">
        Aa
      </text>
    </g>
  ),
  fiesta: (
    <g>
      <path d="M6 44 L16 16 L32 32 Z" fill="#e0a63a" {...C} />
      <path d="M11 30 L22 38 M14 22 L27 33" stroke="#d6336c" strokeWidth="3" />
      <circle cx="30" cy="10" r="3" fill="#2a8bbf" />
      <circle cx="40" cy="18" r="3" fill="#d6336c" />
      <rect x="35" y="5" width="4" height="7" rx="1" fill="#2E9E4F" transform="rotate(30 37 8)" />
      <rect x="38" y="28" width="4" height="7" rx="1" fill="#8b5cf6" transform="rotate(-30 40 31)" />
      <path d="M22 6 Q26 10 22 14" stroke="#2E9E4F" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    </g>
  ),
  birrete: (
    <g>
      <path d="M2 18 L24 8 L46 18 L24 28 Z" fill="#333" {...C} />
      <path d="M12 23 V33 Q24 40 36 33 V23 L24 28 Z" fill="#555" {...C} />
      <path d="M40 20 V32" stroke="#e0a63a" strokeWidth="2.5" />
      <circle cx="40" cy="34" r="3" fill="#e0a63a" />
    </g>
  ),
  flor: (
    <g>
      <path d="M24 46 Q22 36 24 26" stroke="#2f7a28" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M24 34 Q32 30 36 34 Q30 38 24 36" fill="#5cb83a" {...C} />
      <path d="M16 6 Q24 2 32 6 L28 26 Q24 29 20 26 Z" fill="#d6336c" {...C} />
      <path d="M16 6 Q14 2 18 2 M32 6 Q34 2 30 2" stroke="#d6336c" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M22 26 L21 34 M26 26 L27 34" stroke="#f6c343" strokeWidth="2" />
    </g>
  ),
  margarita: (
    <g>
      {[0, 60, 120, 180, 240, 300].map((a) => (
        <ellipse key={a} cx="24" cy="12" rx="6" ry="10" fill="#fff" stroke={O} strokeWidth="2" transform={`rotate(${a} 24 24)`} />
      ))}
      <circle cx="24" cy="24" r="7" fill="#ffd34d" stroke={O} strokeWidth="2" />
    </g>
  ),

  // ───── Insignias ─────
  escudo: (
    <g>
      <path d="M24 3 L42 9 V22 Q42 38 24 45 Q6 38 6 22 V9 Z" fill="#2a8bbf" {...C} />
      <path d="M24 9 L36 13 V22 Q36 33 24 39 Z" fill="#3c9fd6" />
      <path d="M15 24 L21 30 L33 17" fill="none" stroke="#fff" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
    </g>
  ),
  choclo: (
    <g>
      <ellipse cx="24" cy="22" rx="9" ry="18" fill="#f4d13d" {...C} />
      {[10, 16, 22, 28, 34].map((y) => (
        <path key={y} d={`M17 ${y} H31`} stroke="#c9a215" strokeWidth="2" />
      ))}
      <path d="M24 10 V34" stroke="#c9a215" strokeWidth="2" />
      <path d="M14 44 Q6 30 12 14 Q18 30 24 44 Z" fill="#5cb83a" {...C} />
      <path d="M34 44 Q42 30 36 14 Q30 30 24 44 Z" fill="#4f9d3a" {...C} />
    </g>
  ),
  pila: (
    <g>
      <rect x="19" y="3" width="10" height="5" rx="2" fill="#9a9a9a" {...C} />
      <rect x="12" y="8" width="24" height="37" rx="5" fill="#2b2b2b" {...C} />
      <rect x="12" y="8" width="24" height="14" rx="5" fill="#e0a63a" {...C} />
      <path d="M24 28 V38 M19 33 H29" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
    </g>
  ),
  condor: (
    <g>
      <path d="M2 22 Q12 14 24 20 Q36 14 46 22 Q40 22 36 26 Q32 24 28 27 L24 30 L20 27 Q16 24 12 26 Q8 22 2 22 Z" fill="#2b2b2b" {...C} />
      <path d="M4 22 l4 4 M9 21 l3 5 M44 22 l-4 4 M39 21 l-3 5" stroke="#fff" strokeWidth="1.5" />
      <ellipse cx="24" cy="20" rx="5" ry="3" fill="#fff" />
      <circle cx="24" cy="15" r="4" fill="#c98a8a" {...C} />
      <path d="M27 15 L31 17 L27 18 Z" fill="#e0a63a" />
    </g>
  ),
  gota: (
    <g>
      <path d="M24 3 Q38 22 38 31 A14 14 0 0 1 10 31 Q10 22 24 3 Z" fill="#2f9fd6" {...C} />
      <path d="M16 30 Q16 24 20 20" stroke="#fff" strokeWidth="3.5" fill="none" strokeLinecap="round" />
    </g>
  ),
  corona: (
    <g>
      <path d="M5 16 L14 26 L24 8 L34 26 L43 16 L39 40 H9 Z" fill="#ffc83d" stroke="#c98a00" strokeWidth="2.5" strokeLinejoin="round" />
      <rect x="9" y="36" width="30" height="6" rx="2" fill="#e0a63a" stroke="#c98a00" strokeWidth="2" />
      <circle cx="24" cy="29" r="3.5" fill="#d6336c" />
      <circle cx="15" cy="31" r="2.5" fill="#2a8bbf" />
      <circle cx="33" cy="31" r="2.5" fill="#2E9E4F" />
    </g>
  ),

  // ───── Accesorios ─────
  chullo: (
    <g>
      <path d="M8 30 Q8 8 24 8 Q40 8 40 30 Z" fill="#d63a3a" {...C} />
      <rect x="6" y="26" width="36" height="7" rx="3" fill="#e0a63a" {...C} />
      <path d="M8 33 L7 42 L13 41 L14 33 M40 33 L41 42 L35 41 L34 33" fill="#d63a3a" {...C} />
      <path d="M12 18 H36" stroke="#fff" strokeWidth="2" strokeDasharray="3 3" />
      <circle cx="24" cy="6" r="4.5" fill="#e0a63a" {...C} />
    </g>
  ),
  bufanda: (
    <g>
      <path d="M6 14 Q24 24 42 14 L42 22 Q24 32 6 22 Z" fill="#2a8bbf" {...C} />
      <path d="M30 24 L36 44 L28 45 L24 26 Z" fill="#2a8bbf" {...C} />
      <path d="M9 18 Q24 27 39 18" stroke="#fff" strokeWidth="2" strokeDasharray="4 4" fill="none" />
      <path d="M29 44 V47 M33 43 V47" stroke={O} strokeWidth="2" />
    </g>
  ),
  poncho: (
    <g>
      <path d="M16 8 H32 L44 40 Q24 46 4 40 Z" fill="#c62f2f" {...C} />
      <path d="M19 8 Q24 14 29 8" fill="#fff6e5" {...C} />
      <path d="M9 28 Q24 33 39 28" stroke="#e0a63a" strokeWidth="3.5" fill="none" />
      <path d="M8 34 l4 -3 l4 3 l4 -3 l4 3 l4 -3 l4 3 l4 -3 l4 3" stroke="#2E9E4F" strokeWidth="2" fill="none" />
      <path d="M12 20 Q24 24 36 20" stroke="#2a8bbf" strokeWidth="2.5" fill="none" />
    </g>
  ),
};

/** Ícono genérico para residuos sin dibujo propio. */
ICONOS.bolsa = (
  <g>
    <path d="M12 16 Q8 44 14 44 H34 Q40 44 36 16 Z" fill="#f2f2f2" {...C} />
    <path d="M17 16 Q17 6 24 6 Q31 6 31 16" fill="none" stroke={O} strokeWidth="2.5" />
  </g>
);

export const NOMBRES_ICONOS = Object.keys(ICONOS);

export default function Icono({ nombre, size = '1.25em', className = '', titulo, gris = false, ...resto }) {
  const dibujo = ICONOS[nombre] || ICONOS.bolsa;
  return (
    <svg
      viewBox="0 0 48 48"
      width={size}
      height={size}
      className={`inline-block shrink-0 align-[-0.2em] ${className}`}
      role={titulo ? 'img' : undefined}
      aria-label={titulo}
      aria-hidden={titulo ? undefined : true}
      focusable="false"
      style={gris ? { filter: 'grayscale(1)', opacity: 0.35 } : undefined}
      {...resto}
    >
      {dibujo}
    </svg>
  );
}
