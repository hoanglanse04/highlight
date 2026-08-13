import { ProjectGrid } from '@/components/projects/ProjectGrid'
import type { AppLocale } from '@/i18n/routing'
import type { ProjectCard } from '@/lib/payload/projects'

export function RelatedProjects({
  locale,
  projects,
  title,
  viewLabel,
}: {
  locale: AppLocale
  projects: ProjectCard[]
  title: string
  viewLabel: string
}) {
  if (!projects.length) return null

  return (
    <section className="project-block mx-auto max-w-[90rem] px-5 sm:px-8 lg:px-12">
      <h2 className="font-heading text-3xl font-semibold tracking-[-0.04em] sm:text-5xl">
        {title}
      </h2>
      <div className="mt-9">
        <ProjectGrid
          headingLevel="h3"
          locale={locale}
          projects={projects}
          viewLabel={viewLabel}
        />
      </div>
    </section>
  )
}
