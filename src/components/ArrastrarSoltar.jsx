import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { useState } from 'react';
import ResiduoIcon from './ResiduoIcon.jsx';
import Tacho from './Tacho.jsx';

/**
 * Zona de juego con arrastrar y soltar (mouse, dedo y teclado).
 * También se puede tocar un residuo y luego tocar un tacho.
 */
export function ZonaArrastre({ children, residuos, onSoltar, onEmpezar }) {
  const [activo, setActivo] = useState(null);
  const sensores = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 40, tolerance: 10 } }),
    useSensor(KeyboardSensor),
  );
  const residuoActivo = residuos.find((r) => r.id === activo);

  return (
    <DndContext
      sensors={sensores}
      onDragStart={(e) => {
        setActivo(e.active.id);
        onEmpezar?.(e.active.id);
      }}
      onDragCancel={() => setActivo(null)}
      onDragEnd={(e) => {
        setActivo(null);
        if (e.over) onSoltar(e.active.id, e.over.id);
      }}
    >
      {children(activo)}
      <DragOverlay>
        {residuoActivo ? (
          <div className="pieza scale-110 rotate-6 cursor-grabbing">
            <ResiduoIcon residuo={residuoActivo} size={78} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

export function ResiduoArrastrable({ residuo, size = 78, seleccionado, onTocar, conNombre = false, deshabilitado = false }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id: residuo.id, disabled: deshabilitado });
  return (
    <button
      ref={setNodeRef}
      type="button"
      disabled={deshabilitado}
      {...listeners}
      {...attributes}
      onClick={() => onTocar?.(residuo.id)}
      aria-label={`${residuo.nombre}. Arrástralo al tacho correcto o tócalo y luego toca un tacho.`}
      className={`pieza touch-none cursor-grab ${seleccionado ? 'ring-4 ring-yellow-300 scale-105' : ''}`}
      style={{ opacity: isDragging ? 0.25 : 1 }}
    >
      <ResiduoIcon residuo={residuo} size={size} />
      {conNombre && <span className="block text-sm font-bold leading-tight max-w-[7rem]">{residuo.nombre}</span>}
    </button>
  );
}

export function TachoSoltable({ tacho, pulso, brillar, onTocar, size }) {
  const { setNodeRef, isOver } = useDroppable({ id: tacho.id });
  return (
    <button
      ref={setNodeRef}
      type="button"
      onClick={() => onTocar?.(tacho.id)}
      aria-label={`${tacho.nombre}: ${tacho.sub}`}
      className={`rounded-3xl p-1 transition-colors ${isOver ? 'bg-white/70' : 'bg-white/35'}`}
    >
      <Tacho tacho={tacho} abierto={isOver} pulso={pulso} brillar={brillar} size={size} />
    </button>
  );
}
