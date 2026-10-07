import { AppPanel, Icon3D } from '../components/Panel'
import { reveal } from '../components/motion'
import { Section, SectionHeading } from '../components/Section'
import { WHY } from '../content/site'

/** Centred heading over one full-width panel: the level icon, and the comparison on a white card. */
export function WhyP2P() {
  return (
    <Section id="why">
      <SectionHeading eyebrow={WHY.eyebrow} title={WHY.title} body={WHY.body} center />
      <AppPanel glow="tl" scene reveal={1} className="mt-10 rounded-[32px] p-4 sm:mt-12 sm:rounded-[44px] sm:p-8 lg:p-10">
        <div className="grid items-center gap-4 md:grid-cols-[0.9fr_1.1fr] md:gap-8">
          <Icon3D name="level" depth={-6} reveal={2} className="mx-auto w-[min(100%,440px)]" />
          <div {...reveal(3)} className="app-card rounded-[24px] p-5 sm:p-8">
            <dl className="text-[15px]">
              <div className="grid grid-cols-[1.1fr_1fr_1fr] gap-3 pb-3">
                <dt className="sr-only">Compared</dt>
                <dd className="eyebrow col-start-2">DEX pool</dd>
                <dd className="eyebrow text-violet-light">Cross</dd>
              </div>
              {WHY.rows.map((row) => (
                <div key={row.label} className="grid grid-cols-[1.1fr_1fr_1fr] gap-3 border-t border-line py-3.5">
                  <dt className="font-medium">{row.label}</dt>
                  <dd className="text-dim">{row.dex}</dd>
                  <dd className={`font-semibold ${row.positive ? 'text-bid' : 'text-ink'}`}>{row.cross}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-4 text-sm leading-relaxed text-dim">{WHY.note}</p>
          </div>
        </div>
      </AppPanel>
    </Section>
  )
}
