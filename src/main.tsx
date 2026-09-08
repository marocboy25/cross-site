import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, HashRouter } from 'react-router-dom'
import App from './App'
import './index.css'

// The single-file share build (see scripts/bundle-single-file.mjs) is served
// from an arbitrary path, so it uses hash-based routing. Everything else uses
// real URLs (/docs), which needs the host to fall back to index.html.
const Router = window.__CROSS_ASSETS ? HashRouter : BrowserRouter

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Router>
      <App />
    </Router>
  </React.StrictMode>,
)
