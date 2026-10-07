import { TokenLogo } from '../components/TokenLogo'
import { TICKER } from '../content/site'

/** One run of the band: every token, then the tagline. */
function Run() {
  return (
    <>
      {TICKER.tokens.map((t) => (
        <li key={t.symbol} className="group flex shrink-0 items-center gap-2.5">
          {/* Muted gray logos that turn white on hover; Cross's own mark in violet. */}
          <TokenLogo
            symbol={t.symbol}
            className={`h-6 w-6 shrink-0 transition-colors duration-200 group-hover:text-white ${t.symbol === 'CROSS' ? 'text-violet-light' : 'text-dim'}`}
          />
          <span className="text-xl font-bold tracking-[-0.02em]">{t.symbol === 'CROSS' ? '$CROSS' : t.symbol}</span>
          <span className="text-sm text-dim">{t.name}</span>
        </li>
      ))}
      <li className="shrink-0 font-mono text-xs uppercase tracking-[0.14em] text-violet-light">{TICKER.tagline}</li>
    </>
  )
}

/**
 * A slow, endless band of tradable tokens. The list is repeated so one copy
 * scrolls out exactly as the next scrolls in. Static with reduced motion.
 */
export function TokenTicker() {
  return (
    <section aria-label="Tokens on Cross" className="overflow-hidden border-y border-line bg-wash py-6">
      <ul className="ticker-track flex w-max items-center gap-12 pr-12">
        {[0, 1, 2, 3].map((i) => (
          // Four runs: two fill even very wide screens, two more make the seamless loop.
          <Run key={i} />
        ))}
      </ul>
    </section>
  )
}
