import { useEffect, useRef, useState } from 'react'
import { reveal, useFrameJob } from '../components/motion'
import { AppPanel, FloatCard, Icon3D } from '../components/Panel'
import { Section, SectionHeading } from '../components/Section'
import { STEPS } from '../content/site'

// Each step card steps a little further right: a stack, not a list.
const OFFSETS = ['mr-8 lg:mr-14', 'ml-4 mr-4 lg:ml-7 lg:mr-7', 'ml-8 lg:ml-14']

/** Header height plus breathing room: the highest the pinned panel sits. */
const PIN_MIN_TOP = 80

/**
 * Phones and tablets: the panel pins while the section scrolls past, and the
 * steps swap in one at a time with the arrows turning a little per step
 * (see [data-seq] in index.css). Off on desktop and with reduced motion,
 * where all three steps show as a stack.
 */
function useStepSequence(count: number) {
  const track = useRef<HTMLDivElement>(null)
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    if (!document.documentElement.classList.contains('motion-ready')) return
    const mq = matchMedia('(max-width: 1023.98px)')
    const update = () => setEnabled(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  useFrameJob(
    track,
    (el) => {
      if (!enabled) return null
      const pin = el.firstElementChild as HTMLElement
      let next = 0
      let shown = -1
      let top = PIN_MIN_TOP
      let shownTop = -1
      return {
        measure: () => {
          const r = el.getBoundingClientRect()
          const pinHeight = pin.offsetHeight
          // Centred in the space under the header, never under it.
          top = Math.round(Math.max(PIN_MIN_TOP, (window.innerHeight + PIN_MIN_TOP - 16 - pinHeight) / 2))
          const travel = r.height - pinHeight
          const progress = travel > 0 ? Math.min(1, Math.max(0, (top - r.top) / travel)) : 0
          next = Math.min(count - 1, Math.floor(progress * count))
        },
        write: () => {
          if (top !== shownTop) {
            shownTop = top
            el.style.setProperty('--pin-top', `${top}px`)
          }
          if (next !== shown) {
            shown = next
            el.style.setProperty('--step', String(next))
            el.querySelectorAll<HTMLElement>('[data-step]').forEach((item) => {
              const i = Number(item.dataset.step)
              item.toggleAttribute('data-on', i === next)
              item.toggleAttribute('data-past', i < next)
            })
          }
          return false // steps switch discretely; CSS animates the swap
        },
      }
    },
    [enabled],
  )

  return { track, enabled }
}

/** Heading on the left; on the right, the arrows with three step cards stacked over them. */
export function HowItWorks() {
  const { track, enabled } = useStepSequence(STEPS.items.length)
  return (
    <Section id="how">
      <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:items-center lg:gap-14">
        <div>
          <SectionHeading eyebrow={STEPS.eyebrow} title={STEPS.title} />
          <p {...reveal(1)} className="eyebrow mt-8">
            {STEPS.note}
          </p>
        </div>

        <div ref={track} className="seq-track" {...(enabled ? { 'data-seq': '' } : {})}>
          <div className="seq-pin">
            <AppPanel glow="bl" scene reveal={1} className="flex flex-col items-center rounded-[32px] p-5 sm:rounded-[40px] sm:p-8 lg:flex-row lg:p-10">
              <Icon3D name="swap" depth={-6} reveal={2} className="seq-icon relative z-0 w-56 sm:w-72 lg:-mr-16 lg:w-[48%] lg:shrink-0" />
              <ol className="relative z-10 -mt-10 flex w-full max-w-md flex-col gap-3 lg:mt-0">
                {STEPS.items.map((step, i) => (
                  <li key={step.title} data-step={i} className={OFFSETS[i]}>
                    <FloatCard depth={8 + i * 2} reveal={3 + i} className="flex gap-4 p-4 sm:p-5">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-soft font-mono text-sm text-violet-light">
                        {i + 1}
                      </span>
                      <div>
                        <h3 className="font-title font-semibold tracking-[-0.01em]">{step.title}</h3>
                        <p className="mt-1 text-sm leading-relaxed text-dim">{step.body}</p>
                      </div>
                    </FloatCard>
                  </li>
                ))}
              </ol>
              <div aria-hidden="true" className="seq-dots">
                {STEPS.items.map((step, i) => (
                  <span key={step.title} data-step={i} />
                ))}
              </div>
            </AppPanel>
          </div>
        </div>
      </div>
    </Section>
  )
}
