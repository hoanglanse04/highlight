import { Container } from '@/components/ui/Container'
import { FloatingContactDock } from '@/components/layout/FloatingContactDock'
import { PayloadImage } from '@/components/media/PayloadImage'
import { SmartLink } from '@/components/ui/SmartLink'
import type { AppLocale } from '@/i18n/routing'
import { getEnabledItems } from '@/lib/content/homepage'
import { resolveExternalURL, toTelephoneHref } from '@/lib/urls'
import type { Footer, SiteSetting } from '@/payload-types'

/* ── Brand SVG icons ────────────────────────────────────────────── */
function FacebookIcon() {
  return (
    <svg aria-hidden="true" fill="currentColor" height="20" viewBox="0 0 24 24" width="20" xmlns="http://www.w3.org/2000/svg">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  )
}

function InstagramIcon() {
  return (
    <svg aria-hidden="true" fill="currentColor" height="20" viewBox="0 0 24 24" width="20" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  )
}

function TikTokIcon() {
  return (
    <svg aria-hidden="true" fill="currentColor" height="20" viewBox="0 0 24 24" width="20" xmlns="http://www.w3.org/2000/svg">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
    </svg>
  )
}

function ZaloIcon() {
  return (
    <svg aria-hidden="true" fill="currentColor" height="20" viewBox="0 0 48 48" width="20" xmlns="http://www.w3.org/2000/svg">
      <path d="M24 4C13 4 4 13 4 24c0 4.7 1.6 9 4.3 12.4L5 43l6.9-3.2C15.1 42.2 19.4 44 24 44c11 0 20-9 20-20S35 4 24 4zm-8 26H10l9.6-11.8H10v-3.4h15.8L16.2 26.6H26V30H16zm16.3 0h-3.6v-6.4c0-1.3-.5-2.1-1.6-2.1-.9 0-1.5.6-1.8 1.3-.1.2-.1.6-.1.9V30h-3.6V21h3.4v1.6c.5-.8 1.4-1.9 3.4-1.9 2.4 0 3.9 1.6 3.9 5.1V30z"/>
    </svg>
  )
}

function YouTubeIcon() {
  return (
    <svg aria-hidden="true" fill="currentColor" height="20" viewBox="0 0 24 24" width="20" xmlns="http://www.w3.org/2000/svg">
      <path d="M23.495 6.205a3.007 3.007 0 0 0-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 0 0 .527 6.205a31.247 31.247 0 0 0-.522 5.805 31.247 31.247 0 0 0 .522 5.783 3.007 3.007 0 0 0 2.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 0 0 2.088-2.088 31.247 31.247 0 0 0 .5-5.783 31.247 31.247 0 0 0-.5-5.805zM9.609 15.601V8.408l6.264 3.602z"/>
    </svg>
  )
}

function VimeoIcon() {
  return (
    <svg aria-hidden="true" fill="currentColor" height="20" viewBox="0 0 24 24" width="20" xmlns="http://www.w3.org/2000/svg">
      <path d="M23.977 6.416c-.105 2.338-1.739 5.543-4.894 9.609-3.268 4.247-6.026 6.37-8.29 6.37-1.409 0-2.578-1.294-3.553-3.881L5.322 11.4C4.603 8.816 3.834 7.522 3.01 7.522c-.179 0-.806.378-1.881 1.132L0 7.197a315.065 315.065 0 0 0 3.501-3.128C5.08 2.701 6.266 1.984 7.055 1.91c1.867-.18 3.016 1.1 3.447 3.838.465 2.953.789 4.789.971 5.507.539 2.45 1.131 3.674 1.776 3.674.502 0 1.256-.796 2.265-2.385 1.004-1.589 1.54-2.797 1.612-3.628.144-1.371-.395-2.061-1.614-2.061-.574 0-1.167.121-1.777.391 1.186-3.868 3.434-5.757 6.762-5.637 2.473.06 3.628 1.664 3.48 4.807z"/>
    </svg>
  )
}

function LinkedInIcon() {
  return (
    <svg aria-hidden="true" fill="currentColor" height="20" viewBox="0 0 24 24" width="20" xmlns="http://www.w3.org/2000/svg">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  )
}

function BehanceIcon() {
  return (
    <svg aria-hidden="true" fill="currentColor" height="20" viewBox="0 0 24 24" width="20" xmlns="http://www.w3.org/2000/svg">
      <path d="M6.938 4.503c.702 0 1.34.06 1.92.188.577.13 1.07.33 1.485.61.41.28.733.65.96 1.12.225.47.34 1.05.34 1.73 0 .74-.17 1.36-.507 1.86-.338.5-.837.9-1.502 1.22.906.26 1.576.72 2.012 1.38.438.66.655 1.45.655 2.36 0 .75-.13 1.39-.41 1.93-.28.55-.67 1-1.16 1.35-.48.348-1.05.6-1.68.767-.63.165-1.28.254-1.95.254H0V4.502h6.938zm-.32 4.948c.58 0 1.06-.14 1.44-.42.38-.28.57-.72.57-1.33 0-.34-.06-.62-.18-.84-.12-.22-.29-.4-.5-.53-.21-.13-.45-.22-.72-.27-.27-.05-.55-.08-.84-.08H3.5v3.47h3.12zm.16 5.19c.32 0 .62-.03.9-.09.28-.06.52-.17.73-.32.21-.15.38-.36.5-.6.12-.25.18-.57.18-.96 0-.76-.21-1.3-.64-1.62-.42-.32-.99-.48-1.7-.48H3.5v4.08h3.28zM17.953 17.445c.48.47 1.17.7 2.07.7.64 0 1.2-.16 1.66-.48.46-.32.74-.66.84-1.02h2.8c-.45 1.38-1.13 2.37-2.07 2.96-.93.6-2.06.9-3.38.9-.92 0-1.74-.15-2.48-.44-.74-.29-1.36-.71-1.87-1.24-.51-.53-.9-1.17-1.17-1.9-.27-.74-.41-1.54-.41-2.42 0-.85.14-1.64.43-2.37.29-.73.7-1.36 1.22-1.9.52-.54 1.14-.96 1.87-1.26.72-.3 1.51-.45 2.37-.45 1.02 0 1.9.2 2.65.58.75.38 1.36.89 1.83 1.53.47.64.81 1.38 1 2.2.2.82.27 1.69.2 2.6h-8.34c.04 1.06.34 1.84.82 2.31zm3.59-5.68c-.38-.42-.96-.63-1.73-.63-.51 0-.93.09-1.27.26-.34.17-.61.38-.82.63-.2.25-.35.52-.43.8-.08.28-.13.54-.14.79h5.05c-.12-.85-.38-1.48-.76-1.9zm-3.8-4.845h5.41v1.58h-5.41V6.92z"/>
    </svg>
  )
}

const PLATFORM_ICONS: Record<string, React.ReactNode> = {
  facebook: <FacebookIcon />,
  instagram: <InstagramIcon />,
  tiktok: <TikTokIcon />,
  zalo: <ZaloIcon />,
  youtube: <YouTubeIcon />,
  vimeo: <VimeoIcon />,
  linkedin: <LinkedInIcon />,
  behance: <BehanceIcon />,
}

/* ── Component ──────────────────────────────────────────────────── */
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
  const columns = footer?.navigation?.columns ?? []
  const allSocialLinks = getEnabledItems(settings?.social?.socialLinks)
  // Show FB / IG / ZL / TT prominently; cap at 5
  const footerSocials = allSocialLinks
    .filter((s) => ['facebook', 'instagram', 'zalo', 'tiktok', 'youtube', 'vimeo'].includes(s.platform))
    .slice(0, 5)

  const phoneHref = toTelephoneHref(footer?.contact?.phone ?? settings?.contact?.phone)
  const email = footer?.contact?.email ?? settings?.contact?.email
  const address = footer?.contact?.address ?? settings?.contact?.address
  const displayPhone = footer?.contact?.phone ?? settings?.contact?.phone

  const mapQuery = address ? encodeURIComponent(address) : ''
  const customMapEmbed = (footer?.contact as Record<string, unknown> | undefined)?.mapEmbedUrl as string | undefined
  const mapSrc =
    customMapEmbed ||
    (mapQuery
      ? `https://maps.google.com/maps?q=${mapQuery}&t=&z=15&ie=UTF8&iwloc=&output=embed`
      : null)
  const mapDirectionsUrl = mapQuery
    ? `https://www.google.com/maps/search/?api=1&query=${mapQuery}`
    : '#'

  return (
    <>
      <FloatingContactDock locale={locale} settings={settings} />

      <footer className="sf-root" role="contentinfo">

        {/* ── Top grid: brand + nav columns + live location map ── */}
        <div className="sf-top">
          <Container className="sf-top-inner">

            {/* Brand */}
            <div className="sf-brand">
              {footer?.branding?.logo ? (
                <PayloadImage
                  alt={siteName}
                  className="sf-logo"
                  media={footer.branding.logo}
                  preferredSize="thumbnail"
                  sizes="96px"
                />
              ) : (
                <span className="sf-wordmark">{siteName}</span>
              )}
              {footer?.branding?.shortDescription ? (
                <p className="sf-tagline">{footer.branding.shortDescription}</p>
              ) : null}
            </div>

            {/* Nav columns */}
            {columns.map((col) => (
              <nav aria-label={col.title} className="sf-nav" key={col.id ?? col.title}>
                <p className="sf-nav-heading">{col.title}</p>
                <ul className="sf-nav-list">
                  {getEnabledItems(col.links).map((link) => (
                    <li key={link.id ?? link.label}>
                      <SmartLink className="footer-link sf-nav-link" href={link.url} locale={locale} openInNewTab={link.openInNewTab}>
                        {link.label}
                      </SmartLink>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}

            {/* Live Location Map */}
            {mapSrc ? (
              <div className="sf-map-wrapper">
                <div className="sf-map-header">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-brand animate-pulse shadow-[0_0_8px_rgba(255,92,0,0.8)]" />
                    <span className="sf-nav-heading mb-0">
                      {locale === 'vi' ? 'Bản đồ vị trí' : 'Location Map'}
                    </span>
                  </div>
                  <a
                    className="text-[0.6875rem] font-semibold text-brand transition-colors hover:text-brand-hover hover:underline"
                    href={mapDirectionsUrl}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    {locale === 'vi' ? 'Mở Google Maps ↗' : 'Open in Maps ↗'}
                  </a>
                </div>

                <div className="sf-map-card">
                  <iframe
                    allowFullScreen
                    aria-label={`Bản đồ vị trí ${address}`}
                    className="sf-map-iframe"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    src={mapSrc}
                    title="Bản đồ vị trí Highlight Media"
                  />
                </div>
              </div>
            ) : null}

          </Container>
        </div>

        {/* ── Bottom bar: contact + social ── */}
        <div className="sf-bottom">
          <Container className="sf-bottom-inner">

            {/* Contact blocks */}
            <div className="sf-contacts">
              {address ? (
                <div className="sf-contact-block">
                  <p className="sf-contact-label">Địa chỉ</p>
                  <p className="sf-contact-text">{address}</p>
                </div>
              ) : null}

              {(email || phoneHref) ? (
                <div className="sf-contact-block">
                  <p className="sf-contact-label">Liên hệ</p>
                  {email ? (
                    <a className="sf-contact-text sf-contact-link" href={`mailto:${email}`}>{email}</a>
                  ) : null}
                  {phoneHref ? (
                    <a className="sf-contact-text sf-contact-link" href={`tel:${phoneHref}`}>{displayPhone}</a>
                  ) : null}
                </div>
              ) : null}
            </div>

            {/* Social icons */}
            {footerSocials.length ? (
              <nav aria-label={socialLabel} className="sf-socials">
                {footerSocials.map((social) => {
                  const url = resolveExternalURL(social.url)
                  if (!url) return null
                  const icon = PLATFORM_ICONS[social.platform]
                  return (
                    <SmartLink
                      aria-label={social.label || social.platform}
                      className="sf-social-btn"
                      href={url}
                      key={social.id ?? `${social.platform}-${url}`}
                      openInNewTab
                    >
                      {icon ?? <span aria-hidden="true" className="sf-social-fallback">{social.platform[0]?.toUpperCase()}</span>}
                    </SmartLink>
                  )
                })}
              </nav>
            ) : null}

          </Container>
        </div>

        {/* ── Copyright ── */}
        <div className="sf-copy">
          <Container className="sf-copy-inner">
            <p>{footer?.legal?.copyright || `© ${new Date().getUTCFullYear()} ${siteName}`}</p>
            <p className="sf-copy-year">{new Date().getUTCFullYear()}</p>
          </Container>
        </div>

      </footer>
    </>
  )
}
