import type { CSSProperties, ReactNode } from 'react'
import { reveal as revealProps, useMotionVars } from './motion'

export type GlowCorner = 'tl' | 'tr' | 'bl' | 'br' | 'top'

/** Glow position, and which way it drifts as the panel scrolls through (x, y). */
const GLOW: Record<GlowCorner, [string, string, number, number]> = {
  tl: ['0%', '0%', 1, 1],
  tr: ['100%', '0%', -1, 1],
  bl: ['0%', '100%', 1, -1],
  br: ['100%', '100%', -1, -1],
  top: ['50%', '0%', 0, 1],
}

/** Reveal props for an optional stagger step; nothing when `step` is undefined. */
const maybeReveal = (step?: number) => (step === undefined ? { style: {} } : revealProps(step))

/**
 * Panel in the app's card style: a shade lighter than the page, thin violet
 * border, and a soft violet glow from one corner that drifts as the panel
 * scrolls. `glow` picks the corner so neighbouring panels don't repeat.
 * `scene` also makes the cards and icons inside follow the mouse (softer
 * than the hero); `reveal` slides the panel in.
 */
export function AppPanel({
  glow = 'tr',
  scene = false,
  reveal,
  className = '',
  children,
}: {
  glow?: GlowCorner
  scene?: boolean
  reveal?: number
  className?: string
  children: ReactNode
}) {
  const [x, y, dx, dy] = GLOW[glow]
  const ref = useMotionVars<HTMLDivElement>(scene)
  const { style, ...rest } = maybeReveal(reveal)
  return (
    <div
      ref={ref}
      {...rest}
      className={`app-panel relative overflow-hidden ${className}`}
      style={{ ...style, '--glow-x': x, '--glow-y': y, '--glow-dx': dx, '--glow-dy': dy } as CSSProperties}
    >
      {children}
    </div>
  )
}

export type IconName = 'swap' | 'level' | 'block' | 'shield' | 'sheet' | 'coin'

/**
 * A pre-rendered 3D icon from public/icons (see src/dev/RenderStudio.tsx), in
 * three layers so each motion owns one: the wrapper takes the layout classes
 * and pops in when it reaches the screen; the middle layer floats and turns
 * with scroll; the image follows the mouse by `depth` px.
 */
export function Icon3D({ name, depth = 0, reveal = 0, className = '' }: { name: IconName; depth?: number; reveal?: number; className?: string }) {
  return (
    <div className={className} data-pop="" style={{ '--reveal-delay': `${reveal * 90}ms` } as CSSProperties}>
      <div className="icon-scroll">
        <img
          src={`${import.meta.env.BASE_URL}icons/${name}.png`}
          alt=""
          width={640}
          height={640}
          loading="lazy"
          decoding="async"
          className="block h-auto w-full"
          style={depth ? parallax(depth, 0) : undefined}
        />
      </div>
    </div>
  )
}

/**
 * Dark card floating on a panel, over the 3D object: the app's raised card.
 * `depth` is how far it follows the mouse; it also rises faster than the
 * page as you scroll while the icon behind it lags, so they read as layers.
 */
export function FloatCard({
  depth = 0,
  reveal,
  className = '',
  style,
  children,
}: {
  depth?: number
  reveal?: number
  className?: string
  style?: CSSProperties
  children: ReactNode
}) {
  const { style: revealStyle, ...rest } = maybeReveal(reveal)
  return (
    <div {...rest} className={`app-card rounded-2xl ${className}`} style={{ ...revealStyle, ...(depth ? parallax(depth) : {}), ...style }}>
      {children}
    </div>
  )
}

/**
 * Transform for a layer inside a panel: up to `depth` px with the mouse
 * (negative moves against it) and `scroll` px with scroll progress. The panel
 * eases the variables, so no CSS transition is needed.
 */
export function parallax(depth: number, scroll = -Math.abs(depth) * 1.6): CSSProperties {
  return {
    transform: `translate3d(calc(var(--px, 0) * ${depth}px), calc(var(--py, 0) * ${depth}px + var(--sp, 0) * ${scroll}px), 0)`,
  }
}
