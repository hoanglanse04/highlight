import { absoluteMediaURL } from '@/lib/media'
import { getSiteURL } from '@/lib/seo/homepage'
import { resolveExternalURL } from '@/lib/urls'
import type { SiteSetting } from '@/payload-types'

function serializeJsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, '\\u003c')
}

export function OrganizationJsonLd({
  settings,
}: {
  settings: SiteSetting | null
}) {
  if (!settings?.brand.siteName) return null

  const socialLinks = (settings.social?.socialLinks ?? [])
    .filter((link) => link.enabled !== false)
    .sort((left, right) => (left.displayOrder ?? 0) - (right.displayOrder ?? 0))
    .map((link) => resolveExternalURL(link.url))
    .filter((url): url is string => Boolean(url))
  const address = settings.contact?.address?.trim()

  const data = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: settings.brand.siteName,
    ...(settings.brand.legalName
      ? { legalName: settings.brand.legalName }
      : {}),
    ...(getSiteURL() ? { url: getSiteURL()?.toString() } : {}),
    ...(absoluteMediaURL(settings.brand.logoMark, 'medium')
      ? { logo: absoluteMediaURL(settings.brand.logoMark, 'medium') }
      : {}),
    ...(settings.contact?.email ? { email: settings.contact.email } : {}),
    ...(settings.contact?.phone ? { telephone: settings.contact.phone } : {}),
    ...(address
      ? { address: { '@type': 'PostalAddress', streetAddress: address } }
      : {}),
    ...(socialLinks.length ? { sameAs: socialLinks } : {}),
  }

  return (
    <script
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
      type="application/ld+json"
    />
  )
}
