import { PayloadImage } from '@/components/media/PayloadImage'
import { isMedia } from '@/lib/media'
import type { PublicProject } from '@/lib/payload/projects'

type Block = Extract<
  NonNullable<PublicProject['content']>[number],
  { blockType: 'twoColumnImages' }
>

const columns: Record<Block['ratio'], string> = {
  equal: 'lg:grid-cols-2',
  'left-large': 'lg:grid-cols-[1.35fr_0.65fr]',
  'right-large': 'lg:grid-cols-[0.65fr_1.35fr]',
}

export function TwoColumnImagesBlock({ block }: { block: Block }) {
  const entries = [
    { caption: block.leftCaption, image: block.leftImage, side: 'left' },
    { caption: block.rightCaption, image: block.rightImage, side: 'right' },
  ]
  if (block.mobileOrder === 'right-first') entries.reverse()

  return (
    <section
      className={`project-block mx-auto grid max-w-[100rem] gap-4 px-5 sm:px-8 lg:px-12 ${columns[block.ratio]}`}
    >
      {entries.map((entry) => {
        if (!isMedia(entry.image)) return null
        return (
          <figure
            className="flex min-w-0 flex-col"
            key={entry.side}
          >
            <div className="relative aspect-[4/3] overflow-hidden bg-surface">
              <PayloadImage
                fill
                className="object-cover"
                media={entry.image}
                preferredSize="large"
                sizes="(max-width: 1023px) 100vw, 50vw"
              />
            </div>
            {entry.caption ? (
              <figcaption className="mt-3 text-xs leading-5 text-muted">
                {entry.caption}
              </figcaption>
            ) : null}
          </figure>
        )
      })}
    </section>
  )
}
