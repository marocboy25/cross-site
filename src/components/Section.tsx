import type { ReactNode } from 'react'
import { reveal, Words } from './motion'

export function Container({ className = '', children }: { className?: string; children: ReactNode }) {
  return <div className={`mx-auto w-full max-w-page px-4 sm:px-6 lg:px-8 ${className}`}>{children}</div>
}

type HeadingProps = {
  eyebrow?: string
  title: string
  body?: ReactNode
  center?: boolean
}

/** Mono label, display title (with the app's full stop), one short line. */
export function SectionHeading({ eyebrow, title, body, center = false }: HeadingProps) {
  return (
    <header className={center ? 'mx-auto max-w-2xl text-center' : 'max-w-xl'}>
      {eyebrow && (
        <p {...reveal()} className="eyebrow">
          {eyebrow}
        </p>
      )}
      <h2 className="display mt-4 text-balance text-[38px] sm:text-[52px]">
        <Words text={title} />
      </h2>
      {body && <p {...reveal(2)} className={`mt-4 text-[17px] leading-relaxed text-dim ${center ? 'mx-auto max-w-lg' : ''}`}>{body}</p>}
    </header>
  )
}

/** Light sections only; space does the separating, panels do the decorating. */
export function Section({ id, className = '', children }: { id?: string; className?: string; children: ReactNode }) {
  return (
    <section id={id} className={`py-14 sm:py-[76px] ${className}`}>
      <Container>{children}</Container>
    </section>
  )
}
