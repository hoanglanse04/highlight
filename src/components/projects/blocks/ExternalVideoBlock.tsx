import { ExternalVideo } from '@/components/media/ExternalVideo'
import type { PublicProject } from '@/lib/payload/projects'

type Block = Extract<
  NonNullable<PublicProject['content']>[number],
  { blockType: 'externalVideo' }
>

const ratios: Record<Block['aspectRatio'], string> = {
  '1:1': 'aspect-square',
  '16:9': 'aspect-video',
  '9:16': 'aspect-[9/16] max-w-xl mx-auto',
  cinematic: 'aspect-[2.35/1]',
}

export function ExternalVideoBlock({
  block,
  labels,
}: {
  block: Block
  labels: {
    loadingVideo: string
    playVideo: string
    videoUnavailable: string
  }
}) {
  return (
    <section className="project-block mx-auto max-w-[100rem] px-5 sm:px-8 lg:px-12">
      {block.title || block.description ? (
        <div className="mb-7 max-w-3xl">
          {block.title ? (
            <h2 className="font-heading text-3xl font-semibold tracking-[-0.04em] sm:text-5xl">
              {block.title}
            </h2>
          ) : null}
          {block.description ? (
            <p className="mt-4 leading-7 text-muted">{block.description}</p>
          ) : null}
        </div>
      ) : null}
      <div
        className={`relative overflow-hidden bg-surface ${ratios[block.aspectRatio]}`}
      >
        <ExternalVideo
          autoplay={block.autoplay ?? false}
          controls={block.controls !== false}
          loadingLabel={labels.loadingVideo}
          loop={block.loop ?? false}
          muted={block.muted !== false}
          playLabel={labels.playVideo}
          poster={block.posterImage}
          priority={false}
          unavailableLabel={labels.videoUnavailable}
          url={block.videoURL}
        />
      </div>
    </section>
  )
}
