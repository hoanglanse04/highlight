import Link from 'next/link'

import type { AppLocale } from '@/i18n/routing'
import {
  projectListingSearch,
  type ProjectListingQuery,
} from '@/lib/projects/queryParams'
import { getProjectsPath } from '@/lib/projects/routes'
import type { ProjectSort, PublicProjectCategory } from '@/lib/payload/projects'

const SORT_OPTIONS: ProjectSort[] = [
  'displayOrder',
  'newest',
  'oldest',
  'title',
  'featuredOrder',
]

export function ProjectFilters({
  categories,
  labels,
  locale,
  query,
}: {
  categories: PublicProjectCategory[]
  labels: {
    all: string
    categories: string
    filter: string
    sort: string
    sortApply: string
    sorts: Record<ProjectSort, string>
  }
  locale: AppLocale
  query: ProjectListingQuery
}) {
  const basePath = getProjectsPath(locale)

  return (
    <div className="mb-10 grid gap-7 border-y border-border py-6 lg:grid-cols-[1fr_auto] lg:items-end">
      <nav aria-label={labels.filter}>
        <p className="mb-3 text-[0.68rem] font-bold tracking-[0.16em] text-muted uppercase">
          {labels.categories}
        </p>
        <div className="flex flex-wrap gap-2">
          <Link
            aria-current={!query.category ? 'page' : undefined}
            className="project-filter-link"
            href={`${basePath}${projectListingSearch({ sort: query.sort })}`}
          >
            {labels.all}
          </Link>
          {categories.map((category) => (
            <Link
              aria-current={
                query.category === category.slug ? 'page' : undefined
              }
              className="project-filter-link"
              href={`${basePath}${projectListingSearch({
                category: category.slug,
                sort: query.sort,
              })}`}
              key={category.id}
            >
              {category.title}
            </Link>
          ))}
        </div>
      </nav>

      <form className="flex flex-wrap items-end gap-2" method="get">
        {query.category ? (
          <input name="category" type="hidden" value={query.category} />
        ) : null}
        <label className="grid gap-2 text-xs font-bold tracking-[0.12em] uppercase">
          {labels.sort}
          <select
            className="min-h-11 border border-border bg-surface px-3 text-sm font-normal tracking-normal normal-case"
            defaultValue={query.sort}
            name="sort"
          >
            {SORT_OPTIONS.map((sort) => (
              <option key={sort} value={sort}>
                {labels.sorts[sort]}
              </option>
            ))}
          </select>
        </label>
        <button className="button button-secondary min-h-11" type="submit">
          {labels.sortApply}
        </button>
      </form>
    </div>
  )
}
