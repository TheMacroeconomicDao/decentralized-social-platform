import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import TanStackRouterVite from '@tanstack/router-plugin/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), TanStackRouterVite({
    target: "react",
    generatedRouteTree: "src/app/routerTree.gen.ts",
    routesDirectory: "src/app/routes"
  })],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
