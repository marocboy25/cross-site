import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { DOC_META, pagePath, SITE_URL } from './src/docs/meta'

const escapeHtml = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

/** Swaps the content of one <meta>/<link> tag in the page head, matched by its key attribute. */
function setTag(html: string, key: string, attr: 'content' | 'href', value: string) {
  const tag = new RegExp(`(<(?:meta|link)\\s+${key.replace(/[[\]"]/g, '\\$&')}\\s+${attr}=")[^"]*(")`)
  if (!tag.test(html)) throw new Error(`seo-pages: no ${key} tag in index.html`)
  return html.replace(tag, `$1${escapeHtml(value)}$2`)
}

/**
 * Build only: gives every docs page real HTML for crawlers and link
 * previews, and writes sitemap.xml.
 *
 * The site is one app, so without this every /docs/... URL serves the
 * homepage's index.html (homepage title, description and canonical) until
 * JavaScript runs. Here each docs page gets a copy at dist/docs/<slug>/
 * index.html with its own title, description, canonical and social tags;
 * the static file wins over vercel.json's catch-all rewrite. The sitemap
 * lists the homepage and every docs page from the same list (src/docs/meta.ts).
 */
function seoPages(): Plugin {
  let outDir = 'dist'
  return {
    name: 'seo-pages',
    apply: 'build',
    configResolved(config) {
      outDir = path.resolve(config.root, config.build.outDir)
    },
    closeBundle() {
      const shell = readFileSync(path.join(outDir, 'index.html'), 'utf8')
      for (const page of DOC_META) {
        const url = `${SITE_URL}${pagePath(page)}`
        const title = `${page.title} · Cross Docs`
        let html = shell.replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(title)}</title>`)
        html = setTag(html, 'name="description"', 'content', page.lead)
        html = setTag(html, 'rel="canonical"', 'href', url)
        html = setTag(html, 'property="og:url"', 'content', url)
        html = setTag(html, 'property="og:title"', 'content', title)
        html = setTag(html, 'property="og:description"', 'content', page.lead)
        html = setTag(html, 'name="twitter:title"', 'content', title)
        html = setTag(html, 'name="twitter:description"', 'content', page.lead)
        const dir = path.join(outDir, pagePath(page))
        mkdirSync(dir, { recursive: true })
        writeFileSync(path.join(dir, 'index.html'), html)
      }

      const today = new Date().toISOString().slice(0, 10)
      const urls = [`${SITE_URL}/`, ...DOC_META.map((page) => `${SITE_URL}${pagePath(page)}`)]
      const sitemap = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
        ...urls.map((loc) => `  <url><loc>${loc}</loc><lastmod>${today}</lastmod></url>`),
        '</urlset>',
        '',
      ].join('\n')
      writeFileSync(path.join(outDir, 'sitemap.xml'), sitemap)
    },
  }
}

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
  plugins: [react(), renderSaver(), seoPages()],
  resolve: {
    // Keep paths as-written so the project also works behind a symlink /
    // Windows junction (otherwise Vite treats realpath'd files as outside root).
    preserveSymlinks: true,
  },
})
