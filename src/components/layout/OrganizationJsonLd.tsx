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

  const siteURL = getSiteURL()?.toString()

  const data = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        ...(siteURL ? { '@id': `${siteURL}#organization` } : {}),
        name: settings.brand.siteName,
        ...(settings.brand.legalName
          ? { legalName: settings.brand.legalName }
          : {}),
        ...(siteURL ? { url: siteURL } : {}),
        ...(absoluteMediaURL(settings.brand.logoMark, 'medium')
          ? { logo: absoluteMediaURL(settings.brand.logoMark, 'medium') }
          : {}),
        ...(settings.contact?.email ? { email: settings.contact.email } : {}),
        ...(settings.contact?.phone ? { telephone: settings.contact.phone } : {}),
        ...(address
          ? { address: { '@type': 'PostalAddress', streetAddress: address } }
          : {}),
        ...(socialLinks.length ? { sameAs: socialLinks } : {}),
      },
      ...(siteURL
        ? [
            {
              '@type': 'WebSite',
              '@id': `${siteURL}#website`,
              name: settings.brand.siteName,
              url: siteURL,
              publisher: {
                '@id': `${siteURL}#organization`,
              },
            },
          ]
        : []),
    ],
  }

  return (
    <script
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
      type="application/ld+json"
    />
  )
}
