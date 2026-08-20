import type { MetadataRoute } from 'next'
import { getPayload } from 'payload'

import { getProjectsSegment } from '@/lib/projects/routes'
import { getSiteURL } from '@/lib/seo/homepage'
import config from '@payload-config'

export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteURL = getSiteURL()?.origin || 'https://highlightmedia.vn'
  const now = new Date()

  const entries: MetadataRoute.Sitemap = [
    {
      url: `${siteURL}/vi`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
      alternates: {
        languages: {
          vi: `${siteURL}/vi`,
          en: `${siteURL}/en`,
          'x-default': `${siteURL}/vi`,
        },
      },
    },
    {
      url: `${siteURL}/en`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
      alternates: {
        languages: {
          vi: `${siteURL}/vi`,
          en: `${siteURL}/en`,
          'x-default': `${siteURL}/vi`,
        },
      },
    },
    {
      url: `${siteURL}/vi/${getProjectsSegment('vi')}`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
      alternates: {
        languages: {
          vi: `${siteURL}/vi/${getProjectsSegment('vi')}`,
          en: `${siteURL}/en/${getProjectsSegment('en')}`,
          'x-default': `${siteURL}/vi/${getProjectsSegment('vi')}`,
        },
      },
    },
    {
      url: `${siteURL}/en/${getProjectsSegment('en')}`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
      alternates: {
        languages: {
          vi: `${siteURL}/vi/${getProjectsSegment('vi')}`,
          en: `${siteURL}/en/${getProjectsSegment('en')}`,
          'x-default': `${siteURL}/vi/${getProjectsSegment('vi')}`,
        },
      },
    },
  ]

  try {
    const payload = await getPayload({ config })

    const categories = await payload.find({
      collection: 'project-categories',
      locale: 'vi',
      fallbackLocale: 'vi',
      draft: false,
      limit: 100,
      overrideAccess: false,
      where: {
        and: [
          { _status: { equals: 'published' } },
          { enabled: { equals: true } },
        ],
      },
      select: {
        slug: true,
        updatedAt: true,
      },
    })

    for (const category of categories.docs) {
      if (!category.slug) continue
      const lastModified = category.updatedAt ? new Date(category.updatedAt) : now
      const viCategoryURL = `${siteURL}/vi/${getProjectsSegment('vi')}?category=${encodeURIComponent(category.slug)}`
      const enCategoryURL = `${siteURL}/en/${getProjectsSegment('en')}?category=${encodeURIComponent(category.slug)}`

      entries.push({
        url: viCategoryURL,
        lastModified,
        changeFrequency: 'weekly',
        priority: 0.8,
        alternates: {
          languages: {
            vi: viCategoryURL,
            en: enCategoryURL,
            'x-default': viCategoryURL,
          },
        },
      })
      entries.push({
        url: enCategoryURL,
        lastModified,
        changeFrequency: 'weekly',
        priority: 0.8,
        alternates: {
          languages: {
            vi: viCategoryURL,
            en: enCategoryURL,
            'x-default': viCategoryURL,
          },
        },
      })
    }

    const projects = await payload.find({
      collection: 'projects',
      locale: 'vi',
      fallbackLocale: 'vi',
      draft: false,
      limit: 200,
      overrideAccess: false,
      where: {
        and: [
          { _status: { equals: 'published' } },
          { enabled: { equals: true } },
        ],
      },
      select: {
        slug: true,
        updatedAt: true,
      },
    })

    for (const project of projects.docs) {
      if (!project.slug) continue
      const lastModified = project.updatedAt ? new Date(project.updatedAt) : now
      const viProjectURL = `${siteURL}/vi/${getProjectsSegment('vi')}/${encodeURIComponent(project.slug)}`
      const enProjectURL = `${siteURL}/en/${getProjectsSegment('en')}/${encodeURIComponent(project.slug)}`

      entries.push({
        url: viProjectURL,
        lastModified,
        changeFrequency: 'monthly',
        priority: 0.8,
        alternates: {
          languages: {
            vi: viProjectURL,
            en: enProjectURL,
            'x-default': viProjectURL,
          },
        },
      })
      entries.push({
        url: enProjectURL,
        lastModified,
        changeFrequency: 'monthly',
        priority: 0.8,
        alternates: {
          languages: {
            vi: viProjectURL,
            en: enProjectURL,
            'x-default': viProjectURL,
          },
        },
      })
    }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('Failed to load dynamic sitemap entities from Payload:', error)
    }
  }

  return entries
}
