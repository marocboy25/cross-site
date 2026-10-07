import { Component, lazy, Suspense, useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { afterVisible, motionReady } from '../motion'

const MarkCanvas = lazy(() => import('./MarkCanvas'))

/** Pre-rendered from the same 3D scene (see src/dev/RenderStudio.tsx). */
export const MARK_PNG = `${import.meta.env.BASE_URL}icons/cross-mark.png`

function StaticMark() {
  return <img src={MARK_PNG} alt="" width={1024} height={1024} className="mx-auto h-full w-auto max-w-full object-contain" />
}

/** Falls back to the PNG if the 3D scene throws (e.g. WebGL init fails). */
class FallbackOnError extends Component<{ fallback: ReactNode; children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children
  }
}

/**
 * Very low-end devices get the static render: under 2 GB of memory (where the
 * browser reports it) or data saver switched on. CPU core count is not used:
 * Safari on iOS under-reports it, which would wrongly send iPhones the PNG.
 */
function isLowEnd() {
  const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } }
  if (nav.deviceMemory && nav.deviceMemory < 2) return true
  return Boolean(nav.connection?.saveData)
}

/** Live 3D on any screen size, unless WebGL is missing, the device is very low end, or motion is reduced. */
function canRender3D() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false
  if (isLowEnd()) return false
  try {
    const canvas = document.createElement('canvas')
    return Boolean(canvas.getContext('webgl2') || canvas.getContext('webgl'))
  } catch {
    return false
  }
}

/** How long the intro waits for three.js before playing on the static render. */
const INTRO_WAIT_MS = 1200

/**
 * Intro state: 'pending' waits for the first 3D frame; 'three' plays the drop
 * in 3D; 'static' plays it on the PNG (no WebGL, or three.js was slow).
 */
type IntroPhase = 'off' | 'pending' | 'three' | 'static'

/**
 * The 3D Cross mark. three.js is only fetched when it will be used; the
 * scene mounts once it nears the viewport and stops rendering frames while
 * off screen, so two marks on the page never animate at the same time.
 * The static render stays underneath until the first 3D frame is drawn, so
 * there's never an empty panel while the scene starts up.
 *
 * With `intro`, the mark drops in with a quick turn on load, then calls
 * `onIntroStart` so the rest of the scene can follow it.
 */
export function LiveMark({ intro = false, onIntroStart }: { intro?: boolean; onIntroStart?: () => void }) {
  const ref = useRef<HTMLDivElement>(null)
  const [live, setLive] = useState<boolean | null>(null)
  const [mounted, setMounted] = useState(false)
  const [visible, setVisible] = useState(false)
  const [ready, setReady] = useState(false)
  const [phase, setPhase] = useState<IntroPhase>(() => (intro && motionReady() ? 'pending' : 'off'))
  const phaseRef = useRef(phase)

  /** Starts the intro once, in 3D or on the PNG; false if it already started. */
  const startIntro = useCallback(
    (as: 'three' | 'static') => {
      if (phaseRef.current !== 'pending') return false
      phaseRef.current = as
      setPhase(as)
      onIntroStart?.()
      return true
    },
    [onIntroStart],
  )

  useEffect(() => setLive(canRender3D()), [])

  useEffect(() => {
    if (phase !== 'pending' || live === null) return
    if (!live) {
      startIntro('static')
      return
    }
    return afterVisible(INTRO_WAIT_MS, () => startIntro('static'))
  }, [phase, live, startIntro])

  useEffect(() => {
    const el = ref.current
    if (!live || !el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting)
        if (entry.isIntersecting) setMounted(true)
      },
      { rootMargin: '200px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [live])

  // The PNG hides while the intro waits for 3D, and plays the drop itself if 3D is late.
  const staticClass = ready || phase === 'pending' ? 'opacity-0' : phase === 'static' ? 'mark-drop opacity-100' : 'opacity-100'

  return (
    <div ref={ref} className="relative h-full w-full">
      <div className={`absolute inset-0 transition-opacity duration-500 ${staticClass}`}>
        <StaticMark />
      </div>
      {live && mounted && (
        <div className="absolute inset-0">
          <FallbackOnError fallback={<StaticMark />}>
            <Suspense fallback={null}>
              <MarkCanvas
                active={visible}
                onReady={() => {
                  const play = startIntro('three')
                  setReady(true)
                  return play
                }}
                onFail={() => {
                  setReady(false)
                  setLive(false)
                }}
              />
            </Suspense>
          </FallbackOnError>
        </div>
      )}
    </div>
  )
}
