import { CHAIN } from '../content/site'

/**
 * Each docs page's address, title, sidebar group and one-line lead, in
 * sidebar order. Plain data (no JSX) so the build can read it too: it writes
 * a per-page HTML file and sitemap.xml from this list (see vite.config.ts).
 * Page bodies live in pages.tsx.
 */
export type DocMeta = { slug: string; title: string; group: string; lead: string }

export const DOC_META: DocMeta[] = [
  { slug: '', title: 'Introduction', group: 'Start here', lead: 'Cross is a peer to peer exchange. You trade with another person, not a pool.' },
  { slug: 'getting-started', title: 'Getting started', group: 'Start here', lead: `A browser wallet, ${CHAIN.name}, and something to trade with.` },
  { slug: 'trading/fill', title: 'Fill an order', group: 'Trading', lead: 'Buy from an order on the Board. You pay the seller\'s price plus a 0.5% fee.' },
  { slug: 'trading/create', title: 'Create an order', group: 'Trading', lead: 'Lock your tokens in escrow and name your price.' },
  { slug: 'trading/cancel', title: 'Cancel an order', group: 'Trading', lead: "Take back whatever hasn't filled, any time. Only you can." },
  { slug: 'otc', title: 'OTC desk', group: 'Trading', lead: 'For blocks too big for any pool. Both sides pay into escrow, and the contract swaps them at once.' },
  { slug: 'fees', title: 'Fees', group: 'Using Cross', lead: 'One fee on filled trades: 0.5%, paid by the buyer. Sellers pay nothing.' },
  { slug: 'referrals', title: 'Referrals', group: 'Using Cross', lead: 'Earn 20% of the fee on trades by people you bring in, paid in ETH at settlement.' },
  { slug: 'token-trust', title: 'Token trust', group: 'Using Cross', lead: 'Anyone can list any token. These checks help you decide for yourself.' },
  { slug: 'cross-token', title: '$CROSS token', group: 'Using Cross', lead: "Cross's own token. Details to come." },
  { slug: 'security', title: 'Security', group: 'Safety', lead: 'Tested, capped, and audit pending. Here is what that means for you.' },
  { slug: 'contracts', title: 'Contracts', group: 'Safety', lead: `Cross's contracts on ${CHAIN.name} (chain ID ${CHAIN.id}).` },
  { slug: 'faq', title: 'FAQ', group: 'Safety', lead: 'Short answers to common questions.' },
]

export const pagePath = (page: { slug: string }) => (page.slug ? `/docs/${page.slug}` : '/docs')

/** The live site's address; canonical URLs and the sitemap use it. */
export const SITE_URL = 'https://www.usecrossp2p.com'
