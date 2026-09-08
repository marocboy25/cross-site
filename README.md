# Cross — scroll-scrubbed hero

React 18 + TypeScript + Vite + Tailwind CSS + lucide-react.

```bash
npm install
npm run dev
```

Assets live in `public/videos/`:

| File | Purpose |
| --- | --- |
| `cross-hero-desktop.mp4` | 16:9 hero video, scrubbed by scroll on `md+` |
| `cross-hero-mobile.mp4` | optional 9:16 video for `< md`; falls back to the desktop file (letterboxed) if missing |
| `cross-hero-poster.jpg` | poster frame shown before the video loads / when `prefers-reduced-motion` is set |

## Structure

- Routes (`src/App.tsx`, react-router-dom): `/` → `src/pages/LandingPage.tsx`, `/docs` → `src/pages/DocsPage.tsx`. `ScrollToHash` scrolls to `location.hash` on every route change.
- `src/components/SiteNav.tsx` — fixed nav shared by both pages; links live in `src/lib/links.ts` (also holds the external app URL)
- `src/components/Hero.tsx` — scroll-scrubbed hero
- `src/components/sections/` — `WhyCross` (FeaturesGrid on the silk wash), `Comparison` (Without / With Cross, BorderTrail)
- `src/components/ui/` — page blocks: `how-it-works` (4-step grid), `cta-section`, `footer-section`; primitives: `origin-button`, `spotlight-card` (GlowCard), `dot-grid`, `spotlight`, `card`, `features-grid`, `shimmer-text`, `border-trail`, `badge`, `button`
- Landing page order: Hero → How Cross Works → Why Cross → Comparison → CTA → Footer
- `scripts/bundle-single-file.mjs` — inlines `dist/` plus the video, poster and logo into one HTML file for sharing (that build switches to hash routing automatically)
- `public/_redirects` (Netlify) and `vercel.json` (Vercel) send every path to `index.html` so `/docs` works on static hosts
- `src/lib/utils.ts` — shadcn-style `cn()` helper; `@/` aliases `src/`

Brand assets live in `public/brand/` (`cross-logo.png` is used for the nav mark and favicon).

## Encoding hero videos for scrubbing

Scroll-scrubbing seeks the video on every frame. A normally encoded MP4 has a keyframe
only every few seconds, so each seek has to decode every frame since the last keyframe
and the scrub stutters. Re-encode with a keyframe on every frame (all-intra):

```bash
ffmpeg -i source.mp4 -an -c:v libx264 -g 1 -keyint_min 1 -bf 0 -sc_threshold 0 -crf 24 -preset slow -pix_fmt yuv420p -movflags +faststart public/videos/cross-hero-desktop.mp4
```

Raise `-crf` (26–28) for a smaller file, lower it (20–22) for more quality.

Tune the scrub distance with `SCROLL_HEIGHT_VH` / `SCROLL_HEIGHT_VH_MOBILE` at the top of
`src/components/Hero.tsx`.
