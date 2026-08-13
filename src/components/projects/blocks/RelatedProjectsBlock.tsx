import { RelatedProjects } from '@/components/projects/RelatedProjects'
import type { AppLocale } from '@/i18n/routing'
import {
  getAutomaticRelatedProjects,
  getProjectCardsByIDs,
  type ProjectDraftOptions,
  type PublicProject,
} from '@/lib/payload/projects'

type Block = Extract<
  NonNullable<PublicProject['content']>[number],
  { blockType: 'relatedProjects' }
>

export async function RelatedProjectsBlock({
  block,
  labels,
  locale,
  options,
  project,
}: {
  block: Block
  labels: { relatedProjects: string; viewProject: string }
  locale: AppLocale
  options: ProjectDraftOptions
  project: PublicProject
}) {
  const maxItems = Math.min(Math.max(Math.trunc(block.maxItems || 4), 1), 8)
  const projects =
    block.mode === 'manual'
      ? await getProjectCardsByIDs(
          (block.manualProjects ?? []).filter((item) =>
            typeof item === 'object' ? item.id !== project.id : item !== project.id,
          ),
          locale,
          options,
        )
      : await getAutomaticRelatedProjects(
          project,
          locale,
          block.automaticStrategy ?? 'samePrimaryCategory',
          maxItems,
          options,
        )

  return (
    <RelatedProjects
      locale={locale}
      projects={projects.slice(0, maxItems)}
      title={block.title || labels.relatedProjects}
      viewLabel={labels.viewProject}
    />
  )
}
