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
import Tacho from './Tacho.jsx';

/**
 * Zona de juego con arrastrar y soltar (mouse, dedo y teclado).
 * También se puede tocar un residuo y luego tocar un tacho.
 */
export function ZonaArrastre({ children, residuos, onSoltar, onEmpezar }) {
  const [activo, setActivo] = useState(null);
  const sensores = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { distance: 5 } }),
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
      <DragOverlay dropAnimation={null}>
        {residuoActivo ? (
          <img src={residuoActivo.img} alt="" className="w-24 h-24 object-contain scale-110 rotate-6 cursor-grabbing sprite" />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

export function ResiduoArrastrable({ residuo, size = 80, seleccionado, onTocar, deshabilitado = false, conNombre = false }) {
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
      className={`relative touch-none cursor-grab flex flex-col items-center rounded-3xl transition ${
        seleccionado ? 'bg-yellow-200/70 ring-4 ring-yellow-300 scale-110' : ''
      }`}
      style={{ opacity: isDragging ? 0.2 : 1 }}
    >
      <img src={residuo.img} alt="" draggable={false} style={{ width: size, height: size }} className="object-contain sprite" />
      {conNombre && (
        <span className="chip !text-sm !px-2 !py-0 -mt-1 max-w-[9rem] text-center leading-tight">{residuo.nombre}</span>
      )}
    </button>
  );
}

export function TachoSoltable({ tacho, pulso, brillar, onTocar, alto }) {
  const { setNodeRef, isOver } = useDroppable({ id: tacho.id });
  return (
    <button
      ref={setNodeRef}
      type="button"
      onClick={() => onTocar?.(tacho.id)}
      aria-label={`${tacho.nombre}: ${tacho.sub}`}
      className="rounded-3xl px-0.5 pt-1 pb-1 flex justify-center"
    >
      <Tacho tacho={tacho} abierto={isOver} pulso={pulso} brillar={brillar} alto={alto} />
    </button>
  );
}
