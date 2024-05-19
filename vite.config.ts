import path from 'path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  // https://inspector.dev/how-to-make-vite-hot-module-replacement-work-on-windows/
  // With webpack we used to work by running all the commands directly inside the Homestead VM.
  // But running the Vite dev server (npm run dev) caused the HMR to not work.
  // The problem is not the virtualized environment per-se. But the virtualized environment on top of a Windows machine. This is because of
  // the way WSL (Windows Subsystem for Linux) currently works. The workaround is to use usePolling option in the Vite config file:
  // Consider that this option implies a high CPU usage.
  server: {
    watch: {
      usePolling: true,
    },
  },
});
