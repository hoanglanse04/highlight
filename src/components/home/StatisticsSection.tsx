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
    <section
      className="cinematic-bg-dark cinematic-grain relative overflow-hidden pb-[clamp(5.5rem,9vw,9rem)]"
      id="statistics"
    >
      {/* Ambient center spotlight */}
      <div
        aria-hidden="true"
        className="cinematic-glow-spotlight top-1/3 left-1/2 -translate-x-1/2 h-[350px] w-[800px] bg-brand/[0.05]"
      />

      <Container className="relative z-10">
        <Reveal className="border-t border-white/10 pt-10">
          <SectionHeading
            description={section?.description}
            eyebrow={section?.eyebrow}
            fallbackTitle={sectionLabel}
            title={section?.title}
          />
        </Reveal>
        <dl className="mt-12 grid gap-6 sm:grid-cols-2 lg:mt-16 lg:grid-flow-col lg:auto-cols-fr">
          {items.map((item) => (
            <div
              className="relative overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-md transition-all duration-300 hover:border-brand/40 hover:bg-white/[0.05] hover:shadow-[0_8px_30px_rgba(255,92,0,0.12)] sm:p-8"
              key={item.id ?? `${item.label}-${item.value}`}
            >
              <span className="cinematic-corner-mark top-2 right-2 border-t border-r border-white/30" />
              <dd className="font-heading text-[clamp(3rem,5.5vw,5.5rem)] leading-[0.9] font-bold tracking-[-0.06em] text-brand drop-shadow-[0_2px_12px_rgba(255,92,0,0.3)] tabular-nums">
                {item.prefix}
                {item.value.toLocaleString(locale === 'vi' ? 'vi-VN' : 'en-US')}
                {item.suffix}
              </dd>
              <dt className="mt-4 font-heading text-sm leading-5 font-semibold tracking-[0.02em] text-white/85 uppercase sm:text-base">
                {item.label}
              </dt>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  )
}
