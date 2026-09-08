/** External URL of the live Cross app (opens in a new tab). */
export const APP_URL = 'https://www.crossp2p.com/?v=2'

export const EXTERNAL_LINK_PROPS = { target: '_blank', rel: 'noopener noreferrer' } as const

/** Primary navigation, shared by the desktop pill, the mobile menu and the footer. */
export const NAV_LINKS = [
  { label: 'How it works', to: '/#how-it-works' },
  { label: 'Why Cross', to: '/#why-cross' },
  { label: 'Compare', to: '/#comparison' },
  { label: 'Docs', to: '/docs' },
] as const
