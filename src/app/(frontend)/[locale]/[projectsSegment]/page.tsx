import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import { hasLocale } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'

import { MaintenanceScreen } from '@/components/home/MaintenanceScreen'
import { ProjectEmptyState } from '@/components/projects/ProjectEmptyState'
import { ProjectFilters } from '@/components/projects/ProjectFilters'
import { ProjectGrid } from '@/components/projects/ProjectGrid'
import { ProjectJsonLd } from '@/components/projects/ProjectJsonLd'
import { ProjectPagination } from '@/components/projects/ProjectPagination'
import { ProjectsPageShell } from '@/components/projects/ProjectsPageShell'
import { Container } from '@/components/ui/Container'
import { routing, type AppLocale } from '@/i18n/routing'
import { getEnabledItems } from '@/lib/content/homepage'
import {
  getProjectCategories,
  getProjectCategoryBySlug,
  getProjects,
  type ProjectSort,
} from '@/lib/payload/projects'
import { getProjectPreviewContext } from '@/lib/projects/preview'
import {
  parseProjectListingQuery,
  projectListingSearch,
} from '@/lib/projects/queryParams'
import { getProjectsPath, isProjectsSegment } from '@/lib/projects/routes'
import { buildProjectsMetadata } from '@/lib/projects/seo'
import {
  buildProjectsBreadcrumbsJsonLd,
  buildProjectsJsonLd,
} from '@/lib/projects/structuredData'
import {
  getFooter,
  getHeader,
  getSiteSettings,
} from '@/lib/payload/websiteGlobals'

export const dynamic = 'force-dynamic'

type ListingPageProps = {
  params: Promise<{ locale: string; projectsSegment: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

function routeLocale(localeValue: string, segment: string): AppLocale {
  if (!hasLocale(routing.locales, localeValue)) notFound()
  if (!isProjectsSegment(localeValue, segment)) notFound()
  return localeValue
}

function emptyProjectResult(page: number, limit = 12) {
  return {
    docs: [],
    hasNextPage: false,
    hasPrevPage: false,
    limit,
    nextPage: null,
    page,
    pagingCounter: (page - 1) * limit + 1,
    prevPage: null,
    totalDocs: 0,
    totalPages: 0,
  }
}

export async function generateMetadata({
  params,
  searchParams,
}: ListingPageProps): Promise<Metadata> {
  const route = await params
  const locale = routeLocale(route.locale, route.projectsSegment)
  setRequestLocale(locale)
  const query = parseProjectListingQuery(await searchParams)
  const draftState = await draftMode()
  const preview = await getProjectPreviewContext(draftState.isEnabled)
  const [category, projectPage, settings, t] = await Promise.all([
    query.category && !query.categoryIsMalformed
      ? getProjectCategoryBySlug(query.category, locale, preview)
      : null,
    query.categoryIsMalformed
      ? Promise.resolve(emptyProjectResult(query.page))
      : getProjects({
          ...preview,
          categorySlug: query.category,
          limit: 12,
          locale,
          page: query.page,
          sort: query.sort,
        }),
    getSiteSettings(locale, preview.draft),
    getTranslations('ProjectsUI'),
  ])
  if (projectPage.totalPages > 0 && query.page > projectPage.totalPages) {
    notFound()
  }

  return buildProjectsMetadata({
    category,
    categoryMalformed:
      query.categoryIsMalformed || Boolean(query.category && !category),
    draft: preview.draft,
    fallbackDescription: t('listingSeoDescription'),
    fallbackTitle: t('listingSeoTitle'),
    locale,
    page: query.page,
    settings,
  })
}

export default async function ProjectsListingPage({
  params,
  searchParams,
}: ListingPageProps) {
  const route = await params
  const locale = routeLocale(route.locale, route.projectsSegment)
  setRequestLocale(locale)
  const query = parseProjectListingQuery(await searchParams)
  const draftState = await draftMode()
  const preview = await getProjectPreviewContext(draftState.isEnabled)
  const [
    categories,
    category,
    projects,
    header,
    footer,
    settings,
    t,
    homeT,
  ] = await Promise.all([
    getProjectCategories({ ...preview, locale, limit: 100 }),
    query.category && !query.categoryIsMalformed
      ? getProjectCategoryBySlug(query.category, locale, preview)
      : null,
    query.categoryIsMalformed
      ? Promise.resolve(emptyProjectResult(query.page))
      : getProjects({
          ...preview,
          categorySlug: query.category,
          limit: 12,
          locale,
          page: query.page,
          sort: query.sort,
        }),
    getHeader(locale, preview.draft),
    getFooter(locale, preview.draft),
    getSiteSettings(locale, preview.draft),
    getTranslations('ProjectsUI'),
    getTranslations('HomepageUI'),
  ])

  if (projects.totalPages > 0 && query.page > projects.totalPages) notFound()

  const siteName = settings?.brand.siteName || homeT('siteFallbackName')
  if (settings?.system?.maintenanceMode && !preview.draft) {
    return (
      <MaintenanceScreen
        message={
          settings.system.maintenanceMessage ||
          homeT('maintenanceDescription')
        }
        siteName={siteName}
        title={homeT('maintenanceTitle')}
      />
    )
  }

  const publicHeader = header
    ? {
        ...header,
        navigation: header.navigation
          ? {
              ...header.navigation,
              items: getEnabledItems(header.navigation.items),
            }
          : undefined,
      }
    : null
  const currentSearch = projectListingSearch({
    category: query.category,
    page: query.page,
    sort: query.sort,
  })
  const languagePaths = {
    en: `${getProjectsPath('en')}${currentSearch}`,
    vi: `${getProjectsPath('vi')}${currentSearch}`,
  }
  const heading = category?.title || t('title')
  const intro = category?.shortDescription || t('intro')

  return (
    <ProjectsPageShell
      footer={footer}
      header={publicHeader}
      labels={{
        closeMenu: homeT('closeMenu'),
        exitPreview: homeT('exitPreview'),
        openMenu: homeT('openMenu'),
        previewMode: homeT('previewMode'),
        primaryNavigation: homeT('primaryNavigation'),
        skipToContent: homeT('skipToContent'),
        socialLinks: homeT('socialLinks'),
        switchLanguage: homeT('switchLanguage'),
      }}
      languagePaths={languagePaths}
      locale={locale}
      preview={preview.draft}
      previewExitPath={`${getProjectsPath(locale)}${currentSearch}`}
      settings={settings}
      siteName={siteName}
    >
      <ProjectJsonLd
        data={buildProjectsJsonLd({
          locale,
          projects: projects.docs,
          title: heading,
        })}
      />
      <ProjectJsonLd
        data={buildProjectsBreadcrumbsJsonLd({
          categoryTitle: category?.title,
          homeTitle: homeT('home'),
          locale,
          projectsTitle: t('title'),
        })}
      />
      <section className="border-b border-border bg-surface pt-16 pb-14 sm:pt-20 sm:pb-20">
        <Container>
          <p className="section-eyebrow">{t('eyebrow')}</p>
          <h1 className="font-heading text-[clamp(3.5rem,9vw,8rem)] leading-[0.9] font-bold tracking-[-0.06em] uppercase">
            {heading}
          </h1>
          <p className="mt-6 max-w-3xl text-base leading-7 text-muted sm:text-lg">
            {intro}
          </p>
        </Container>
      </section>
      <section className="section-shell">
        <Container>
          <ProjectFilters
            categories={categories.docs}
            labels={{
              all: t('allProjects'),
              categories: t('categories'),
              filter: t('filterByCategory'),
              sort: t('sortBy'),
              sortApply: t('applySort'),
              sorts: {
                displayOrder: t('sorts.displayOrder'),
                featuredOrder: t('sorts.featuredOrder'),
                newest: t('sorts.newest'),
                oldest: t('sorts.oldest'),
                title: t('sorts.title'),
              } satisfies Record<ProjectSort, string>,
            }}
            locale={locale}
            query={query}
          />
          {projects.docs.length ? (
            <>
              <ProjectGrid
                locale={locale}
                projects={projects.docs}
                viewLabel={t('viewProject')}
              />
              <ProjectPagination
                category={query.category}
                labels={{
                  next: t('next'),
                  page: t('page'),
                  previous: t('previous'),
                }}
                locale={locale}
                page={query.page}
                sort={query.sort}
                totalPages={projects.totalPages}
              />
            </>
          ) : (
            <ProjectEmptyState
              description={t('noProjectsDescription')}
              title={t('noProjects')}
            />
          )}
        </Container>
      </section>
    </ProjectsPageShell>
  )
}
