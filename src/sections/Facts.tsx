import { TextLink } from '../components/Button'
import { reveal } from '../components/motion'
import { Section, SectionHeading } from '../components/Section'
import { EXPLORER, FACTS, LINKS, isPlaceholder, shortAddress } from '../content/site'

/** Heading and specs link on the left, six facts in a clean two-column grid. */
export function Facts() {
  // Hidden while the docs URL is still a [PLACEHOLDER].
  const hasDocs = !isPlaceholder(LINKS.docs)
  return (
    <Section id="facts">
      <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-16">
        <div>
          <SectionHeading eyebrow={FACTS.eyebrow} title={FACTS.title} />
          {hasDocs && (
            <TextLink href={LINKS.docs} className="mt-6">
              {FACTS.more} →
            </TextLink>
          )}
        </div>
        <dl className="grid gap-x-10 self-end sm:grid-cols-2">
          {FACTS.rows.map((row, i) => (
            <div key={row.label} {...reveal(i % 2 + Math.floor(i / 2))} className="border-t border-line py-5">
              <dt className="eyebrow">{row.label}</dt>
              <dd className="mt-2 text-[17px] font-medium">
                {row.links ? (
                  <ul className="space-y-1 font-mono text-[14px] font-normal">
                    {row.links.map((l) => (
                      <li key={l.address}>
                        <span className="text-dim">{l.label} </span>
                        <a
                          href={`${EXPLORER}${l.address}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          title={l.address}
                          className="underline decoration-violet/30 underline-offset-4 hover:text-violet-light hover:decoration-violet-light"
                        >
                          {shortAddress(l.address)}
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : (
                  row.value
                )}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </Section>
  )
}
