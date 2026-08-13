import type { AppLocale } from '@/i18n/routing'
import { getProjectsPath } from '@/lib/projects/routes'

const HTTP_PROTOCOLS = new Set(['http:', 'https:'])

export type SafeHref = {
  external: boolean
  href: string
}

function hasUnsafePathSegment(value: string): boolean {
  try {
    return decodeURIComponent(value)
      .split('/')
      .some((segment) => segment === '..' || segment === '.')
  } catch {
    return true
  }
}

export function resolveSafeHref(
  value: string | null | undefined,
  locale?: AppLocale,
): SafeHref | null {
  const href = value?.trim()

  if (!href || /[\u0000-\u001F\u007F\\]/.test(href)) return null

  if (
    href.startsWith('/') &&
    !href.startsWith('//') &&
    !hasUnsafePathSegment(href)
  ) {
    if (!locale || /^\/(?:vi|en)(?:\/|$|\?|#)/.test(href)) {
      return { external: false, href }
    }

    const projectsMatch = href.match(/^\/(?:du-an|projects)([?#].*)?$/)
    if (projectsMatch) {
      return {
        external: false,
        href: `${getProjectsPath(locale)}${projectsMatch[1] ?? ''}`,
      }
    }

    const localizedHref = href === '/' ? `/${locale}` : `/${locale}${href}`
    return { external: false, href: localizedHref }
  }

  try {
    const parsed = new URL(href)
    if (!HTTP_PROTOCOLS.has(parsed.protocol)) return null
    return { external: true, href: parsed.toString() }
  } catch {
    return null
  }
}

export function resolveExternalURL(
  value: string | null | undefined,
): string | null {
  const resolved = resolveSafeHref(value)
  return resolved?.external ? resolved.href : null
}

export function toTelephoneHref(
  value: string | null | undefined,
): string | null {
  if (!value) return null
  const normalized = value.replace(/(?!^\+)\D/g, '')
  return normalized.replace(/^\+{2,}/, '+') || null
}
