import { PayloadImage } from '@/components/media/PayloadImage'
import { Container } from '@/components/ui/Container'
import { Reveal } from '@/components/ui/Motion'
import { SmartLink } from '@/components/ui/SmartLink'
import type { AppLocale } from '@/i18n/routing'
import { isSectionEnabled } from '@/lib/content/homepage'
import type { Homepage, SiteSetting } from '@/payload-types'

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
  const ctaURL = section?.cta?.url || settings?.system?.defaultContactCTAURL

  return (
    <section
      className="cinematic-grain relative min-h-[100svh] overflow-hidden bg-[#111211] lg:min-h-[58rem]"
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
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_35%,rgb(var(--brand)/0.12),transparent_30rem),#111211]" />
      )}

      <Container className="relative z-10 flex min-h-[100svh] flex-col pb-9 pt-24 lg:min-h-[58rem]">
        <Reveal>
          {section?.eyebrow ? (
            <p className="section-eyebrow">{section.eyebrow}</p>
          ) : null}
        </Reveal>

        <div className="flex flex-1 items-center justify-center py-16 text-center">
          <Reveal className="max-w-[72rem]">
            {section?.title ? (
              <h2 className="font-heading text-[clamp(2rem,4vw,4.5rem)] leading-[1.14] font-semibold tracking-[-0.025em] text-balance uppercase">
                {section.title}
              </h2>
            ) : (
              <h2 className="sr-only">{sectionLabel}</h2>
            )}
            {section?.description ? (
              <p className="mx-auto mt-7 max-w-2xl whitespace-pre-line text-base leading-7 text-white/68 sm:text-lg">
                {section.description}
              </p>
            ) : null}
            {ctaLabel && ctaURL ? (
              <SmartLink
                className="button button-primary mt-9"
                href={ctaURL}
                locale={locale}
                openInNewTab={section?.cta?.openInNewTab}
              >
                {ctaLabel}
              </SmartLink>
            ) : null}
          </Reveal>
        </div>

        {/* Back to top only — contact info is now in the footer */}
        <div className="flex justify-end border-t border-white/16 pt-8">
          <a
            className="group flex items-center gap-4 self-start text-[0.68rem] font-bold tracking-[0.12em] uppercase transition-colors hover:text-brand"
            href="#hero"
          >
            {locale === 'vi' ? 'Lên đầu trang' : 'Back to top'}
            <span
              aria-hidden="true"
              className="grid h-12 w-12 place-items-center rounded-full border border-white/40 transition group-hover:border-brand group-hover:bg-brand group-hover:text-white"
            >
              ↑
            </span>
          </a>
        </div>
      </Container>
    </section>
  )
}
