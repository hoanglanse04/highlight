import { PayloadImage } from '@/components/media/PayloadImage'
import { Container } from '@/components/ui/Container'
import { MotionCard, Reveal } from '@/components/ui/Motion'
import { OptionalLink } from '@/components/ui/OptionalLink'
import { SectionHeading } from '@/components/ui/SectionHeading'
import type { AppLocale } from '@/i18n/routing'
import { getEnabledItems, isSectionEnabled } from '@/lib/content/homepage'
import type { Homepage } from '@/payload-types'

function formatDate(
  value: string | null | undefined,
  locale: AppLocale,
): string | null {
  if (!value) return null
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return null
  return new Intl.DateTimeFormat(locale === 'vi' ? 'vi-VN' : 'en-US', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date)
}

export function StoriesSection({
  homepage,
  locale,
  readMoreLabel,
  sectionLabel,
}: {
  homepage: Homepage
  locale: AppLocale
  readMoreLabel: string
  sectionLabel: string
}) {
  const section = homepage.stories
  const items = getEnabledItems(section?.items, 3)
  if (!isSectionEnabled(section) || !items.length) return null

  return (
    <section className="section-light section-shell" id="stories">
      <Container>
        <Reveal>
          <SectionHeading
            description={section?.description}
            eyebrow={section?.eyebrow}
            fallbackTitle={sectionLabel}
            title={section?.title}
          />
        </Reveal>
        <div className="mt-12 grid gap-x-6 gap-y-12 md:grid-cols-3 lg:mt-16">
          {items.map((item) => (
            <MotionCard key={item.id ?? item.internalName}>
              <OptionalLink
                className="group block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
                href={item.link}
                locale={locale}
                openInNewTab={item.openInNewTab}
              >
                <article>
                  <div className="relative aspect-[4/3] overflow-hidden bg-black/10">
                    <PayloadImage
                      fill
                      media={item.thumbnail}
                      preferredSize="medium"
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      fallbackClassName="h-full w-full"
                    />
                  </div>
                  <div className="pt-6">
                    {formatDate(item.publishedDate, locale) ? (
                      <time
                        className="text-[0.68rem] font-bold tracking-[0.16em] text-brand uppercase"
                        dateTime={item.publishedDate ?? undefined}
                      >
                        {formatDate(item.publishedDate, locale)}
                      </time>
                    ) : null}
                    <h3 className="mt-3 font-heading text-2xl leading-[1.12] font-semibold tracking-[-0.04em] text-ink">
                      {item.title}
                    </h3>
                    {item.excerpt ? (
                      <p className="mt-3 line-clamp-3 text-sm leading-6 text-ink/62">
                        {item.excerpt}
                      </p>
                    ) : null}
                    <span className="mt-5 inline-flex items-center gap-3 border-b border-ink/30 pb-1 text-xs font-bold tracking-[0.14em] text-ink uppercase">
                      {readMoreLabel}
                      <span aria-hidden="true" className="text-brand">
                        ↗
                      </span>
                    </span>
                  </div>
                </article>
              </OptionalLink>
            </MotionCard>
          ))}
        </div>
      </Container>
    </section>
  )
}
