import type { ReactNode } from 'react'
import { Grid } from '@/components/ui/dot-grid'
import FooterSection from '@/components/ui/footer-section'
import { GlowCard } from '@/components/ui/spotlight-card'

/* ---------- Content ---------- */

const SECTIONS = [
  { id: 'overview', label: 'Overview' },
  { id: 'security', label: 'Current Status' },
  { id: 'how-it-works', label: 'How It Works' },
  { id: 'why-it-safe', label: "Why It's Safe" },
  { id: 'deal-board', label: 'The Deal Board' },
  { id: 'proposing', label: 'Proposing a Trade' },
  { id: 'funding', label: 'Funding an Escrow' },
  { id: 'token-trust', label: 'Token Trust' },
  { id: 'impact-simulator', label: 'Impact Simulator' },
  { id: 'history', label: 'Trade History & My Escrows' },
  { id: 'glossary', label: 'Glossary' },
] as const

const STEPS = [
  {
    title: 'Post an offer',
    body: "A seller lists tokens for sale, or a buyer posts what they'll pay, priced in dollars per 1 million tokens. Unfilled offers expire after 72 hours.",
  },
  {
    title: 'Agree on a price',
    body: 'Every offer has a private chat attached. Either side can counter, the person who posted the original offer accepts. Once anyone pays in, the price locks.',
  },
  {
    title: 'Both sides pay into escrow',
    body: 'The seller deposits tokens, the buyer deposits the dollar amount plus a 0.5% settlement fee paid in $CROSS. Funds go straight into the smart contract, never to Cross. Browsing and negotiating are free, the fee only applies if a trade completes.',
  },
  {
    title: 'The swap happens automatically',
    body: 'The instant the second side pays in, the contract hands tokens to the buyer and dollars to the seller in one step. The trade appears on the public Trade History feed as proof.',
  },
  {
    title: 'Timeout protection',
    body: 'If a counterparty never funds their side, the funded party can reclaim their full deposit after 24 hours. No one, not even Cross, can move or freeze funds early.',
  },
]

const SAFETY = [
  {
    title: 'Escrow holds both sides at once',
    body: 'Funds sit in the contract, not with Cross or the other trader. The swap happens for both people together or not at all.',
  },
  {
    title: 'You can always get your money back',
    body: 'If the other side never funds, the timeout lets you reclaim your deposit in full.',
  },
  {
    title: 'Tested thoroughly, and audits are on the way',
    body: 'See Current Status above.',
  },
]

const GLOSSARY = [
  { term: 'Pool depth', def: "Total USD value in a token's own Uniswap v4 pool." },
  { term: 'Notional', def: 'Total USD value of a trade or listing.' },
  {
    term: 'Impact saved',
    def: 'Dollar difference between the public-pool price and the Cross escrow price for the same trade.',
  },
  { term: 'Δ Pool', def: "How far a listing's offered price sits from the token's current pool price." },
  {
    term: 'Reclaim',
    def: 'When a funded party can withdraw their deposit if the counterparty never completes their side.',
  },
  { term: '$CROSS', def: 'The token settlement fees are paid in.' },
]

/* ---------- Building blocks ---------- */

function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="scroll-mt-28">
      <h2 className="font-grotesk text-2xl font-semibold tracking-tight text-white md:text-3xl">
        {title}
      </h2>
      <div className="mt-4 flex flex-col gap-4 text-[15px] leading-relaxed text-white/70">{children}</div>
    </section>
  )
}

function NumberTag({ n }: { n: number }) {
  return (
    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#2A2A30] bg-muted font-mono text-xs text-white">
      {String(n).padStart(2, '0')}
    </span>
  )
}

function Strong({ children }: { children: ReactNode }) {
  return <span className="font-medium text-white">{children}</span>
}

/* ---------- Page ---------- */

export default function DocsPage() {
  return (
    <>
      <div className="relative isolate bg-black pt-28 pb-24">
        <Grid size={40} />

        <div className="mx-auto flex max-w-6xl gap-12 px-6">
          {/* Sidebar */}
          <aside className="hidden lg:block w-64 shrink-0">
            <nav aria-label="Docs sections" className="sticky top-28">
              <p className="font-mono text-xs uppercase tracking-widest text-[#C026F5]">Docs</p>
              <ul className="mt-4 flex flex-col gap-1 border-l border-[#2A2A30]">
                {SECTIONS.map((s) => (
                  <li key={s.id}>
                    <a
                      href={`#${s.id}`}
                      className="-ml-px block border-l border-transparent py-1.5 pl-4 text-sm text-white/60 transition-colors hover:border-[#C026F5] hover:text-white"
                    >
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>

          {/* Main column */}
          <main className="min-w-0 max-w-3xl flex-1">
            <p className="font-mono text-xs uppercase tracking-widest text-[#C026F5]">Documentation</p>
            <h1 className="mt-3 font-grotesk text-4xl font-semibold tracking-tight text-white md:text-5xl [text-wrap:balance]">
              How Cross works, end to end.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/70">
              Everything from the deal board to settlement, plus where the product stands today.
            </p>

            <div className="mt-16 flex flex-col gap-16">
              <Section id="overview" title="Overview">
                <p>
                  Cross is a trusted-middleman escrow terminal for large trades in tokens paired
                  against tokenized stocks, like NVDA, AAPL, and TSLA, on Robinhood Chain via Pons.
                </p>
                <p>
                  These tokens each trade in their own small pool. Selling a large position straight
                  through that pool crashes its price, and because every pool references the same
                  real stock price, arbitrage carries that impact into every other pool paired to the
                  same stock.
                </p>
                <p>
                  Cross lets a buyer and seller settle the same trade privately, off the public pool,
                  at one agreed price, so the market never sees the block and never moves against it.
                </p>
              </Section>

              <Section id="security" title="Current Status">
                <GlowCard glowColor="purple" customSize className="w-full h-full flex flex-col gap-5 p-6 md:p-7">
                  <dl className="grid gap-x-8 gap-y-3 sm:grid-cols-3">
                    <div>
                      <dt className="font-mono text-xs uppercase tracking-widest text-white/40">Chain</dt>
                      <dd className="mt-1 text-sm text-white">Robinhood Chain (chain ID 4663)</dd>
                    </div>
                    <div>
                      <dt className="font-mono text-xs uppercase tracking-widest text-white/40">Primary venue</dt>
                      <dd className="mt-1 text-sm text-white">Pons launchpad</dd>
                    </div>
                    <div>
                      <dt className="font-mono text-xs uppercase tracking-widest text-white/40">Stage</dt>
                      <dd className="mt-1 text-sm text-white">Concept, pre-launch, running in simulation mode</dd>
                    </div>
                  </dl>

                  <div className="rounded-lg border border-[#C026F5]/30 bg-[#C026F5]/10 px-4 py-3 font-mono text-xs leading-relaxed text-[#E879F9]">
                    A persistent banner across the live app reads: “SIMULATED DATA — escrow deposits,
                    releases &amp; pool prices are on-chain simulations. Wallet connection &amp; message
                    signing are real.”
                  </div>

                  <p className="text-sm leading-relaxed text-white/70">
                    Escrow contracts have been through extensive internal testing and verification
                    during development. Cross is pursuing reviews from independent third-party
                    security firms, to happen before the system ever handles real funds on mainnet.{' '}
                    <Strong>Cross does not call its contracts “audited” until that work is complete.</Strong>
                  </p>
                  <p className="text-xs leading-relaxed text-white/50">
                    Escrow contract 0xC055…63eF on Robinhood Chain 4663. In this build, deposits,
                    releases, pool prices and trust signals are produced by the backend.
                  </p>
                </GlowCard>
              </Section>

              <Section id="how-it-works" title="How It Works">
                <ol className="flex flex-col gap-6">
                  {STEPS.map((step, i) => (
                    <li key={step.title} className="flex gap-4">
                      <NumberTag n={i + 1} />
                      <div className="pt-1.5">
                        <h3 className="font-grotesk text-lg font-semibold text-white">{step.title}</h3>
                        <p className="mt-1.5">{step.body}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </Section>

              <Section id="why-it-safe" title="Why It's Safe">
                <ul className="flex flex-col gap-4">
                  {SAFETY.map((item) => (
                    <li key={item.title} className="flex gap-3">
                      <span aria-hidden="true" className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#C026F5]" />
                      <p>
                        <Strong>{item.title}:</Strong> {item.body}
                      </p>
                    </li>
                  ))}
                </ul>
              </Section>

              <Section id="deal-board" title="The Deal Board">
                <p>
                  The main marketplace, a live table of open listings. Each row shows the token/stock
                  pair and listing ID, side (ask/bid), size in tokens and % of that pool's reserve,
                  offered price vs current pool price (USD per 1M tokens) with the Δ Pool difference,
                  notional value, dollar amount saved vs the public pool with the % of impact avoided,
                  funding status (open, buyer funded, seller funded), post time, and an expiry or
                  reclaim countdown.
                </p>
                <p>
                  Filterable by all/asks/bids/half-funded, searchable by token, stock or ID, and
                  sortable by newest, discount, size or saved. Clicking a listing opens Impact Saved,
                  Negotiation, and Token Trust tabs for that specific trade.
                </p>
              </Section>

              <Section id="proposing" title="Proposing a Trade">
                <p>
                  The Propose panel on the right of every page. Pick a token/stock pair, choose sell
                  (ask) or buy (bid), set a size (quick-fill 5/10/20/30% of pool), set a price in USD
                  per 1 million tokens (quick adjust: at pool, -2%, -5%, -8%), add an optional note
                  to counterparties, optionally make it a private invite-only listing.
                </p>
                <p>Posting requires a wallet signature.</p>
              </Section>

              <Section id="funding" title="Funding an Escrow">
                <p>
                  Once a listing has a counterparty, the panel switches to the Escrow Ticket view:
                  agreed price vs current pool price, impact saved, a live checklist (seller token
                  deposit, buyer USD+fee deposit, automatic contract release), exactly what each side
                  owes and receives, a timeout countdown, and a single funding button.
                </p>
              </Section>

              <Section id="token-trust" title="Token Trust">
                <p>
                  A risk-screening view for every stock-paired token on Cross. Shows pool depth,
                  price, top-10-holder concentration, deployer holdings, holder count, token age, LP
                  lock status, and an overall risk score out of 100 with a plain tier
                  (low/moderate/elevated).
                </p>
                <p>
                  These are informational signals read from chain state. They don't affect escrow
                  logic.
                </p>
              </Section>

              <Section id="impact-simulator" title="Impact Simulator">
                <p>
                  A standalone calculator. Pick a token/pair, a block size (quick-fill 5/10/20/35/50%
                  of pool) and an OTC discount vs the pool price (0–25%), see the full price-impact
                  curve from 1% to 100% of pool reserve (tokens out, USD out, % impact at each size),
                  then a side-by-side of selling into the public pool at that size vs settling the
                  same size through Cross escrow, with the dollar difference called out.
                </p>
              </Section>

              <Section id="history" title="Trade History & My Escrows">
                <p>
                  Trade History is a public, live feed of every completed trade: time, pair, size,
                  price, notional, impact saved, fee paid in $CROSS, a shortened seller→buyer address
                  pair (or “Private → Private” for invite-only deals), tx hash, and a share button.
                </p>
                <p>
                  My Escrows is the same view scoped to your connected wallet only. It needs a wallet
                  connected to show anything, and stays empty until you post or fund your first
                  listing.
                </p>
              </Section>

              <Section id="glossary" title="Glossary">
                <dl className="flex flex-col divide-y divide-[#2A2A30]">
                  {GLOSSARY.map((g) => (
                    <div key={g.term} className="grid gap-1 py-3 sm:grid-cols-[160px_1fr] sm:gap-6">
                      <dt className="font-mono text-sm text-white">{g.term}</dt>
                      <dd>{g.def}</dd>
                    </div>
                  ))}
                </dl>
              </Section>
            </div>
          </main>
        </div>
      </div>
      <FooterSection />
    </>
  )
}
