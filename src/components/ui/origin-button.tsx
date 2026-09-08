import * as React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { cn } from '@/lib/utils'

/**
 * OriginButton — a pill button whose brand-colored fill expands from the exact
 * point the pointer entered / clicked ("origin"), and retracts from the point
 * it left. Palette is driven by the `--ic-*` custom properties below; Cross has
 * no light mode so base and `dark:` values are identical.
 */

const IC_VARS = {
  '--ic-background': '#0C0C0F',
  '--ic-foreground': '#FFFFFF',
  '--ic-primary': '#FFFFFF',
  '--ic-border': '#2A2A30',
  '--ic-card': '#0C0C0F',
  '--ic-muted': '#141416',
  '--ic-muted-foreground': '#8C8C96',
  '--ic-accent': '#1A1A1F',
  '--ic-brand': '#C026F5',
} as React.CSSProperties

type Variant = 'primary' | 'brand' | 'ghost'
type Size = 'sm' | 'md' | 'lg'

export interface OriginButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  /** When set, renders an <a> with this href instead of a <button>. */
  href?: string
  target?: string
  rel?: string
}

const variantClasses: Record<Variant, string> = {
  // White pill, magenta wash on interaction (nav "Launch App")
  primary:
    'bg-[var(--ic-primary)] text-[var(--ic-background)] hover:text-[var(--ic-foreground)]',
  // Magenta pill, brighter wash on interaction (hero "Start Escrow")
  brand:
    'bg-[var(--ic-brand)] text-[var(--ic-foreground)] shadow-lg shadow-[#C026F5]/20 hover:shadow-[#C026F5]/40',
  ghost:
    'bg-transparent text-[var(--ic-foreground)] border border-[var(--ic-border)] hover:text-[var(--ic-foreground)]',
}

const sizeClasses: Record<Size, string> = {
  sm: 'text-xs px-4 py-2',
  md: 'text-sm px-6 py-2.5',
  lg: 'text-sm px-7 py-3',
}

export const OriginButton = React.forwardRef<HTMLButtonElement, OriginButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      children,
      onPointerEnter,
      onPointerLeave,
      onPointerDown,
      href,
      target,
      rel,
      type,
      ...props
    },
    ref,
  ) => {
    const [origin, setOrigin] = React.useState<{ x: number; y: number } | null>(null)
    const [pulse, setPulse] = React.useState(0)

    const pointFor = (e: React.PointerEvent<HTMLElement>) => {
      const rect = e.currentTarget.getBoundingClientRect()
      return { x: e.clientX - rect.left, y: e.clientY - rect.top }
    }

    // Render as a link when `href` is given, otherwise as a button.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const Comp: any = href ? 'a' : 'button'
    const elementProps = href ? { href, target, rel } : { type: type ?? 'button' }

    return (
      <Comp
        ref={ref}
        {...elementProps}
        style={IC_VARS}
        className={cn(
          'group relative isolate inline-flex select-none items-center justify-center gap-2 overflow-hidden rounded-full font-medium tracking-[-0.01em]',
          'transition-[transform,color,box-shadow] duration-300 ease-out hover:scale-[1.03] active:scale-95',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ic-brand)] focus-visible:ring-offset-2 focus-visible:ring-offset-black',
          'disabled:pointer-events-none disabled:opacity-50',
          variantClasses[variant],
          sizeClasses[size],
          className,
        )}
        onPointerEnter={(e: React.PointerEvent<HTMLButtonElement>) => {
          setOrigin(pointFor(e))
          onPointerEnter?.(e)
        }}
        onPointerLeave={(e: React.PointerEvent<HTMLButtonElement>) => {
          setOrigin(null)
          onPointerLeave?.(e)
        }}
        onPointerDown={(e: React.PointerEvent<HTMLButtonElement>) => {
          setOrigin(pointFor(e))
          setPulse((n) => n + 1)
          onPointerDown?.(e)
        }}
        {...props}
      >
        {/* Fill that grows from the pointer origin */}
        <AnimatePresence>
          {origin && (
            <motion.span
              key="fill"
              aria-hidden="true"
              className="pointer-events-none absolute -z-10 rounded-full"
              style={{
                left: origin.x,
                top: origin.y,
                width: 20,
                height: 20,
                x: '-50%',
                y: '-50%',
                background:
                  variant === 'brand'
                    ? 'radial-gradient(circle, #ffffff 0%, var(--ic-brand) 55%, var(--ic-brand) 100%)'
                    : 'var(--ic-brand)',
              }}
              initial={{ scale: 0, opacity: 0.9 }}
              animate={{ scale: 30, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 32, mass: 0.6 }}
            />
          )}
        </AnimatePresence>

        {/* Click pulse ring */}
        <AnimatePresence>
          {pulse > 0 && origin && (
            <motion.span
              key={pulse}
              aria-hidden="true"
              className="pointer-events-none absolute -z-10 rounded-full border-2 border-white/70"
              style={{ left: origin.x, top: origin.y, width: 24, height: 24, x: '-50%', y: '-50%' }}
              initial={{ scale: 0.4, opacity: 0.8 }}
              animate={{ scale: 12, opacity: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />
          )}
        </AnimatePresence>

        <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
      </Comp>
    )
  },
)
OriginButton.displayName = 'OriginButton'

export default OriginButton
