/**
 * Every piece of copy, number and link on the page lives here, so wording can
 * change without touching layout.
 *
 * Source of truth is the live app (app.usecrossp2p.com): numbers and facts
 * come from it. Anything still unknown is a [PLACEHOLDER], listed in
 * PLACEHOLDERS at the bottom.
 */

export const LINKS = {
  app: 'https://app.usecrossp2p.com',
  appOtc: 'https://app.usecrossp2p.com/otc',
  appTrust: 'https://app.usecrossp2p.com/trust',
  appCreate: 'https://app.usecrossp2p.com/create',
  x: 'https://x.com/CrossP2P',
  xHandle: '@CrossP2P',
  docs: '[DOCS_URL]',
  terms: '[TERMS_URL]',
} as const

export const EXPLORER = 'https://robinhoodchain.blockscout.com/address/'

export const CHAIN = { name: 'Robinhood Chain', id: 4663 } as const

export const CONTRACTS = {
  exchange: '0x422760Ce51a14afeb33e213e7EA4998c82026916',
  otc: '0xcE073548a1d289CD5B18ec7C15da85160fF0C834',
} as const

export const NAV = [
  { label: 'How it works', href: '#how' },
  { label: 'Why P2P', href: '#why' },
  { label: 'OTC desk', href: '#otc' },
  { label: 'Trust', href: '#trust' },
  { label: 'Facts', href: '#facts' },
] as const

export const HERO = {
  tag: 'P2P exchange · Robinhood Chain',
  // The app's own headline.
  title: 'Trade any token, peer to peer.',
  body: 'Buyer and seller meet at one price. No pool, so nothing moves the chart.',
  primary: 'Launch app',
  secondary: 'How it works',
}

/**
 * The two orders in the hero. Price is the Chainlink NVDA spot the app showed
 * on 7 Oct 2026 (0.088930 ETH/token); 20 NVDA keeps it under the 2 ETH cap.
 */
export const CROSSING = {
  sell: { side: 'Seller', amount: '20 NVDA', sub: '@ 0.088930 ETH' },
  buy: { side: 'Buyer', amount: '1.7786 ETH', sub: '+ 0.5% fee' },
  settle: '0.00% price impact',
}

/** Stat strip under the hero. `positive` values show in the app's green. */
export const STATS = [
  { value: '0.00%', label: 'Price impact', positive: true },
  { value: '0%', label: 'Slippage', positive: true },
  { value: '0.5%', label: 'Fee, paid by the buyer', positive: false },
  { value: '1', label: 'Transaction to settle', positive: false },
]

/**
 * Ticker band. Only tokens the app itself lists: the three verified stock
 * tokens and the two quote assets. Add more only once the app supports them.
 */
export const TICKER = {
  tokens: [
    { symbol: 'NVDA', name: 'Nvidia' },
    { symbol: 'AAPL', name: 'Apple' },
    { symbol: 'TSLA', name: 'Tesla' },
    { symbol: 'ETH', name: 'Ether' },
    { symbol: 'USDG', name: 'Global Dollar' },
  ],
  tagline: 'Any Robinhood Chain token',
}

export const STEPS = {
  eyebrow: 'How it works',
  title: 'How Cross works.',
  note: 'Public or private. Fill all of it, or part.',
  items: [
    { title: 'Post an order', body: 'Pick a token, an amount and a price. Your tokens wait in escrow.' },
    { title: 'Someone fills it', body: 'The buyer pays your price plus 0.5%. Both sides swap in one transaction.' },
    { title: 'Cancel any time', body: "Take back whatever hasn't filled. Only you can." },
  ],
}

export const WHY = {
  eyebrow: 'Why P2P',
  title: "A pool moves the price. A person doesn't.",
  body: "Big orders push a pool's price against you. On Cross the price is agreed first, so size doesn't move it.",
  rows: [
    { label: 'Price impact', dex: 'Grows with size', cross: '0.00%', positive: true },
    { label: 'Slippage', dex: 'Yes', cross: 'None', positive: true },
    { label: 'Launchpad tax', dex: 'Often', cross: 'None', positive: true },
    { label: 'Fee', dex: '0.05% to 1%', cross: '0.5%, buyer pays', positive: false },
  ],
  note: 'For small orders a pool can be cheaper. The app shows both before you trade.',
}

export const OTC = {
  eyebrow: 'OTC desk',
  title: 'Big positions, off the book.',
  body: 'Blocks too big for any pool, in tokens paired with tokenized stocks. Agree a price, both sides deposit, and the contract swaps both legs at once.',
  link: 'Open the OTC desk',
  /** Floating cards around the blocks. Same three facts as before. */
  cards: [
    { value: '72h', label: 'Listing stays live' },
    { value: '24h', label: 'Then a funded side can reclaim' },
    { value: '2 ETH', label: 'Per-order cap until audit' },
  ],
}

export const TRUST = {
  eyebrow: 'Token trust',
  title: 'Anyone can list any token. Check before you trade.',
  body: "Stock tokens are checked against Robinhood's registry and Chainlink feeds. Same ticker, different address? Different token.",
  link: 'Check a token',
  checks: [
    'Canonical Robinhood stock token',
    'Allowlisted on the OTC desk',
    'Chainlink feed fresh',
    'Transfers live',
    'No pending corporate action',
  ],
}

export type Fact = { label: string; value: string; links?: { label: string; address: string }[] }

export const FACTS: { eyebrow: string; title: string; more: string; rows: Fact[] } = {
  eyebrow: 'Facts',
  title: 'The numbers.',
  more: 'Full specs',
  rows: [
    { label: 'Chain', value: `${CHAIN.name}, chain ID ${CHAIN.id}` },
    { label: 'Settlement', value: 'Both legs in one transaction' },
    { label: 'Fee', value: '0.5% of notional, paid by the buyer' },
    { label: 'Fee hard cap', value: '2%, set in the contract' },
    { label: 'Per-order cap', value: '2 ETH until the audit is done' },
    {
      label: 'Contracts',
      value: '',
      links: [
        { label: 'Exchange', address: CONTRACTS.exchange },
        { label: 'OTC escrow', address: CONTRACTS.otc },
      ],
    },
  ],
}

export const FINAL_CTA = {
  title: 'Create the first order.',
  body: 'Any Robinhood Chain token. Your price.',
  primary: 'Launch app',
  secondary: 'Follow @CrossP2P',
}

export const FOOTER = {
  blurb: 'Peer to peer exchange. First on Robinhood Chain, other chains later.',
  disclaimer: 'Contracts internally tested, audit pending. Not financial advice.',
  links: [
    { label: 'App', href: LINKS.app },
    { label: 'X', href: LINKS.x },
    { label: 'Docs', href: LINKS.docs },
    { label: 'Terms', href: LINKS.terms },
  ],
}

/** Still needed before launch. */
export const PLACEHOLDERS = ['[DOCS_URL]', '[TERMS_URL]'] as const

export const isPlaceholder = (value: string) => /^\[[A-Z_]+\]$/.test(value)

export const shortAddress = (address: string) => `${address.slice(0, 6)}…${address.slice(-4)}`
