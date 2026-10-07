import { ButtonLink } from '../components/Button'
import { Logo } from '../components/Logo'
import { Container } from '../components/Section'
import { CHAIN, LINKS, NAV } from '../content/site'

/** Same layout as the app header: lockup, mono tab pill, chain chip, action. */
export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper">
      <Container className="flex h-16 items-center justify-between gap-4">
        <a href="#top" aria-label="Cross, back to top">
          <Logo tag />
        </a>
        <nav aria-label="Sections" className="hidden lg:block">
          <ul className="flex gap-0.5 rounded-full border border-line bg-card-raised/75 p-1">
            {NAV.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="block rounded-full px-3 py-1.5 font-mono text-[11px] tracking-[0.02em] text-dim transition-colors hover:bg-violet-soft hover:text-ink"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-3">
          <span className="hidden items-center gap-1.5 rounded-full border border-line px-2.5 py-1 font-mono text-[10px] tracking-[0.08em] text-dim md:inline-flex">
            <span className="h-1.5 w-1.5 rounded-full bg-bid" />
            {CHAIN.name}
          </span>
          <ButtonLink href={LINKS.app} external size="md">
            Launch app
          </ButtonLink>
        </div>
      </Container>
    </header>
  )
}
