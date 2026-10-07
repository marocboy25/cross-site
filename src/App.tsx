import { BigPositions } from './sections/BigPositions'
import { Facts } from './sections/Facts'
import { FinalCta } from './sections/FinalCta'
import { Footer } from './sections/Footer'
import { Header } from './sections/Header'
import { Hero } from './sections/Hero'
import { HowItWorks } from './sections/HowItWorks'
import { StatStrip } from './sections/StatStrip'
import { TokenTicker } from './sections/TokenTicker'
import { TokenTrust } from './sections/TokenTrust'
import { WhyP2P } from './sections/WhyP2P'

import { useScrollReveal } from './components/motion'

export default function App() {
  useScrollReveal()
  return (
    <>
      <Header />
      <main>
        <Hero />
        <StatStrip />
        <HowItWorks />
        <WhyP2P />
        <TokenTicker />
        <BigPositions />
        <TokenTrust />
        <Facts />
        <FinalCta />
      </main>
      <Footer />
    </>
  )
}
