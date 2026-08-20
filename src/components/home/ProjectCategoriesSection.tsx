import { PayloadImage } from '@/components/media/PayloadImage'
import { Container } from '@/components/ui/Container'
import { MotionCard, Reveal } from '@/components/ui/Motion'
import { OptionalLink } from '@/components/ui/OptionalLink'
import { SectionHeading } from '@/components/ui/SectionHeading'
import type { AppLocale } from '@/i18n/routing'
import { getEnabledItems, isSectionEnabled } from '@/lib/content/homepage'
import type { PublicProjectCategory } from '@/lib/payload/projects'
import { getCategoryProjectsPath } from '@/lib/projects/routes'
import type { Homepage } from '@/payload-types'

export function ProjectCategoriesSection({
  categories = [],
  homepage,
  locale,
  sectionLabel,
  viewLabel,
}: {
  categories?: PublicProjectCategory[]
  homepage: Homepage
  locale: AppLocale
  sectionLabel: string
  viewLabel: string
}) {
  const section = homepage.projectCategories
  if (!isSectionEnabled(section)) return null
  if (section.sourceMode === 'categoryCollection') {
    if (!categories.length) return null
    return (
      <section
        className="section-shell cinematic-bg-dark cinematic-grain relative overflow-hidden border-t border-white/[0.06]"
        id="categories"
      >
        <Container>
          <Reveal>
            <SectionHeading
              description={section.description}
              eyebrow={section.eyebrow}
              fallbackTitle={sectionLabel}
              title={section.title}
            />
          </Reveal>
          <div className="mt-12 grid gap-3 md:grid-cols-2 lg:mt-16 xl:grid-cols-3">
            {categories.map((category) => (
              <MotionCard key={category.id}>
                <OptionalLink
                  className="group block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
                  href={getCategoryProjectsPath(locale, category.slug)}
                  locale={locale}
                >
                  <article className="relative aspect-[16/10] overflow-hidden border border-white/8 bg-surface">
                    <PayloadImage
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      fallbackClassName="h-full w-full"
                      media={category.coverImage}
                      preferredSize="medium"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                      <h3 className="font-heading text-2xl font-semibold tracking-[-0.045em] uppercase sm:text-3xl">
                        {category.title}
                      </h3>
                      {category.shortDescription ? (
                        <p className="mt-3 line-clamp-2 text-sm leading-6 text-white/65">
                          {category.shortDescription}
                        </p>
                      ) : null}
                      <span className="mt-5 inline-flex items-center gap-3 text-xs font-bold tracking-[0.14em] text-brand uppercase">
                        {viewLabel}
                        <span aria-hidden="true">↗</span>
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
  const items = getEnabledItems(section?.items)
  if (!items.length) return null

  return (
    <section
      className="section-shell cinematic-bg-dark cinematic-grain relative overflow-hidden border-t border-white/[0.06]"
      id="categories"
    >
      <Container>
        <Reveal>
          <SectionHeading
            description={section?.description}
            eyebrow={section?.eyebrow}
            fallbackTitle={sectionLabel}
            title={section?.title}
          />
        </Reveal>
          <div className="mt-12 grid gap-3 md:grid-cols-2 lg:mt-16 xl:grid-cols-3">
          {items.map((item) => (
            <MotionCard key={item.id ?? item.internalName}>
              <OptionalLink
                className="group block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
                href={item.link}
                locale={locale}
                openInNewTab={item.openInNewTab}
              >
                <article className="relative aspect-[16/10] overflow-hidden border border-white/8 bg-surface">
                  <PayloadImage
                    fill
                    media={item.coverImage}
                    preferredSize="medium"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    fallbackClassName="h-full w-full"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                    <h3 className="font-heading text-2xl font-semibold tracking-[-0.045em] uppercase sm:text-3xl">
                      {item.title}
                    </h3>
                    {item.description ? (
                      <p className="mt-3 line-clamp-2 text-sm leading-6 text-white/65">
                        {item.description}
                      </p>
                    ) : null}
                    <span className="mt-5 inline-flex items-center gap-3 text-xs font-bold tracking-[0.14em] text-brand uppercase">
                      {viewLabel}
                      <span aria-hidden="true">↗</span>
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
