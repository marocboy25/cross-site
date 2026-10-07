import { TextLink } from '../components/Button'
import { AppPanel, FloatCard, Icon3D } from '../components/Panel'
import { reveal, Words } from '../components/motion'
import { Section } from '../components/Section'
import { LINKS, OTC } from '../content/site'

// Where each fact card floats around the blocks.
const SPOTS = ['left-0 top-2', 'right-0 top-[38%]', 'bottom-2 left-[6%]']

/** One card-shaped panel: the blocks with three facts floating round them, and the pitch. */
export function BigPositions() {
  return (
    <Section id="otc">
      <AppPanel glow="br" scene reveal={0} className="mx-auto max-w-5xl rounded-[32px] p-5 sm:rounded-[40px] sm:p-10">
        <div className="grid items-center gap-6 md:grid-cols-[minmax(0,400px)_1fr] md:gap-10">
          <div className="relative h-[320px] sm:h-[360px]">
            <Icon3D name="block" depth={-6} reveal={1} className="absolute left-1/2 top-1/2 w-[64%] max-w-[260px] -translate-x-1/2 -translate-y-1/2" />
            {OTC.cards.map((card, i) => (
              <FloatCard key={card.label} depth={[10, 7, 12][i]} reveal={2 + i} className={`absolute max-w-[170px] px-4 py-3 ${SPOTS[i]}`}>
                <p className="display text-[26px] text-violet-light">{card.value}</p>
                <p className="mt-1 text-xs leading-snug text-dim">{card.label}</p>
              </FloatCard>
            ))}
          </div>
          <div {...reveal(2)}>
            <p className="eyebrow text-violet-light">{OTC.eyebrow}</p>
            <h2 className="display mt-3 text-balance text-[34px] sm:text-[44px]">
              <Words text={OTC.title} />
            </h2>
            <p className="mt-4 leading-relaxed text-dim">{OTC.body}</p>
            <TextLink href={LINKS.appOtc} external className="mt-7">
              {OTC.link} →
            </TextLink>
          </div>
        </div>
      </AppPanel>
    </Section>
  )
}
