import { motion } from 'framer-motion';
import { useProgreso } from '../context/ProgresoContext.jsx';
import Icono from './Icono.jsx';

// Wari: vizcacha andina original, dibujada en SVG.
// Estados: feliz | celebrando | pensando | seria | saludando | durmiendo
// Regla ética: Wari nunca llora, nunca se enferma y nunca culpa al niño.

const PELO = '#c9bfb0';
const PELO_OSCURO = '#9c907f';
const CARA = '#d3cabd';
const PANZA = '#f1e9da';
const OREJA_IN = '#e9b8ae';

const CONFETI = ['#d6336c', '#e0a63a', '#2E9E4F', '#2a8bbf', '#8b5cf6', '#f97316'];

const animCuerpo = {
  feliz: { y: [0, -10, 0], transition: { duration: 1.1, repeat: Infinity, ease: 'easeInOut' } },
  celebrando: { y: [0, -34, 0], rotate: [0, -4, 4, 0], transition: { duration: 0.8, repeat: Infinity } },
  pensando: { y: 0, rotate: 0 },
  seria: { y: 0, rotate: 0 },
  saludando: { y: [0, -4, 0], transition: { duration: 1.6, repeat: Infinity } },
  durmiendo: { y: 0, scale: [1, 1.025, 1], transition: { duration: 3, repeat: Infinity } },
};

const animCabeza = {
  pensando: { rotate: 12, transition: { type: 'spring', stiffness: 120 } },
  durmiendo: { rotate: -8, y: 6 },
  seria: { rotate: 0 },
  default: { rotate: 0, y: 0 },
};

export default function Wari({ mood = 'feliz', accesorios, size = 180, className = '', titulo }) {
  const { estado } = useProgreso();
  const acc = accesorios ?? estado.equipados;
  const tiene = (id) => acc.includes(id);

  const orejaRot =
    mood === 'seria' ? 0 : mood === 'durmiendo' ? 26 : mood === 'celebrando' ? 6 : 13;

  return (
    <svg
      viewBox="0 0 220 240"
      width={size}
      height={size * (240 / 220)}
      className={className}
      role="img"
      aria-label={titulo || `Wari la vizcacha (${mood})`}
      style={{ overflow: 'visible' }}
    >
      {/* sombra */}
      <ellipse cx="110" cy="232" rx="58" ry="7" fill="#000" opacity="0.15" />

      <motion.g animate={animCuerpo[mood] || animCuerpo.feliz}>
        {/* cola enroscada */}
        <motion.path
          d="M150 196 C 200 196, 205 140, 176 128 C 154 120, 146 150, 166 154 C 176 156, 180 146, 172 142"
          fill="none"
          stroke={PELO_OSCURO}
          strokeWidth="13"
          strokeLinecap="round"
          style={{ originX: '0%', originY: '100%' }}
          animate={
            mood === 'feliz' || mood === 'celebrando'
              ? { rotate: [0, 8, -4, 0], transition: { duration: 0.7, repeat: Infinity } }
              : { rotate: 0 }
          }
        />

        {/* patas */}
        <ellipse cx="84" cy="224" rx="18" ry="9" fill={PELO_OSCURO} />
        <ellipse cx="136" cy="224" rx="18" ry="9" fill={PELO_OSCURO} />

        {/* cuerpo */}
        <ellipse cx="110" cy="176" rx="54" ry="54" fill={PELO} />
        <ellipse cx="110" cy="184" rx="34" ry="40" fill={PANZA} />
        {/* raya del lomo (típica de la vizcacha) */}
        <path d="M70 140 Q110 124 150 140" stroke={PELO_OSCURO} strokeWidth="5" fill="none" opacity="0.5" />

        {/* poncho */}
        {tiene('poncho') && (
          <g>
            <path d="M58 150 Q110 126 162 150 L170 204 Q110 220 50 204 Z" fill="#c62f2f" />
            <path d="M54 186 Q110 202 166 186" stroke="#e0a63a" strokeWidth="6" fill="none" />
            <path
              d="M58 196 l8 -8 l8 8 l8 -8 l8 8 l8 -8 l8 8 l8 -8 l8 8 l8 -8 l8 8 l8 -8 l8 8 l8 -8"
              stroke="#2E9E4F"
              strokeWidth="3"
              fill="none"
            />
            <path d="M58 168 Q110 150 162 168" stroke="#2a8bbf" strokeWidth="4" fill="none" />
          </g>
        )}

        {/* brazo izquierdo */}
        <ellipse cx="70" cy="180" rx="11" ry="18" fill={PELO_OSCURO} transform="rotate(18 70 180)" />
        {/* brazo derecho (saluda) */}
        <motion.g
          style={{ originX: '50%', originY: '90%' }}
          animate={
            mood === 'saludando'
              ? { rotate: [0, -150, -120, -150, -120, -150, 0], transition: { duration: 2.2, repeat: Infinity, repeatDelay: 0.6 } }
              : mood === 'celebrando'
                ? { rotate: -150 }
                : { rotate: 0 }
          }
        >
          <ellipse cx="150" cy="180" rx="11" ry="18" fill={PELO_OSCURO} transform="rotate(-18 150 180)" />
        </motion.g>

        {/* bufanda */}
        {tiene('bufanda') && (
          <g>
            <path d="M70 132 Q110 150 150 132 L152 146 Q110 164 68 146 Z" fill="#2a8bbf" />
            <path d="M130 146 L140 182 L126 184 L120 150 Z" fill="#2a8bbf" />
            <path d="M72 140 Q110 156 148 140" stroke="#fff" strokeWidth="3" strokeDasharray="6 6" fill="none" />
            <path d="M128 180 l2 8 M134 179 l2 8" stroke="#1d6a92" strokeWidth="3" />
          </g>
        )}

        {/* cabeza */}
        <motion.g
          style={{ originX: '50%', originY: '85%' }}
          animate={animCabeza[mood] || animCabeza.default}
        >
          {/* orejas */}
          <motion.g style={{ originX: '50%', originY: '100%' }} animate={{ rotate: -orejaRot }}>
            <ellipse cx="80" cy="42" rx="14" ry="40" fill={PELO} />
            <ellipse cx="80" cy="46" rx="7" ry="29" fill={OREJA_IN} />
          </motion.g>
          <motion.g style={{ originX: '50%', originY: '100%' }} animate={{ rotate: orejaRot }}>
            <ellipse cx="140" cy="42" rx="14" ry="40" fill={PELO} />
            <ellipse cx="140" cy="46" rx="7" ry="29" fill={OREJA_IN} />
          </motion.g>

          <ellipse cx="110" cy="94" rx="50" ry="45" fill={CARA} />
          <ellipse cx="110" cy="112" rx="25" ry="17" fill={PANZA} />

          {/* mejillas */}
          <circle cx="76" cy="108" r="7" fill="#f2a1a1" opacity="0.55" />
          <circle cx="144" cy="108" r="7" fill="#f2a1a1" opacity="0.55" />

          {/* ojos */}
          <Ojos mood={mood} />

          {/* cejas serias */}
          {mood === 'seria' && (
            <g stroke="#4a3b30" strokeWidth="4" strokeLinecap="round">
              <line x1="80" y1="70" x2="100" y2="74" />
              <line x1="140" y1="70" x2="120" y2="74" />
            </g>
          )}

          {/* nariz y boca */}
          <ellipse cx="110" cy="106" rx="6" ry="4.2" fill="#5a3b2e" />
          <Boca mood={mood} />

          {/* bigotes */}
          <g stroke="#7d7468" strokeWidth="1.8" strokeLinecap="round">
            <line x1="92" y1="108" x2="62" y2="102" />
            <line x1="92" y1="112" x2="62" y2="114" />
            <line x1="128" y1="108" x2="158" y2="102" />
            <line x1="128" y1="112" x2="158" y2="114" />
          </g>

          {tiene('lentes') && (
            <g fill="rgba(180,220,255,0.25)" stroke="#3b2a20" strokeWidth="3.5">
              <circle cx="90" cy="88" r="15" />
              <circle cx="130" cy="88" r="15" />
              <path d="M105 88 Q110 84 115 88" fill="none" />
            </g>
          )}

          {tiene('chullo') && (
            <g>
              <path d="M64 72 Q66 34 110 30 Q154 34 156 72 Z" fill="#d63a3a" />
              <rect x="62" y="62" width="96" height="12" rx="5" fill="#e0a63a" />
              <path d="M66 68 l6 -5 l6 5 l6 -5 l6 5 l6 -5 l6 5 l6 -5 l6 5 l6 -5 l6 5 l6 -5 l6 5 l6 -5 l6 5" stroke="#2E9E4F" strokeWidth="2.5" fill="none" />
              <path d="M70 46 Q110 40 150 46" stroke="#fff" strokeWidth="3" strokeDasharray="5 5" fill="none" />
              <path d="M64 72 L60 104 L72 100 L74 74 Z" fill="#d63a3a" />
              <path d="M156 72 L160 104 L148 100 L146 74 Z" fill="#d63a3a" />
              <line x1="66" y1="102" x2="64" y2="118" stroke="#e0a63a" strokeWidth="3" />
              <line x1="154" y1="102" x2="156" y2="118" stroke="#e0a63a" strokeWidth="3" />
              <circle cx="110" cy="26" r="9" fill="#e0a63a" />
            </g>
          )}

          {tiene('flor') && (
            <g transform="translate(150 58) rotate(25)">
              <path d="M0 0 L-6 -26 Q0 -32 6 -26 Z" fill="#d6336c" />
              <path d="M-6 -26 Q-10 -32 -4 -34 M6 -26 Q10 -32 4 -34" stroke="#d6336c" strokeWidth="3" fill="none" />
              <path d="M-3 -6 L-1 -22 M3 -6 L1 -22" stroke="#f6c343" strokeWidth="1.5" />
              <path d="M0 0 L0 12" stroke="#2E9E4F" strokeWidth="3" />
            </g>
          )}
        </motion.g>
      </motion.g>

      {/* extras según estado */}
      {mood === 'pensando' && (
        <motion.text
          x="180"
          y="50"
          fontSize="46"
          fontWeight="800"
          fill="#2a8bbf"
          animate={{ y: [50, 40, 50] }}
          transition={{ duration: 1.4, repeat: Infinity }}
        >
          ?
        </motion.text>
      )}
      {mood === 'seria' && (
        <motion.g animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 1, repeat: Infinity }}>
          <Icono nombre="advertencia" x="164" y="12" size="44" />
        </motion.g>
      )}
      {mood === 'durmiendo' && (
        <g fill="#2a8bbf" fontWeight="800">
          {[0, 1, 2].map((i) => (
            <motion.text
              key={i}
              x={160 + i * 14}
              y={60}
              fontSize={18 + i * 6}
              initial={{ opacity: 0, y: 0 }}
              animate={{ opacity: [0, 1, 0], y: [-0, -30 - i * 6] }}
              transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.7 }}
            >
              z
            </motion.text>
          ))}
        </g>
      )}
      {mood === 'celebrando' &&
        Array.from({ length: 16 }).map((_, i) => {
          const ang = (i / 16) * Math.PI * 2;
          return (
            <motion.rect
              key={i}
              x="106"
              y="90"
              width="8"
              height="12"
              rx="2"
              fill={CONFETI[i % CONFETI.length]}
              initial={{ x: 0, y: 0, opacity: 1 }}
              animate={{
                x: [0, Math.cos(ang) * 110],
                y: [0, Math.sin(ang) * 90 + 40],
                rotate: [0, 360],
                opacity: [1, 1, 0],
              }}
              transition={{ duration: 1.4, repeat: Infinity, delay: (i % 4) * 0.12 }}
            />
          );
        })}
    </svg>
  );
}

function Ojos({ mood }) {
  if (mood === 'durmiendo') {
    return (
      <g stroke="#2a2320" strokeWidth="4" fill="none" strokeLinecap="round">
        <path d="M80 90 Q90 96 100 90" />
        <path d="M120 90 Q130 96 140 90" />
      </g>
    );
  }
  if (mood === 'celebrando') {
    return (
      <g stroke="#2a2320" strokeWidth="5" fill="none" strokeLinecap="round">
        <path d="M80 92 Q90 78 100 92" />
        <path d="M120 92 Q130 78 140 92" />
      </g>
    );
  }
  const mirar = mood === 'pensando' ? { x: 3, y: -3 } : { x: 0, y: 0 };
  return (
    <motion.g
      style={{ originX: '50%', originY: '50%' }}
      animate={{ scaleY: [1, 1, 0.1, 1] }}
      transition={{ duration: 4, repeat: Infinity, times: [0, 0.92, 0.96, 1] }}
    >
      <circle cx="90" cy="88" r="14" fill="#fff" />
      <circle cx="130" cy="88" r="14" fill="#fff" />
      <circle cx={90 + mirar.x} cy={89 + mirar.y} r="9" fill="#2a2320" />
      <circle cx={130 + mirar.x} cy={89 + mirar.y} r="9" fill="#2a2320" />
      <circle cx={93 + mirar.x} cy={85 + mirar.y} r="3.2" fill="#fff" />
      <circle cx={133 + mirar.x} cy={85 + mirar.y} r="3.2" fill="#fff" />
    </motion.g>
  );
}

function Boca({ mood }) {
  const props = { stroke: '#5a3b2e', strokeWidth: 3, fill: 'none', strokeLinecap: 'round' };
  if (mood === 'celebrando' || mood === 'saludando') {
    return <path d="M98 114 Q110 130 122 114 Z" fill="#a8423f" stroke="#5a3b2e" strokeWidth="2.5" />;
  }
  if (mood === 'pensando') return <path d="M104 118 Q110 114 116 118" {...props} />;
  if (mood === 'seria') return <line x1="102" y1="118" x2="118" y2="118" {...props} />;
  if (mood === 'durmiendo') return <circle cx="110" cy="118" r="3" {...props} />;
  return <path d="M100 113 Q110 122 120 113" {...props} />;
}
