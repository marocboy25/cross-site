import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  define: {
    // Some borrowed UI components reference process.env.NODE_ENV in dev-only checks.
    'process.env.NODE_ENV': JSON.stringify(mode),
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    // Keep paths as-written so the project also works when it lives behind a
    // symlink / Windows junction (otherwise Vite realpath-resolves files and
    // treats them as outside the root).
    preserveSymlinks: true,
  },
}))
