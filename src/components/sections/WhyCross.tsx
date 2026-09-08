import { Grid } from '@/components/ui/dot-grid'
import { FeaturesGrid, type Feature } from '@/components/ui/features-grid'

// Auto-Refunded and Doesn't Move the Price now live in the "Settle" step of How Cross Works.
const FEATURES: Feature[] = [
  {
    title: 'Security-First Escrow',
    description:
      'Contracts are internally tested now, with independent third-party audits underway before any real funds touch the system.',
  },
  {
    title: 'Risk Screening',
    description: "Tokens are automatically checked before they're allowed onto Cross.",
  },
  {
    title: 'Built-in Negotiation',
    description: 'Counter, accept, or walk away, all inside the escrow flow.',
  },
  {
    title: 'Referral Rewards',
    description: 'Bring liquidity to Cross and earn a share of what it generates.',
  },
]

export default function WhyCross() {
  return (
    <div id="why-cross" className="silk-wash relative isolate w-full">
      <Grid size={40} />
      <FeaturesGrid
        title="Why Cross"
        subtitle="Built for stock-sized trades that don't fit anywhere else."
        features={FEATURES}
      />
    </div>
  )
}
