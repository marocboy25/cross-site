import { useCallback, useEffect, useRef, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { OriginButton } from '@/components/ui/origin-button'
import { asset } from '@/lib/assets'

/** Scroll distance (in vh) the hero video is scrubbed across. Tune freely. */
export const SCROLL_HEIGHT_VH = 300
/** Shorter scrub distance below the `md` breakpoint so phones don't scroll forever. */
export const SCROLL_HEIGHT_VH_MOBILE = 220

/** Lerp factor per frame for smoothing the scrub (0.1 ≈ ~10 frames to settle). */
const SMOOTHING = 0.1
/** Below this delta the video is considered settled and we stop seeking. */
const SETTLE_EPSILON = 0.0005

const DESKTOP_SRC = asset('videoDesktop')
const MOBILE_SRC = asset('videoMobile')
const POSTER_SRC = asset('poster')

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v))

function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(query).matches : false,
  )
  useEffect(() => {
    const mq = window.matchMedia(query)
    const onChange = (e: MediaQueryListEvent) => setMatches(e.matches)
    setMatches(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [query])
  return matches
}

/** True when the element is actually laid out (not `display: none` via a responsive class). */
const isRendered = (el: HTMLElement | null): el is HTMLElement =>
  !!el && el.getClientRects().length > 0

/** Scroll-scrubbed hero. The fixed site nav lives in SiteNav.tsx. */
export default function Hero() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const videoDesktopRef = useRef<HTMLVideoElement>(null)
  const videoMobileRef = useRef<HTMLVideoElement>(null)
  const rafRef = useRef<number | null>(null)

  // Progress lives in refs so the per-frame loop never triggers a React render.
  const rawProgress = useRef(0)
  const smoothProgress = useRef(0)

  const [mobileFallback, setMobileFallback] = useState(false)

  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const scrollHeightVh = isDesktop ? SCROLL_HEIGHT_VH : SCROLL_HEIGHT_VH_MOBILE

  const handleMobileError = useCallback(() => {
    // Mobile 9:16 source missing (404 / undecodable) -> reuse the desktop file,
    // letterboxed with object-contain. The handler is detached once we've
    // swapped, so a broken desktop file can't loop.
    setMobileFallback(true)
  }, [])

  useEffect(() => {
    if (reducedMotion) return
    const section = sectionRef.current
    if (!section) return

    const updateProgress = () => {
      const rect = section.getBoundingClientRect()
      const sectionTop = rect.top + window.scrollY
      const sectionHeight = rect.height
      const viewportHeight = window.innerHeight
      const range = sectionHeight - viewportHeight
      rawProgress.current =
        range > 0 ? clamp((window.scrollY - sectionTop) / range, 0, 1) : 0
    }

    const activeVideo = (): HTMLVideoElement | null => {
      if (isRendered(videoDesktopRef.current)) return videoDesktopRef.current
      if (isRendered(videoMobileRef.current)) return videoMobileRef.current
      return null
    }

    const tick = () => {
      const delta = rawProgress.current - smoothProgress.current
      if (Math.abs(delta) < SETTLE_EPSILON) {
        smoothProgress.current = rawProgress.current
      } else {
        smoothProgress.current += delta * SMOOTHING
      }

      const video = activeVideo()
      // Don't queue a new seek while the previous one is still decoding; the
      // lerp simply catches up on the next frame. Piling seeks up is what makes
      // scrubbing stutter.
      if (video && !video.seeking) {
        // `duration` is NaN until loadedmetadata fires; guard so we never seek to NaN.
        const duration = video.duration
        if (Number.isFinite(duration) && duration > 0) {
          const target = smoothProgress.current * duration
          if (Math.abs(video.currentTime - target) > 0.001) {
            video.currentTime = target
          }
        }
      }

      rafRef.current = requestAnimationFrame(tick)
    }

    updateProgress()
    window.addEventListener('scroll', updateProgress, { passive: true })
    window.addEventListener('resize', updateProgress)
    rafRef.current = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('scroll', updateProgress)
      window.removeEventListener('resize', updateProgress)
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
  }, [reducedMotion, scrollHeightVh])

  return (
    <div
      ref={sectionRef}
      className="relative w-full"
      style={{ height: `${scrollHeightVh}vh` }}
    >
      {/* Sticky hero: pinned while the wrapper's extra height scrolls past */}
      <div
        className="sticky top-0 w-full h-screen overflow-hidden bg-black"
        style={{ height: '100dvh' }}
      >
        {/* 1. Video layer */}
        {reducedMotion ? (
          <img
            src={POSTER_SRC}
            alt=""
            className="absolute inset-0 z-10 w-full h-full object-cover pointer-events-none"
          />
        ) : (
          <>
            <video
              ref={videoDesktopRef}
              src={DESKTOP_SRC}
              poster={POSTER_SRC}
              muted
              playsInline
              preload="auto"
              disablePictureInPicture
              className="hidden md:block absolute inset-0 z-10 w-full h-full object-cover pointer-events-none"
            />
            <video
              ref={videoMobileRef}
              src={mobileFallback ? DESKTOP_SRC : MOBILE_SRC}
              poster={POSTER_SRC}
              muted
              playsInline
              preload="auto"
              disablePictureInPicture
              onError={mobileFallback ? undefined : handleMobileError}
              className={`md:hidden absolute inset-0 z-10 w-full h-full pointer-events-none ${
                mobileFallback ? 'object-contain' : 'object-cover'
              }`}
            />
          </>
        )}

        {/* 2. Vignette overlay */}
        <div className="absolute inset-0 z-20 pointer-events-none bg-gradient-to-b from-black/40 via-transparent to-black/60" />

        {/* 3. Heading */}
        <div className="absolute top-[14%] left-0 right-0 z-50 flex flex-col items-center text-center px-5 pointer-events-none">
          <h1 className="text-white leading-[0.95] font-grotesk">
            <span
              className="hero-anim hero-reveal block font-semibold text-5xl sm:text-7xl md:text-8xl"
              style={{ letterSpacing: '-0.03em', animationDelay: '0.25s' }}
            >
              Whale-sized stock trades.
            </span>
            <span
              className="hero-anim hero-reveal block font-semibold text-5xl sm:text-7xl md:text-8xl -mt-1 text-[#C026F5]"
              style={{ letterSpacing: '-0.03em', animationDelay: '0.42s' }}
            >
              Zero market impact.
            </span>
          </h1>
        </div>

        {/* 4. Bottom-left paragraph */}
        <div
          className="hero-anim hero-fade hidden sm:block absolute bottom-14 left-10 md:left-14 z-50 max-w-[280px]"
          style={{ animationDelay: '0.7s' }}
        >
          <p className="text-sm text-white/80 leading-relaxed font-mono">
            NVDA, AAPL, TSLA, and more. Tokenized stock exposure, moved in size through
            private escrow instead of a paper-thin public pool.
          </p>
        </div>

        {/* 5. Bottom-right block */}
        <div
          className="hero-anim hero-fade absolute bottom-10 sm:bottom-24 left-5 right-5 sm:left-auto sm:right-10 md:right-14 z-50 max-w-full sm:max-w-[280px] flex flex-col items-start gap-4 sm:gap-5"
          style={{ animationDelay: '0.85s' }}
        >
          <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
            If the deal falls through, funds return automatically. Built for trades
            too big for any single pool.
          </p>
          <OriginButton type="button" variant="brand" size="lg">
            Start Escrow
            <ArrowRight size={16} strokeWidth={2.25} />
          </OriginButton>
        </div>
      </div>
    </div>
  )
}
