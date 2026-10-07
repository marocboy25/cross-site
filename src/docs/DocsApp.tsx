import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { ButtonLink } from '../components/Button'
import { Logo } from '../components/Logo'
import { LINKS } from '../content/site'
import { findPage, pagePath, PAGES, type DocPage } from './pages'
import { interceptDocsLinks, usePath } from './router'

/** Sidebar groups, in order, with their pages. */
const GROUPS = PAGES.reduce<{ name: string; pages: DocPage[] }[]>((groups, page) => {
  const last = groups[groups.length - 1]
  if (last?.name === page.group) last.pages.push(page)
  else groups.push({ name: page.group, pages: [page] })
  return groups
}, [])

function Sidebar({ current, onPick }: { current?: DocPage; onPick?: () => void }) {
  return (
    <nav aria-label="Docs" className="space-y-7">
      {GROUPS.map((group) => (
        <div key={group.name}>
          <p className="eyebrow mb-2.5">{group.name}</p>
          <ul className="space-y-0.5">
            {group.pages.map((page) => {
              const active = page === current
              return (
                <li key={page.slug}>
                  <a
                    href={pagePath(page)}
                    onClick={onPick}
                    aria-current={active ? 'page' : undefined}
                    className={`block rounded-lg px-3 py-1.5 text-[14px] transition-colors ${
                      active ? 'bg-violet-soft font-medium text-ink' : 'text-dim hover:bg-card-raised hover:text-ink'
                    }`}
                  >
                    {page.title}
                  </a>
                </li>
              )
            })}
          </ul>
        </div>
      ))}
    </nav>
  )
}

/** "On this page": the article's h2s, with the one you're reading highlighted. */
function OnThisPage({ path }: { path: string }) {
  const [headings, setHeadings] = useState<{ id: string; text: string }[]>([])
  const [active, setActive] = useState('')

  useLayoutEffect(() => {
    const els = [...document.querySelectorAll<HTMLElement>('.docs-prose h2[id]')]
    setHeadings(els.map((el) => ({ id: el.id, text: el.textContent ?? '' })))
    setActive(els[0]?.id ?? '')
    // The active heading is the last one that has scrolled past the top bar,
    // or the last heading once you reach the bottom (short final sections
    // can never scroll that far up).
    let frame = 0
    const update = () => {
      frame = 0
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2
      const passed = els.filter((el) => el.getBoundingClientRect().top < 120)
      const current = atBottom ? els[els.length - 1] : (passed[passed.length - 1] ?? els[0])
      setActive(current?.id ?? '')
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(frame)
    }
  }, [path])

  if (headings.length < 2) return null
  return (
    <nav aria-label="On this page">
      <p className="eyebrow mb-3">On this page</p>
      <ul className="space-y-2 border-l border-line">
        {headings.map((h) => (
          <li key={h.id}>
            <a
              href={`#${h.id}`}
              className={`-ml-px block border-l py-0.5 pl-3 text-[13px] leading-snug transition-colors ${
                active === h.id ? 'border-violet-light text-ink' : 'border-transparent text-dim hover:text-ink'
              }`}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

function PrevNext({ page }: { page: DocPage }) {
  const i = PAGES.indexOf(page)
  const prev = PAGES[i - 1]
  const next = PAGES[i + 1]
  return (
    <div className="mt-14 grid gap-3 border-t border-line pt-6 sm:grid-cols-2">
      {prev ? (
        <a href={pagePath(prev)} className="docs-pager">
          <span className="eyebrow">Previous</span>
          <span className="mt-1 block font-medium text-ink">{prev.title}</span>
        </a>
      ) : (
        <span />
      )}
      {next && (
        <a href={pagePath(next)} className="docs-pager sm:text-right">
          <span className="eyebrow">Next</span>
          <span className="mt-1 block font-medium text-ink">{next.title}</span>
        </a>
      )}
    </div>
  )
}

function NotFound() {
  return (
    <div className="docs-prose">
      <h1>Page not found</h1>
      <p>
        That page isn't in the docs. Start from the <a href="/docs">introduction</a>.
      </p>
    </div>
  )
}

/** Keeps the tab title, description and canonical URL in step with the page. */
function usePageMeta(page: DocPage | undefined, path: string) {
  useEffect(() => {
    document.title = page ? `${page.title} · Cross Docs` : 'Not found · Cross Docs'
    document.querySelector('meta[name="description"]')?.setAttribute('content', page?.lead ?? 'Cross documentation.')
    document.querySelector('link[rel="canonical"]')?.setAttribute('href', `https://www.usecrossp2p.com${page ? pagePath(page) : path}`)
  }, [page, path])
}

/**
 * The docs at /docs: a calm, readable layout in the site's colours. Left
 * sidebar (a menu on small screens), the article in the middle, and "On this
 * page" on the right on wide screens. Pages change without a reload.
 */
export default function DocsApp() {
  const path = usePath()
  const page = findPage(path)
  const [menuOpen, setMenuOpen] = useState(false)
  const article = useRef<HTMLElement>(null)
  usePageMeta(page, path)

  // New page: back to the top, unless the URL points at a heading.
  useEffect(() => {
    setMenuOpen(false)
    const id = decodeURIComponent(window.location.hash.slice(1))
    const target = id && document.getElementById(id)
    if (target) target.scrollIntoView()
    else window.scrollTo(0, 0)
  }, [path])

  // The open menu covers the page: no scrolling behind it, Escape closes it.
  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenuOpen(false)
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [menuOpen])

  return (
    <div onClick={interceptDocsLinks}>
      <header className="sticky top-0 z-40 border-b border-line bg-paper">
        <div className="mx-auto flex h-16 max-w-[1320px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => setMenuOpen((o) => !o)}
              aria-expanded={menuOpen}
              aria-controls="docs-menu"
              className="-ml-1.5 rounded-lg p-1.5 text-dim hover:text-ink lg:hidden"
            >
              <span className="sr-only">{menuOpen ? 'Close menu' : 'Open menu'}</span>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                {menuOpen ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
              </svg>
            </button>
            <a href="/" aria-label="Cross home" className="flex items-center gap-2.5">
              <Logo />
            </a>
            <a href="/docs" className="rounded-full border border-line px-2.5 py-1 font-mono text-[11px] uppercase tracking-[0.12em] text-violet-light">
              Docs
            </a>
          </div>
          <div className="flex shrink-0 items-center gap-5">
            <a href="/" className="hidden text-sm text-dim hover:text-ink sm:inline">
              Home
            </a>
            <ButtonLink href={LINKS.app} external size="md" className="shrink-0 whitespace-nowrap">
              Launch app
            </ButtonLink>
          </div>
        </div>
      </header>

      {/* Small screens: the sidebar as a full-height menu. */}
      {menuOpen && (
        <div id="docs-menu" className="fixed inset-x-0 bottom-0 top-16 z-30 overflow-y-auto bg-paper px-5 pb-10 pt-6 lg:hidden">
          <Sidebar current={page} onPick={() => setMenuOpen(false)} />
        </div>
      )}

      <div className="mx-auto grid max-w-[1320px] gap-10 px-4 sm:px-6 lg:grid-cols-[220px_minmax(0,1fr)] lg:px-8 xl:grid-cols-[220px_minmax(0,1fr)_200px]">
        <aside className="hidden lg:block">
          <div className="sticky top-16 max-h-[calc(100vh-4rem)] overflow-y-auto py-10 pr-2">
            <Sidebar current={page} />
          </div>
        </aside>

        <main ref={article} className="min-w-0 py-10 lg:py-12">
          {page ? (
            <article className="docs-prose mx-auto max-w-[720px]">
              <p className="eyebrow">{page.group}</p>
              <h1>{page.title}</h1>
              <p className="docs-lead">{page.lead}</p>
              {page.body()}
              <PrevNext page={page} />
            </article>
          ) : (
            <NotFound />
          )}
        </main>

        <aside className="hidden xl:block">
          <div className="sticky top-16 py-12">
            <OnThisPage path={path} />
          </div>
        </aside>
      </div>
    </div>
  )
}
