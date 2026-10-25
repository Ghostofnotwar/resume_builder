import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    // Preview environments proxy the app under their own host name.
    allowedHosts: true,
    hmr: {
      clientPort: 443,
    },
  },
  build: {
    chunkSizeWarningLimit: 900,
  },
});
