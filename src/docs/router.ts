import { useEffect, useState, type MouseEvent } from 'react'

/** True for paths the docs app handles. */
export const isDocsPath = (path: string) => path === '/docs' || path.startsWith('/docs/')

/** Current pathname, kept in sync with back/forward and navigate(). */
export function usePath() {
  const [path, setPath] = useState(() => window.location.pathname)
  useEffect(() => {
    const update = () => setPath(window.location.pathname)
    window.addEventListener('popstate', update)
    return () => window.removeEventListener('popstate', update)
  }, [])
  return path
}

/** Moves to another docs page without a reload (history entry + popstate for usePath). */
export function navigate(to: string) {
  window.history.pushState(null, '', to)
  window.dispatchEvent(new PopStateEvent('popstate'))
}

/**
 * Click handler for a container: plain left-clicks on links to other docs
 * pages navigate in place. Same-page #anchors, other sites and modified
 * clicks (new tab) keep the browser's default.
 */
export function interceptDocsLinks(e: MouseEvent) {
  if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
  const a = (e.target as HTMLElement).closest('a')
  if (!a || a.target || a.origin !== window.location.origin) return
  if (!isDocsPath(a.pathname) || (a.pathname === window.location.pathname && a.hash)) return
  e.preventDefault()
  navigate(a.pathname + a.hash)
}
