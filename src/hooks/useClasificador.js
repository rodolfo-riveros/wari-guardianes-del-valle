import { useCallback, useState } from 'react';
import { RESIDUOS } from '../data/residuos.js';

// El modelo se carga una sola vez y solo cuando se entra al nivel 4 (import dinámico).
let promesaModelo = null;

function cargarModelo() {
  if (!promesaModelo) {
    promesaModelo = (async () => {
      const tf = await import('@tensorflow/tfjs');
      await tf.ready();
      const mobilenet = await import('@tensorflow-models/mobilenet');
      return mobilenet.load({ version: 2, alpha: 1.0 });
    })().catch((e) => {
      promesaModelo = null;
      throw e;
    });
  }
  return promesaModelo;
}

function conTiempoLimite(promesa, ms) {
  return Promise.race([
    promesa,
    new Promise((_, rechazar) => setTimeout(() => rechazar(new Error('tiempo')), ms)),
  ]);
}

function coincide(className, etiqueta) {
  const nombres = className.toLowerCase().split(',').map((s) => s.trim());
  const e = etiqueta.toLowerCase();
  const seguro = e.replace(/[.*+?^$()|[\]\\{}]/g, '\\$&');
  const re = new RegExp('\\b' + seguro + '\\b');
  return nombres.some((n) => n === e || re.test(n));
}

/** Convierte predicciones de MobileNet en un residuo del juego. */
export function mapearPrediccion(predicciones) {
  for (const p of predicciones) {
    const r = RESIDUOS.find((res) => res.mobilenetLabels.some((l) => coincide(p.className, l)));
    if (r) return { residuo: r, confianza: p.probability };
  }
  return { residuo: null, confianza: predicciones[0]?.probability || 0 };
}

export function useClasificador() {
  const [estado, setEstado] = useState(promesaModelo ? 'cargando' : 'inactivo'); // inactivo | cargando | listo | error

  const cargar = useCallback(async () => {
    setEstado('cargando');
    try {
      await conTiempoLimite(cargarModelo(), 45000);
      setEstado('listo');
      return true;
    } catch {
      setEstado('error');
      return false;
    }
  }, []);

  const clasificar = useCallback(async (canvas) => {
    const modelo = await cargarModelo();
    const pred = await modelo.classify(canvas, 5);
    return mapearPrediccion(pred);
  }, []);

  return { estado, cargar, clasificar };
}
