import React, { lazy, Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { enableMotion } from './components/motion'
import { isDocsPath } from './docs/router'
import './index.css'

// Dev-only asset renderer; import.meta.env.DEV is false in builds, so this
// branch and its chunk are dropped from production.
const RenderStudio = import.meta.env.DEV ? lazy(() => import('./dev/RenderStudio')) : null
const isRenderPage = import.meta.env.DEV && window.location.pathname === '/__render'

// The docs at /docs: their own chunk, so the landing page doesn't load them.
const DocsApp = lazy(() => import('./docs/DocsApp'))
const isDocs = isDocsPath(window.location.pathname)

if (!isRenderPage) enableMotion()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {isRenderPage && RenderStudio ? (
      <Suspense fallback={null}>
        <RenderStudio />
      </Suspense>
    ) : isDocs ? (
      <Suspense fallback={null}>
        <DocsApp />
      </Suspense>
    ) : (
      <App />
    )}
  </React.StrictMode>,
)
