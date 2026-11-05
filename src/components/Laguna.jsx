import { AnimatePresence, motion } from 'framer-motion';
import { useId } from 'react';

// Escena de la laguna del Valle Sagrado. `limpieza` 0–100 cambia todo gradualmente.

function hexARgb(h) {
  const n = parseInt(h.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
function mezclar(a, b, t) {
  const A = hexARgb(a);
  const B = hexARgb(b);
  const c = A.map((v, i) => Math.round(v + (B[i] - v) * t));
  return `rgb(${c[0]},${c[1]},${c[2]})`;
}
const suave = { transition: 'fill 1.2s ease, stop-color 1.2s ease, opacity 1.2s ease' };

const BASURA_AGUA = [
  { x: 250, y: 352, tipo: 'botella', hasta: 8 },
  { x: 330, y: 380, tipo: 'bolsa', hasta: 14 },
  { x: 420, y: 340, tipo: 'lata', hasta: 20 },
  { x: 500, y: 372, tipo: 'botella', hasta: 28 },
  { x: 580, y: 350, tipo: 'bolsa', hasta: 36 },
  { x: 360, y: 405, tipo: 'lata', hasta: 46 },
  { x: 460, y: 410, tipo: 'bolsa', hasta: 56 },
  { x: 290, y: 395, tipo: 'botella', hasta: 66 },
];
const BASURA_ORILLA = [
  { x: 90, y: 455, tipo: 'lata', hasta: 12 },
  { x: 660, y: 462, tipo: 'bolsa', hasta: 24 },
  { x: 180, y: 478, tipo: 'botella', hasta: 40 },
  { x: 720, y: 440, tipo: 'lata', hasta: 52 },
];

function Basura({ x, y, tipo, flotar }) {
  return (
    <motion.g
      initial={{ opacity: 0 }}
      animate={flotar ? { opacity: 1, y: [0, -3, 0] } : { opacity: 1 }}
      exit={{ opacity: 0, scale: 0.2 }}
      transition={flotar ? { y: { duration: 2.5, repeat: Infinity }, opacity: { duration: 0.6 } } : { duration: 0.6 }}
    >
      {tipo === 'botella' && (
        <g transform={`translate(${x} ${y}) rotate(-70)`}>
          <rect x="-6" y="-14" width="12" height="24" rx="4" fill="#9fd3e6" stroke="#4d7f91" strokeWidth="1.5" />
          <rect x="-3" y="-19" width="6" height="6" fill="#2a6fd1" />
        </g>
      )}
      {tipo === 'bolsa' && (
        <path
          d={`M${x - 12} ${y} q4 -16 12 -12 q8 -6 12 8 q-4 10 -12 8 q-10 4 -12 -4z`}
          fill="#f2f2f2"
          stroke="#9b9b9b"
          strokeWidth="1.5"
          opacity="0.9"
        />
      )}
      {tipo === 'lata' && (
        <g transform={`translate(${x} ${y}) rotate(80)`}>
          <rect x="-6" y="-10" width="12" height="20" rx="2" fill="#d93a3a" stroke="#7a1d1d" strokeWidth="1.5" />
          <rect x="-6" y="-3" width="12" height="5" fill="#f5f5f5" />
        </g>
      )}
    </motion.g>
  );
}

function Pasto({ x, y, s = 1 }) {
  return (
    <motion.path
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ duration: 0.8 }}
      style={{ originX: '50%', originY: '100%' }}
      d={`M${x} ${y} q-4 ${-14 * s} -10 ${-18 * s} q8 2 10 ${12 * s} q1 ${-16 * s} 4 ${-22 * s} q2 10 0 ${22 * s} q4 ${-10 * s} 10 ${-14 * s} q-4 8 -4 ${14 * s}z`}
      fill="#3f8f2f"
    />
  );
}

function Cantuta({ x, y, color = '#d6336c', delay = 0 }) {
  return (
    <motion.g
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ duration: 0.8, delay }}
      style={{ originX: '50%', originY: '100%' }}
    >
      <path d={`M${x} ${y} q2 -14 -2 -26`} stroke="#2f7a28" strokeWidth="2.5" fill="none" />
      <path d={`M${x - 2} ${y - 24} l-6 -16 q6 -4 12 0 z`} fill={color} />
      <path d={`M${x - 2} ${y - 24} l-2 4`} stroke="#f6c343" strokeWidth="2" />
      <path d={`M${x + 3} ${y - 14} l8 -10 q4 4 2 10 z`} fill={color} opacity="0.85" />
    </motion.g>
  );
}

function Pato({ x, y, dur = 9 }) {
  return (
    <motion.g
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, x: [0, 60, 0] }}
      exit={{ opacity: 0 }}
      transition={{ x: { duration: dur, repeat: Infinity, ease: 'easeInOut' }, opacity: { duration: 0.8 } }}
    >
      <ellipse cx={x} cy={y} rx="16" ry="8" fill="#f5f0e6" />
      <circle cx={x + 12} cy={y - 8} r="6" fill="#2f7a4f" />
      <path d={`M${x + 17} ${y - 8} l7 2 l-7 2z`} fill="#e0a63a" />
      <circle cx={x + 13} cy={y - 9} r="1.3" fill="#111" />
    </motion.g>
  );
}

function Rana({ x, y }) {
  return (
    <motion.g
      initial={{ scale: 0 }}
      animate={{ scale: 1, y: [0, -6, 0] }}
      exit={{ scale: 0 }}
      transition={{ y: { duration: 1.8, repeat: Infinity, repeatDelay: 1.5 }, scale: { duration: 0.6 } }}
      style={{ originX: '50%', originY: '100%' }}
    >
      <ellipse cx={x} cy={y} rx="11" ry="7" fill="#5aa83a" />
      <circle cx={x - 5} cy={y - 7} r="3.5" fill="#5aa83a" />
      <circle cx={x + 5} cy={y - 7} r="3.5" fill="#5aa83a" />
      <circle cx={x - 5} cy={y - 7} r="1.4" fill="#111" />
      <circle cx={x + 5} cy={y - 7} r="1.4" fill="#111" />
    </motion.g>
  );
}

function Trucha({ x, y, delay }) {
  return (
    <motion.g
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 1, 1, 0], x: [0, 20, 40], y: [0, -40, 0], rotate: [-30, 0, 30] }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.4, repeat: Infinity, repeatDelay: 2.5, delay }}
    >
      <path d={`M${x} ${y} q12 -8 24 0 q-12 8 -24 0z`} fill="#c98bb0" stroke="#7a6a8a" strokeWidth="1.2" />
      <path d={`M${x} ${y} l-7 -5 l0 10z`} fill="#a7799a" />
    </motion.g>
  );
}

function Vizcachita({ x, y, s = 1 }) {
  return (
    <motion.g
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx="0" cy="0" rx="12" ry="11" fill="#c9bfb0" />
      <ellipse cx="0" cy="-15" rx="9" ry="8" fill="#d3cabd" />
      <ellipse cx="-4" cy="-28" rx="3" ry="9" fill="#c9bfb0" />
      <ellipse cx="4" cy="-28" rx="3" ry="9" fill="#c9bfb0" />
      <circle cx="-3" cy="-16" r="1.6" fill="#111" />
      <circle cx="3" cy="-16" r="1.6" fill="#111" />
      <path d="M10 6 q12 0 10 -12" stroke="#9c907f" strokeWidth="4" fill="none" strokeLinecap="round" />
      </g>
    </motion.g>
  );
}

export default function Laguna({ limpieza = 0, className = '', titulo = 'Laguna del valle' }) {
  const t = Math.max(0, Math.min(100, limpieza)) / 100;
  const uid = useId().replace(/:/g, '');
  const L = limpieza;

  const cieloArriba = mezclar('#7f878e', '#4aa8ea', t);
  const cieloAbajo = mezclar('#b7bcc0', '#cdeeff', t);
  const agua1 = mezclar('#6d6a58', '#2f9fd6', t);
  const agua2 = mezclar('#8a8672', '#7fd0f2', t);
  const cerro1 = mezclar('#8a7c62', '#5c9c3e', t);
  const cerro2 = mezclar('#776a52', '#4a8a35', t);
  const orilla = mezclar('#8d7550', '#87b552', t);

  return (
    <svg
      viewBox="0 0 800 500"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      role="img"
      aria-label={`${titulo}: ${Math.round(limpieza)} % limpia`}
    >
      <defs>
        <linearGradient id={`cielo${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" style={{ stopColor: cieloArriba, ...suave }} />
          <stop offset="1" style={{ stopColor: cieloAbajo, ...suave }} />
        </linearGradient>
        <linearGradient id={`agua${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" style={{ stopColor: agua2, ...suave }} />
          <stop offset="1" style={{ stopColor: agua1, ...suave }} />
        </linearGradient>
        <clipPath id={`clip${uid}`}>
          <path d="M100 360 Q120 292 400 290 Q690 292 710 360 Q690 432 400 436 Q110 432 100 360Z" />
        </clipPath>
      </defs>

      <rect width="800" height="500" fill={`url(#cielo${uid})`} />

      {/* sol */}
      <AnimatePresence>
        {L >= 40 && (
          <motion.g
            key="sol"
            initial={{ opacity: 0, scale: 0.4, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 1.4 }}
            style={{ originX: '50%', originY: '50%' }}
          >
            <motion.g
              animate={{ rotate: 360 }}
              transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
              style={{ originX: '50%', originY: '50%' }}
            >
              {Array.from({ length: 12 }).map((_, i) => (
                <rect key={i} x="666" y="22" width="8" height="22" rx="4" fill="#ffd34d" transform={`rotate(${i * 30} 670 90)`} />
              ))}
            </motion.g>
            <circle cx="670" cy="90" r="40" fill="#ffd34d" />
            <circle cx="670" cy="90" r="30" fill="#ffe27a" />
          </motion.g>
        )}
      </AnimatePresence>

      {/* nubes grises que se van */}
      <g style={{ ...suave, opacity: Math.max(0, 1 - t * 1.6) }} fill={mezclar('#6f777e', '#ffffff', t)}>
        <ellipse cx="160" cy="80" rx="90" ry="30" />
        <ellipse cx="210" cy="64" rx="60" ry="30" />
        <ellipse cx="480" cy="70" rx="110" ry="32" />
        <ellipse cx="540" cy="52" rx="60" ry="28" />
        <ellipse cx="700" cy="110" rx="90" ry="26" />
      </g>
      {/* nubes blancas */}
      <g style={{ ...suave, opacity: t > 0.4 ? 0.95 : 0 }} fill="#fff">
        <motion.g animate={{ x: [0, 30, 0] }} transition={{ duration: 20, repeat: Infinity }}>
          <ellipse cx="180" cy="70" rx="50" ry="16" />
          <ellipse cx="205" cy="60" rx="30" ry="16" />
          <ellipse cx="420" cy="110" rx="40" ry="12" />
        </motion.g>
      </g>

      {/* nevados */}
      <polygon points="40,300 220,130 400,300" fill="#7c8fa6" />
      <polygon points="180,168 220,130 262,170 244,162 228,178 212,160 196,176" fill="#fff" />
      <polygon points="250,300 440,80 630,300" fill="#8ea2ba" />
      <polygon points="394,134 440,80 488,136 468,126 452,146 436,124 418,146 404,128" fill="#fff" />
      <polygon points="520,300 660,170 800,300" fill="#7c8fa6" />
      <polygon points="630,198 660,170 690,198 676,192 662,206 648,190" fill="#fff" />

      {/* cerros */}
      <path d="M0 320 Q120 230 260 300 Q380 250 520 300 Q660 236 800 300 L800 500 L0 500Z" fill={cerro2} style={suave} />
      <path d="M0 340 Q160 280 300 330 Q460 290 600 330 Q720 300 800 330 L800 500 L0 500Z" fill={cerro1} style={suave} />

      {/* laguna */}
      <path
        d="M100 360 Q120 292 400 290 Q690 292 710 360 Q690 432 400 436 Q110 432 100 360Z"
        fill={`url(#agua${uid})`}
      />
      {/* reflejo del nevado */}
      <g clipPath={`url(#clip${uid})`}>
        <polygon
          points="250,296 440,430 630,296"
          fill="#ffffff"
          style={{ ...suave, opacity: L >= 80 ? 0.35 : 0 }}
        />
        <polygon
          points="394,376 440,430 488,376"
          fill="#ffffff"
          style={{ ...suave, opacity: L >= 80 ? 0.5 : 0 }}
        />
        <g style={{ ...suave, opacity: t * 0.7 }} stroke="#ffffff" strokeWidth="3" strokeLinecap="round">
          <line x1="180" y1="330" x2="230" y2="330" />
          <line x1="520" y1="400" x2="590" y2="400" />
          <line x1="300" y1="415" x2="340" y2="415" />
        </g>
      </g>

      {/* orilla */}
      <path d="M0 430 Q200 400 400 440 Q600 410 800 430 L800 500 L0 500Z" fill={orilla} style={suave} />
      <ellipse cx="740" cy="438" rx="44" ry="16" fill="#9a9384" />
      <ellipse cx="60" cy="430" rx="34" ry="12" fill="#9a9384" />

      {/* basura */}
      <AnimatePresence>
        {BASURA_AGUA.filter((b) => L < b.hasta).map((b) => (
          <Basura key={`a${b.x}`} {...b} flotar />
        ))}
        {BASURA_ORILLA.filter((b) => L < b.hasta).map((b) => (
          <Basura key={`o${b.x}`} {...b} />
        ))}
      </AnimatePresence>

      {/* vida */}
      <AnimatePresence>
        {L >= 20 &&
          [
            [40, 470, 1],
            [140, 462, 1.2],
            [250, 476, 0.9],
            [520, 474, 1.1],
            [610, 458, 1],
            [770, 476, 1.2],
            [90, 340, 0.8],
            [720, 342, 0.8],
          ].map(([x, y, s]) => <Pasto key={`p${x}${y}`} x={x} y={y} s={s} />)}
        {L >= 40 &&
          [
            [110, 470, '#d6336c'],
            [210, 480, '#f2a93b'],
            [560, 482, '#d6336c'],
            [690, 470, '#e85d3a'],
            [330, 488, '#d6336c'],
          ].map(([x, y, c], i) => <Cantuta key={`c${x}`} x={x} y={y} color={c} delay={i * 0.12} />)}
        {L >= 60 && <Pato key="pato1" x={300} y={340} />}
        {L >= 60 && <Pato key="pato2" x={470} y={395} dur={12} />}
        {L >= 60 && <Rana key="rana1" x={430} y={462} />}
        {L >= 60 && <Rana key="rana2" x={60} y={420} />}
        {L >= 60 && (
          <motion.g key="aves" initial={{ opacity: 0 }} animate={{ opacity: 1, x: [0, 40, 0] }} transition={{ x: { duration: 14, repeat: Infinity } }} exit={{ opacity: 0 }}>
            <path d="M300 150 q8 -8 16 0 q8 -8 16 0" stroke="#333" strokeWidth="2.5" fill="none" />
            <path d="M350 130 q6 -6 12 0 q6 -6 12 0" stroke="#333" strokeWidth="2.5" fill="none" />
          </motion.g>
        )}
        {L >= 80 && <Trucha key="t1" x={250} y={360} delay={0} />}
        {L >= 80 && <Trucha key="t2" x={540} y={380} delay={1.6} />}
        {L >= 80 && <Vizcachita key="v1" x={725} y={424} s={1} />}
        {L >= 80 && <Vizcachita key="v2" x={752} y={428} s={0.7} />}
        {L >= 80 && <Vizcachita key="v3" x={770} y={430} s={0.55} />}
      </AnimatePresence>
    </svg>
  );
}

export function etapaLaguna(limpieza) {
  if (limpieza >= 80) return '¡Agua cristalina! Saltan las truchas y llegó la familia de vizcachas.';
  if (limpieza >= 60) return 'Volvieron los patos y las ranas. ¡Qué alegría!';
  if (limpieza >= 40) return 'Salió el sol y florecen las cantutas.';
  if (limpieza >= 20) return 'El agua está menos gris y ya crece el pasto.';
  return '¡Uy, cuánta basura! El agua está gris y el cielo nublado.';
}
