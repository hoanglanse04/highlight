import { PayloadImage } from '@/components/media/PayloadImage'
import { ProjectRichText } from '@/components/projects/ProjectRichText'
import type { AppLocale } from '@/i18n/routing'
import { isMedia } from '@/lib/media'
import type { PublicProject } from '@/lib/payload/projects'

type Block = Extract<
  NonNullable<PublicProject['content']>[number],
  { blockType: 'textImage' }
>

const backgrounds: Record<Block['backgroundStyle'], string> = {
  'brand-accent': 'bg-brand text-white',
  default: 'bg-background',
  surface: 'bg-surface',
}

const alignment: Record<Block['verticalAlignment'], string> = {
  bottom: 'items-end',
  center: 'items-center',
  top: 'items-start',
}

export function TextImageBlock({
  block,
  locale,
}: {
  block: Block
  locale: AppLocale
}) {
  if (!isMedia(block.image)) return null
  const imageFirst = block.imagePosition === 'left'

  return (
    <section className={`project-block py-12 sm:py-16 ${backgrounds[block.backgroundStyle]}`}>
      <div
        className={`mx-auto grid max-w-[90rem] gap-10 px-5 sm:px-8 lg:grid-cols-2 lg:px-12 ${alignment[block.verticalAlignment]}`}
      >
        <div className={imageFirst ? 'lg:order-2' : ''}>
          {block.eyebrow ? <p className="section-eyebrow">{block.eyebrow}</p> : null}
          {block.title ? (
            <h2 className="font-heading text-3xl font-semibold tracking-[-0.04em] sm:text-5xl">
              {block.title}
            </h2>
          ) : null}
          <ProjectRichText
            className="mt-6"
            data={block.content}
            locale={locale}
          />
        </div>
        <div
          className={`relative aspect-[4/3] overflow-hidden bg-surface-elevated ${
            imageFirst ? 'lg:order-1' : ''
          }`}
        >
          <PayloadImage
            fill
            className="object-cover"
            media={block.image}
            preferredSize="large"
            sizes="(max-width: 1023px) 100vw, 50vw"
          />
        </div>
      </div>
    </section>
  )
}
