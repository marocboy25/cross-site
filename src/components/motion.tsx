import { useEffect, useLayoutEffect, useRef, type CSSProperties } from 'react'

const STAGGER_MS = 90
const REVEAL_MS = 800

const reducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Turns scroll reveals on before the first paint, so revealable elements start
 * hidden instead of flashing. Without IntersectionObserver or with reduced
 * motion nothing is hidden. Call once, before rendering.
 */
export function enableScrollReveal() {
  if ('IntersectionObserver' in window && !reducedMotion()) document.documentElement.classList.add('reveal-ready')
}

/** Props for an element that fades and slides up on entering the screen; `step` staggers it. */
export function reveal(step = 0): { 'data-reveal': string; style: CSSProperties } {
  return { 'data-reveal': '', style: { '--reveal-delay': `${step * STAGGER_MS}ms` } as CSSProperties }
}

/**
 * Watches every [data-reveal] element and marks it shown once it's on screen.
 * After its entrance it's marked done, which drops the stagger delay so hover
 * and parallax respond straight away.
 */
export function useScrollReveal() {
  useEffect(() => {
    if (!document.documentElement.classList.contains('reveal-ready')) return
    const timers: number[] = []
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          const el = entry.target as HTMLElement
          observer.unobserve(el)
          el.dataset.shown = ''
          const delay = parseFloat(el.style.getPropertyValue('--reveal-delay')) || 0
          timers.push(window.setTimeout(() => (el.dataset.revealDone = ''), delay + REVEAL_MS))
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
    )
    document.querySelectorAll('[data-reveal]').forEach((el) => observer.observe(el))
    return () => {
      observer.disconnect()
      timers.forEach(clearTimeout)
    }
  }, [])
}

/**
 * A stat like "0.5%" or "1" that counts up from zero, keeping its decimals and
 * any prefix or suffix, once it scrolls into view. The final value is always
 * what screen readers get; reduced motion just shows it.
 */
export function CountUp({ value, delay = 0, duration = 1400 }: { value: string; delay?: number; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const match = value.match(/^(\D*)(\d+(?:\.(\d+))?)(.*)$/)
  const target = match ? parseFloat(match[2]) : 0

  // Before paint: show the starting value, so the final one never flashes first.
  useLayoutEffect(() => {
    const el = ref.current
    if (!el || !match || target === 0 || reducedMotion() || !('IntersectionObserver' in window)) return
    const [, prefix, , decimals = '', suffix] = match
    const format = (n: number) => `${prefix}${n.toFixed(decimals.length)}${suffix}`
    el.textContent = format(0)

    let frame = 0
    let timer = 0
    const run = () => {
      const start = performance.now()
      const tick = (now: number) => {
        const t = Math.min((now - start) / duration, 1)
        el.textContent = format(target * (1 - Math.pow(1 - t, 4))) // ease-out quart
        if (t < 1) frame = requestAnimationFrame(tick)
        else el.textContent = value
      }
      frame = requestAnimationFrame(tick)
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        observer.disconnect()
        timer = window.setTimeout(run, delay)
      },
      { threshold: 0.6 },
    )
    observer.observe(el)
    return () => {
      observer.disconnect()
      clearTimeout(timer)
      cancelAnimationFrame(frame)
      el.textContent = value
    }
  }, [value, delay, duration]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <span ref={ref} aria-hidden="true" className="tabular-nums">
        {value}
      </span>
      <span className="sr-only">{value}</span>
    </>
  )
}
