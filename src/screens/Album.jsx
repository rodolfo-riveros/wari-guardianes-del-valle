import { useState } from 'react';
import Encabezado from '../components/Encabezado.jsx';
import Icono from '../components/Icono.jsx';
import ResiduoIcon from '../components/ResiduoIcon.jsx';
import TarjetaResiduo from '../components/TarjetaResiduo.jsx';
import Modal from '../components/Modal.jsx';
import { RESIDUOS } from '../data/residuos.js';
import { TACHOS, TACHO_POR_ID } from '../data/tachos.js';
import { useProgreso } from '../context/ProgresoContext.jsx';

export default function Album({ ir }) {
  const { estado } = useProgreso();
  const [abierta, setAbierta] = useState(null);

  return (
    <div className="min-h-[100dvh] bg-gradient-to-b from-laguna to-[#9fd6f2] pb-8">
      <div className="max-w-3xl mx-auto">
        <Encabezado titulo="Álbum de residuos" onVolver={() => ir('mapa')} />
        <p className="px-4 text-white font-bold text-lg drop-shadow">
          Tienes {estado.album.length} de {RESIDUOS.length} cartitas. ¡Clasifica bien para ganar más!
        </p>
        {TACHOS.map((t) => (
          <section key={t.id} className="px-4 mt-4">
            <h2 className="inline-block rounded-full px-4 py-1 text-white font-extrabold text-lg mb-2" style={{ background: t.color }}>
              <Icono nombre={t.icono} className="bg-white rounded-full p-0.5" /> {t.nombre} · {t.sub}
            </h2>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {RESIDUOS.filter((r) => r.tacho === t.id).map((r) => {
                const tiene = estado.album.includes(r.id);
                return (
                  <button
                    key={r.id}
                    type="button"
                    disabled={!tiene}
                    onClick={() => setAbierta(r)}
                    className="flex flex-col items-center rounded-2xl bg-white p-2 shadow-[0_4px_0_rgba(0,0,0,0.2)] border-4 min-h-[110px]"
                    style={{ borderColor: tiene ? TACHO_POR_ID[r.tacho].color : '#d6d3d1' }}
                    aria-label={tiene ? r.nombre : 'Cartita por descubrir'}
                  >
                    <ResiduoIcon residuo={r} size={58} apagado={!tiene} />
                    <span className="text-sm font-bold leading-tight text-center">{tiene ? r.nombre : '¿?'}</span>
                  </button>
                );
              })}
            </div>
          </section>
        ))}
      </div>
      <Modal abierto={!!abierta} onCerrar={() => setAbierta(null)} etiqueta="Cartita">
        {abierta && (
          <TarjetaResiduo residuo={abierta}>
            <button type="button" className="btn btn-verde" onClick={() => setAbierta(null)}>
              Cerrar
            </button>
          </TarjetaResiduo>
        )}
      </Modal>
    </div>
  );
}
