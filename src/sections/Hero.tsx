import { useCallback, useEffect, useRef, useState } from 'react'
import { ButtonLink, TextLink } from '../components/Button'
import { afterVisible, motionReady } from '../components/motion'
import { AppPanel, FloatCard, parallax } from '../components/Panel'
import { Container } from '../components/Section'
import { LiveMark } from '../components/three/LiveMark'
import { CROSSING, HERO, LINKS, type OrderSide } from '../content/site'

function OrderBody({ order, onViolet = false }: { order: OrderSide; onViolet?: boolean }) {
  return (
    <>
      <p className={`font-mono text-[10px] uppercase tracking-[0.14em] sm:text-[11px] ${onViolet ? 'text-white/70' : 'text-dim'}`}>{order.side}</p>
      <p className="mt-0.5 flex items-center gap-1.5 whitespace-nowrap text-lg font-semibold tracking-[-0.02em] sm:text-2xl">
        {order.crossMark && (
          <img src={`${import.meta.env.BASE_URL}brand/cross-logo-96.png`} alt="" width={24} height={24} className="h-5 w-5 rounded-full sm:h-6 sm:w-6" />
        )}
        {order.amount}
      </p>
      <p className={`mt-0.5 hidden whitespace-nowrap font-mono text-xs sm:block ${onViolet ? 'text-white/70' : 'text-dim'}`}>{order.sub}</p>
    </>
  )
}

/** Longest the cards wait for the mark before playing the intro anyway. */
const INTRO_FALLBACK_MS = 2000
/** How long each pair shows, and how long its cards take to flip out. */
const ROTATE_MS = 4000
const FLIP_OUT_MS = 300

/**
 * Cycles through CROSSING.pairs every few seconds once the intro has started.
 * Holds while `paused` (pointer on a card), while the hero is off screen and
 * while the tab is hidden. Cards flip out (`leaving`), the pair changes, and
 * the new content flips in; `turn` keys the content so it remounts to play
 * the flip-in. With reduced motion the pair just changes.
 */
function usePairRotation(started: boolean, paused: boolean) {
  const scene = useRef<HTMLDivElement>(null)
  const inView = useRef(true)
  const [turn, setTurn] = useState(0)
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    const el = scene.current
    if (!el) return
    const observer = new IntersectionObserver(([entry]) => (inView.current = entry.isIntersecting))
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!started || paused) return
    let wait = 0
    let swap = 0
    const tick = () => {
      if (document.hidden || !inView.current) {
        wait = window.setTimeout(tick, ROTATE_MS)
        return
      }
      if (!motionReady()) {
        setTurn((t) => t + 1)
        wait = window.setTimeout(tick, ROTATE_MS)
        return
      }
      setLeaving(true)
      swap = window.setTimeout(() => {
        setTurn((t) => t + 1)
        setLeaving(false)
        wait = window.setTimeout(tick, ROTATE_MS)
      }, FLIP_OUT_MS)
    }
    wait = window.setTimeout(tick, ROTATE_MS)
    return () => {
      clearTimeout(wait)
      clearTimeout(swap)
      setLeaving(false) // paused mid-flip: bring the current pair back
    }
  }, [started, paused])

  return { scene, turn, leaving, pair: CROSSING.pairs[turn % CROSSING.pairs.length] }
}

/**
 * Centred text, then the scene: the live 3D mark with the two sides of a
 * trade floating beside it. The cards drift with the pointer, less than the
 * mark, and rotate through a few example pairs (paused under the pointer).
 *
 * On load (see .hero-intro in index.css): the mark drops in, the two orders
 * slide in from the sides and land with a "match" pulse, then the price
 * impact pill pops in with a green flash.
 */
export function Hero() {
  const [intro, setIntro] = useState<'wait' | 'play' | 'off'>(() => (motionReady() ? 'wait' : 'off'))
  const play = useCallback(() => setIntro((s) => (s === 'wait' ? 'play' : s)), [])
  useEffect(() => {
    if (intro !== 'wait') return
    return afterVisible(INTRO_FALLBACK_MS, play)
  }, [intro, play])

  const [paused, setPaused] = useState(false)
  const { scene, turn, leaving, pair } = usePairRotation(intro !== 'wait', paused)
  // Hover (mouse) or a finger on a card holds the current pair.
  const hold = { onPointerEnter: () => setPaused(true), onPointerLeave: () => setPaused(false) }
  const flipIn = turn > 0 ? 'flip-in' : ''

  return (
    <section id="top" className="pb-10 pt-10 sm:pb-14 sm:pt-14">
      <Container>
        <div className="mx-auto max-w-5xl text-center">
          <p className="eyebrow">{HERO.tag}</p>
          <h1 className="display mt-4 text-balance text-[44px] sm:text-[64px] lg:text-[72px]">{HERO.title}</h1>
          <p className="mx-auto mt-5 max-w-md text-lg leading-relaxed text-dim">{HERO.body}</p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
            <ButtonLink href={LINKS.app} external pulse>
              {HERO.primary}
            </ButtonLink>
            <TextLink href="#how">{HERO.secondary}</TextLink>
          </div>
        </div>

        <div ref={scene} className="hero-intro mt-10 sm:mt-12" data-intro={intro} {...(leaving ? { 'data-leaving': '' } : {})}>
          <AppPanel glow="top" scene className="h-[380px] rounded-[32px] sm:h-[400px] sm:rounded-[44px]">
            {/* Mark: centred; on phones it sits below the two cards. */}
            <div className="absolute inset-x-0 bottom-14 top-24 mx-auto max-w-[640px] sm:inset-y-4">
              <LiveMark intro onIntroStart={play} />
              <span aria-hidden="true" className="intro-ring" />
            </div>

            <div className="intro-sell absolute left-4 top-4 z-10 sm:left-[6%] sm:top-1/2 sm:-translate-y-1/2 lg:left-[15%]" {...hold}>
              <FloatCard depth={12} className="min-w-[136px] px-4 py-3 [perspective:600px] sm:min-w-[180px] sm:px-5 sm:py-4">
                <div key={turn} className={`flip-content ${flipIn}`}>
                  <OrderBody order={pair.sell} />
                </div>
              </FloatCard>
            </div>
            <div className="intro-buy absolute right-4 top-4 z-10 sm:right-[6%] sm:top-1/2 sm:-translate-y-1/2 lg:right-[15%]" {...hold}>
              <div className="btn-primary min-w-[136px] rounded-2xl px-4 py-3 text-white [perspective:600px] sm:min-w-[180px] sm:px-5 sm:py-4" style={parallax(16)}>
                <div key={turn} className={`flip-content ${flipIn}`}>
                  <OrderBody order={pair.buy} onViolet />
                </div>
              </div>
            </div>

            <p className="intro-pill absolute bottom-5 left-1/2 z-10 isolate -translate-x-1/2 whitespace-nowrap rounded-full border border-bid/40 bg-bid/10 px-4 py-1.5 font-mono text-xs uppercase tracking-[0.12em] text-bid-light sm:bottom-7">
              {CROSSING.settle}
            </p>
          </AppPanel>
          <p className="mt-2.5 pr-2 text-right font-mono text-[10px] uppercase tracking-[0.14em] text-dim/70">{CROSSING.note}</p>
        </div>
      </Container>
    </section>
  )
}
