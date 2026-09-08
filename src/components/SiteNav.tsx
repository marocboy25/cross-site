import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { OriginButton } from '@/components/ui/origin-button'
import { asset } from '@/lib/assets'
import { APP_URL, EXTERNAL_LINK_PROPS, NAV_LINKS } from '@/lib/links'

function LogoMark() {
  return (
    <img
      src={asset('logo')}
      alt=""
      width={28}
      height={28}
      draggable={false}
      className="h-7 w-7 select-none rounded-full"
      aria-hidden="true"
    />
  )
}

/** Fixed site navigation, shared by the landing page and the docs page. */
export default function SiteNav() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { pathname } = useLocation()

  // "Docs" is active on /docs; otherwise the first pill ("How it works") is.
  const isActive = (to: string, i: number) =>
    pathname.startsWith('/docs') ? to === '/docs' : i === 0

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between p-4 sm:p-5 bg-black/60 backdrop-blur-md">
        <Link to="/" className="flex items-center gap-2.5" aria-label="Cross home">
          <LogoMark />
          <span className="text-white text-xl font-grotesk font-bold">Cross</span>
        </Link>

        <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-md border border-white/15 rounded-full px-2 py-2 items-center gap-1">
          {NAV_LINKS.map(({ label, to }, i) => (
            <Link
              key={label}
              to={to}
              className={`font-mono text-xs px-4 py-1.5 rounded-full hover:bg-white/10 hover:text-white transition-colors ${
                isActive(to, i) ? 'text-white' : 'text-white/70'
              }`}
            >
              {label}
            </Link>
          ))}
        </div>

        <OriginButton
          href={APP_URL}
          {...EXTERNAL_LINK_PROPS}
          variant="primary"
          size="md"
          className="hidden md:inline-flex font-semibold"
        >
          Launch App
        </OriginButton>

        <button
          type="button"
          onClick={() => setMenuOpen((o) => !o)}
          className="md:hidden flex h-10 w-10 items-center justify-center rounded-full bg-white/10 border border-white/15 backdrop-blur-md text-white"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </nav>

      {menuOpen && (
        <div className="md:hidden fixed inset-x-4 top-[72px] z-[99] rounded-2xl border border-white/15 bg-[var(--panel)]/95 backdrop-blur-md p-3 flex flex-col gap-1">
          {NAV_LINKS.map(({ label, to }, i) => (
            <Link
              key={label}
              to={to}
              onClick={() => setMenuOpen(false)}
              className={`font-mono text-sm text-left px-4 py-3 rounded-xl hover:bg-white/10 transition-colors ${
                isActive(to, i) ? 'text-white' : 'text-white/70'
              }`}
            >
              {label}
            </Link>
          ))}
          <OriginButton
            href={APP_URL}
            {...EXTERNAL_LINK_PROPS}
            variant="primary"
            size="lg"
            className="mt-2 w-full font-semibold"
          >
            Launch App
          </OriginButton>
        </div>
      )}
    </>
  )
}
