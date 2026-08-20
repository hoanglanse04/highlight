import { ExternalVideo } from '@/components/media/ExternalVideo'
import { PayloadImage } from '@/components/media/PayloadImage'
import { Container } from '@/components/ui/Container'
import { Reveal } from '@/components/ui/Motion'
import { SmartLink } from '@/components/ui/SmartLink'
import type { AppLocale } from '@/i18n/routing'
import { isSectionEnabled } from '@/lib/content/homepage'
import type { Homepage } from '@/payload-types'

type HeroSectionProps = {
  homepage: Homepage
  labels: {
    loadingVideo: string
    playVideo: string
    scrollDown: string
    videoUnavailable: string
  }
  locale: AppLocale
}

export function HeroSection({ homepage, labels, locale }: HeroSectionProps) {
  const hero = homepage.hero
  if (!isSectionEnabled(hero)) return null

  const isVideo = hero.mediaType === 'externalVideo'

  return (
    <section
      className="cinematic-grain relative flex min-h-[calc(100svh-78px)] items-end overflow-hidden bg-background pt-14 pb-14 sm:pb-20 md:min-h-[calc(100svh-92px)] lg:pt-20 lg:pb-24"
      id="hero"
    >
      <div className="absolute inset-0">
        {isVideo ? (
          <ExternalVideo
            loadingLabel={labels.loadingVideo}
            playLabel={labels.playVideo}
            poster={hero.posterImage}
            priority
            unavailableLabel={labels.videoUnavailable}
            url={hero.externalVideoURL}
          />
        ) : (
          <PayloadImage
            fill
            media={hero.backgroundImage}
            preferredSize="large"
            priority
            sizes="100vw"
            className="object-cover"
            fallbackClassName="h-full w-full bg-surface"
          />
        )}
        <div className="cinematic-media-overlay absolute inset-0" />
      </div>

      <Container className="relative z-10">
        <Reveal className="max-w-[78rem]">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            {hero.eyebrow ? (
              <p className="section-eyebrow mb-0">{hero.eyebrow}</p>
            ) : null}
            <span className="cinematic-film-badge">
              <span className="cinematic-film-badge-dot" />
              <span>OFFICIAL SHOWREEL</span>
            </span>
          </div>
          <h1 className="max-w-[21ch] font-heading text-[clamp(2rem,3.6vw,4rem)] leading-[1.12] font-bold tracking-[-0.025em] text-balance uppercase">
            {hero.title}
          </h1>
          {hero.description ? (
            <p className="mt-7 max-w-xl whitespace-pre-line text-base leading-7 text-white/72 sm:text-lg sm:leading-8">
              {hero.description}
            </p>
          ) : null}
          <div className="mt-8 flex flex-wrap gap-3">
            {hero.primaryCTA?.label && hero.primaryCTA.url ? (
              <SmartLink
                className="button button-primary"
                href={hero.primaryCTA.url}
                locale={locale}
                openInNewTab={hero.primaryCTA.openInNewTab}
              >
                {hero.primaryCTA.label}
              </SmartLink>
            ) : null}
            {hero.secondaryCTA?.label && hero.secondaryCTA.url ? (
              <SmartLink
                className="button button-glass"
                href={hero.secondaryCTA.url}
                locale={locale}
                openInNewTab={hero.secondaryCTA.openInNewTab}
              >
                {hero.secondaryCTA.label}
              </SmartLink>
            ) : null}
          </div>
        </Reveal>
      </Container>

      {hero.showScrollIndicator !== false ? (
        <a
          aria-label={labels.scrollDown}
          className="absolute right-5 bottom-5 z-10 hidden items-center gap-3 text-[0.65rem] font-bold tracking-[0.2em] text-white/60 uppercase transition-colors hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand sm:flex lg:right-12 lg:bottom-9"
          href="#about"
        >
          {labels.scrollDown}
          <span aria-hidden="true" className="h-10 w-px bg-brand" />
        </a>
      ) : null}
    </section>
  )
}
