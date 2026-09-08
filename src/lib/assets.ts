/**
 * Static asset paths. Normally these are served from `public/`.
 *
 * A single-file build (for sharing the site as one HTML page) can embed the
 * assets as data URIs and expose them on `window.__CROSS_ASSETS` before the app
 * script runs; anything set there wins over the default path.
 */
type AssetKey = 'videoDesktop' | 'videoMobile' | 'poster' | 'logo'

declare global {
  interface Window {
    __CROSS_ASSETS?: Partial<Record<AssetKey, string>>
  }
}

const DEFAULTS: Record<AssetKey, string> = {
  videoDesktop: '/videos/cross-hero-desktop.mp4',
  videoMobile: '/videos/cross-hero-mobile.mp4',
  poster: '/videos/cross-hero-poster.jpg',
  logo: '/brand/cross-logo.png',
}

export function asset(key: AssetKey): string {
  const override = typeof window !== 'undefined' ? window.__CROSS_ASSETS?.[key] : undefined
  return override ?? DEFAULTS[key]
}
