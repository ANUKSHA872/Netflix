import { defineConfig } from 'vite';
import path from 'path';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE_PATH || '/',
  build: {
    outDir: path.resolve(__dirname, '../dist'),
  },
    server: {
    port: 5173,
    host: true,
    proxy: {
      '/api': 'http://localhost:5000'
    }
  }
});
