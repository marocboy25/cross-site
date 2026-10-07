import { ButtonLink, TextLink } from '../components/Button'
import { AppPanel, FloatCard, parallax, usePointerParallax } from '../components/Panel'
import { Container } from '../components/Section'
import { LiveMark } from '../components/three/LiveMark'
import { CROSSING, HERO, LINKS } from '../content/site'

type Order = (typeof CROSSING)['sell']

function OrderBody({ order, onViolet = false }: { order: Order; onViolet?: boolean }) {
  return (
    <>
      <p className={`font-mono text-[10px] uppercase tracking-[0.14em] sm:text-[11px] ${onViolet ? 'text-white/70' : 'text-dim'}`}>{order.side}</p>
      <p className="mt-0.5 whitespace-nowrap text-lg font-semibold tracking-[-0.02em] sm:text-2xl">{order.amount}</p>
      <p className={`mt-0.5 hidden whitespace-nowrap font-mono text-xs sm:block ${onViolet ? 'text-white/70' : 'text-dim'}`}>{order.sub}</p>
    </>
  )
}

/**
 * Centred text, then the scene: the live 3D mark with the two sides of the
 * trade floating beside it. The cards drift with the pointer, less than the mark.
 */
export function Hero() {
  const scene = usePointerParallax<HTMLDivElement>()
  return (
    <section id="top" className="pb-10 pt-10 sm:pb-14 sm:pt-14">
      <Container>
        <div className="mx-auto max-w-5xl text-center">
          <p className="eyebrow">{HERO.tag}</p>
          <h1 className="display mt-4 text-balance text-[44px] sm:text-[64px] lg:text-[72px]">{HERO.title}</h1>
          <p className="mx-auto mt-5 max-w-md text-lg leading-relaxed text-dim">{HERO.body}</p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
            <ButtonLink href={LINKS.app} external>
              {HERO.primary}
            </ButtonLink>
            <TextLink href="#how">{HERO.secondary}</TextLink>
          </div>
        </div>

        <div ref={scene} className="mt-10 sm:mt-12">
          <AppPanel glow="top" className="h-[380px] rounded-[32px] sm:h-[400px] sm:rounded-[44px]">
            {/* Mark: centred; on phones it sits below the two cards. */}
            <div className="absolute inset-x-0 bottom-14 top-24 mx-auto max-w-[640px] sm:inset-y-4">
              <LiveMark />
            </div>

            <div className="absolute left-4 top-4 z-10 sm:left-[6%] sm:top-1/2 sm:-translate-y-1/2 lg:left-[15%]">
              <FloatCard className="px-4 py-3 sm:px-5 sm:py-4" style={parallax(12)}>
                <OrderBody order={CROSSING.sell} />
              </FloatCard>
            </div>
            <div className="absolute right-4 top-4 z-10 sm:right-[6%] sm:top-1/2 sm:-translate-y-1/2 lg:right-[15%]">
              <div
                className="btn-primary rounded-2xl px-4 py-3 text-white sm:px-5 sm:py-4"
                style={parallax(16)}
              >
                <OrderBody order={CROSSING.buy} onViolet />
              </div>
            </div>

            <p className="absolute bottom-5 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-full border border-bid/40 bg-bid/10 px-4 py-1.5 font-mono text-xs uppercase tracking-[0.12em] text-bid-light sm:bottom-7">
              {CROSSING.settle}
            </p>
          </AppPanel>
        </div>
      </Container>
    </section>
  )
}
