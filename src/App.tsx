import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import SiteNav from '@/components/SiteNav'
import LandingPage from '@/pages/LandingPage'
import DocsPage from '@/pages/DocsPage'

/**
 * React Router doesn't scroll to `location.hash` on its own. On every route
 * change: scroll to the hash target if there is one (retrying briefly while the
 * new page mounts), otherwise jump to the top.
 */
function ScrollToHash() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0 })
      return
    }
    const id = decodeURIComponent(hash.slice(1))
    let attempts = 0
    let raf = 0
    const tryScroll = () => {
      const el = document.getElementById(id)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' })
        return
      }
      if (attempts++ < 30) raf = requestAnimationFrame(tryScroll)
    }
    raf = requestAnimationFrame(tryScroll)
    return () => cancelAnimationFrame(raf)
  }, [pathname, hash])

  return null
}

export default function App() {
  return (
    <div
      className="min-h-screen bg-black tracking-[-0.02em]"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <ScrollToHash />
      <SiteNav />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/docs" element={<DocsPage />} />
        <Route path="*" element={<LandingPage />} />
      </Routes>
    </div>
  )
}
