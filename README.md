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

> La cámara solo funciona en `localhost` o con `https`. Si entras desde otra PC por la IP (http://192.168…), el nivel 8 pasa solo al modo "elegir a mano".

## Publicar gratis
- **Netlify**: entra a app.netlify.com/drop y arrastra la carpeta `dist/`. Te da un enlace https.
- **Vercel**: sube el proyecto a GitHub → en vercel.com "Add New Project" → elige el repo (Vite se detecta solo; build `npm run build`, salida `dist`).

## El juego
Aventura en 5 capítulos y 10 niveles con historia: Wari (vizcacha), el Apu Kuntur (cóndor), Tika (niña de Pisac) y Ch'ura (monstruo de basura que se transforma).
Minijuegos: clasificar arrastrando, lluvia del mercado, rescate en el río, memoria, quiz, escáner con cámara y batalla final.
Ilustraciones generadas con IA (estilo animación 3D) en `public/img/` (WebP).

## Estructura
`src/data` (historia, niveles, residuos, tachos, personajes, insignias, vivero) · `src/niveles` (minijuegos) · `src/screens` (pantallas) ·
`src/components` · `src/hooks` (voz, sonidos, cámara, clasificador) · `src/context/ProgresoContext.jsx` (progreso en localStorage, clave `wari_progreso_v2`).
