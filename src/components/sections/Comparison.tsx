import { Check, X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { BorderTrail } from '@/components/ui/border-trail'
import { ShimmerText } from '@/components/ui/shimmer-text'
import { GlowCard } from '@/components/ui/spotlight-card'

const WITHOUT = [
  "Moves the token's price on-chain",
  "No escrow, funds aren't protected if it falls apart",
  'Not built for this kind of trade',
]

const WITH = [
  'No stranger to trust',
  'Never moves the on-chain price',
  'Refunded automatically if it falls through',
  'Built specifically for this',
]

export default function Comparison() {
  return (
    <section id="comparison" className="relative overflow-hidden bg-black py-24 px-6">
      {/* Dotted grid with radial mask */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(#2A2A30_1px,transparent_1px)] [background-size:18px_18px] [mask-image:radial-gradient(ellipse_at_center,black_35%,transparent_75%)]"
      />

      <div className="relative mx-auto max-w-4xl">
        <div className="text-center">
          <ShimmerText className="font-mono text-xs tracking-widest text-[#C026F5]">
            THE COMPARISON
          </ShimmerText>
          <h2 className="mt-3 font-grotesk text-3xl font-semibold text-white md:text-4xl">
            Same trade. Different outcome.
          </h2>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {/* Without Cross */}
          <GlowCard glowColor="purple" customSize className="w-full h-full flex flex-col gap-6 p-6 md:p-8">
            <div>
              <span className="font-mono text-xs tracking-widest text-white/40">WITHOUT CROSS</span>
              <h3 className="mt-2 font-grotesk text-xl font-semibold text-white/70">
                Trading on the open book
              </h3>
            </div>
            <ul className="flex flex-col gap-4">
              {WITHOUT.map((line) => (
                <li key={line} className="flex items-start gap-3 text-sm text-white/50">
                  <X className="mt-0.5 h-4 w-4 shrink-0 text-white/40" aria-hidden="true" />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </GlowCard>

          {/* With Cross */}
          <GlowCard glowColor="purple" customSize className="w-full h-full flex flex-col gap-6 p-6 md:p-8">
            <BorderTrail
              className="bg-[#C026F5]"
              size={90}
              style={{
                boxShadow:
                  '0 0 40px 18px rgba(192,38,245,0.55), 0 0 90px 40px rgba(192,38,245,0.25)',
              }}
            />
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="font-mono text-xs tracking-widest text-[#C026F5]">WITH CROSS</span>
                <h3 className="mt-2 font-grotesk text-xl font-semibold text-white">
                  Escrowed, off the book
                </h3>
              </div>
              <Badge className="shrink-0 border-[#C026F5]/40 bg-[#C026F5]/15 font-mono text-[10px] font-medium uppercase tracking-widest text-[#E879F9] hover:bg-[#C026F5]/20">
                built for this
              </Badge>
            </div>
            <ul className="flex flex-col gap-4">
              {WITH.map((line) => (
                <li key={line} className="flex items-start gap-3 text-sm text-white">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#C026F5]" aria-hidden="true" />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </GlowCard>
        </div>
      </div>
    </section>
  )
}
