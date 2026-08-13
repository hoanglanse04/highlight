import Link from 'next/link'

import type { AppLocale } from '@/i18n/routing'
import { projectListingSearch } from '@/lib/projects/queryParams'
import { getProjectsPath } from '@/lib/projects/routes'
import type { ProjectSort } from '@/lib/payload/projects'

function visiblePages(current: number, total: number): Array<number | 'ellipsis'> {
  if (total <= 7) return Array.from({ length: total }, (_, index) => index + 1)

  const pages = new Set([1, total, current - 1, current, current + 1])
  const sorted = [...pages].filter((page) => page > 0 && page <= total).sort((a, b) => a - b)
  const result: Array<number | 'ellipsis'> = []

  sorted.forEach((page, index) => {
    if (index > 0 && page - sorted[index - 1]! > 1) result.push('ellipsis')
    result.push(page)
  })
  return result
}

export function ProjectPagination({
  category,
  labels,
  locale,
  page,
  sort,
  totalPages,
}: {
  category?: string
  labels: { next: string; page: string; previous: string }
  locale: AppLocale
  page: number
  sort: ProjectSort
  totalPages: number
}) {
  if (totalPages <= 1) return null
  const basePath = getProjectsPath(locale)
  const hrefFor = (targetPage: number) =>
    `${basePath}${projectListingSearch({
      category,
      page: targetPage,
      sort,
    })}`

  return (
    <nav
      aria-label={labels.page}
      className="mt-12 flex flex-wrap items-center justify-center gap-2"
    >
      {page > 1 ? (
        <Link className="project-page-link px-4" href={hrefFor(page - 1)}>
          {labels.previous}
        </Link>
      ) : null}
      {visiblePages(page, totalPages).map((item, index) =>
        item === 'ellipsis' ? (
          <span aria-hidden="true" className="px-1 text-muted" key={`ellipsis-${index}`}>
            …
          </span>
        ) : (
          <Link
            aria-current={item === page ? 'page' : undefined}
            aria-label={`${labels.page} ${item}`}
            className="project-page-link"
            href={hrefFor(item)}
            key={item}
          >
            {item}
          </Link>
        ),
      )}
      {page < totalPages ? (
        <Link className="project-page-link px-4" href={hrefFor(page + 1)}>
          {labels.next}
        </Link>
      ) : null}
    </nav>
  )
}
