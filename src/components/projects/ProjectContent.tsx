import {
  ExternalVideoBlock,
  FullWidthImageBlock,
  ImageGalleryBlock,
  ProjectFactsBlock,
  QuoteBlock,
  RelatedProjectsBlock,
  RichTextBlock,
  StatisticsBlock,
  TextImageBlock,
  TwoColumnImagesBlock,
} from '@/components/projects/blocks'
import type { AppLocale } from '@/i18n/routing'
import { Fragment } from 'react'
import type {
  ProjectDraftOptions,
  PublicProject,
} from '@/lib/payload/projects'

export type ProjectContentLabels = {
  gallery: string
  loadingVideo: string
  playVideo: string
  projectFacts: string
  relatedProjects: string
  statistics: string
  videoUnavailable: string
  viewProject: string
}

export async function ProjectContent({
  labels,
  locale,
  options,
  project,
}: {
  labels: ProjectContentLabels
  locale: AppLocale
  options: ProjectDraftOptions
  project: PublicProject
}) {
  const blocks = (project.content ?? []).filter((block) => block.enabled !== false)
  if (!blocks.length) return null

  const rendered = []
  for (const block of blocks) {
    const key = block.id ?? `${block.blockType}-${rendered.length}`

    switch (block.blockType) {
      case 'richText':
        rendered.push(<RichTextBlock block={block} key={key} locale={locale} />)
        break
      case 'fullWidthImage':
        rendered.push(<FullWidthImageBlock block={block} key={key} />)
        break
      case 'twoColumnImages':
        rendered.push(<TwoColumnImagesBlock block={block} key={key} />)
        break
      case 'imageGallery':
        rendered.push(
          <ImageGalleryBlock block={block} galleryLabel={labels.gallery} key={key} />,
        )
        break
      case 'externalVideo':
        rendered.push(
          <ExternalVideoBlock
            block={block}
            key={key}
            labels={{
              loadingVideo: labels.loadingVideo,
              playVideo: labels.playVideo,
              videoUnavailable: labels.videoUnavailable,
            }}
          />,
        )
        break
      case 'quote':
        rendered.push(<QuoteBlock block={block} key={key} />)
        break
      case 'projectFacts':
        rendered.push(
          <ProjectFactsBlock
            block={block}
            key={key}
            project={project}
            title={labels.projectFacts}
          />,
        )
        break
      case 'statistics':
        rendered.push(
          <StatisticsBlock
            block={block}
            key={key}
            project={project}
            title={labels.statistics}
          />,
        )
        break
      case 'textImage':
        rendered.push(<TextImageBlock block={block} key={key} locale={locale} />)
        break
      case 'relatedProjects':
        rendered.push(
          <Fragment key={key}>
            {await RelatedProjectsBlock({
            block,
            labels: {
              relatedProjects: labels.relatedProjects,
              viewProject: labels.viewProject,
            },
            locale,
            options,
            project,
            })}
          </Fragment>,
        )
        break
      default: {
        const unknown = block as { blockType?: unknown }
        if (process.env.NODE_ENV === 'development') {
          console.warn('Ignoring unknown project content block.', unknown.blockType)
        }
      }
    }
  }

  return <>{rendered}</>
}

export function hasRelatedProjectsBlock(project: PublicProject): boolean {
  return Boolean(
    project.content?.some(
      (block) => block.enabled !== false && block.blockType === 'relatedProjects',
    ),
  )
}
