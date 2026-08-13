import { AboutGallery } from '@/components/home/AboutGallery'
import { Container } from '@/components/ui/Container'
import { Reveal } from '@/components/ui/Motion'
import { SmartLink } from '@/components/ui/SmartLink'
import type { AppLocale } from '@/i18n/routing'
import { isSectionEnabled } from '@/lib/content/homepage'
import type { Homepage, Media } from '@/payload-types'

function relationID(value: Media | number | null | undefined): string | null {
  if (typeof value === 'number') return String(value)
  return value?.id ? String(value.id) : null
}

export function AboutSection({
  homepage,
  locale,
  sectionLabel,
}: {
  homepage: Homepage
  locale: AppLocale
  sectionLabel: string
}) {
  const section = homepage.about
  if (!isSectionEnabled(section)) return null

  const galleryImages = [
    section.mainImage,
    ...(section.gallery ?? []).map((item) => item.image),
  ]
    .filter((image): image is Media | number => Boolean(image))
    .filter(
      (image, index, images) =>
        images.findIndex(
          (candidate) => relationID(candidate) === relationID(image),
        ) === index,
    )
    .slice(0, 8)

  return (
    <section className="section-shell bg-[#111211]" id="about">
      <Container>
        <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,3fr)_minmax(24rem,2fr)] lg:gap-14 xl:gap-20">
          <Reveal className="lg:sticky lg:top-32 lg:pr-4">
            {section.eyebrow ? (
              <p className="section-eyebrow">{section.eyebrow}</p>
            ) : null}
            {section.title ? (
              <h2 className="display-title max-w-[14ch] text-brand">
                {section.title}
              </h2>
            ) : (
              <h2 className="sr-only">{sectionLabel}</h2>
            )}
            {section.description ? (
              <p className="mt-8 max-w-[42rem] whitespace-pre-line font-heading text-[clamp(1rem,1.15vw,1.125rem)] leading-[1.7] text-white/82">
                {section.description}
              </p>
            ) : null}
            {section.highlightText ? (
              <blockquote className="mt-9 max-w-2xl border-l-2 border-brand pl-5 text-base leading-7 text-white/64 sm:text-lg">
                {section.highlightText}
              </blockquote>
            ) : null}
            {section.cta?.label && section.cta.url ? (
              <SmartLink
                className="button button-secondary mt-9"
                href={section.cta.url}
                locale={locale}
                openInNewTab={section.cta.openInNewTab}
              >
                {section.cta.label}
              </SmartLink>
            ) : null}
          </Reveal>

          <Reveal>
            <AboutGallery images={galleryImages} />
          </Reveal>
        </div>
      </Container>
    </section>
  )
}
