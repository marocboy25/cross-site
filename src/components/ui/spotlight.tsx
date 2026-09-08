import * as React from 'react'
import { motion, useMotionTemplate, useMotionValue, useSpring } from 'framer-motion'
import { cn } from '@/lib/utils'

export interface SpotlightProps {
  className?: string
  /** Glow color. Pass a color with alpha (e.g. rgba / 8-digit hex) for a soft wash. */
  fill?: string
  /** Diameter of the glow in px. */
  size?: number
  /** Spring config for the follow motion. */
  springOptions?: { stiffness?: number; damping?: number; mass?: number }
}

/**
 * Spotlight — a mouse-following radial glow. Drop it inside any element with
 * `position: relative; overflow: hidden` and it tracks the pointer over that parent.
 */
export function Spotlight({
  className,
  fill = 'rgba(255,255,255,0.4)',
  size = 360,
  springOptions = { stiffness: 220, damping: 30, mass: 0.5 },
}: SpotlightProps) {
  const ref = React.useRef<HTMLDivElement>(null)
  const [active, setActive] = React.useState(false)

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const x = useSpring(mouseX, springOptions)
  const y = useSpring(mouseY, springOptions)

  const background = useMotionTemplate`radial-gradient(${size}px circle at ${x}px ${y}px, ${fill}, transparent 70%)`

  React.useEffect(() => {
    const parent = ref.current?.parentElement
    if (!parent) return

    const onMove = (e: MouseEvent) => {
      const rect = parent.getBoundingClientRect()
      mouseX.set(e.clientX - rect.left)
      mouseY.set(e.clientY - rect.top)
    }
    const onEnter = () => setActive(true)
    const onLeave = () => setActive(false)

    parent.addEventListener('mousemove', onMove)
    parent.addEventListener('mouseenter', onEnter)
    parent.addEventListener('mouseleave', onLeave)
    return () => {
      parent.removeEventListener('mousemove', onMove)
      parent.removeEventListener('mouseenter', onEnter)
      parent.removeEventListener('mouseleave', onLeave)
    }
  }, [mouseX, mouseY])

  return (
    <motion.div
      ref={ref}
      aria-hidden="true"
      className={cn(
        'pointer-events-none absolute inset-0 z-0 transition-opacity duration-500',
        active ? 'opacity-100' : 'opacity-0',
        className,
      )}
      style={{ background }}
    />
  )
}

export default Spotlight
