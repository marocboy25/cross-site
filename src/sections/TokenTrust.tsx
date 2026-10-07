import { TextLink } from '../components/Button'
import { Check } from '../components/icons'
import { AppPanel, FloatCard, Icon3D } from '../components/Panel'
import { Section, SectionHeading } from '../components/Section'
import { LINKS, TRUST } from '../content/site'

/** Panel first: the shield with the checklist card overlapping it. Then the point. */
export function TokenTrust() {
  return (
    <Section id="trust">
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <AppPanel
          glow="tr"
          scene
          reveal={0}
          className="order-2 flex flex-col rounded-[32px] p-5 sm:rounded-[40px] sm:p-8 lg:order-1 lg:min-h-[500px]"
        >
          <Icon3D name="shield" depth={-6} reveal={1} className="relative z-0 w-52 self-start sm:w-64 lg:w-[62%]" />
          <FloatCard depth={9} reveal={2} className="relative z-10 -mt-14 w-full max-w-[340px] self-end p-5 sm:p-6 lg:absolute lg:bottom-8 lg:right-8 lg:mt-0">
            <ul className="space-y-3">
              {TRUST.checks.map((check) => (
                <li key={check} className="flex items-center gap-3 text-[15px]">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-bid/15 text-bid">
                    <Check width={13} height={13} strokeWidth={3} />
                  </span>
                  {check}
                </li>
              ))}
            </ul>
          </FloatCard>
        </AppPanel>
        <div className="order-1 lg:order-2">
          <SectionHeading eyebrow={TRUST.eyebrow} title={TRUST.title} body={TRUST.body} />
          <TextLink href={LINKS.appTrust} external className="mt-8">
            {TRUST.link} →
          </TextLink>
        </div>
      </div>
    </Section>
  )
}
