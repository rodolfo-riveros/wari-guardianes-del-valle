import { useState } from 'react';
import Encabezado from '../components/Encabezado.jsx';
import Wari from '../components/Wari.jsx';
import Dialogo from '../components/Dialogo.jsx';
import { ACCESORIOS } from '../data/accesorios.js';
import { useProgreso } from '../context/ProgresoContext.jsx';
import { useSonidos } from '../hooks/useSonidos.js';

export default function Tienda({ ir }) {
  const { estado, comprar, equipar } = useProgreso();
  const sonidos = useSonidos();
  const [texto, setTexto] = useState('¡Bienvenido a mi tiendita! Con tus semillas puedes comprarme ropa andina.');
  const [mood, setMood] = useState('saludando');

  function accion(a) {
    if (estado.comprados.includes(a.id)) {
      sonidos.click();
      const puesto = estado.equipados.includes(a.id);
      equipar(a.id);
      setMood('feliz');
      setTexto(puesto ? `Me quito ${a.nombre.toLowerCase()}.` : `¡Me pongo ${a.nombre.toLowerCase()}! ¿Cómo me veo?`);
      return;
    }
    if (estado.semillas < a.precio) {
      sonidos.error();
      setMood('pensando');
      setTexto(`Te faltan ${a.precio - estado.semillas} semillas. ¡Juega un nivel para ganar más!`);
      return;
    }
    sonidos.fiesta();
    comprar(a.id, a.precio);
    setMood('celebrando');
    setTexto(`¡Sulpayki! ¡Me encanta mi ${a.nombre.toLowerCase()}!`);
  }

  return (
    <div className="min-h-[100dvh] bg-gradient-to-b from-[#f7d9a8] to-crema pb-8">
      <div className="tejido h-3" />
      <div className="max-w-3xl mx-auto">
        <Encabezado titulo="Tienda de Wari" onVolver={() => ir('mapa')} />
        <div className="flex items-end gap-2 px-3">
          <Wari mood={mood} size={150} />
          <Dialogo texto={texto} className="flex-1 mb-8" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 px-4 mt-2">
          {ACCESORIOS.map((a) => {
            const comprado = estado.comprados.includes(a.id);
            const puesto = estado.equipados.includes(a.id);
            return (
              <div key={a.id} className="tarjeta p-3 flex items-center gap-3">
                <div className="text-5xl shrink-0" aria-hidden="true">
                  {a.icono}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-extrabold text-xl leading-tight">{a.nombre}</p>
                  <p className="text-sm text-stone-600 leading-tight">{a.desc}</p>
                </div>
                <button
                  type="button"
                  onClick={() => accion(a)}
                  className={`btn shrink-0 !px-3 ${comprado ? (puesto ? 'btn-ocre' : 'btn-verde') : 'btn-primario'}`}
                >
                  {comprado ? (puesto ? 'Quitar' : 'Poner') : `🌱 ${a.precio}`}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
