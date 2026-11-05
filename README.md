# Wari y los Guardianes del Valle 🦫💧

Juego web educativo (6 a 11 años) para aprender a separar residuos con el código de colores peruano.
React 18 + Vite + Tailwind + Framer Motion + dnd-kit + TensorFlow.js (MobileNet). Sin backend.

## Ejecutar

```bash
npm install      # solo la primera vez
npm run dev      # abre http://localhost:5173
npm run build    # genera la carpeta dist/
npm run preview  # prueba la versión de dist/ en http://localhost:4173
```

### Con XAMPP (Apache)
1. `npm run build`
2. Enciende Apache en el panel de XAMPP.
3. Abre `http://localhost/wari-guardianes-del-valle/dist/`

> La cámara solo funciona en `localhost` o con `https`. Si entras desde otra PC por la IP (http://192.168…), el nivel 4 pasa solo al modo "elegir a mano".

## Publicar gratis
- **Netlify**: entra a app.netlify.com/drop y arrastra la carpeta `dist/`. Te da un enlace https.
- **Vercel**: sube el proyecto a GitHub → en vercel.com "Add New Project" → elige el repo (Vite se detecta solo; build `npm run build`, salida `dist`).

## Estructura
`src/data` (residuos, tachos, frases, insignias, accesorios, niveles) · `src/components` (Wari, Laguna, Tacho, tarjetas…) ·
`src/hooks` (voz, sonidos, cámara, clasificador) · `src/screens` (pantallas) · `src/context/ProgresoContext.jsx` (progreso en localStorage, clave `wari_progreso_v1`).
