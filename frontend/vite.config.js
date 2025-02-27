import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "VITE_"); // ✅ Lädt nur VITE_ Variablen

  return {
    root: "../frontend",
    plugins: [
      react(),
      tailwindcss()
    ],
    server: {
      port: 5173,
      strictPort: true,
    },
    define: {
      'process.env': env // ✅ `.env`-Variablen direkt verfügbar machen
    }
  };
});