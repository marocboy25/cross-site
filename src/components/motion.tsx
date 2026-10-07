import { Fragment, useEffect, useLayoutEffect, useRef, type CSSProperties, type RefObject } from 'react'

const STAGGER_MS = 90
const REVEAL_MS = 800

const reducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Turns motion on before the first paint, so animated elements start in their
 * hidden pose instead of flashing. Without IntersectionObserver or with
 * reduced motion nothing is hidden and nothing moves. Call once, before
 * rendering.
 */
export function enableMotion() {
  if (!('IntersectionObserver' in window) || reducedMotion()) return
  document.documentElement.classList.add('motion-ready')
  // iOS Safari only applies :active (tap feedback) once a touch listener exists.
  document.addEventListener('touchstart', () => {}, { passive: true })
}

/**
 * Runs `fn` after `ms` of the page actually being visible, so intros opened
 * in a background tab wait for the visitor instead of playing unseen.
 * Returns a cleanup function.
 */
export function afterVisible(ms: number, fn: () => void) {
  let timer = 0
  const start = () => {
    if (document.hidden) return
    document.removeEventListener('visibilitychange', start)
    timer = window.setTimeout(fn, ms)
  }
  document.addEventListener('visibilitychange', start)
  start()
  return () => {
    document.removeEventListener('visibilitychange', start)
    clearTimeout(timer)
  }
}

/** True once enableMotion() has switched motion on. */
export const motionReady = () => typeof document !== 'undefined' && document.documentElement.classList.contains('motion-ready')

/** Props for an element that fades and slides up on entering the screen; `step` staggers it. */
export function reveal(step = 0): { 'data-reveal': string; style: CSSProperties } {
  return { 'data-reveal': '', style: { '--reveal-delay': `${step * STAGGER_MS}ms` } as CSSProperties }
}

/**
 * One-shot entrances: marks [data-reveal], [data-pop] (3D icons) and
 * [data-words] (headlines) as shown once on screen. Reveals are then marked
 * done, which drops the stagger delay so hover responds straight away.
 * Also flags [data-pulse] elements while they're on screen, so their
 * looping pulse only runs when it can be seen.
 */
export function useScrollReveal() {
  useEffect(() => {
    if (!motionReady()) return
    const timers: number[] = []
    const once = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          const el = entry.target as HTMLElement
          once.unobserve(el)
          el.dataset.shown = ''
          if (!('reveal' in el.dataset)) continue
          const delay = parseFloat(el.style.getPropertyValue('--reveal-delay')) || 0
          timers.push(window.setTimeout(() => (el.dataset.revealDone = ''), delay + REVEAL_MS))
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
    )
    const inView = new IntersectionObserver((entries) => {
      for (const entry of entries) (entry.target as HTMLElement).toggleAttribute('data-inview', entry.isIntersecting)
    })
    document.querySelectorAll('[data-reveal], [data-pop], [data-words]').forEach((el) => once.observe(el))
    document.querySelectorAll('[data-pulse]').forEach((el) => inView.observe(el))
    return () => {
      once.disconnect()
      inView.disconnect()
      timers.forEach(clearTimeout)
    }
  }, [])
}

/** A headline whose words rise in one after another as it scrolls into view. */
export function Words({ text }: { text: string }) {
  const words = text.split(' ')
  return (
    <span data-words="">
      {words.map((word, i) => (
        <Fragment key={i}>
          <span className="word" style={{ '--wi': i } as CSSProperties}>
            {word}
          </span>
          {i < words.length - 1 && ' '}
        </Fragment>
      ))}
    </span>
  )
}

/* ---- Frame loop --------------------------------------------------------
   One requestAnimationFrame loop for every scroll- and pointer-linked
   effect. Each frame it first measures all jobs, then writes, so reading
   layout never follows a style write. Jobs are only registered while their
   element is near the screen, and the loop stops once everything settles. */

type Job = {
  /** Read layout (getBoundingClientRect) here only. */
  measure: () => void
  /** Write styles here only. Return true while still moving. */
  write: (dt: number) => boolean
}

const jobs = new Set<Job>()
let frame = 0
let last = 0
/** Pointer position across the window, -1..1. */
export const pointer = { x: 0, y: 0 }

function loop(now: number) {
  const dt = last ? Math.min((now - last) / 1000, 1 / 20) : 1 / 60
  last = now
  jobs.forEach((job) => job.measure())
  let moving = false
  jobs.forEach((job) => {
    if (job.write(dt)) moving = true
  })
  frame = moving ? requestAnimationFrame(loop) : 0
  if (!moving) last = 0
}

function kick() {
  if (!frame) frame = requestAnimationFrame(loop)
}

let listening = false
function listen() {
  if (listening) return
  listening = true
  window.addEventListener('scroll', kick, { passive: true })
  window.addEventListener('resize', kick, { passive: true })
  window.addEventListener(
    'pointermove',
    (e) => {
      if (e.pointerType !== 'mouse') return
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1
      pointer.y = (e.clientY / window.innerHeight) * 2 - 1
      kick()
    },
    { passive: true },
  )
}

/** Runs `job` in the shared loop while `ref`'s element is within a screen of view. */
export function useFrameJob(ref: RefObject<HTMLElement>, make: (el: HTMLElement) => Job | null, deps: unknown[] = []) {
  useEffect(() => {
    const el = ref.current
    if (!el || !motionReady()) return
    const job = make(el)
    if (!job) return
    listen()
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          jobs.add(job)
          kick()
        } else jobs.delete(job)
      },
      { rootMargin: '50% 0px' },
    )
    observer.observe(el)
    return () => {
      observer.disconnect()
      jobs.delete(job)
    }
  }, deps) // eslint-disable-line react-hooks/exhaustive-deps
}

/**
 * Where an element's centre sits relative to the viewport: -1 just below the
 * screen, 0 centred, 1 just above it.
 */
export function scrollProgress(rect: DOMRect) {
  const vh = window.innerHeight
  const p = (vh / 2 - (rect.top + rect.height / 2)) / ((vh + rect.height) / 2)
  return Math.max(-1, Math.min(1, p))
}

/**
 * Eased motion variables on an element: --sp (scroll progress, see
 * scrollProgress) and, for `pointer`, --px / --py (mouse position, mouse
 * devices only). Children use them in transforms.
 */
export function useMotionVars<T extends HTMLElement>(pointerToo: boolean) {
  const ref = useRef<T>(null)
  useFrameJob(ref, (el) => {
    const usePointer = pointerToo && matchMedia('(hover: hover) and (pointer: fine)').matches
    const target = { sp: 0 }
    const cur = { sp: Number.NaN, px: 0, py: 0 }
    return {
      measure: () => {
        target.sp = scrollProgress(el.getBoundingClientRect())
      },
      write: (dt) => {
        if (Number.isNaN(cur.sp)) cur.sp = target.sp // first frame: jump, don't sweep in
        const ks = 1 - Math.exp(-dt * 7)
        const kp = 1 - Math.exp(-dt * 5)
        cur.sp += (target.sp - cur.sp) * ks
        el.style.setProperty('--sp', cur.sp.toFixed(4))
        let moving = Math.abs(target.sp - cur.sp) > 0.0005
        if (usePointer) {
          cur.px += (pointer.x - cur.px) * kp
          cur.py += (pointer.y - cur.py) * kp
          el.style.setProperty('--px', cur.px.toFixed(4))
          el.style.setProperty('--py', cur.py.toFixed(4))
          moving ||= Math.abs(pointer.x - cur.px) > 0.001 || Math.abs(pointer.y - cur.py) > 0.001
        }
        return moving
      },
    }
  })
  return ref
}

/** Gentle overshoot: rises a little past 1, then settles. */
const easeOutBack = (t: number) => {
  const c1 = 1.1
  const c3 = c1 + 1
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2)
}

/**
 * A stat like "0.5%" or "1" that counts up from zero with a slight
 * overshoot, keeping its decimals and any prefix or suffix, once it scrolls
 * into view. When it lands it gives a small bump, and `flash` adds a green
 * glow. Zero values just land. The final value is always what screen readers
 * get; reduced motion just shows it.
 */
export function CountUp({ value, delay = 0, duration = 900, flash = false }: { value: string; delay?: number; duration?: number; flash?: boolean }) {
  const wrap = useRef<HTMLSpanElement>(null)
  const num = useRef<HTMLSpanElement>(null)
  const match = value.match(/^(\D*)(\d+(?:\.(\d+))?)(.*)$/)
  const target = match ? parseFloat(match[2]) : 0

  // Before paint: show the starting value, so the final one never flashes first.
  useLayoutEffect(() => {
    const el = num.current
    const box = wrap.current
    if (!el || !box || !match || !motionReady()) return
    const [, prefix, , decimals = '', suffix] = match
    const format = (n: number) => `${prefix}${Math.max(0, n).toFixed(decimals.length)}${suffix}`
    if (target !== 0) el.textContent = format(0)

    let frame = 0
    let timer = 0
    const land = () => {
      el.textContent = value
      box.dataset.landed = ''
    }
    const run = () => {
      if (target === 0) return land()
      const start = performance.now()
      const tick = (now: number) => {
        const t = Math.min((now - start) / duration, 1)
        el.textContent = format(target * easeOutBack(t))
        if (t < 1) frame = requestAnimationFrame(tick)
        else land()
      }
      frame = requestAnimationFrame(tick)
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        observer.disconnect()
        // Zeros land when the others would, so the row finishes together.
        timer = window.setTimeout(run, target === 0 ? delay + duration * 0.6 : delay)
      },
      { threshold: 0.6 },
    )
    observer.observe(box)
    return () => {
      observer.disconnect()
      clearTimeout(timer)
      cancelAnimationFrame(frame)
      el.textContent = value
    }
  }, [value, delay, duration]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <span ref={wrap} className="stat-num">
      <span ref={num} aria-hidden="true" className="tabular-nums">
        {value}
      </span>
      {flash && (
        <span aria-hidden="true" className="stat-flash tabular-nums">
          {value}
        </span>
      )}
      <span className="sr-only">{value}</span>
    </span>
  )
}
