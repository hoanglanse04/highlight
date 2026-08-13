import { PayloadImage } from '@/components/media/PayloadImage'
import { getEnabledItems } from '@/lib/content/homepage'
import { isMedia } from '@/lib/media'
import type { PublicProject } from '@/lib/payload/projects'

type Block = Extract<
  NonNullable<PublicProject['content']>[number],
  { blockType: 'imageGallery' }
>

const gridColumns: Record<Block['columns'], string> = {
  '2': 'md:grid-cols-2',
  '3': 'md:grid-cols-2 xl:grid-cols-3',
  '4': 'sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
}

export function ImageGalleryBlock({
  block,
  galleryLabel,
}: {
  block: Block
  galleryLabel: string
}) {
  const images = getEnabledItems(block.images).filter((item) => isMedia(item.image))
  if (!images.length) return null

  const heading = block.title || galleryLabel
  const content = images.map((item) => (
    <figure
      className={
        block.layout === 'filmstrip'
          ? 'w-[82vw] shrink-0 snap-center sm:w-[62vw] lg:w-[48vw]'
          : 'mb-5 break-inside-avoid'
      }
      key={item.id ?? (typeof item.image === 'object' ? item.image.id : String(item.image))}
    >
      <div
        className={`relative overflow-hidden bg-surface ${
          block.layout === 'masonry' ? 'min-h-72' : 'aspect-[4/3]'
        }`}
      >
        <PayloadImage
          fill
          className="object-cover"
          media={item.image}
          preferredSize="medium"
          sizes={
            block.layout === 'filmstrip'
              ? '(max-width: 767px) 82vw, 55vw'
              : '(max-width: 767px) 100vw, 50vw'
          }
        />
      </div>
      {item.caption ? (
        <figcaption className="mt-3 text-xs leading-5 text-muted">
          {item.caption}
        </figcaption>
      ) : null}
    </figure>
  ))

  return (
    <section
      aria-label={heading}
      className="project-block mx-auto max-w-[100rem] px-5 sm:px-8 lg:px-12"
    >
      <div className="mb-8 max-w-3xl">
        <h2 className="font-heading text-3xl font-semibold tracking-[-0.04em] sm:text-5xl">
          {heading}
        </h2>
        {block.description ? (
          <p className="mt-4 leading-7 text-muted">{block.description}</p>
        ) : null}
      </div>
      {block.layout === 'filmstrip' ? (
        <div
          aria-label={galleryLabel}
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4"
          role="region"
          tabIndex={0}
        >
          {content}
        </div>
      ) : block.layout === 'masonry' ? (
        <div
          className={`columns-1 gap-5 ${
            block.columns === '2'
              ? 'md:columns-2'
              : block.columns === '3'
                ? 'md:columns-2 xl:columns-3'
                : 'sm:columns-2 lg:columns-3 xl:columns-4'
          }`}
        >
          {content}
        </div>
      ) : (
        <div className={`grid gap-5 ${gridColumns[block.columns]}`}>{content}</div>
      )}
    </section>
  )
}
