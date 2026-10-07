import React, { lazy, Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { enableScrollReveal } from './components/motion'
import './index.css'

// Dev-only asset renderer; import.meta.env.DEV is false in builds, so this
// branch and its chunk are dropped from production.
const RenderStudio = import.meta.env.DEV ? lazy(() => import('./dev/RenderStudio')) : null
const isRenderPage = import.meta.env.DEV && window.location.pathname === '/__render'

if (!isRenderPage) enableScrollReveal()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {isRenderPage && RenderStudio ? (
      <Suspense fallback={null}>
        <RenderStudio />
      </Suspense>
    ) : (
      <App />
    )}
  </React.StrictMode>,
)
