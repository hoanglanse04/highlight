import { PayloadImage } from '@/components/media/PayloadImage'
import { FeaturedProjectSlider } from '@/components/home/FeaturedProjectSlider'
import { Container } from '@/components/ui/Container'
import { MotionCard, Reveal } from '@/components/ui/Motion'
import { OptionalLink } from '@/components/ui/OptionalLink'
import { SectionHeading } from '@/components/ui/SectionHeading'
import type { AppLocale } from '@/i18n/routing'
import { getEnabledItems, isSectionEnabled } from '@/lib/content/homepage'
import { detectExternalVideo } from '@/lib/media/video'
import type { ProjectCard } from '@/lib/payload/projects'
import type { Homepage } from '@/payload-types'

export function FeaturedProjectsSection({
  homepage,
  locale,
  projects = [],
  sectionLabel,
  viewLabel,
  videoLabel,
}: {
  homepage: Homepage
  locale: AppLocale
  projects?: ProjectCard[]
  sectionLabel: string
  viewLabel: string
  videoLabel: string
}) {
  const section = homepage.featuredProjects
  if (!isSectionEnabled(section)) return null
  if (section.sourceMode === 'projectCollection') {
    if (!projects.length) return null
    return (
      <section
        className="section-shell cinematic-bg-studio cinematic-grain relative overflow-hidden border-t border-white/[0.06]"
        id="featured-projects"
      >
        <div
          aria-hidden="true"
          className="cinematic-glow-spotlight top-1/4 -right-32 h-[500px] w-[500px] bg-brand/[0.06]"
        />
        <Container>
          <Reveal>
            <SectionHeading
              description={section.description}
              eyebrow={section.eyebrow}
              fallbackTitle={sectionLabel}
              title={section.title}
            />
          </Reveal>
          <div className="mt-12 lg:mt-16">
            <FeaturedProjectSlider
              locale={locale}
              projects={projects}
              videoLabel={videoLabel}
              viewLabel={viewLabel}
            />
          </div>
        </Container>
      </section>
    )
  }
  const items = getEnabledItems(section?.items, 8)
  if (!items.length) return null

  return (
    <section
      className="section-shell cinematic-bg-studio cinematic-grain relative overflow-hidden border-t border-white/[0.06]"
      id="featured-projects"
    >
      <div
        aria-hidden="true"
        className="cinematic-glow-spotlight top-1/4 -right-32 h-[500px] w-[500px] bg-brand/[0.06]"
      />
      <Container>
        <Reveal>
          <SectionHeading
            description={section?.description}
            eyebrow={section?.eyebrow}
            fallbackTitle={sectionLabel}
            title={section?.title}
          />
        </Reveal>
        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:mt-16 lg:gap-7">
          {items.map((item, index) => {
            const featured = index % 3 === 0
            const video = detectExternalVideo(item.externalVideoURL)
            return (
              <MotionCard
                className={featured ? 'md:col-span-2' : ''}
                key={item.id ?? item.internalName}
              >
                <OptionalLink
                  className="group block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
                  href={item.link}
                  locale={locale}
                  openInNewTab={item.openInNewTab}
                >
                  <article>
                    <div
                      className={`relative overflow-hidden bg-background ${featured ? 'aspect-[16/8]' : 'aspect-[4/3]'}`}
                    >
                      <PayloadImage
                        fill
                        media={item.previewImage ?? item.coverImage}
                        preferredSize={featured ? 'large' : 'medium'}
                        sizes={
                          featured
                            ? '(max-width: 768px) 100vw, 90vw'
                            : '(max-width: 768px) 100vw, 46vw'
                        }
                        className="object-cover transition-transform duration-700 group-hover:scale-[1.035]"
                        fallbackClassName="h-full w-full"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
                      {video ? (
                        <span className="absolute top-4 right-4 rounded-full border border-white/30 bg-black/40 px-3 py-1 text-[0.65rem] font-bold tracking-[0.16em] uppercase backdrop-blur">
                          {videoLabel}
                        </span>
                      ) : null}
                      <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7">
                        <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-semibold tracking-[0.14em] text-white/65 uppercase">
                          {item.categoryLabel ? (
                            <span className="text-brand">
                              {item.categoryLabel}
                            </span>
                          ) : null}
                          {item.clientName ? (
                            <span>{item.clientName}</span>
                          ) : null}
                          {item.year ? <span>{item.year}</span> : null}
                        </div>
                        <h3
                          className={`font-heading leading-none font-semibold tracking-[-0.045em] ${featured ? 'text-3xl sm:text-5xl lg:text-6xl' : 'text-2xl sm:text-3xl'}`}
                        >
                          {item.title}
                        </h3>
                        {item.subtitle ? (
                          <p className="mt-3 max-w-2xl text-sm text-white/70 sm:text-base">
                            {item.subtitle}
                          </p>
                        ) : null}
                        <span className="mt-5 inline-flex items-center gap-3 text-xs font-bold tracking-[0.16em] uppercase">
                          {viewLabel}
                          <span
                            aria-hidden="true"
                            className="h-px w-8 bg-brand transition-all group-hover:w-12"
                          />
                        </span>
                      </div>
                    </div>
                  </article>
                </OptionalLink>
              </MotionCard>
            )
          })}
        </div>
      </Container>
    </section>
  )
}
