import { defineConfig } from 'vite';

export default defineConfig({
  server: { port: 5173 },
  build: { 
    sourcemap: true,
    rollupOptions: {
      input: {
        main: 'index.html',
        game: 'simple-game.html',
        test: 'test-system.html'
      }
    }
  }
});
