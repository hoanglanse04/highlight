import type { AppLocale } from '@/i18n/routing'

const PROJECT_SEGMENTS: Record<AppLocale, 'du-an' | 'projects'> = {
  en: 'projects',
  vi: 'du-an',
}

export function getProjectsSegment(locale: AppLocale): 'du-an' | 'projects' {
  return PROJECT_SEGMENTS[locale]
}

export function isProjectsSegment(
  locale: AppLocale,
  segment: string,
): boolean {
  return PROJECT_SEGMENTS[locale] === segment
}

export function getProjectsPath(locale: AppLocale): string {
  return `/${locale}/${getProjectsSegment(locale)}`
}

export function getProjectPath(locale: AppLocale, slug: string): string {
  return `${getProjectsPath(locale)}/${encodeURIComponent(slug)}`
}

export function getCategoryProjectsPath(
  locale: AppLocale,
  categorySlug: string,
): string {
  return `${getProjectsPath(locale)}?${new URLSearchParams({
    category: categorySlug,
  }).toString()}`
}
