import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Maneja la cámara del dispositivo. Las imágenes NUNCA se guardan ni se envían:
 * solo se dibuja un cuadro en un canvas en memoria para analizarlo en el navegador.
 */
export function useCamara() {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [estado, setEstado] = useState('inactiva'); // inactiva | pidiendo | lista | error

  const detener = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setEstado('inactiva');
  }, []);

  const iniciar = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setEstado('error');
      return false;
    }
    setEstado('pidiendo');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' }, width: { ideal: 640 }, height: { ideal: 480 } },
        audio: false,
      });
      streamRef.current = stream;
      setEstado('lista');
      return true;
    } catch {
      setEstado('error');
      return false;
    }
  }, []);

  // Conecta el stream al <video> cuando ambos existen.
  useEffect(() => {
    const v = videoRef.current;
    if (estado === 'lista' && v && streamRef.current && v.srcObject !== streamRef.current) {
      v.srcObject = streamRef.current;
      v.play().catch(() => {});
    }
  });

  useEffect(() => () => streamRef.current?.getTracks().forEach((t) => t.stop()), []);

  /** Toma un cuadro del video en un canvas temporal (no se guarda). */
  const capturar = useCallback(() => {
    const v = videoRef.current;
    if (!v || !v.videoWidth) return null;
    const canvas = document.createElement('canvas');
    const lado = Math.min(v.videoWidth, v.videoHeight);
    canvas.width = 224;
    canvas.height = 224;
    const c = canvas.getContext('2d');
    c.drawImage(v, (v.videoWidth - lado) / 2, (v.videoHeight - lado) / 2, lado, lado, 0, 0, 224, 224);
    return canvas;
  }, []);

  return { videoRef, estado, iniciar, detener, capturar };
}
