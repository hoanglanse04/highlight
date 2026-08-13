import { Container } from '@/components/ui/Container'
import { Reveal } from '@/components/ui/Motion'
import { SectionHeading } from '@/components/ui/SectionHeading'
import type { AppLocale } from '@/i18n/routing'
import { getEnabledItems, isSectionEnabled } from '@/lib/content/homepage'
import type { Homepage } from '@/payload-types'

export function StatisticsSection({
  homepage,
  locale,
  sectionLabel,
}: {
  homepage: Homepage
  locale: AppLocale
  sectionLabel: string
}) {
  const section = homepage.statistics
  const items = getEnabledItems(section?.items)
  if (!isSectionEnabled(section) || !items.length) return null

  return (
    <section className="bg-[#111211] pb-[clamp(5.5rem,9vw,9rem)]" id="statistics">
      <Container>
        <Reveal className="border-t border-white/14 pt-10">
          <SectionHeading
            description={section?.description}
            eyebrow={section?.eyebrow}
            fallbackTitle={sectionLabel}
            title={section?.title}
          />
        </Reveal>
        <dl className="mt-12 grid gap-y-10 sm:grid-cols-2 lg:mt-16 lg:grid-flow-col lg:auto-cols-fr">
          {items.map((item) => (
            <div
              className="border-l border-white/14 pl-5 sm:pl-7"
              key={item.id ?? `${item.label}-${item.value}`}
            >
              <dt className="mt-4 max-w-[15rem] font-heading text-base leading-5 font-semibold tracking-[-0.02em] text-white/78 uppercase sm:text-xl">
                {item.label}
              </dt>
              <dd className="order-first font-heading text-[clamp(3.5rem,7vw,7rem)] leading-[0.8] font-bold tracking-[-0.075em] text-brand tabular-nums">
                {item.prefix}
                {item.value.toLocaleString(locale === 'vi' ? 'vi-VN' : 'en-US')}
                {item.suffix}
              </dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  )
}
