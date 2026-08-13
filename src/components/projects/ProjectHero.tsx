import { ExternalVideo } from '@/components/media/ExternalVideo'
import { PayloadImage } from '@/components/media/PayloadImage'
import { Container } from '@/components/ui/Container'
import type { PublicProject } from '@/lib/payload/projects'
import type { ProjectCategory } from '@/payload-types'

function categoryTitle(value: number | ProjectCategory): string | null {
  return typeof value === 'object' ? value.title : null
}

export function ProjectHero({
  labels,
  project,
}: {
  labels: {
    loadingVideo: string
    playVideo: string
    videoUnavailable: string
  }
  project: PublicProject
}) {
  const video = project.heroMediaType === 'externalVideo'

  return (
    <section className="relative flex min-h-[72svh] items-end overflow-hidden bg-background pt-14 pb-14 sm:min-h-[80svh] sm:pt-20 sm:pb-20">
      <div className="absolute inset-0">
        {video ? (
          <ExternalVideo
            autoplay
            loadingLabel={labels.loadingVideo}
            muted
            playLabel={labels.playVideo}
            poster={project.videoPoster ?? project.coverImage}
            priority
            unavailableLabel={labels.videoUnavailable}
            url={project.externalVideoURL}
          />
        ) : (
          <PayloadImage
            fill
            className="object-cover"
            fallbackClassName="h-full w-full"
            media={project.heroImage ?? project.coverImage}
            preferredSize="large"
            priority
            sizes="100vw"
          />
        )}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,10,10,0.2)_0%,rgba(10,10,10,0.42)_45%,rgba(10,10,10,0.96)_100%)]" />
      </div>
      <Container className="relative z-10">
        <p className="section-eyebrow">
          {categoryTitle(project.primaryCategory) ?? project.year ?? ''}
        </p>
        <h1 className="max-w-[15ch] font-heading text-[clamp(3rem,8vw,8rem)] leading-[0.9] font-bold tracking-[-0.06em] text-balance uppercase">
          {project.title}
        </h1>
        {project.subtitle ? (
          <p className="mt-5 max-w-3xl text-lg leading-8 text-white/78 sm:text-xl">
            {project.subtitle}
          </p>
        ) : null}
        <p className="mt-5 max-w-2xl text-base leading-7 text-white/70 sm:text-lg">
          {project.shortDescription}
        </p>
      </Container>
    </section>
  )
}
