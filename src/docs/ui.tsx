import type { ReactNode } from 'react'
import { EXPLORER } from '../content/site'

/** Lower-case, dash-separated id from heading text, for #anchors. */
export const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

/** Section heading; listed in "On this page". */
export function H2({ children, id }: { children: string; id?: string }) {
  return <h2 id={id ?? slugify(children)}>{children}</h2>
}

/** A boxed note: `tip` for helpful asides, `warn` for things that can cost you. */
export function Callout({ tone = 'tip', title, children }: { tone?: 'tip' | 'warn'; title?: string; children: ReactNode }) {
  return (
    <aside className={`docs-callout docs-callout-${tone}`}>
      {title && <p className="docs-callout-title">{title}</p>}
      <div>{children}</div>
    </aside>
  )
}

/** Something we don't know yet. Rendered visibly so it can't ship by accident unnoticed. */
export function Todo({ children }: { children?: ReactNode }) {
  return <span className="docs-todo">[TODO{children ? <>: {children}</> : null}]</span>
}

/** Link to another site, opened in a new tab. */
export function Ext({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  )
}

/** A full contract address that links to Blockscout. */
export function Address({ address }: { address: string }) {
  return (
    <a href={`${EXPLORER}${address}`} target="_blank" rel="noopener noreferrer" className="docs-address">
      {address}
    </a>
  )
}
