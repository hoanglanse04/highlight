import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import { hasLocale } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { MaintenanceScreen } from '@/components/home/MaintenanceScreen'
import {
  hasRelatedProjectsBlock,
  ProjectContent,
} from '@/components/projects/ProjectContent'
import { ProjectGallery } from '@/components/projects/ProjectGallery'
import { ProjectHero } from '@/components/projects/ProjectHero'
import { ProjectJsonLd } from '@/components/projects/ProjectJsonLd'
import { ProjectMetadata } from '@/components/projects/ProjectMetadata'
import { ProjectRichText } from '@/components/projects/ProjectRichText'
import { ProjectsPageShell } from '@/components/projects/ProjectsPageShell'
import { RelatedProjects } from '@/components/projects/RelatedProjects'
import { Container } from '@/components/ui/Container'
import { isSafeProjectSlug } from '@/fields/projectSlug'
import { routing, type AppLocale } from '@/i18n/routing'
import { getEnabledItems } from '@/lib/content/homepage'
import {
  getProjectBySlug,
  getRelatedProjects,
} from '@/lib/payload/projects'
import { getProjectPreviewContext } from '@/lib/projects/preview'
import {
  getProjectPath,
  getProjectsPath,
  isProjectsSegment,
} from '@/lib/projects/routes'
import { buildProjectMetadata } from '@/lib/projects/seo'
import {
  buildProjectBreadcrumbsJsonLd,
  buildProjectJsonLd,
} from '@/lib/projects/structuredData'
import {
  getFooter,
  getHeader,
  getSiteSettings,
} from '@/lib/payload/websiteGlobals'

export const dynamic = 'force-dynamic'

type DetailPageProps = {
  params: Promise<{
    locale: string
    projectsSegment: string
    slug: string
  }>
}

function routeParams(values: {
  locale: string
  projectsSegment: string
  slug: string
}): { locale: AppLocale; slug: string } {
  if (!hasLocale(routing.locales, values.locale)) notFound()
  if (!isProjectsSegment(values.locale, values.projectsSegment)) notFound()
  if (!isSafeProjectSlug(values.slug)) notFound()
  return { locale: values.locale, slug: values.slug }
}

export async function generateMetadata({
  params,
}: DetailPageProps): Promise<Metadata> {
  const { locale, slug } = routeParams(await params)
  setRequestLocale(locale)
  const draftState = await draftMode()
  const preview = await getProjectPreviewContext(draftState.isEnabled)
  const [project, settings, t] = await Promise.all([
    getProjectBySlug(slug, locale, preview),
    getSiteSettings(locale, preview.draft),
    getTranslations('ProjectsUI'),
  ])
  if (!project) notFound()

  return buildProjectMetadata({
    draft: preview.draft,
    fallbackTitle: t('notFoundTitle'),
    locale,
    project,
    settings,
  })
}

export default async function ProjectDetailPage({ params }: DetailPageProps) {
  const { locale, slug } = routeParams(await params)
  setRequestLocale(locale)
  const draftState = await draftMode()
  const preview = await getProjectPreviewContext(draftState.isEnabled)
  const [project, header, footer, settings, t, homeT] = await Promise.all([
    getProjectBySlug(slug, locale, preview),
    getHeader(locale, preview.draft),
    getFooter(locale, preview.draft),
    getSiteSettings(locale, preview.draft),
    getTranslations('ProjectsUI'),
    getTranslations('HomepageUI'),
  ])
  if (!project) notFound()

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
  const languagePaths = {
    en: getProjectPath('en', slug),
    vi: getProjectPath('vi', slug),
  }
  const defaultRelated = hasRelatedProjectsBlock(project)
    ? []
    : await getRelatedProjects(project.id, locale, 4, preview)

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
      previewExitPath={getProjectPath(locale, slug)}
      settings={settings}
      siteName={siteName}
    >
      <ProjectJsonLd
        data={buildProjectJsonLd({ locale, project, settings })}
      />
      <ProjectJsonLd
        data={buildProjectBreadcrumbsJsonLd({
          homeTitle: homeT('home'),
          locale,
          project,
          projectsTitle: t('title'),
        })}
      />
      <ProjectHero
        labels={{
          loadingVideo: t('loadingVideo'),
          playVideo: t('playVideo'),
          videoUnavailable: t('videoUnavailable'),
        }}
        project={project}
      />
      <Container className="pt-10 sm:pt-14">
        <Link
          className="inline-flex items-center gap-3 text-xs font-bold tracking-[0.14em] text-brand uppercase focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
          href={getProjectsPath(locale)}
        >
          <span aria-hidden="true">←</span>
          {t('backToProjects')}
        </Link>
        <div className="mt-8">
          <ProjectMetadata
            labels={{
              artist: t('artist'),
              category: t('category'),
              client: t('client'),
              date: t('date'),
              location: t('location'),
              secondaryCategories: t('secondaryCategories'),
              services: t('services'),
              year: t('year'),
            }}
            locale={locale}
            project={project}
          />
        </div>
      </Container>

      {project.introduction ? (
        <section className="project-block mx-auto max-w-4xl px-5 sm:px-8">
          <h2 className="sr-only">{t('introduction')}</h2>
          <ProjectRichText data={project.introduction} locale={locale} />
        </section>
      ) : null}

      <ProjectGallery project={project} title={t('projectGallery')} />
      <ProjectContent
        labels={{
          gallery: t('projectGallery'),
          loadingVideo: t('loadingVideo'),
          playVideo: t('playVideo'),
          projectFacts: t('projectFacts'),
          relatedProjects: t('relatedProjects'),
          statistics: t('statistics'),
          videoUnavailable: t('videoUnavailable'),
          viewProject: t('viewProject'),
        }}
        locale={locale}
        options={preview}
        project={project}
      />
      <RelatedProjects
        locale={locale}
        projects={defaultRelated}
        title={t('relatedProjects')}
        viewLabel={t('viewProject')}
      />
    </ProjectsPageShell>
  )
}
