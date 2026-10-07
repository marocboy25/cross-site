import { MARK_PATHS, MARK_VIEWBOX } from '../markPaths'

/**
 * 2D outlines that become the 3D brand objects. Each is an SVG string; holes
 * use fill-rule="evenodd". Everything is extruded and bevelled the same way
 * (see geometry.ts), so the mark and the icons read as one family.
 */

/** Rounded rectangle as an SVG path. */
function rr(x: number, y: number, w: number, h: number, r: number) {
  return `M ${x + r} ${y} H ${x + w - r} A ${r} ${r} 0 0 1 ${x + w} ${y + r} V ${y + h - r} A ${r} ${r} 0 0 1 ${x + w - r} ${y + h} H ${x + r} A ${r} ${r} 0 0 1 ${x} ${y + h - r} V ${y + r} A ${r} ${r} 0 0 1 ${x + r} ${y} Z`
}

/**
 * Polygon with every corner filleted (radius r, shortened on short edges),
 * so straight-edged shapes come out soft rather than sharp.
 */
function roundPoly(pts: [number, number][], r: number) {
  const n = pts.length
  let d = ''
  pts.forEach((p, i) => {
    const prev = pts[(i - 1 + n) % n]
    const next = pts[(i + 1) % n]
    const toPrev = [prev[0] - p[0], prev[1] - p[1]]
    const toNext = [next[0] - p[0], next[1] - p[1]]
    const lp = Math.hypot(toPrev[0], toPrev[1])
    const ln = Math.hypot(toNext[0], toNext[1])
    const k = Math.min(r, lp / 2, ln / 2)
    const a = [p[0] + (toPrev[0] / lp) * k, p[1] + (toPrev[1] / lp) * k]
    const b = [p[0] + (toNext[0] / ln) * k, p[1] + (toNext[1] / ln) * k]
    d += `${i === 0 ? 'M' : 'L'} ${a[0]} ${a[1]} Q ${p[0]} ${p[1]} ${b[0]} ${b[1]} `
  })
  return `${d}Z`
}

/** Circle as an SVG path. */
function circle(cx: number, cy: number, r: number) {
  return `M ${cx - r} ${cy} A ${r} ${r} 0 1 0 ${cx + r} ${cy} A ${r} ${r} 0 1 0 ${cx - r} ${cy} Z`
}

const svg = (paths: string[], evenOdd = false) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000">${paths
    .map((d) => `<path d="${d}"${evenOdd ? ' fill-rule="evenodd"' : ''}/>`)
    .join('')}</svg>`

/**
 * The Cross mark (outline in ../markPaths.ts), traced from the logo artwork: a top
 * chevron and two arms. Gaps between the pieces are ~47 units at their
 * narrowest, which caps how far the bevel may grow outward.
 */
const MARK = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${MARK_VIEWBOX} ${MARK_VIEWBOX}">${MARK_PATHS.map((d) => `<path d="${d}"/>`).join('')}</svg>`

/** P2P swap: two arrows passing in opposite directions. */
const SWAP = svg([
  // → on top
  roundPoly([[140, 240], [600, 240], [600, 140], [860, 320], [600, 500], [600, 400], [140, 400]], 42),
  // ← below
  roundPoly([[860, 600], [400, 600], [400, 500], [140, 680], [400, 860], [400, 760], [860, 760]], 42),
])

/** Flat price line: a level bar with a ball resting dead centre. Nothing tips. */
const LEVEL = svg([rr(80, 560, 840, 110, 55), circle(500, 395, 125)])

/** Big block: three stacked slabs, widest at the base. */
const BLOCK = svg([rr(290, 210, 420, 150, 46), rr(230, 410, 540, 150, 46), rr(170, 610, 660, 160, 50)])

/** Token trust: a shield with a check cut through it. */
const SHIELD = svg(
  [
    `M 470 101 Q 500 90 530 101 L 800 199 Q 830 210 830 242 V 470 C 830 700 690 830 500 920 C 310 830 170 700 170 470 V 242 Q 170 210 200 199 Z ${roundPoly(
      [[330, 500], [425, 405], [480, 460], [645, 295], [740, 390], [480, 650]],
      26,
    )}`,
  ],
  true,
)

/** Ticker coin: a plain bevelled disc. */
const COIN = svg([circle(500, 500, 440)])

/** Facts: a sheet with three ruled rows. */
const SHEET = svg(
  [`${rr(220, 100, 560, 800, 70)} ${rr(320, 290, 360, 70, 35)} ${rr(320, 465, 360, 70, 35)} ${rr(320, 640, 240, 70, 35)}`],
  true,
)

export const SHAPES = {
  mark: MARK,
  swap: SWAP,
  level: LEVEL,
  block: BLOCK,
  shield: SHIELD,
  sheet: SHEET,
  coin: COIN,
} as const

export type ShapeName = keyof typeof SHAPES
