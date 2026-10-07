import { AppPanel, FloatCard, Icon3D } from '../components/Panel'
import { reveal } from '../components/motion'
import { Section, SectionHeading } from '../components/Section'
import { STEPS } from '../content/site'

// Each step card steps a little further right: a stack, not a list.
const OFFSETS = ['mr-8 lg:mr-14', 'ml-4 mr-4 lg:ml-7 lg:mr-7', 'ml-8 lg:ml-14']

/** Heading on the left; on the right, the arrows with three step cards stacked over them. */
export function HowItWorks() {
  return (
    <Section id="how">
      <div className="grid items-center gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:gap-14">
        <div>
          <SectionHeading eyebrow={STEPS.eyebrow} title={STEPS.title} />
          <p {...reveal(1)} className="eyebrow mt-8">{STEPS.note}</p>
        </div>

        <AppPanel glow="bl" scene reveal={1} className="flex flex-col items-center rounded-[32px] p-5 sm:rounded-[40px] sm:p-8 lg:flex-row lg:p-10">
          <Icon3D name="swap" depth={-6} reveal={2} className="relative z-0 w-56 sm:w-72 lg:-mr-16 lg:w-[48%] lg:shrink-0" />
          <ol className="relative z-10 -mt-10 w-full max-w-md space-y-3 lg:mt-0">
            {STEPS.items.map((step, i) => (
              <li key={step.title} className={OFFSETS[i]}>
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
        </AppPanel>
      </div>
    </Section>
  )
}
