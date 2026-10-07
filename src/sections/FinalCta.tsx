import { ButtonLink, TextLink } from '../components/Button'
import { XLogo } from '../components/icons'
import { AppPanel } from '../components/Panel'
import { reveal, Words } from '../components/motion'
import { Section } from '../components/Section'
import { LiveMark } from '../components/three/LiveMark'
import { FINAL_CTA, LINKS } from '../content/site'

/** The closing line beside a smaller live mark. It only animates while on screen. */
export function FinalCta() {
  return (
    <Section>
      <div className="grid items-center gap-10 md:grid-cols-[1.1fr_0.9fr] md:gap-14">
        <div {...reveal(0)}>
          <h2 className="display text-balance text-[48px] sm:text-[72px]">
            <Words text={FINAL_CTA.title} />
          </h2>
          <p className="mt-5 text-lg text-dim">{FINAL_CTA.body}</p>
          <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-4">
            <ButtonLink href={LINKS.app} external pulse>
              {FINAL_CTA.primary}
            </ButtonLink>
            <TextLink href={LINKS.x} external>
              <XLogo />
              {FINAL_CTA.secondary}
            </TextLink>
          </div>
        </div>
        <AppPanel glow="bl" reveal={1} className="flex h-[300px] items-center justify-center rounded-[32px] sm:h-[360px] sm:rounded-[40px]">
          <div className="h-full w-full max-w-[420px] py-4">
            <LiveMark />
          </div>
        </AppPanel>
      </div>
    </Section>
  )
}
