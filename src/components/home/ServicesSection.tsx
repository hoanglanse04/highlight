import { PayloadImage } from '@/components/media/PayloadImage'
import { Container } from '@/components/ui/Container'
import { Reveal } from '@/components/ui/Motion'
import { OptionalLink } from '@/components/ui/OptionalLink'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { ServiceIcon } from '@/components/ui/ServiceIcon'
import type { AppLocale } from '@/i18n/routing'
import { getEnabledItems, isSectionEnabled } from '@/lib/content/homepage'
import type { Homepage } from '@/payload-types'

export function ServicesSection({
  homepage,
  locale,
  sectionLabel,
}: {
  homepage: Homepage
  locale: AppLocale
  sectionLabel: string
}) {
  const section = homepage.services
  const items = getEnabledItems(section?.items)
  if (!isSectionEnabled(section) || !items.length) return null

  return (
    <section
      className="section-shell cinematic-bg-studio cinematic-grain relative overflow-hidden border-t border-white/[0.06]"
      id="services"
    >
      <div
        aria-hidden="true"
        className="cinematic-glow-spotlight -top-24 right-10 h-[400px] w-[400px] bg-brand/[0.07]"
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
        <div className="mt-12 grid gap-2 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4">
          {items.map((item, index) => (
            <OptionalLink
              className="group block focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand"
              href={item.link}
              key={item.id ?? item.internalName}
              locale={locale}
            >
              <article className="relative min-h-[31rem] overflow-hidden rounded-xl border border-white/10 bg-[#121412] transform-gpu transition-[border-color,box-shadow] duration-300 hover:border-brand/40 hover:shadow-[0_10px_30px_rgba(0,0,0,0.8),0_0_20px_rgba(255,92,0,0.1)] sm:min-h-[36rem]">
                {item.image ? (
                  <PayloadImage
                    fill
                    decorative
                    className="object-cover opacity-70 transition-transform duration-500 ease-out group-hover:scale-[1.04] group-hover:opacity-85"
                    fallbackClassName="h-full w-full"
                    media={item.image}
                    preferredSize="medium"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                ) : (
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_15%,rgba(255,92,0,0.14),transparent_50%),linear-gradient(180deg,#181a18_0%,#0e100e_100%)]" />
                )}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

                <div className="absolute inset-x-0 top-0 flex items-center justify-between p-5 sm:p-6">
                  <span className="font-heading text-xs tracking-[0.18em] text-brand">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="text-brand">
                    <ServiceIcon iconKey={item.iconKey} />
                  </span>
                </div>

                <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                  <div className="flex items-end justify-between gap-5">
                    <div>
                      <h3 className="font-heading text-2xl leading-[1.2] font-semibold tracking-[-0.025em] uppercase sm:text-3xl">
                        {item.title}
                      </h3>
                      <p className="mt-4 line-clamp-3 text-sm leading-6 text-white/64">
                        {item.description}
                      </p>
                    </div>
                    <span aria-hidden="true" className="media-card-arrow">
                      ↗
                    </span>
                  </div>
                </div>
              </article>
            </OptionalLink>
          ))}
        </div>
      </Container>
    </section>
  )
}
