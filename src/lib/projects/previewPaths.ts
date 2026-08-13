import { isSafeProjectSlug } from '@/fields/projectSlug'
import { isProjectsSegment } from '@/lib/projects/routes'
import type { ProjectSort } from '@/lib/payload/projects'

const SORTS = new Set<ProjectSort>([
  'displayOrder',
  'featuredOrder',
  'newest',
  'oldest',
  'title',
])

export function isAllowedPreviewPath(
  value: string,
  allowNavigationParams = false,
): boolean {
  if (value.includes('\\') || value.includes('\0')) return false

  let parsed: URL
  try {
    parsed = new URL(value, 'https://preview.invalid')
  } catch {
    return false
  }

  if (parsed.origin !== 'https://preview.invalid') return false
  const segments = parsed.pathname.split('/').filter(Boolean)
  if (segments.length === 1 && (segments[0] === 'vi' || segments[0] === 'en')) {
    return parsed.search === ''
  }
  if (segments[0] !== 'vi' && segments[0] !== 'en') return false
  const locale = segments[0]
  if (!isProjectsSegment(locale, segments[1] ?? '')) return false

  if (segments.length === 3) {
    return isSafeProjectSlug(segments[2]) && parsed.search === ''
  }
  if (segments.length !== 2) return false

  const allowedKeys = allowNavigationParams
    ? new Set(['category', 'page', 'sort'])
    : new Set(['category'])
  if ([...parsed.searchParams.keys()].some((key) => !allowedKeys.has(key))) {
    return false
  }
  const category = parsed.searchParams.get('category')
  if (category && !isSafeProjectSlug(category)) return false
  const page = parsed.searchParams.get('page')
  if (
    page &&
    (!/^[1-9]\d{0,3}$/.test(page) || Number(page) > 10_000)
  ) {
    return false
  }
  const sort = parsed.searchParams.get('sort')
  if (sort && !SORTS.has(sort as ProjectSort)) return false
  return true
}
