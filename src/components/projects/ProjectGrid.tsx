import { ProjectCard } from '@/components/projects/ProjectCard'
import type { AppLocale } from '@/i18n/routing'
import type { ProjectCard as ProjectCardData } from '@/lib/payload/projects'

export function ProjectGrid({
  headingLevel,
  locale,
  projects,
  viewLabel,
}: {
  headingLevel?: 'h2' | 'h3'
  locale: AppLocale
  projects: ProjectCardData[]
  viewLabel: string
}) {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          headingLevel={headingLevel}
          locale={locale}
          project={project}
          viewLabel={viewLabel}
        />
      ))}
    </div>
  )
}
