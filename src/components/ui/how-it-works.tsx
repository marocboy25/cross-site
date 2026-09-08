import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { Grid } from '@/components/ui/dot-grid'
import { GlowCard } from '@/components/ui/spotlight-card'
import { cn } from '@/lib/utils'

interface Step {
  title: string
  description: string
  benefits: string[]
}

const stepsData: Step[] = [
  {
    title: 'Propose',
    description: 'Buyer and seller agree on a large tokenized stock position and a price, directly.',
    benefits: ['Any size, negotiated privately', 'No public order book', 'Works for NVDA, AAPL, TSLA, and more'],
  },
  {
    title: 'Escrow',
    description: 'Funds lock into a smart contract. Neither side can touch the asset until both are in.',
    benefits: [
      'Internally tested, third-party audit underway',
      'Risky tokens screened out automatically',
      'Nothing moves until both sides are ready',
    ],
  },
  {
    title: 'Confirm',
    description: 'Both sides confirm inside the escrow flow, or either can walk away.',
    benefits: ['Built-in negotiation, counter or accept', 'Either party can back out cleanly', 'No stranger to trust'],
  },
  {
    title: 'Settle',
    description: 'Escrow releases atomically. If it falls through, funds return automatically.',
    benefits: ['Instant, atomic settlement', 'Automatic refund if it falls apart', "Never moves the token's on-chain price"],
  },
]

export interface HowItWorksProps {
  title?: string
  subtitle?: string
  steps?: Step[]
  className?: string
}

export function HowItWorks({
  title = 'How Cross Works',
  subtitle = 'Every large tokenized stock trade moves through the same escrow contract, from first offer to final settlement.',
  steps = stepsData,
  className,
}: HowItWorksProps) {
  return (
    <section id="how-it-works" className={cn('relative isolate bg-background py-24 px-6', className)}>
      <Grid size={40} />

      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-grotesk text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            {title}
          </h2>
          <p className="mt-4 text-base text-white/70 md:text-lg">{subtitle}</p>
        </div>

        {/* Step numbers with connecting line (desktop only) */}
        <div className="relative mx-auto mt-16 hidden max-w-6xl lg:block">
          <div
            aria-hidden="true"
            className="absolute left-[12.5%] top-1/2 h-px w-[75%] -translate-y-1/2 bg-gradient-to-r from-transparent via-[#C026F5]/60 to-transparent"
          />
          <div className="relative grid grid-cols-4">
            {steps.map((step, i) => (
              <div key={step.title} className="flex justify-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#2A2A30] bg-muted font-mono text-sm text-foreground shadow-[0_0_0_6px_#000]">
                  {String(i + 1).padStart(2, '0')}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Step cards */}
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:mt-10 lg:grid-cols-4">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            >
              <GlowCard glowColor="purple" customSize className="w-full h-full flex flex-col p-6">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-grotesk text-xl font-semibold text-foreground">{step.title}</h3>
                  {/* Number shown inline below lg, where the connecting row is hidden */}
                  <span className="font-mono text-xs text-muted-foreground lg:hidden">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-white/60">{step.description}</p>
                <ul className="mt-5 flex flex-col gap-2.5 border-t border-[#2A2A30] pt-4">
                  {step.benefits.map((benefit) => (
                    <li key={benefit} className="flex items-start gap-2 text-sm text-white/80">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </GlowCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HowItWorks
