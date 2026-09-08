import { cn } from '@/lib/utils'

const TICKERS = ['NVDA', 'AAPL', 'TSLA'] as const

/** Full-width strip naming the tokenized stocks on Cross. Names only, no live data. */
export default function TickerStrip() {
  return (
    <section
      aria-label="Tokenized stocks on Cross"
      className="border-y border-[#2A2A30] bg-black py-6 px-6"
    >
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-8 gap-y-4">
        <span className="font-mono text-xs uppercase tracking-widest text-white/40">
          Tokenized stocks on Cross
        </span>
        <ul className="flex flex-wrap items-center justify-center gap-2">
          {TICKERS.map((ticker) => (
            <li key={ticker}>
              <Pill>{ticker}</Pill>
            </li>
          ))}
          <li>
            <Pill muted>+ More soon</Pill>
          </li>
        </ul>
      </div>
    </section>
  )
}

function Pill({ children, muted = false }: { children: string; muted?: boolean }) {
  return (
    <span
      className={cn(
        'inline-block rounded-full border border-[#2A2A30] bg-[#0C0C0F] px-4 py-1.5 font-mono text-xs uppercase tracking-wide',
        muted ? 'text-white/40' : 'text-white/70',
      )}
    >
      {children}
    </span>
  )
}
