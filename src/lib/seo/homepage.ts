import type { Metadata } from 'next'

import type { AppLocale } from '@/i18n/routing'
import { absoluteMediaURL } from '@/lib/media'
import { resolveExternalURL } from '@/lib/urls'
import type { Homepage, SiteSetting } from '@/payload-types'

export function getSiteURL(): URL | null {
  for (const value of [
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.NEXT_PUBLIC_SERVER_URL,
  ]) {
    if (!value) continue
    try {
      const url = new URL(value)
      if (['http:', 'https:'].includes(url.protocol)) return url
    } catch {
      // Try the next configured public origin.
    }
  }

  return null
}

function localizedCanonical(
  locale: AppLocale,
  customURL?: string | null,
): string {
  const base = getSiteURL()
  const fallback = new URL(
    `/${locale}`,
    base ?? new URL('http://localhost'),
  ).toString()
  const external = resolveExternalURL(customURL)
  if (!external) return fallback

  const custom = new URL(external)
  const localeMatch = custom.pathname.match(/\/(vi|en)\/?$/)
  if (!localeMatch) return fallback

  custom.pathname = custom.pathname.replace(/\/(vi|en)\/?$/, `/${locale}`)
  return custom.toString()
}

type BuildMetadataArgs = {
  fallbackTitle: string
  homepage: Homepage | null
  locale: AppLocale
  settings: SiteSetting | null
}

export function buildHomepageMetadata({
  fallbackTitle,
  homepage,
  locale,
  settings,
}: BuildMetadataArgs): Metadata {
  const seo = homepage?.seo
  const title =
    seo?.metaTitle ||
    settings?.seoDefaults?.defaultMetaTitle ||
    settings?.brand.siteName ||
    fallbackTitle
  const description =
    seo?.metaDescription ||
    settings?.seoDefaults?.defaultMetaDescription ||
    undefined
  const canonical = localizedCanonical(locale, seo?.canonicalURL)
  const siteURL = getSiteURL()
  const image = absoluteMediaURL(seo?.ogImage ?? settings?.brand.defaultOGImage)
  const maintenance = Boolean(settings?.system?.maintenanceMode)
  const noIndex = maintenance || Boolean(seo?.noIndex)

  const viURL = siteURL ? new URL('/vi', siteURL).toString() : '/vi'
  const enURL = siteURL ? new URL('/en', siteURL).toString() : '/en'

  return {
    metadataBase: siteURL ?? undefined,
    title,
    description,
    alternates: {
      canonical,
      languages: {
        en: enURL,
        vi: viURL,
        'x-default': viURL,
      },
    },
    icons: settings?.brand.favicon
      ? {
          icon:
            absoluteMediaURL(settings.brand.favicon, 'thumbnail') ?? undefined,
        }
      : undefined,
    openGraph: {
      title: seo?.ogTitle || title,
      description: seo?.ogDescription || description,
      locale: locale === 'vi' ? 'vi_VN' : 'en_US',
      alternateLocale: locale === 'vi' ? ['en_US'] : ['vi_VN'],
      type: 'website',
      url: canonical,
      siteName: settings?.brand.siteName || undefined,
      images: image ? [{ url: image }] : undefined,
    },
    twitter: {
      card: image ? 'summary_large_image' : 'summary',
      title: seo?.ogTitle || title,
      description: seo?.ogDescription || description,
      images: image ? [image] : undefined,
    },
    robots: noIndex
      ? { follow: false, index: false }
      : { follow: true, index: true },
  }
}
