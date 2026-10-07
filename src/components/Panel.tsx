import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react'
import { reveal as revealProps } from './motion'

export type GlowCorner = 'tl' | 'tr' | 'bl' | 'br' | 'top'

const GLOW: Record<GlowCorner, [string, string]> = {
  tl: ['0%', '0%'],
  tr: ['100%', '0%'],
  bl: ['0%', '100%'],
  br: ['100%', '100%'],
  top: ['50%', '0%'],
}

/** Reveal props for an optional stagger step; nothing when `step` is undefined. */
const maybeReveal = (step?: number) => (step === undefined ? { style: {} } : revealProps(step))

/**
 * Panel in the app's card style: a shade lighter than the page, thin violet
 * border, and a soft violet glow from one corner. `glow` picks the corner so
 * neighbouring panels don't repeat. `scene` makes the cards and icons inside
 * drift with the pointer (softer than the hero); `reveal` slides it in.
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
  const [x, y] = GLOW[glow]
  const ref = usePointerParallax<HTMLDivElement>(scene)
  const { style, ...rest } = maybeReveal(reveal)
  return (
    <div
      ref={ref}
      {...rest}
      className={`app-panel relative overflow-hidden ${className}`}
      style={{ ...style, '--glow-x': x, '--glow-y': y } as CSSProperties}
    >
      {children}
    </div>
  )
}

export type IconName = 'swap' | 'level' | 'block' | 'shield' | 'sheet' | 'coin'

/**
 * A pre-rendered 3D icon from public/icons (see src/dev/RenderStudio.tsx).
 * Layout classes go on the wrapper; the image itself takes the parallax, so it
 * composes with any transform in `className`.
 */
export function Icon3D({ name, depth = 0, reveal, className = '' }: { name: IconName; depth?: number; reveal?: number; className?: string }) {
  return (
    <div className={className} {...maybeReveal(reveal)}>
      <img
        src={`${import.meta.env.BASE_URL}icons/${name}.png`}
        alt=""
        width={640}
        height={640}
        loading="lazy"
        decoding="async"
        className="parallax-layer block h-auto w-full"
        style={depth ? parallax(depth) : undefined}
      />
    </div>
  )
}

/** Dark card floating on a panel, over the 3D object: the app's raised card. */
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
 * Pointer parallax: writes the pointer position (-1..1 across the window) to
 * --px / --py on the returned element, once per frame, while it's on screen.
 * Children move with `parallax(depth)`. Off for touch-only devices and
 * reduced motion.
 */
export function usePointerParallax<T extends HTMLElement>(enabled = true) {
  const ref = useRef<T>(null)
  useEffect(() => {
    const el = ref.current
    if (!el || !enabled) return
    if (matchMedia('(prefers-reduced-motion: reduce)').matches || matchMedia('(hover: none)').matches) return
    let frame = 0
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        el.style.setProperty('--px', ((e.clientX / window.innerWidth) * 2 - 1).toFixed(3))
        el.style.setProperty('--py', ((e.clientY / window.innerHeight) * 2 - 1).toFixed(3))
      })
    }
    let listening = false
    const listen = (on: boolean) => {
      if (on === listening) return
      listening = on
      if (on) window.addEventListener('pointermove', onMove, { passive: true })
      else window.removeEventListener('pointermove', onMove)
    }
    const observer = new IntersectionObserver(([entry]) => listen(entry.isIntersecting))
    observer.observe(el)
    return () => {
      observer.disconnect()
      listen(false)
      cancelAnimationFrame(frame)
    }
  }, [enabled])
  return ref
}

/**
 * Style for a layer that drifts up to `depth` px with the pointer (negative
 * moves against it). Easing lives in CSS (.app-card, .btn-primary,
 * .parallax-layer) so it combines with reveal and hover transitions.
 */
export function parallax(depth: number): CSSProperties {
  return {
    transform: `translate3d(calc(var(--px, 0) * ${depth}px), calc(var(--py, 0) * ${depth}px), 0)`,
  }
}
