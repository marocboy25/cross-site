import { Logo } from '../components/Logo'
import { Container } from '../components/Section'
import { FOOTER, LINKS, isPlaceholder } from '../content/site'

export function Footer() {
  return (
    <footer className="pt-12">
      <Container>
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-sm">
            <Logo tag />
            <p className="mt-4 text-[15px] leading-relaxed text-dim">{FOOTER.blurb}</p>
          </div>
          <ul className="flex flex-wrap gap-x-7 gap-y-3 text-[15px] font-medium">
            {/* Links still set to a [PLACEHOLDER] are left out until filled in. */}
            {FOOTER.links
              .filter((link) => !isPlaceholder(link.href))
              .map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="hover:text-violet-light"
                    {...(link.href === LINKS.app || link.href === LINKS.x ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
          </ul>
        </div>
        <div className="mt-10 flex flex-col gap-2 border-t border-line py-6 text-sm text-dim sm:flex-row sm:justify-between">
          <div className="space-y-1">
            <p>{FOOTER.disclaimer}</p>
            <p>{FOOTER.trademarks}</p>
          </div>
          <p>© {new Date().getFullYear()} Cross</p>
        </div>
      </Container>
    </footer>
  )
}
