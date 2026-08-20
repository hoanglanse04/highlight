import { PayloadImage } from '@/components/media/PayloadImage'
import { Container } from '@/components/ui/Container'
import { Reveal } from '@/components/ui/Motion'
import { OptionalLink } from '@/components/ui/OptionalLink'
import type { AppLocale } from '@/i18n/routing'
import { getEnabledItems, isSectionEnabled } from '@/lib/content/homepage'
import type { Homepage } from '@/payload-types'

export function ClientsSection({
  homepage,
  locale,
  sectionLabel,
}: {
  homepage: Homepage
  locale: AppLocale
  sectionLabel: string
}) {
  const section = homepage.clients
  const items = getEnabledItems(section?.items)
  if (!isSectionEnabled(section) || !items.length) return null

  return (
    <section
      className="section-shell cinematic-bg-studio cinematic-grain relative overflow-hidden border-t border-white/[0.06]"
      id="clients"
    >
      <div
        aria-hidden="true"
        className="cinematic-glow-spotlight bottom-0 left-1/4 h-[350px] w-[500px] bg-brand/[0.05]"
      />
      <Container>
        <Reveal>
          {section?.eyebrow ? (
            <p className="section-eyebrow">{section.eyebrow}</p>
          ) : null}
          {section?.title ? (
            <h2 className="display-title max-w-[11ch] text-brand">
              {section.title}
            </h2>
          ) : (
            <h2 className="sr-only">{sectionLabel}</h2>
          )}
          {section?.description ? (
            <p className="section-description">{section.description}</p>
          ) : null}
        </Reveal>
        <div className="mt-12 grid grid-cols-2 border-t border-l border-white/16 sm:grid-cols-4 lg:mt-16 lg:grid-cols-7">
          {items.map((item) => (
            <OptionalLink
              className="group relative grid aspect-[4/3] place-items-center border-r border-b border-white/16 p-5 transition-colors hover:bg-white/[0.035] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand"
              href={item.websiteURL}
              key={item.id ?? item.name}
              locale={locale}
              openInNewTab
            >
              <PayloadImage
                alt={item.name}
                media={item.logo}
                preferredSize="thumbnail"
                sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 15vw"
                className="max-h-16 w-auto max-w-full object-contain opacity-70 grayscale transition-all duration-300 group-hover:opacity-100 group-hover:grayscale-0"
                fallbackClassName="h-12 w-24"
              />
              <span className="sr-only">{item.name}</span>
            </OptionalLink>
          ))}
        </div>
      </Container>
    </section>
  )
}
