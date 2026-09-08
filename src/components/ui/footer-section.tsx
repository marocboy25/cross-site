import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Twitter } from 'lucide-react'
import { asset } from '@/lib/assets'
import { cn } from '@/lib/utils'

interface FooterLink {
  label: string
  href: string
  icon?: ReactNode
  external?: boolean
}

interface FooterSection {
  title: string
  links: FooterLink[]
}

const footerLinks: FooterSection[] = [
  {
    title: 'Product',
    links: [
      { label: 'How it Works', href: '/#how-it-works' },
      { label: 'Why Cross', href: '/#why-cross' },
      { label: 'Docs', href: '/docs' },
    ],
  },
  {
    title: 'Community',
    links: [
      {
        label: 'X',
        href: 'https://x.com/CrossP2P',
        icon: <Twitter className="h-3.5 w-3.5" aria-hidden="true" />,
        external: true,
      },
    ],
  },
]

export function FooterSection({ className }: { className?: string }) {
  return (
    <footer className={cn('border-t border-[#2A2A30] bg-background', className)}>
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-2">
          {/* Brand */}
          <div className="flex flex-col items-start gap-4">
            <Link to="/" className="flex items-center gap-2.5" aria-label="Cross home">
              <img
                src={asset('logo')}
                alt=""
                width={28}
                height={28}
                className="h-7 w-7 rounded-full"
                aria-hidden="true"
              />
              <span className="font-grotesk text-xl font-bold text-foreground">Cross</span>
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-white/60">
              Escrowed OTC trades for tokenized stock positions. Nothing touches the on-chain price
              until both sides confirm.
            </p>
          </div>

          {/* Link sections */}
          <div className="grid grid-cols-2 gap-8">
            {footerLinks.map((section) => (
              <div key={section.title} className="flex flex-col gap-4">
                <h3 className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                  {section.title}
                </h3>
                <ul className="flex flex-col gap-2.5">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      {link.external ? (
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-sm text-white/70 transition-colors hover:text-foreground"
                        >
                          {link.icon}
                          {link.label}
                        </a>
                      ) : (
                        <Link
                          to={link.href}
                          className="inline-flex items-center gap-2 text-sm text-white/70 transition-colors hover:text-foreground"
                        >
                          {link.icon}
                          {link.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-[#2A2A30] pt-6 font-mono text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <span>© 2026 Cross · concept stage</span>
          <span>Built on Robinhood Chain</span>
        </div>
      </div>
    </footer>
  )
}

export default FooterSection
