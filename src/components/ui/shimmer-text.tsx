import * as React from 'react'
import { useInView } from '@/lib/use-in-view'
import { cn } from '@/lib/utils'

export interface ShimmerTextProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Seconds per shimmer sweep. */
  duration?: number
  /** Highlight color that sweeps across the text. */
  shimmerColor?: string
}

/**
 * ShimmerText — a bright highlight sweeps across the text. The base color is
 * whatever `color` (e.g. `text-[#C026F5]`) the caller sets, because the
 * gradient is built from `currentColor`. The animation runs only while the
 * element is on screen.
 */
export function ShimmerText({
  className,
  duration = 3,
  shimmerColor = 'rgba(255,255,255,0.95)',
  style,
  children,
  ...props
}: ShimmerTextProps) {
  const ref = React.useRef<HTMLSpanElement>(null)
  const inView = useInView(ref)

  return (
    <span
      ref={ref}
      className={cn('inline-block animate-shimmer bg-clip-text', className)}
      style={{
        backgroundImage: `linear-gradient(100deg, currentColor 35%, ${shimmerColor} 50%, currentColor 65%)`,
        backgroundSize: '200% 100%',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        animationDuration: `${duration}s`,
        animationPlayState: inView ? 'running' : 'paused',
        ...style,
      }}
      {...props}
    >
      {children}
    </span>
  )
}

export default ShimmerText
