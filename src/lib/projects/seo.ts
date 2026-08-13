import type { Metadata } from 'next'

import type { AppLocale } from '@/i18n/routing'
import { absoluteMediaURL } from '@/lib/media'
import type {
  PublicProject,
  PublicProjectCategory,
} from '@/lib/payload/projects'
import { getProjectPath, getProjectsPath } from '@/lib/projects/routes'
import { getSiteURL } from '@/lib/seo/homepage'
import type { SiteSetting } from '@/payload-types'

function absolutePath(path: string): string {
  const siteURL = getSiteURL()
  return siteURL ? new URL(path, siteURL).toString() : path
}

function listingPath(
  locale: AppLocale,
  categorySlug?: string,
  page = 1,
): string {
  const search = new URLSearchParams()
  if (categorySlug) search.set('category', categorySlug)
  if (page > 1) search.set('page', String(page))
  const query = search.toString()
  return `${getProjectsPath(locale)}${query ? `?${query}` : ''}`
}

function iconMetadata(settings: SiteSetting | null): Metadata['icons'] {
  const icon = absoluteMediaURL(settings?.brand.favicon, 'thumbnail')
  return icon ? { icon } : undefined
}

function safeProjectCanonical(
  locale: AppLocale,
  slug: string,
  customURL?: string | null,
): string {
  const fallbackPath = getProjectPath(locale, slug)
  const siteURL = getSiteURL()
  if (!customURL || !siteURL) return absolutePath(fallbackPath)

  try {
    const custom = new URL(customURL)
    if (
      custom.origin !== siteURL.origin ||
      custom.pathname !== fallbackPath ||
      custom.search ||
      custom.hash
    ) {
      return absolutePath(fallbackPath)
    }
    return custom.toString()
  } catch {
    return absolutePath(fallbackPath)
  }
}

export function buildProjectsMetadata({
  category,
  categoryMalformed,
  draft,
  fallbackDescription,
  fallbackTitle,
  locale,
  page,
  settings,
}: {
  category: PublicProjectCategory | null
  categoryMalformed: boolean
  draft: boolean
  fallbackDescription: string
  fallbackTitle: string
  locale: AppLocale
  page: number
  settings: SiteSetting | null
}): Metadata {
  const siteName = settings?.brand.siteName
  const title =
    category?.seo?.metaTitle ||
    (category
      ? `${category.title}${siteName ? ` | ${siteName}` : ''}`
      : `${fallbackTitle}${siteName ? ` | ${siteName}` : ''}`)
  const description =
    category?.seo?.metaDescription ||
    category?.shortDescription ||
    settings?.seoDefaults?.defaultMetaDescription ||
    fallbackDescription
  const categorySlug = category?.slug
  const canonical = absolutePath(listingPath(locale, categorySlug, page))
  const viURL = absolutePath(listingPath('vi', categorySlug, page))
  const enURL = absolutePath(listingPath('en', categorySlug, page))
  const image = absoluteMediaURL(
    category?.seo?.ogImage ??
      category?.heroImage ??
      category?.coverImage ??
      settings?.brand.defaultOGImage,
  )
  const noIndex =
    draft ||
    categoryMalformed ||
    Boolean(category?.seo?.noIndex) ||
    Boolean(settings?.system?.maintenanceMode)

  return {
    metadataBase: getSiteURL() ?? undefined,
    title,
    description,
    alternates: {
      canonical,
      languages: { en: enURL, vi: viURL, 'x-default': viURL },
    },
    icons: iconMetadata(settings),
    openGraph: {
      title: category?.seo?.ogTitle || title,
      description: category?.seo?.ogDescription || description,
      images: image ? [{ url: image }] : undefined,
      locale: locale === 'vi' ? 'vi_VN' : 'en_US',
      alternateLocale: locale === 'vi' ? ['en_US'] : ['vi_VN'],
      siteName: siteName || undefined,
      type: 'website',
      url: canonical,
    },
    twitter: {
      card: image ? 'summary_large_image' : 'summary',
      title: category?.seo?.ogTitle || title,
      description: category?.seo?.ogDescription || description,
      images: image ? [image] : undefined,
    },
    robots: noIndex
      ? { follow: false, index: false }
      : { follow: true, index: true },
  }
}

export function buildProjectMetadata({
  draft,
  fallbackTitle,
  locale,
  project,
  settings,
}: {
  draft: boolean
  fallbackTitle: string
  locale: AppLocale
  project: PublicProject | null
  settings: SiteSetting | null
}): Metadata {
  if (!project) {
    return {
      title: fallbackTitle,
      robots: { follow: false, index: false },
    }
  }

  const seo = project.seo
  const siteName = settings?.brand.siteName
  const title =
    seo?.metaTitle ||
    `${project.title}${siteName ? ` | ${siteName}` : ''}`
  const description =
    seo?.metaDescription ||
    project.shortDescription ||
    settings?.seoDefaults?.defaultMetaDescription ||
    undefined
  const canonical = safeProjectCanonical(
    locale,
    project.slug,
    seo?.canonicalURL,
  )
  const viURL = absolutePath(getProjectPath('vi', project.slug))
  const enURL = absolutePath(getProjectPath('en', project.slug))
  const image = absoluteMediaURL(
    seo?.ogImage ?? project.heroImage ?? project.coverImage ?? settings?.brand.defaultOGImage,
  )
  const noIndex =
    draft ||
    Boolean(seo?.noIndex) ||
    Boolean(settings?.system?.maintenanceMode)

  return {
    metadataBase: getSiteURL() ?? undefined,
    title,
    description,
    alternates: {
      canonical,
      languages: { en: enURL, vi: viURL, 'x-default': viURL },
    },
    icons: iconMetadata(settings),
    openGraph: {
      title: seo?.ogTitle || title,
      description: seo?.ogDescription || description,
      images: image ? [{ url: image }] : undefined,
      locale: locale === 'vi' ? 'vi_VN' : 'en_US',
      alternateLocale: locale === 'vi' ? ['en_US'] : ['vi_VN'],
      siteName: siteName || undefined,
      type: 'article',
      url: canonical,
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
