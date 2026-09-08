import * as React from 'react'
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
 * gradient is built from `currentColor`.
 */
export function ShimmerText({
  className,
  duration = 3,
  shimmerColor = 'rgba(255,255,255,0.95)',
  style,
  children,
  ...props
}: ShimmerTextProps) {
  return (
    <span
      className={cn('inline-block animate-shimmer bg-clip-text', className)}
      style={{
        backgroundImage: `linear-gradient(100deg, currentColor 35%, ${shimmerColor} 50%, currentColor 65%)`,
        backgroundSize: '200% 100%',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        animationDuration: `${duration}s`,
        ...style,
      }}
      {...props}
    >
      {children}
    </span>
  )
}

export default ShimmerText
