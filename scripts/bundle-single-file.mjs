// Builds a single self-contained HTML page from `dist/` for sharing (e.g. as a
// Claude artifact). Assets are embedded as data URIs and handed to the app via
// window.__CROSS_ASSETS (see src/lib/assets.ts).
//
// Usage: node scripts/bundle-single-file.mjs <video.mp4> <out.html>

import fs from 'node:fs'
import path from 'node:path'

const [videoPath, outPath] = process.argv.slice(2)
if (!videoPath || !outPath) {
  console.error('usage: node scripts/bundle-single-file.mjs <video.mp4> <out.html>')
  process.exit(1)
}

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..')
const dist = path.join(root, 'dist')
const assetsDir = path.join(dist, 'assets')

const files = fs.readdirSync(assetsDir)
const cssFile = files.find((f) => f.endsWith('.css'))
const jsFile = files.find((f) => f.endsWith('.js'))
if (!cssFile || !jsFile) throw new Error('dist/assets is missing the css or js bundle; run `npm run build` first')

const css = fs.readFileSync(path.join(assetsDir, cssFile), 'utf8')
let js = fs.readFileSync(path.join(assetsDir, jsFile), 'utf8')
if (js.includes('</script')) js = js.replace(/<\/script/g, '<\\/script')

const dataUri = (file, mime) => `data:${mime};base64,${fs.readFileSync(file).toString('base64')}`

const video = dataUri(videoPath, 'video/mp4')
const poster = dataUri(path.join(root, 'public/videos/cross-hero-poster.jpg'), 'image/jpeg')
const logo = dataUri(path.join(root, 'public/brand/cross-logo.png'), 'image/png')

// The video is embedded once and reused for the mobile source.
const assets = { videoDesktop: video, poster, logo }

const html = `<title>Cross</title>
<link rel="icon" type="image/png" href="${logo}">
<meta name="theme-color" content="#000000">
<style>
${css}
html, body { background: #000; margin: 0; }
</style>
<div id="root"></div>
<script>
window.__CROSS_ASSETS = ${JSON.stringify(assets)};
window.__CROSS_ASSETS.videoMobile = window.__CROSS_ASSETS.videoDesktop;
</script>
<script type="module">
${js}
</script>
`

fs.writeFileSync(outPath, html)
const mb = (n) => (n / 1024 / 1024).toFixed(2) + ' MB'
console.log(`wrote ${outPath} (${mb(Buffer.byteLength(html))}); video ${mb(fs.statSync(videoPath).size)} raw`)
