import type { ReactNode } from 'react'

import { OrganizationJsonLd } from '@/components/layout/OrganizationJsonLd'
import { PreviewBanner } from '@/components/layout/PreviewBanner'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { SiteHeader } from '@/components/layout/SiteHeader'
import type { AppLocale } from '@/i18n/routing'
import type { Footer, Header, SiteSetting } from '@/payload-types'

export function ProjectsPageShell({
  children,
  footer,
  header,
  labels,
  languagePaths,
  locale,
  preview,
  previewExitPath,
  settings,
  siteName,
}: {
  children: ReactNode
  footer: Footer | null
  header: Header | null
  labels: {
    closeMenu: string
    exitPreview: string
    openMenu: string
    previewMode: string
    primaryNavigation: string
    skipToContent: string
    socialLinks: string
    switchLanguage: string
  }
  languagePaths: Record<AppLocale, string>
  locale: AppLocale
  preview: boolean
  previewExitPath: string
  settings: SiteSetting | null
  siteName: string
}) {
  return (
    <>
      <a className="skip-link" href="#main-content">
        {labels.skipToContent}
      </a>
      <OrganizationJsonLd settings={settings} />
      <SiteHeader
        closeMenuLabel={labels.closeMenu}
        header={header}
        languagePaths={languagePaths}
        locale={locale}
        openMenuLabel={labels.openMenu}
        primaryNavigationLabel={labels.primaryNavigation}
        siteName={siteName}
        switchLanguageLabel={labels.switchLanguage}
      />
      <main id="main-content">{children}</main>
      <SiteFooter
        footer={footer}
        locale={locale}
        settings={settings}
        siteName={siteName}
        socialLabel={labels.socialLinks}
      />
      {preview ? (
        <PreviewBanner
          exitLabel={labels.exitPreview}
          exitPath={previewExitPath}
          label={labels.previewMode}
          locale={locale}
        />
      ) : null}
    </>
  )
}
