import { isSafeProjectSlug } from '@/fields/projectSlug'
import type { ProjectSort } from '@/lib/payload/projects'

const PROJECT_SORTS = new Set<ProjectSort>([
  'displayOrder',
  'featuredOrder',
  'newest',
  'oldest',
  'title',
])

export type ProjectListingQuery = {
  category?: string
  categoryIsMalformed: boolean
  page: number
  sort: ProjectSort
}

type SearchParams = Record<string, string | string[] | undefined>

function firstValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value
}

export function parseProjectListingQuery(
  searchParams: SearchParams,
): ProjectListingQuery {
  const rawCategory = firstValue(searchParams.category)?.trim()
  const category = rawCategory && isSafeProjectSlug(rawCategory)
    ? rawCategory
    : undefined
  const rawPage = firstValue(searchParams.page)
  const parsedPage = rawPage ? Number(rawPage) : 1
  const page =
    Number.isSafeInteger(parsedPage) && parsedPage > 0 && parsedPage <= 10_000
      ? parsedPage
      : 1
  const rawSort = firstValue(searchParams.sort)
  const sort =
    rawSort && PROJECT_SORTS.has(rawSort as ProjectSort)
      ? (rawSort as ProjectSort)
      : 'displayOrder'

  return {
    category,
    categoryIsMalformed: Boolean(rawCategory && !category),
    page,
    sort,
  }
}

export function projectListingSearch(
  values: {
    category?: string
    page?: number
    sort?: ProjectSort
  },
  defaults: { sort: ProjectSort } = { sort: 'displayOrder' },
): string {
  const search = new URLSearchParams()
  if (values.category) search.set('category', values.category)
  if (values.sort && values.sort !== defaults.sort) search.set('sort', values.sort)
  if (values.page && values.page > 1) search.set('page', String(values.page))
  const value = search.toString()
  return value ? `?${value}` : ''
}
