import { defineConfig } from 'vite';

export default defineConfig({
  base: './', // Ensures relative asset paths, making it GitHub Pages compatible
  build: {
    outDir: 'dist',
  }
});
