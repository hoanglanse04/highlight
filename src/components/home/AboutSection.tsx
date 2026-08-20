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
    <section
      className="section-shell cinematic-bg-studio cinematic-grain cinematic-grid relative overflow-hidden border-y border-white/[0.06]"
      id="about"
    >
      {/* Ambient cinematic light flares */}
      <div
        aria-hidden="true"
        className="cinematic-glow-spotlight -top-40 -left-32 h-[520px] w-[520px] bg-brand/12"
      />
      <div
        aria-hidden="true"
        className="cinematic-glow-spotlight -bottom-36 right-0 h-[480px] w-[480px] bg-brand/[0.07]"
      />
      <div
        aria-hidden="true"
        className="cinematic-glow-spotlight top-1/2 left-2/3 h-[420px] w-[420px] bg-sky-900/[0.08]"
      />

      <Container className="relative z-10">
        <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,3fr)_minmax(24rem,2.2fr)] lg:gap-14 xl:gap-20">
          <Reveal className="lg:sticky lg:top-32 lg:pr-4">
            <div className="mb-4 flex flex-wrap items-center gap-3">
              {section.eyebrow ? (
                <p className="section-eyebrow mb-0">{section.eyebrow}</p>
              ) : null}
              <span className="cinematic-film-badge">
                <span className="cinematic-film-badge-dot" />
                <span>DIRECTED & PRODUCED</span>
              </span>
            </div>

            {section.title ? (
              <h2 className="display-title max-w-[14ch] text-balance bg-gradient-to-r from-brand via-[#ff7c33] to-[#ffaa66] bg-clip-text text-transparent drop-shadow-[0_2px_18px_rgba(255,92,0,0.25)]">
                {section.title}
              </h2>
            ) : (
              <h2 className="sr-only">{sectionLabel}</h2>
            )}

            {section.description ? (
              <p className="mt-8 max-w-[42rem] whitespace-pre-line font-heading text-[clamp(1rem,1.15vw,1.125rem)] leading-[1.75] text-white/80">
                {section.description}
              </p>
            ) : null}

            {section.highlightText ? (
              <div className="cinematic-quote-card mt-9 max-w-2xl">
                <blockquote className="text-base leading-7 font-medium text-white/90 sm:text-lg">
                  &ldquo;{section.highlightText}&rdquo;
                </blockquote>
              </div>
            ) : null}

            {section.cta?.label && section.cta.url ? (
              <div className="mt-9 flex items-center gap-4">
                <SmartLink
                  className="button button-primary shadow-[0_4px_20px_rgba(255,92,0,0.3)] transition-all hover:shadow-[0_6px_28px_rgba(255,92,0,0.5)]"
                  href={section.cta.url}
                  locale={locale}
                  openInNewTab={section.cta.openInNewTab}
                >
                  {section.cta.label}
                  <span aria-hidden="true" className="ml-2">→</span>
                </SmartLink>
              </div>
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
