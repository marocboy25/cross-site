import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

/**
 * GlowCard — a glass card whose border and backdrop light up around the pointer.
 *
 * The pointer position is written once to `--x/--y/--xp/--yp` on <html>; every
 * card reads it through `background-attachment: fixed` radial gradients, so the
 * spotlight tracks the mouse across all cards at once. The `[data-glow]` rules
 * that draw the border glow live in `src/index.css` (hoisted there so they are
 * not duplicated per instance).
 */

interface GlowCardProps {
  children: ReactNode
  className?: string
  glowColor?: 'blue' | 'purple' | 'green' | 'red' | 'orange'
  size?: 'sm' | 'md' | 'lg'
  width?: string | number
  height?: string | number
  customSize?: boolean // When true, ignores size prop and uses width/height or className
}

const glowColorMap = {
  blue: { base: 220, spread: 200 },
  // 292° ≈ Cross's #C026F5; the narrow spread keeps the glow locked to that hue
  // with only a faint shimmer as the pointer moves.
  purple: { base: 292, spread: 24 },
  green: { base: 120, spread: 200 },
  red: { base: 0, spread: 200 },
  orange: { base: 30, spread: 200 },
}

const sizeMap = {
  sm: 'w-48 h-64',
  md: 'w-64 h-80',
  lg: 'w-80 h-96',
}

// One document-level pointer listener shared by every mounted card.
let pointerSubscribers = 0
const syncPointer = ({ x, y }: PointerEvent) => {
  const root = document.documentElement
  root.style.setProperty('--x', x.toFixed(2))
  root.style.setProperty('--xp', (x / window.innerWidth).toFixed(2))
  root.style.setProperty('--y', y.toFixed(2))
  root.style.setProperty('--yp', (y / window.innerHeight).toFixed(2))
}

export function GlowCard({
  children,
  className = '',
  glowColor = 'blue',
  size = 'md',
  width,
  height,
  customSize = false,
}: GlowCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Touch devices have no hovering pointer, so the follow-glow is invisible
    // there; skip the listener (and the per-move style writes) entirely.
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    if (pointerSubscribers === 0) {
      document.addEventListener('pointermove', syncPointer)
    }
    pointerSubscribers += 1
    return () => {
      pointerSubscribers -= 1
      if (pointerSubscribers === 0) {
        document.removeEventListener('pointermove', syncPointer)
      }
    }
  }, [])

  const { base, spread } = glowColorMap[glowColor]

  // Determine sizing
  const getSizeClasses = () => {
    if (customSize) {
      return '' // Let className or inline styles handle sizing
    }
    return sizeMap[size]
  }

  const getInlineStyles = () => {
    const baseStyles = {
      '--base': base,
      '--spread': spread,
      '--radius': '14',
      '--border': '3',
      '--backdrop': 'hsl(220 8% 5% / 0.6)',
      '--backup-border': '#2A2A30',
      '--size': '200',
      '--outer': '1',
      '--border-size': 'calc(var(--border, 2) * 1px)',
      '--spotlight-size': 'calc(var(--size, 150) * 1px)',
      '--hue': 'calc(var(--base) + (var(--xp, 0) * var(--spread, 0)))',
      backgroundImage: `radial-gradient(
        var(--spotlight-size) var(--spotlight-size) at
        calc(var(--x, 0) * 1px)
        calc(var(--y, 0) * 1px),
        hsl(var(--hue, 210) calc(var(--saturation, 100) * 1%) calc(var(--lightness, 70) * 1%) / var(--bg-spot-opacity, 0.1)), transparent
      )`,
      backgroundColor: 'var(--backdrop, transparent)',
      backgroundSize: 'calc(100% + (2 * var(--border-size))) calc(100% + (2 * var(--border-size)))',
      backgroundPosition: '50% 50%',
      backgroundAttachment: 'fixed',
      border: 'var(--border-size) solid var(--backup-border)',
      position: 'relative',
      touchAction: 'none',
    } as CSSProperties

    // Add width and height if provided
    if (width !== undefined) {
      baseStyles.width = typeof width === 'number' ? `${width}px` : width
    }
    if (height !== undefined) {
      baseStyles.height = typeof height === 'number' ? `${height}px` : height
    }

    return baseStyles
  }

  return (
    <div
      ref={cardRef}
      data-glow
      style={getInlineStyles()}
      className={cn(
        getSizeClasses(),
        !customSize && 'aspect-[3/4]',
        'rounded-2xl relative grid grid-rows-[1fr_auto] shadow-[0_1rem_2rem_-1rem_black] p-4 gap-4 md:backdrop-blur-[5px]',
        className,
      )}
    >
      <div ref={innerRef} data-glow></div>
      {children}
    </div>
  )
}

export { GlowCard as default }
