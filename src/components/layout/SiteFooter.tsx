import { Container } from '@/components/ui/Container'
import { FloatingContactDock } from '@/components/layout/FloatingContactDock'
import { PayloadImage } from '@/components/media/PayloadImage'
import { SmartLink } from '@/components/ui/SmartLink'
import type { AppLocale } from '@/i18n/routing'
import { getEnabledItems } from '@/lib/content/homepage'
import { resolveExternalURL, toTelephoneHref } from '@/lib/urls'
import type { Footer, SiteSetting } from '@/payload-types'

export function SiteFooter({
  footer,
  locale,
  siteName,
  socialLabel,
  settings,
}: {
  footer: Footer | null
  locale: AppLocale
  siteName: string
  socialLabel: string
  settings: SiteSetting | null
}) {
  const background = footer?.branding?.backgroundImage
  const columns = footer?.navigation?.columns ?? []
  const socialLinks = getEnabledItems(settings?.social?.socialLinks)
  const phoneHref = toTelephoneHref(
    footer?.contact?.phone ?? settings?.contact?.phone,
  )
  const email = footer?.contact?.email ?? settings?.contact?.email
  const address = footer?.contact?.address ?? settings?.contact?.address

  return (
    <>
      <FloatingContactDock locale={locale} settings={settings} />
      <footer className="relative overflow-hidden bg-background py-10 sm:py-12">
      {background ? (
        <div className="absolute inset-0 opacity-[0.08]">
          <PayloadImage
            fill
            decorative
            media={background}
            preferredSize="large"
            sizes="100vw"
            className="object-cover"
            fallbackClassName="h-full w-full"
          />
        </div>
      ) : null}
      <Container className="relative">
        <div className="grid gap-10 border-t border-white/12 pt-10 pb-10 lg:grid-cols-[1.1fr_2fr]">
          <div className="max-w-md">
            {footer?.branding?.logo ? (
              <PayloadImage
                alt={siteName}
                className="h-16 w-auto object-contain"
                media={footer.branding.logo}
                preferredSize="thumbnail"
                sizes="96px"
              />
            ) : (
              <p className="font-heading text-2xl font-bold tracking-[-0.045em] uppercase">
                {siteName}
              </p>
            )}
            {footer?.branding?.shortDescription ? (
              <p className="mt-5 max-w-sm whitespace-pre-line text-sm leading-6 text-muted">
                {footer.branding.shortDescription}
              </p>
            ) : null}
            {socialLinks.length ? (
              <nav
                aria-label={socialLabel}
                className="mt-6 flex flex-wrap gap-3"
              >
                {socialLinks.map((social) => {
                  const url = resolveExternalURL(social.url)
                  if (!url) return null
                  return (
                    <SmartLink
                      aria-label={social.label || social.platform}
                      className="social-link"
                      href={url}
                      key={social.id ?? `${social.platform}-${url}`}
                      openInNewTab
                    >
                      {social.label || social.platform}
                    </SmartLink>
                  )
                })}
              </nav>
            ) : null}
          </div>

          <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-4">
            {columns.map((column) => (
              <nav aria-label={column.title} key={column.id ?? column.title}>
                <h2 className="text-sm font-bold tracking-[0.16em] uppercase">
                  {column.title}
                </h2>
                <ul className="mt-5 space-y-3 text-sm text-muted">
                  {getEnabledItems(column.links).map((link) => (
                    <li key={link.id ?? `${column.title}-${link.label}`}>
                      <SmartLink
                        className="footer-link"
                        href={link.url}
                        locale={locale}
                        openInNewTab={link.openInNewTab}
                      >
                        {link.label}
                      </SmartLink>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
            {email || phoneHref || address ? (
              <address className="not-italic sm:col-span-2 xl:col-span-1">
                <h2 className="text-sm font-bold tracking-[0.16em] uppercase">
                  {siteName}
                </h2>
                <div className="mt-5 space-y-3 text-sm text-muted">
                  {email ? (
                    <p>
                      <a
                        className="footer-link break-all"
                        href={`mailto:${email}`}
                      >
                        {email}
                      </a>
                    </p>
                  ) : null}
                  {phoneHref ? (
                    <p>
                      <a className="footer-link" href={`tel:${phoneHref}`}>
                        {footer?.contact?.phone ?? settings?.contact?.phone}
                      </a>
                    </p>
                  ) : null}
                  {address ? (
                    <p className="whitespace-pre-line leading-6">{address}</p>
                  ) : null}
                </div>
              </address>
            ) : null}
          </div>
        </div>
        <div className="flex flex-col gap-3 border-t border-white/8 pt-7 text-xs tracking-[0.08em] text-muted uppercase sm:flex-row sm:items-center sm:justify-between">
          <p>{footer?.legal?.copyright || siteName}</p>
          <p>{new Date().getUTCFullYear()}</p>
        </div>
      </Container>
      </footer>
    </>
  )
}
