import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Zap } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { OriginButton } from '@/components/ui/origin-button'
import { GlowCard } from '@/components/ui/spotlight-card'
import { APP_URL, EXTERNAL_LINK_PROPS } from '@/lib/links'
import { cn } from '@/lib/utils'

interface ResourceCard {
  title: string
  body: string
  to: string
}

const resources: ResourceCard[] = [
  {
    title: 'Documentation',
    body: 'Read how escrow, negotiation, and settlement work end to end.',
    to: '/docs',
  },
  {
    title: 'Security & Testing',
    body: "See how escrow contracts are tested today, and what's planned before mainnet.",
    to: '/docs#security',
  },
]

export function CtaSection({ className }: { className?: string }) {
  return (
    <section id="cta" className={cn('relative overflow-hidden bg-background py-24 px-6', className)}>
      {/* Soft brand glow behind the banner */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[520px] w-[820px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#C026F5]/10 blur-[120px]"
      />

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2 lg:gap-16">
        {/* Left: message + actions */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-start gap-6"
        >
          <Badge className="gap-1.5 border-[#C026F5]/40 bg-[#C026F5]/15 font-mono text-[11px] font-medium uppercase tracking-widest text-[#E879F9] hover:bg-[#C026F5]/20">
            <Zap className="h-3 w-3" aria-hidden="true" />
            Ready When You Are
          </Badge>

          <h2 className="font-grotesk text-4xl font-semibold leading-[1.02] tracking-tight text-foreground md:text-5xl [text-wrap:balance]">
            Move size without moving the market.
          </h2>

          <p className="max-w-lg text-base leading-relaxed text-white/70 md:text-lg">
            Cross settles large tokenized stock trades through smart-contract escrow, on Robinhood Chain.
            No stranger to trust, built specifically for this.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <OriginButton type="button" variant="brand" size="lg">
              <Zap size={16} strokeWidth={2.25} aria-hidden="true" />
              Start Escrow
            </OriginButton>
            <OriginButton href={APP_URL} {...EXTERNAL_LINK_PROPS} variant="ghost" size="lg">
              Launch App
            </OriginButton>
          </div>
        </motion.div>

        {/* Right: resource cards */}
        <div className="flex flex-col gap-4">
          {resources.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, delay: 0.1 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              <Link
                to={item.to}
                className="group block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C026F5]"
              >
                <GlowCard glowColor="purple" customSize className="w-full h-full flex flex-col p-6">
                  <h3 className="font-grotesk text-xl font-semibold text-foreground">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/60">{item.body}</p>
                </GlowCard>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default CtaSection
