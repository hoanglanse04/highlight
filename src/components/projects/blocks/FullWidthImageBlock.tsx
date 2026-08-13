import { PayloadImage } from '@/components/media/PayloadImage'
import { isMedia } from '@/lib/media'
import type { PublicProject } from '@/lib/payload/projects'

type Block = Extract<
  NonNullable<PublicProject['content']>[number],
  { blockType: 'fullWidthImage' }
>

const ratios: Record<Block['aspectRatio'], string> = {
  cinematic: 'aspect-[2.35/1]',
  landscape: 'aspect-[4/3]',
  original: '',
  portrait: 'aspect-[3/4] max-w-4xl mx-auto',
}

export function FullWidthImageBlock({ block }: { block: Block }) {
  if (!isMedia(block.image)) return null
  const fixedRatio = block.aspectRatio !== 'original'

  return (
    <figure className="project-block mx-auto w-full max-w-[120rem]">
      <div
        className={`relative overflow-hidden bg-surface ${ratios[block.aspectRatio]}`}
      >
        <PayloadImage
          alt={block.altOverride ?? undefined}
          className={
            `${fixedRatio ? '' : 'h-auto w-full'} ${
              block.containOrCover === 'contain' ? 'object-contain' : 'object-cover'
            }`
          }
          fill={fixedRatio}
          media={block.image}
          preferredSize="large"
          sizes="100vw"
        />
      </div>
      {block.caption || block.credit ? (
        <figcaption className="mx-auto mt-3 flex max-w-[90rem] flex-wrap justify-between gap-2 px-5 text-xs leading-5 text-muted sm:px-8 lg:px-12">
          <span>{block.caption}</span>
          {block.credit ? <span>© {block.credit}</span> : null}
        </figcaption>
      ) : null}
    </figure>
  )
}
