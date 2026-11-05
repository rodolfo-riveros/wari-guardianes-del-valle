import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base './' permite abrir el build desde cualquier carpeta
// (por ejemplo http://localhost/wari-guardianes-del-valle/dist/ en XAMPP).
export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 2500,
  },
});
