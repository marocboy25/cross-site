import Hero from '@/components/Hero'
import TickerStrip from '@/components/sections/TickerStrip'
import HowItWorks from '@/components/ui/how-it-works'
import WhyCross from '@/components/sections/WhyCross'
import Comparison from '@/components/sections/Comparison'
import CtaSection from '@/components/ui/cta-section'
import FooterSection from '@/components/ui/footer-section'

export default function LandingPage() {
  return (
    <>
      <Hero />
      {/* Sections sit above the sticky hero's stacking context */}
      <div className="relative z-10">
        <TickerStrip />
        <HowItWorks />
        <WhyCross />
        <Comparison />
        <CtaSection />
        <FooterSection />
      </div>
    </>
  )
}
