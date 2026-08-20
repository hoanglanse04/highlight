import { PayloadImage } from '@/components/media/PayloadImage'
import { Container } from '@/components/ui/Container'
import { Reveal } from '@/components/ui/Motion'
import { SmartLink } from '@/components/ui/SmartLink'
import type { AppLocale } from '@/i18n/routing'
import { isSectionEnabled } from '@/lib/content/homepage'
import { toTelephoneHref } from '@/lib/urls'
import type { Homepage, SiteSetting } from '@/payload-types'

function renderCinematicTitle(title: string) {
  return (
    <span className="bg-gradient-to-r from-[#FFA858] via-[#FF5C00] to-[#FFA858] bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(255,92,0,0.45)]">
      {title}
    </span>
  )
}

export function ContactCTASection({
  contactLabel,
  homepage,
  locale,
  sectionLabel,
  settings,
}: {
  contactLabel: string
  homepage: Homepage
  locale: AppLocale
  sectionLabel: string
  socialLabel?: string
  settings: SiteSetting | null
}) {
  const section = homepage.contactCTA
  if (!isSectionEnabled(section)) return null

  const ctaLabel = section?.cta?.label || contactLabel
  const ctaURL = section?.cta?.url || settings?.system?.defaultContactCTAURL || '#contact'
  const hotline = settings?.contact?.phone || '0963.373.606'
  const email = settings?.contact?.email || 'contact@highlightmedia.vn'
  const phoneHref = toTelephoneHref(hotline)

  return (
    <section
      className="cinematic-bg-studio cinematic-grain relative overflow-hidden border-t border-white/[0.06] py-20 sm:py-28 lg:py-36"
      id="contact"
    >
      {section?.backgroundImage ? (
        <div className="absolute inset-0">
          <PayloadImage
            fill
            decorative
            media={section.backgroundImage}
            preferredSize="large"
            sizes="100vw"
            className="object-cover"
            fallbackClassName="h-full w-full"
          />
          <div className="cinematic-media-overlay absolute inset-0" />
        </div>
      ) : (
        <>
          {/* Volumetric ambient spotlight */}
          <div aria-hidden="true" className="cinematic-cta-spotlight" />
          <div
            aria-hidden="true"
            className="cinematic-glow-spotlight top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] bg-brand/[0.08]"
          />
        </>
      )}

      <Container className="relative z-10">
        <Reveal>
          <div className="cinematic-cta-card relative mx-auto max-w-5xl px-6 py-14 sm:px-12 sm:py-18 lg:px-16 lg:py-24">
            <div aria-hidden="true" className="cinematic-headline-glow" />

            {/* Viewfinder Corner Crop Marks */}
            <span className="cinematic-corner-mark top-4 left-4 border-t-2 border-l-2 border-white/40" />
            <span className="cinematic-corner-mark top-4 right-4 border-t-2 border-r-2 border-white/40" />
            <span className="cinematic-corner-mark bottom-4 left-4 border-b-2 border-l-2 border-white/40" />
            <span className="cinematic-corner-mark bottom-4 right-4 border-b-2 border-r-2 border-white/40" />

            {/* Top Production Badge */}
            <div className="relative z-10 mb-7 flex flex-wrap items-center justify-center gap-3">
              <span className="cinematic-film-badge">
                <span className="cinematic-film-badge-dot" />
                <span>DIRECTED &amp; PRODUCED BY HIGHLIGHT</span>
              </span>
              {section?.eyebrow ? (
                <span className="font-mono text-xs font-bold tracking-[0.16em] text-brand uppercase">
                  {section.eyebrow}
                </span>
              ) : null}
            </div>

            {/* Main Balanced & Soft-Gradient Headline */}
            <div className="relative z-10 mx-auto max-w-3xl text-center">
              {section?.title ? (
                <h2 className="font-heading text-[clamp(2.1rem,4.2vw,3.85rem)] leading-[1.2] font-extrabold tracking-[-0.03em] text-balance uppercase">
                  {renderCinematicTitle(section.title)}
                </h2>
              ) : (
                <h2 className="sr-only">{sectionLabel}</h2>
              )}

              {/* Softer, balanced description */}
              {section?.description ? (
                <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-slate-300/85 sm:text-lg">
                  {section.description}
                </p>
              ) : null}
            </div>

            {/* CTA Button & Interactive Action Area */}
            <div className="relative z-10 mt-10 flex flex-col items-center justify-center gap-6 sm:mt-12">
              {ctaLabel && ctaURL ? (
                <SmartLink
                  className="button-magnetic-glow group"
                  href={ctaURL}
                  locale={locale}
                  openInNewTab={section?.cta?.openInNewTab}
                >
                  <span>{ctaLabel}</span>
                  <span
                    aria-hidden="true"
                    className="grid h-7 w-7 place-items-center rounded-full bg-white/20 transition-transform duration-300 group-hover:translate-x-1 group-hover:rotate-45"
                  >
                    ↗
                  </span>
                </SmartLink>
              ) : null}

              {/* Quick Contact Badges */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-xs font-medium text-white/60">
                {hotline ? (
                  <a
                    className="flex items-center gap-1.5 rounded-full border border-white/10 bg-black/40 px-3.5 py-1.5 transition-colors hover:border-brand hover:text-white"
                    href={`tel:${phoneHref}`}
                  >
                    <span className="text-brand">⚡ Hotline:</span>
                    <span className="font-mono font-bold text-white/90">{hotline}</span>
                  </a>
                ) : null}

                {email ? (
                  <a
                    className="flex items-center gap-1.5 rounded-full border border-white/10 bg-black/40 px-3.5 py-1.5 transition-colors hover:border-brand hover:text-white"
                    href={`mailto:${email}`}
                  >
                    <span className="text-brand">✉</span>
                    <span className="text-white/80">{email}</span>
                  </a>
                ) : null}

                <span className="flex items-center gap-1.5 rounded-full border border-white/10 bg-black/40 px-3.5 py-1.5 text-white/50">
                  <span>⏱</span>
                  <span>{locale === 'vi' ? 'Phản hồi trong 2h' : 'Fast response within 2h'}</span>
                </span>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Back to top button */}
        <div className="mt-12 flex justify-end border-t border-white/[0.08] pt-8">
          <a
            className="group flex items-center gap-3 text-xs font-bold tracking-[0.16em] text-white/60 uppercase transition-colors hover:text-brand"
            href="#hero"
          >
            <span>{locale === 'vi' ? 'Lên đầu trang' : 'Back to top'}</span>
            <span
              aria-hidden="true"
              className="grid h-10 w-10 place-items-center rounded-full border border-white/20 transition-all duration-300 group-hover:border-brand group-hover:bg-brand group-hover:text-white group-hover:-translate-y-1"
            >
              ↑
            </span>
          </a>
        </div>
      </Container>
    </section>
  )
}
