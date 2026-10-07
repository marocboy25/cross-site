import { mkdirSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * Dev server only: accepts PNGs posted by the /__render page and writes them
 * to public/icons/<name>.png. Names are restricted to [a-z0-9-].
 */
function renderSaver(): Plugin {
  return {
    name: 'render-saver',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use('/__save-render', (req, res) => {
        const name = new URL(req.url ?? '', 'http://localhost').searchParams.get('name') ?? ''
        if (req.method !== 'POST' || !/^[a-z0-9-]+$/.test(name)) {
          res.statusCode = 400
          res.end('POST with ?name=[a-z0-9-]+')
          return
        }
        const chunks: Buffer[] = []
        req.on('data', (chunk: Buffer) => chunks.push(chunk))
        req.on('end', () => {
          const dir = path.resolve(__dirname, 'public/icons')
          mkdirSync(dir, { recursive: true })
          const file = path.join(dir, `${name}.png`)
          writeFileSync(file, Buffer.concat(chunks))
          res.end(`saved public/icons/${name}.png`)
        })
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), renderSaver()],
  resolve: {
    // Keep paths as-written so the project also works behind a symlink /
    // Windows junction (otherwise Vite treats realpath'd files as outside root).
    preserveSymlinks: true,
  },
})
