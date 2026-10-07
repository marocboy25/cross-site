import type { AnchorHTMLAttributes, ReactNode } from 'react'
import { ArrowRight } from './icons'

type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string
  /** Opens in a new tab. */
  external?: boolean
  children: ReactNode
}

const externalProps = (external: boolean) => (external ? { target: '_blank', rel: 'noopener noreferrer' } : {})

const focus = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-violet-light'

/** The app's primary button: violet to magenta pill with a soft glow. */
export function ButtonLink({
  href,
  external = false,
  size = 'lg',
  className = '',
  children,
  ...rest
}: LinkProps & { size?: 'md' | 'lg' }) {
  const sizing = size === 'lg' ? 'h-12 px-6 text-[15px]' : 'h-10 px-4 text-sm'
  return (
    <a
      href={href}
      {...externalProps(external)}
      className={`btn-primary inline-flex items-center justify-center gap-2 rounded-full font-semibold text-white ${sizing} ${focus} ${className}`}
      {...rest}
    >
      {children}
      <ArrowRight />
    </a>
  )
}

/** Secondary action: a mono, underlined text link like the app's labels. */
export function TextLink({
  href,
  external = false,
  onDark = false,
  className = '',
  children,
  ...rest
}: LinkProps & { onDark?: boolean }) {
  const tone = onDark ? 'text-white/80 decoration-white/30 hover:text-white' : 'text-ink decoration-violet-light/50 hover:text-violet-light'
  return (
    <a
      href={href}
      {...externalProps(external)}
      className={`inline-flex items-center gap-2 font-mono text-[13px] uppercase tracking-[0.1em] underline decoration-1 underline-offset-[6px] transition-colors ${tone} ${focus} ${className}`}
      {...rest}
    >
      {children}
    </a>
  )
}
