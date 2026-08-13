import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import { hasLocale } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'

import { AboutSection } from '@/components/home/AboutSection'
import { ClientsSection } from '@/components/home/ClientsSection'
import { ContactCTASection } from '@/components/home/ContactCTASection'
import { FeaturedProjectsSection } from '@/components/home/FeaturedProjectsSection'
import { HeroSection } from '@/components/home/HeroSection'
import { HomepageEmptyState } from '@/components/home/HomepageEmptyState'
import { MaintenanceScreen } from '@/components/home/MaintenanceScreen'
import { ProjectCategoriesSection } from '@/components/home/ProjectCategoriesSection'
import { ServicesSection } from '@/components/home/ServicesSection'
import { StatisticsSection } from '@/components/home/StatisticsSection'
import { StoriesSection } from '@/components/home/StoriesSection'
import { OrganizationJsonLd } from '@/components/layout/OrganizationJsonLd'
import { PreviewBanner } from '@/components/layout/PreviewBanner'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { SiteHeader } from '@/components/layout/SiteHeader'
import { routing, type AppLocale } from '@/i18n/routing'
import { getEnabledItems } from '@/lib/content/homepage'
import { getHomepageProjectSources } from '@/lib/projects/homepageSources'
import { getProjectPreviewContext } from '@/lib/projects/preview'
import {
  getFooter,
  getHeader,
  getHomepage,
  getSiteSettings,
} from '@/lib/payload/websiteGlobals'
import { buildHomepageMetadata } from '@/lib/seo/homepage'

type HomePageProps = {
  params: Promise<{ locale: string }>
}

function resolveLocale(value: string): AppLocale {
  if (!hasLocale(routing.locales, value)) notFound()
  return value
}

export async function generateMetadata({
  params,
}: HomePageProps): Promise<Metadata> {
  const locale = resolveLocale((await params).locale)
  setRequestLocale(locale)
  const draft = await draftMode()
  const [homepage, settings, t] = await Promise.all([
    getHomepage(locale, draft.isEnabled),
    getSiteSettings(locale, draft.isEnabled),
    getTranslations('HomepageUI'),
  ])

  return buildHomepageMetadata({
    fallbackTitle: t('siteFallbackName'),
    homepage,
    locale,
    settings,
  })
}

export default async function HomePage({ params }: HomePageProps) {
  const locale = resolveLocale((await params).locale)
  setRequestLocale(locale)
  const draft = await draftMode()
  const [homepage, header, footer, settings, t] = await Promise.all([
    getHomepage(locale, draft.isEnabled),
    getHeader(locale, draft.isEnabled),
    getFooter(locale, draft.isEnabled),
    getSiteSettings(locale, draft.isEnabled),
    getTranslations('HomepageUI'),
  ])
  const preview = await getProjectPreviewContext(draft.isEnabled)
  const projectSources = await getHomepageProjectSources(homepage, locale, preview)

  const siteName = settings?.brand.siteName || t('siteFallbackName')
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

  if (settings?.system?.maintenanceMode && !draft.isEnabled) {
    return (
      <MaintenanceScreen
        message={
          settings.system.maintenanceMessage || t('maintenanceDescription')
        }
        siteName={siteName}
        title={t('maintenanceTitle')}
      />
    )
  }

  return (
    <>
      <a className="skip-link" href="#main-content">
        {t('skipToContent')}
      </a>
      <OrganizationJsonLd settings={settings} />
      <SiteHeader
        closeMenuLabel={t('closeMenu')}
        header={publicHeader}
        locale={locale}
        openMenuLabel={t('openMenu')}
        primaryNavigationLabel={t('primaryNavigation')}
        siteName={siteName}
        switchLanguageLabel={t('switchLanguage')}
      />

      {homepage ? (
        <main id="main-content">
          <HeroSection
            homepage={homepage}
            labels={{
              loadingVideo: t('loadingVideo'),
              playVideo: t('playVideo'),
              scrollDown: t('scrollDown'),
              videoUnavailable: t('videoUnavailable'),
            }}
            locale={locale}
          />
          <AboutSection
            homepage={homepage}
            locale={locale}
            sectionLabel={t('sections.about')}
          />
          <StatisticsSection
            homepage={homepage}
            locale={locale}
            sectionLabel={t('sections.statistics')}
          />
          <FeaturedProjectsSection
            homepage={homepage}
            locale={locale}
            projects={projectSources.projects}
            sectionLabel={t('sections.featuredProjects')}
            videoLabel={t('video')}
            viewLabel={t('viewProject')}
          />
          <ProjectCategoriesSection
            categories={projectSources.categories}
            homepage={homepage}
            locale={locale}
            sectionLabel={t('sections.categories')}
            viewLabel={t('viewCategory')}
          />
          <ServicesSection
            homepage={homepage}
            locale={locale}
            sectionLabel={t('sections.services')}
          />
          <ClientsSection
            homepage={homepage}
            locale={locale}
            sectionLabel={t('sections.clients')}
          />
          <StoriesSection
            homepage={homepage}
            locale={locale}
            readMoreLabel={t('readMore')}
            sectionLabel={t('sections.stories')}
          />
          <ContactCTASection
            contactLabel={t('contactUs')}
            homepage={homepage}
            locale={locale}
            sectionLabel={t('sections.contact')}
            settings={settings}
            socialLabel={t('socialLinks')}
          />
        </main>
      ) : (
        <HomepageEmptyState
          description={
            draft.isEnabled
              ? t('previewEmptyDescription')
              : t('emptyDescription')
          }
          title={draft.isEnabled ? t('previewEmptyTitle') : siteName}
        />
      )}

      <SiteFooter
        footer={footer}
        locale={locale}
        settings={settings}
        siteName={siteName}
        socialLabel={t('socialLinks')}
      />
      {draft.isEnabled ? (
        <PreviewBanner
          exitLabel={t('exitPreview')}
          label={t('previewMode')}
          locale={locale}
        />
      ) : null}
    </>
  )
}
