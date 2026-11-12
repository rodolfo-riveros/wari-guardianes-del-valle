import Personaje from './Personaje.jsx';
import Dialogo from './Dialogo.jsx';

/** Personaje + globo de diálogo, para dar instrucciones y pistas dentro de los niveles. */
export default function Guia({ quien = 'wari', pose = 'feliz', texto, alto = 'clamp(84px, 15vh, 150px)', className = '' }) {
  return (
    <section className={`relative z-20 flex items-end gap-1 px-3 ${className}`}>
      <div className="shrink-0 -mb-1">
        <Personaje quien={quien} pose={pose} alto={alto} voltear={quien === 'tika'} />
      </div>
      <Dialogo texto={texto} quien={quien} className="flex-1 mb-3 max-w-2xl" />
    </section>
  );
}
