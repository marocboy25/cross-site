import { motion } from 'framer-motion'
import { GlowCard } from '@/components/ui/spotlight-card'
import { cn } from '@/lib/utils'

export interface Feature {
  title: string
  description: string
}

export interface FeaturesGridProps {
  title: string
  subtitle?: string
  features: Feature[]
  className?: string
}

export function FeaturesGrid({ title, subtitle, features, className }: FeaturesGridProps) {
  return (
    <section className={cn('relative w-full py-24 px-6', className)}>
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-grotesk text-3xl font-semibold tracking-tight text-white md:text-4xl">
            {title}
          </h2>
          {subtitle && <p className="mt-4 text-base text-white/70 md:text-lg">{subtitle}</p>}
        </div>

        <div
          className={cn(
            'mt-14 grid gap-5 sm:grid-cols-2',
            // 4 items fill a 4-up row; otherwise 3-up so 6 items don't leave an orphan.
            features.length % 4 === 0 ? 'lg:grid-cols-4' : 'lg:grid-cols-3',
          )}
        >
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
            >
              <GlowCard glowColor="purple" customSize className="w-full h-full flex flex-col p-6">
                <h3 className="font-grotesk text-xl font-semibold text-white">{feature.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/60">{feature.description}</p>
              </GlowCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeaturesGrid
