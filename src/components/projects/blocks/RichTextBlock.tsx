import { ProjectRichText } from '@/components/projects/ProjectRichText'
import type { AppLocale } from '@/i18n/routing'
import type { PublicProject } from '@/lib/payload/projects'

type Block = Extract<
  NonNullable<PublicProject['content']>[number],
  { blockType: 'richText' }
>

const widths: Record<Block['maxWidth'], string> = {
  narrow: 'max-w-2xl',
  normal: 'max-w-4xl',
  wide: 'max-w-6xl',
}

export function RichTextBlock({
  block,
  locale,
}: {
  block: Block
  locale: AppLocale
}) {
  return (
    <section
      className={`project-block mx-auto px-5 sm:px-8 ${widths[block.maxWidth]} ${
        block.textAlign === 'center' ? 'text-center' : ''
      }`}
    >
      <ProjectRichText data={block.content} locale={locale} />
    </section>
  )
}
