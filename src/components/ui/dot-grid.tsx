import { useId, type SVGProps } from 'react'
import { cn } from '@/lib/utils'

/**
 * Fixed highlight cells (was Math.random per mount). A constant pattern costs
 * nothing on re-render and looks identical on every visit.
 */
const DEFAULT_PATTERN: number[][] = [
  [7, 1],
  [9, 3],
  [8, 5],
  [10, 2],
  [7, 6],
]

/**
 * Grid — a faint grid-pattern texture with a few highlighted cells.
 * Pulled from the "feature section with card gradient" block; only the
 * background helper is kept. Place inside a `relative isolate` parent.
 */
export const Grid = ({
  pattern,
  size,
  className,
}: {
  pattern?: number[][]
  size?: number
  className?: string
}) => {
  const p = pattern ?? DEFAULT_PATTERN

  return (
    <div
      aria-hidden="true"
      className={cn(
        'pointer-events-none absolute inset-0 -z-10 [mask-image:linear-gradient(white,transparent)]',
        className,
      )}
    >
      <div className="absolute inset-0 [mask-image:radial-gradient(farthest-side_at_top,white,transparent)]">
        <GridPattern
          width={size ?? 20}
          height={size ?? 20}
          x="-12"
          y="4"
          squares={p}
          className="absolute inset-0 h-full w-full fill-white/5 stroke-white/5 mix-blend-overlay"
        />
      </div>
    </div>
  )
}

interface GridPatternProps extends SVGProps<SVGSVGElement> {
  width: number
  height: number
  x: string | number
  y: string | number
  squares?: number[][]
}

export function GridPattern({ width, height, x, y, squares, ...props }: GridPatternProps) {
  const patternId = useId()

  return (
    <svg aria-hidden="true" {...props}>
      <defs>
        <pattern id={patternId} width={width} height={height} patternUnits="userSpaceOnUse" x={x} y={y}>
          <path d={`M.5 ${height}V.5H${width}`} fill="none" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" strokeWidth={0} fill={`url(#${patternId})`} />
      {squares && (
        <svg x={x} y={y} className="overflow-visible">
          {squares.map(([sx, sy], i) => (
            <rect
              strokeWidth="0"
              key={`${i}-${sx}-${sy}`}
              width={width + 1}
              height={height + 1}
              x={sx * width}
              y={sy * height}
            />
          ))}
        </svg>
      )}
    </svg>
  )
}

export default Grid
