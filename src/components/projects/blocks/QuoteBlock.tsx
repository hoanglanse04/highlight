import { PayloadImage } from '@/components/media/PayloadImage'
import { isMedia } from '@/lib/media'
import type { PublicProject } from '@/lib/payload/projects'

type Block = Extract<
  NonNullable<PublicProject['content']>[number],
  { blockType: 'quote' }
>

export function QuoteBlock({ block }: { block: Block }) {
  return (
    <figure className="project-block mx-auto grid max-w-5xl gap-7 px-5 sm:px-8 md:grid-cols-[auto_1fr] md:items-center">
      {isMedia(block.portrait) ? (
        <div className="relative h-24 w-24 overflow-hidden rounded-full bg-surface md:h-32 md:w-32">
          <PayloadImage
            fill
            className="object-cover"
            media={block.portrait}
            preferredSize="small"
            sizes="128px"
          />
        </div>
      ) : null}
      <blockquote>
        <p className="font-heading text-3xl leading-tight font-semibold tracking-[-0.045em] text-balance sm:text-5xl">
          “{block.quote}”
        </p>
        {block.author || block.role ? (
          <figcaption className="mt-6 text-sm">
            {block.author ? <cite className="font-bold not-italic">{block.author}</cite> : null}
            {block.role ? <span className="ml-2 text-muted">— {block.role}</span> : null}
          </figcaption>
        ) : null}
      </blockquote>
    </figure>
  )
}
