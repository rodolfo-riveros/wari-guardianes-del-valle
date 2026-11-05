// Dibujos SVG simples y propios de cada residuo (el emoji queda como respaldo).
const D = {
  botella_plastico: (
    <g>
      <rect x="22" y="18" width="20" height="40" rx="7" fill="#a9dcef" stroke="#3f7f96" strokeWidth="2" />
      <rect x="27" y="8" width="10" height="12" rx="2" fill="#a9dcef" stroke="#3f7f96" strokeWidth="2" />
      <rect x="26" y="4" width="12" height="6" rx="2" fill="#2a6fd1" />
      <rect x="22" y="30" width="20" height="10" fill="#4fb3d9" />
    </g>
  ),
  lata_gaseosa: (
    <g>
      <rect x="18" y="12" width="28" height="44" rx="4" fill="#d93a3a" stroke="#7a1d1d" strokeWidth="2" />
      <ellipse cx="32" cy="12" rx="14" ry="4" fill="#cfcfcf" stroke="#7d7d7d" strokeWidth="2" />
      <path d="M18 30 Q32 40 46 30" stroke="#fff" strokeWidth="4" fill="none" />
    </g>
  ),
  periodico: (
    <g transform="rotate(-8 32 32)">
      <rect x="10" y="12" width="44" height="40" rx="2" fill="#f4f1ea" stroke="#8b8b8b" strokeWidth="2" />
      <rect x="15" y="17" width="34" height="7" fill="#555" />
      <rect x="15" y="28" width="15" height="12" fill="#bbb" />
      <path d="M34 30 h15 M34 35 h15 M34 40 h15 M15 45 h34" stroke="#999" strokeWidth="2" />
    </g>
  ),
  caja_carton: (
    <g>
      <path d="M10 24 L32 14 L54 24 L54 50 L32 60 L10 50 Z" fill="#c8945a" stroke="#7a5228" strokeWidth="2" />
      <path d="M10 24 L32 34 L54 24 M32 34 V60" stroke="#7a5228" strokeWidth="2" fill="none" />
      <path d="M21 19 L43 29" stroke="#e8d28a" strokeWidth="5" />
    </g>
  ),
  frasco_vidrio: (
    <g>
      <rect x="16" y="18" width="32" height="40" rx="8" fill="#d8f3f7" fillOpacity="0.8" stroke="#5aa3b0" strokeWidth="2" />
      <rect x="18" y="8" width="28" height="10" rx="3" fill="#b0b0b0" stroke="#6d6d6d" strokeWidth="2" />
      <path d="M22 26 v20" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
    </g>
  ),
  cuaderno_viejo: (
    <g>
      <rect x="14" y="10" width="38" height="46" rx="3" fill="#3c78c4" stroke="#1d4a85" strokeWidth="2" />
      <rect x="24" y="20" width="22" height="10" rx="2" fill="#fff" />
      {[14, 22, 30, 38, 46].map((y) => (
        <circle key={y} cx="14" cy={y} r="2.5" fill="#ddd" stroke="#666" />
      ))}
    </g>
  ),
  botella_vidrio: (
    <g>
      <path d="M27 6 h10 v14 q9 6 9 16 v20 q0 4 -4 4 h-20 q-4 0 -4 -4 v-20 q0 -10 9 -16 z" fill="#3e9a5a" stroke="#1e5e33" strokeWidth="2" />
      <rect x="20" y="36" width="24" height="10" fill="#e9dca6" />
      <path d="M24 30 v20" stroke="#bfe8c9" strokeWidth="2.5" strokeLinecap="round" />
    </g>
  ),
  cascara_platano: (
    <g>
      <path d="M32 26 Q14 34 10 56 Q22 44 32 34 Z" fill="#f4d13d" stroke="#a88a12" strokeWidth="2" />
      <path d="M32 26 Q50 34 54 56 Q42 44 32 34 Z" fill="#f4d13d" stroke="#a88a12" strokeWidth="2" />
      <path d="M30 28 Q30 46 32 60 Q36 46 34 28 Z" fill="#ead06a" stroke="#a88a12" strokeWidth="2" />
      <rect x="29" y="12" width="6" height="16" rx="2" fill="#6b5a1a" />
    </g>
  ),
  cascara_naranja: (
    <g fill="none" strokeLinecap="round">
      <path d="M14 40 Q14 18 34 16 Q52 16 52 34 Q52 48 38 50 Q26 50 26 38 Q26 30 34 30" stroke="#f08a24" strokeWidth="8" />
      <path d="M14 40 Q14 18 34 16 Q52 16 52 34 Q52 48 38 50 Q26 50 26 38 Q26 30 34 30" stroke="#ffd59a" strokeWidth="2" />
    </g>
  ),
  coronta_choclo: (
    <g>
      <ellipse cx="32" cy="32" rx="11" ry="24" fill="#e7d9a8" stroke="#9e8a4e" strokeWidth="2" />
      {[16, 24, 32, 40, 48].map((y) => (
        <path key={y} d={`M24 ${y} h16`} stroke="#c6b276" strokeWidth="2" />
      ))}
      <path d="M22 52 Q12 40 16 22 Q22 40 30 54Z" fill="#7bb352" />
      <path d="M42 52 Q52 40 48 22 Q42 40 34 54Z" fill="#6aa043" />
    </g>
  ),
  hojas_secas: (
    <g>
      <path d="M10 44 Q16 14 44 12 Q42 40 10 44Z" fill="#c77a2c" stroke="#7a4512" strokeWidth="2" />
      <path d="M10 44 Q26 30 40 16" stroke="#7a4512" strokeWidth="2" fill="none" />
      <path d="M26 56 Q34 30 56 30 Q52 52 26 56Z" fill="#e0a63a" stroke="#8a5a12" strokeWidth="2" />
      <path d="M26 56 Q40 44 52 32" stroke="#8a5a12" strokeWidth="2" fill="none" />
    </g>
  ),
  restos_pan: (
    <g>
      <path d="M12 30 Q12 12 32 12 Q52 12 52 30 L50 54 L14 54 Z" fill="#d79a4e" stroke="#8a5a22" strokeWidth="2" />
      <path d="M18 30 Q18 18 32 18 Q46 18 46 30 L44 50 L20 50 Z" fill="#f6e1b4" />
      <circle cx="28" cy="34" r="2" fill="#e2c48a" />
      <circle cx="36" cy="40" r="2" fill="#e2c48a" />
    </g>
  ),
  cascara_huevo: (
    <g>
      <path d="M8 40 Q8 58 24 58 Q38 58 38 40 L34 36 L30 41 L26 35 L22 41 L18 35 L13 41 Z" fill="#fbf3e2" stroke="#b8a888" strokeWidth="2" />
      <path d="M30 26 Q30 8 44 8 Q58 8 58 26 L54 30 L50 25 L46 31 L42 25 L38 31 L34 25 Z" fill="#f3e3c3" stroke="#b8a888" strokeWidth="2" />
    </g>
  ),
  cascara_papa: (
    <g fill="none" strokeLinecap="round">
      <path d="M10 44 Q20 30 30 44 T50 44" stroke="#9a6a3a" strokeWidth="7" />
      <path d="M14 24 Q24 12 34 24 T54 24" stroke="#b07c46" strokeWidth="7" />
      <path d="M10 44 Q20 30 30 44 T50 44" stroke="#f1dfa8" strokeWidth="2" />
    </g>
  ),
  envoltura_galleta: (
    <g>
      <path d="M14 22 L50 18 L52 44 L16 48 Z" fill="#7b4fd1" stroke="#3f2580" strokeWidth="2" />
      <path d="M14 22 L6 18 L8 30 L4 40 L16 48 M50 18 L58 14 L56 26 L60 36 L52 44" fill="#a98ce6" stroke="#3f2580" strokeWidth="2" />
      <circle cx="30" cy="32" r="7" fill="#d79a4e" />
      <circle cx="40" cy="38" r="4" fill="#6b4a2a" opacity="0.7" />
    </g>
  ),
  papel_higienico: (
    <g>
      <rect x="12" y="18" width="34" height="32" fill="#fafafa" stroke="#999" strokeWidth="2" />
      <ellipse cx="46" cy="34" rx="7" ry="16" fill="#fff" stroke="#999" strokeWidth="2" />
      <ellipse cx="46" cy="34" rx="2.5" ry="6" fill="#b08a5a" />
      <path d="M12 50 Q10 56 18 58 L30 56" stroke="#999" strokeWidth="2" fill="#fafafa" />
    </g>
  ),
  chicle: (
    <g>
      <path d="M14 38 Q10 22 26 20 Q36 10 46 22 Q58 28 50 42 Q46 54 30 50 Q14 52 14 38Z" fill="#f48fb1" stroke="#b0476d" strokeWidth="2" />
      <path d="M24 30 q6 -4 10 0" stroke="#fff" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    </g>
  ),
  tecnopor_comida: (
    <g>
      <path d="M8 34 L56 34 L50 54 L14 54 Z" fill="#fff" stroke="#9a9a9a" strokeWidth="2" />
      <path d="M8 32 L14 12 L50 12 L56 32 Z" fill="#f5f5f5" stroke="#9a9a9a" strokeWidth="2" />
      <ellipse cx="26" cy="40" rx="7" ry="3" fill="#b5651d" opacity="0.8" />
      <ellipse cx="40" cy="44" rx="5" ry="2.5" fill="#d9a03a" opacity="0.8" />
    </g>
  ),
  servilleta_sucia: (
    <g>
      <path d="M12 18 L48 12 L54 44 L20 54 L10 40 Z" fill="#ffffff" stroke="#a0a0a0" strokeWidth="2" />
      <path d="M16 26 L44 22 M18 36 L48 32" stroke="#ddd" strokeWidth="2" />
      <circle cx="30" cy="30" r="6" fill="#d58b3c" opacity="0.6" />
      <circle cx="40" cy="42" r="4" fill="#b84a3c" opacity="0.5" />
    </g>
  ),
  cepillo_dientes: (
    <g transform="rotate(-35 32 32)">
      <rect x="6" y="29" width="40" height="7" rx="3.5" fill="#29a3c9" stroke="#176b85" strokeWidth="2" />
      <rect x="44" y="27" width="14" height="10" rx="2" fill="#29a3c9" stroke="#176b85" strokeWidth="2" />
      {[46, 50, 54].map((x) => (
        <rect key={x} x={x} y="17" width="3" height="10" fill="#f0f0f0" stroke="#999" strokeWidth="0.8" />
      ))}
    </g>
  ),
  pila: (
    <g>
      <rect x="20" y="14" width="24" height="42" rx="4" fill="#2b2b2b" />
      <rect x="20" y="14" width="24" height="16" rx="4" fill="#e0a63a" />
      <rect x="27" y="8" width="10" height="7" rx="2" fill="#9a9a9a" />
      <text x="32" y="48" textAnchor="middle" fontSize="16" fontWeight="800" fill="#fff">+</text>
    </g>
  ),
  foco: (
    <g>
      <circle cx="32" cy="26" r="17" fill="#fff6b3" stroke="#b09a2a" strokeWidth="2" />
      <path d="M26 38 L38 38 L37 46 L27 46 Z" fill="#fff6b3" stroke="#b09a2a" strokeWidth="2" />
      <rect x="25" y="46" width="14" height="10" rx="2" fill="#9a9a9a" stroke="#555" strokeWidth="2" />
      <path d="M25 50 h14 M25 53 h14" stroke="#555" strokeWidth="1.5" />
      <path d="M28 30 q4 -8 8 0" stroke="#b09a2a" strokeWidth="2" fill="none" />
    </g>
  ),
  medicina_vencida: (
    <g>
      <rect x="10" y="20" width="24" height="34" rx="4" fill="#f0882a" fillOpacity="0.9" stroke="#9a4b0e" strokeWidth="2" />
      <rect x="8" y="12" width="28" height="10" rx="3" fill="#fff" stroke="#999" strokeWidth="2" />
      <rect x="13" y="30" width="18" height="12" fill="#fff" />
      <g transform="rotate(-30 46 40)">
        <rect x="36" y="34" width="22" height="11" rx="5.5" fill="#d93a3a" />
        <rect x="47" y="34" width="11" height="11" rx="5.5" fill="#fff" stroke="#ccc" />
      </g>
    </g>
  ),
  celular_viejo: (
    <g>
      <rect x="18" y="6" width="28" height="52" rx="6" fill="#333" />
      <rect x="21" y="12" width="22" height="36" rx="2" fill="#8fb8d6" />
      <path d="M24 14 L34 28 L28 34 L40 46" stroke="#fff" strokeWidth="1.5" fill="none" />
      <circle cx="32" cy="53" r="2.5" fill="#777" />
    </g>
  ),
  aerosol: (
    <g>
      <rect x="20" y="20" width="22" height="38" rx="4" fill="#5b8bd6" stroke="#2c4f8a" strokeWidth="2" />
      <path d="M20 26 Q31 16 42 26" fill="#c0c0c0" stroke="#777" strokeWidth="2" />
      <rect x="27" y="10" width="8" height="8" rx="1" fill="#e0e0e0" stroke="#777" strokeWidth="1.5" />
      <circle cx="44" cy="12" r="1.8" fill="#9ab" />
      <circle cx="50" cy="9" r="1.8" fill="#9ab" />
      <circle cx="50" cy="16" r="1.8" fill="#9ab" />
      <circle cx="56" cy="12" r="1.8" fill="#9ab" />
      <path d="M24 40 l7 -8 l7 8 l-7 8z" fill="#ffd34d" stroke="#a8861a" strokeWidth="1.5" />
    </g>
  ),
};

export default function ResiduoIcon({ residuo, size = 64, apagado = false }) {
  const dibujo = D[residuo.id];
  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      role="img"
      aria-label={residuo.nombre}
      style={apagado ? { filter: 'grayscale(1) brightness(0.3)', opacity: 0.45 } : undefined}
    >
      {dibujo || (
        <text x="32" y="44" textAnchor="middle" fontSize="38">
          {residuo.emoji}
        </text>
      )}
    </svg>
  );
}
