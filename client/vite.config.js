import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Vite config — the equivalent of your build settings.
// The react() plugin enables JSX and fast refresh (hot reload).
export default defineConfig({
  plugins: [react()],
});
