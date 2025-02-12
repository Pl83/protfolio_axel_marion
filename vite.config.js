import { defineConfig } from 'vite';

export default defineConfig({
  base: './', // Ensures correct paths for build
  build: {
    outDir: 'dist',
  },
});
