import { CountUp, reveal } from '../components/motion'
import { Container } from '../components/Section'
import { STATS } from '../content/site'

/** Four huge numbers on plain white, right after the hero. No panel: a change of rhythm. */
export function StatStrip() {
  return (
    <section aria-label="Cross in numbers" className="py-10 sm:py-14">
      <Container>
        <dl className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
          {STATS.map((s, i) => (
            // Label first for screen readers; shown under the number.
            <div key={s.label} {...reveal(i)} className="flex flex-col-reverse">
              <dt className="eyebrow mt-3">{s.label}</dt>
              <dd className={`display text-[52px] sm:text-[72px] lg:text-[84px] ${s.positive ? 'text-bid' : 'text-ink'}`}>
                <CountUp value={s.value} delay={i * 90 + 150} />
              </dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  )
}
