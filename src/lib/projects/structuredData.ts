import type { AppLocale } from '@/i18n/routing'
import { absoluteMediaURL } from '@/lib/media'
import type { ProjectCard, PublicProject } from '@/lib/payload/projects'
import { getProjectPath, getProjectsPath } from '@/lib/projects/routes'
import { getSiteURL } from '@/lib/seo/homepage'
import type { SiteSetting } from '@/payload-types'

function absolutePath(path: string): string {
  const siteURL = getSiteURL()
  return siteURL ? new URL(path, siteURL).toString() : path
}

export function buildProjectsJsonLd({
  locale,
  projects,
  title,
}: {
  locale: AppLocale
  projects: ProjectCard[]
  title: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    inLanguage: locale,
    name: title,
    url: absolutePath(getProjectsPath(locale)),
    ...(projects.length
      ? {
          mainEntity: {
            '@type': 'ItemList',
            itemListElement: projects.map((project, index) => ({
              '@type': 'ListItem',
              position: index + 1,
              url: absolutePath(getProjectPath(locale, project.slug)),
              name: project.title,
            })),
          },
        }
      : {}),
  }
}

export function buildProjectJsonLd({
  locale,
  project,
  settings,
}: {
  locale: AppLocale
  project: PublicProject
  settings: SiteSetting | null
}) {
  const image = absoluteMediaURL(
    project.seo?.ogImage ?? project.heroImage ?? project.coverImage,
  )
  const publisher = settings?.brand.siteName
    ? {
        '@type': 'Organization',
        name: settings.brand.siteName,
        ...(absoluteMediaURL(settings.brand.logoMark, 'medium')
          ? { logo: absoluteMediaURL(settings.brand.logoMark, 'medium') }
          : {}),
      }
    : undefined
  const services = (project.services ?? []).map((service) => service.label)

  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.title,
    description: project.shortDescription,
    inLanguage: locale,
    url: absolutePath(getProjectPath(locale, project.slug)),
    ...(image ? { image } : {}),
    ...(project.projectDate ? { dateCreated: project.projectDate } : {}),
    ...(project.year ? { copyrightYear: project.year } : {}),
    ...(publisher ? { creator: publisher, publisher } : {}),
    ...(project.clientName
      ? {
          contributor: {
            '@type': 'Organization',
            name: project.clientName,
          },
        }
      : {}),
    ...(project.artistName ? { about: project.artistName } : {}),
    ...(project.location
      ? { contentLocation: { '@type': 'Place', name: project.location } }
      : {}),
    ...(services.length ? { keywords: services.join(', ') } : {}),
  }
}

export function buildProjectsBreadcrumbsJsonLd({
  categoryTitle,
  homeTitle,
  locale,
  projectsTitle,
}: {
  categoryTitle?: string
  homeTitle: string
  locale: AppLocale
  projectsTitle: string
}) {
  const items = [
    {
      '@type': 'ListItem',
      position: 1,
      name: homeTitle,
      item: absolutePath(`/${locale}`),
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: projectsTitle,
      item: absolutePath(getProjectsPath(locale)),
    },
  ]

  if (categoryTitle) {
    items.push({
      '@type': 'ListItem',
      position: 3,
      name: categoryTitle,
      item: absolutePath(getProjectsPath(locale)),
    })
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items,
  }
}

export function buildProjectBreadcrumbsJsonLd({
  homeTitle,
  locale,
  project,
  projectsTitle,
}: {
  homeTitle: string
  locale: AppLocale
  project: PublicProject
  projectsTitle: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: homeTitle,
        item: absolutePath(`/${locale}`),
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: projectsTitle,
        item: absolutePath(getProjectsPath(locale)),
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: project.title,
        item: absolutePath(getProjectPath(locale, project.slug)),
      },
    ],
  }
}

export function serializeJsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, '\\u003c')
}

