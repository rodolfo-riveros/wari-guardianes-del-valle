import { useState } from 'react';
import Hud from '../components/Hud.jsx';
import Escena from '../components/Escena.jsx';
import TarjetaResiduo from '../components/TarjetaResiduo.jsx';
import Modal from '../components/Modal.jsx';
import { RESIDUOS } from '../data/residuos.js';
import { TACHOS } from '../data/tachos.js';
import { useProgreso } from '../context/ProgresoContext.jsx';

export default function Album({ ir }) {
  const { estado } = useProgreso();
  const [abierta, setAbierta] = useState(null);

  return (
    <div className="relative min-h-[100dvh] pb-10">
      <Escena fondo="escuela" oscurecer={0.45} />
      <div className="relative max-w-5xl mx-auto">
        <Hud titulo={`Álbum · ${estado.album.length}/${RESIDUOS.length}`} onVolver={() => ir('mapa')} />
        <p className="px-4 text-white font-bold text-lg texto-sombra">Cada vez que clasificas bien un residuo, ganas su carta. ¡Tócala para ver su historia!</p>
        {TACHOS.map((t) => (
          <section key={t.id} className="px-3 mt-4">
            <h2 className="inline-flex items-center gap-2 rounded-full pl-1 pr-4 py-1 text-white font-extrabold text-lg mb-2 shadow-lg" style={{ background: t.color, border: '3px solid #fff' }}>
              <img src={t.img} alt="" className="h-9 w-auto" /> {t.nombre} · {t.sub}
            </h2>
            <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-7 gap-2 sm:gap-3">
              {RESIDUOS.filter((r) => r.tacho === t.id).map((r) => {
                const tiene = estado.album.includes(r.id);
                return (
                  <button
                    key={r.id}
                    type="button"
                    disabled={!tiene}
                    onClick={() => setAbierta(r)}
                    className="relative flex flex-col items-center rounded-2xl p-2 shadow-[0_5px_0_rgba(0,0,0,0.25)] border-4 aspect-[3/4] justify-between active:translate-y-1"
                    style={{
                      borderColor: tiene ? t.color : 'rgba(255,255,255,.4)',
                      background: tiene ? 'linear-gradient(180deg,#fff,#fff4dc)' : 'rgba(255,255,255,.25)',
                    }}
                    aria-label={tiene ? r.nombre : 'Carta por descubrir'}
                  >
                    <img src={r.img} alt="" className="w-full flex-1 min-h-0 object-contain" style={tiene ? undefined : { filter: 'brightness(0)', opacity: 0.45 }} />
                    <span className={`text-[0.72rem] sm:text-sm font-extrabold leading-tight text-center ${tiene ? '' : 'text-white'}`}>{tiene ? r.nombre : '¿?'}</span>
                  </button>
                );
              })}
            </div>
          </section>
        ))}
      </div>
      <Modal abierto={!!abierta} onCerrar={() => setAbierta(null)} etiqueta="Carta">
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
