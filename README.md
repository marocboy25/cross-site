# Cross: marketing site

Live at https://usecrossp2p.com (Vercel, auto-deploys from `main` on GitHub `marocboy25/cross-site`).
The app itself lives at https://app.usecrossp2p.com.

React 18 + TypeScript + Vite + Tailwind CSS, plus three.js via React Three Fiber v8 + drei v9
(lazy-loaded near the viewport, static PNG fallback) for the live 3D mark.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production build into dist/
```

## Structure

```
src/
  content/site.ts        all copy, numbers, links and contract addresses
  components/
    Button.tsx           ButtonLink (violet pill) + TextLink (mono, underlined)
    Section.tsx          Container, SectionHeading, Section
    Panel.tsx            AppPanel, Icon3D, FloatCard, pointer parallax helpers
    Logo.tsx, icons.tsx
    three/
      shapes.ts            2D outlines: the Cross mark + five icons
      models.tsx           extrude + bevel, the soft violet material, studio lights
      MarkCanvas.tsx       live scene: front-facing mark, float, ±20° mouse tilt
      LiveMark.tsx         lazy-loads MarkCanvas on desktop; static PNG otherwise
  dev/RenderStudio.tsx   dev-only /__render page that exports the PNGs
  sections/              one file per page section, in page order in App.tsx
public/icons/            cross-mark.png (fallback) + swap, level, block, shield, coin (sheet unused)
```

To change wording or numbers, edit `src/content/site.ts` only. Values still to
fill in are written as `[PLACEHOLDER]` and listed in `PLACEHOLDERS` at the
bottom of that file; any link still set to a placeholder is hidden from the page
until it is replaced.

## 3D assets

Only the Cross mark runs live (hero and final CTA, never both animating: each
canvas mounts near the viewport and stops rendering off screen). Phones,
reduced motion, missing WebGL or a WebGL error all get the static PNG.

Icons are rendered once from the same setup and saved as transparent PNGs. To
re-render after changing a shape, material or light, run `npm run dev` and open
`http://localhost:5173/__render?asset=<name>`, then in the browser console:

```js
await window.__saveRender('<name>') // writes public/icons/<name>.png
```

Assets: `cross-mark`, `swap`, `level`, `block`, `shield`, `sheet`, `coin`. The save
endpoint exists only on the dev server (see `renderSaver` in `vite.config.ts`).

## Design rules

- Dark, matching the app (app.usecrossp2p.com) exactly: its colour tokens are in
  `tailwind.config.js` (`paper` = page #050508, `ink` = text, `dim` = muted, `violet`, `bid` = green).
  Green is for positive numbers and checks only (0.00%, 0%, None, checkmarks), as in the app.
- Decoration is limited to app-style panels (`AppPanel`: a shade lighter than the page, thin violet
  border, soft violet glow from one corner) and the 3D objects on them. No lines or app mockups.
- One 3D family: same extrusion, bevel, soft matte violet material and lighting for the mark and
  every icon, lit for a dark page (rim lights, violet ground glow). The mark rests facing the viewer.
- Panels are scenes, not lone icons: dark app-style FloatCards with real content overlap the 3D object.
  Vary layouts section to section, and break the rhythm with panel-free bands (stat strip, ticker).
- The token ticker lists only tokens the app supports (NVDA, AAPL, TSLA, ETH, USDG). Add more
  only once the app lists them.
- Fonts are the app's: Inter (headlines use its .display: 700, tight), Space Grotesk for card
  titles, IBM Plex Mono for labels and numbers.
- Copy comes from the app wherever the app already says it. Numbers come from the app; never invent one.
- Just Claim (justclaimnow.com) is mood only. Don't borrow its icon tile, layout or wording.
