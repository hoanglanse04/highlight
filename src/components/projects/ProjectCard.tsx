import Link from 'next/link'

import { PayloadImage } from '@/components/media/PayloadImage'
import { isSafeProjectSlug } from '@/fields/projectSlug'
import type { AppLocale } from '@/i18n/routing'
import { getProjectPath } from '@/lib/projects/routes'
import type { ProjectCard as ProjectCardData } from '@/lib/payload/projects'
import type { ProjectCategory } from '@/payload-types'

function categoryTitle(
  value: number | ProjectCategory,
): string | null {
  return typeof value === 'object' ? value.title : null
}

export function ProjectCard({
  headingLevel = 'h2',
  locale,
  project,
  viewLabel,
}: {
  headingLevel?: 'h2' | 'h3'
  locale: AppLocale
  project: ProjectCardData
  viewLabel: string
}) {
  const Heading = headingLevel
  const content = (
    <article className="group h-full">
      <div className="relative aspect-[4/3] overflow-hidden bg-surface">
        <PayloadImage
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-[1.035]"
          fallbackClassName="h-full w-full"
          media={project.coverImage}
          preferredSize="medium"
          sizes="(max-width: 767px) 100vw, (max-width: 1199px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        {project.featured ? (
          <span
            aria-hidden="true"
            className="absolute top-4 right-4 h-2.5 w-2.5 rounded-full bg-brand shadow-[0_0_0_5px_rgb(10_10_10/0.35)]"
          />
        ) : null}
      </div>
      <div className="border-x border-b border-border bg-surface p-5 sm:p-6">
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-[0.68rem] font-bold tracking-[0.14em] text-muted uppercase">
          {categoryTitle(project.primaryCategory) ? (
            <span className="text-brand">
              {categoryTitle(project.primaryCategory)}
            </span>
          ) : null}
          {project.clientName ? <span>{project.clientName}</span> : null}
          {project.artistName ? <span>{project.artistName}</span> : null}
          {project.year ? <span>{project.year}</span> : null}
        </div>
        <Heading className="mt-3 font-heading text-2xl leading-tight font-semibold tracking-[-0.04em] text-balance sm:text-3xl">
          {project.title}
        </Heading>
        {project.shortDescription ? (
          <p className="mt-3 line-clamp-2 text-sm leading-6 text-muted">
            {project.shortDescription}
          </p>
        ) : null}
        <span className="mt-6 inline-flex items-center gap-3 text-xs font-bold tracking-[0.14em] uppercase">
          {viewLabel}
          <span
            aria-hidden="true"
            className="h-px w-8 bg-brand transition-[width] group-hover:w-12"
          />
        </span>
      </div>
    </article>
  )

  if (!isSafeProjectSlug(project.slug)) return content

  return (
    <Link
      className="block h-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
      href={getProjectPath(locale, project.slug)}
    >
      {content}
    </Link>
  )
}
