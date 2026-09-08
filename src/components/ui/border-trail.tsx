import { useRef } from 'react'
import { motion, type Transition } from 'framer-motion'
import { useInView } from '@/lib/use-in-view'
import { cn } from '@/lib/utils'

export interface BorderTrailProps {
  className?: string
  /** Diameter of the travelling glow in px. */
  size?: number
  transition?: Transition
  delay?: number
  onAnimationComplete?: () => void
  style?: React.CSSProperties
}

/**
 * BorderTrail — a glowing dot that travels along the border of its parent.
 * Parent needs `position: relative` and a border-radius; the trail inherits it.
 * The loop only runs while the parent is on screen.
 */
export function BorderTrail({
  className,
  size = 60,
  transition,
  delay,
  onAnimationComplete,
  style,
}: BorderTrailProps) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref)

  const BASE_TRANSITION: Transition = {
    repeat: Infinity,
    duration: 5,
    ease: 'linear',
  }

  return (
    <div
      ref={ref}
      className="pointer-events-none absolute inset-0 rounded-[inherit] border border-transparent [mask-clip:padding-box,border-box] [mask-composite:intersect] [mask-image:linear-gradient(transparent,transparent),linear-gradient(#000,#000)]"
    >
      <motion.div
        className={cn('absolute aspect-square bg-white', className)}
        style={{
          width: size,
          offsetPath: `rect(0 auto auto 0 round ${size}px)`,
          ...style,
        }}
        // Animate only while visible; off-screen the dot simply stops.
        animate={inView ? { offsetDistance: ['0%', '100%'] } : { offsetDistance: '0%' }}
        transition={inView ? { ...(transition ?? BASE_TRANSITION), delay } : { duration: 0 }}
        onAnimationComplete={onAnimationComplete}
      />
    </div>
  )
}

export default BorderTrail
