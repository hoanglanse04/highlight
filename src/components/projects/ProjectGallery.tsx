import { PayloadImage } from '@/components/media/PayloadImage'
import { getEnabledItems } from '@/lib/content/homepage'
import { isMedia } from '@/lib/media'
import type { PublicProject } from '@/lib/payload/projects'

export function ProjectGallery({
  project,
  title,
}: {
  project: PublicProject
  title: string
}) {
  const images = getEnabledItems(project.gallery).filter((item) => isMedia(item.image))
  if (!images.length) return null

  return (
    <section
      aria-label={title}
      className="project-block mx-auto max-w-[100rem] px-5 sm:px-8 lg:px-12"
    >
      <h2 className="font-heading text-3xl font-semibold tracking-[-0.04em] sm:text-5xl">
        {title}
      </h2>
      <div className="mt-8 grid gap-5 md:grid-cols-2">
        {images.map((item, index) => (
          <figure
            className={index % 3 === 0 ? 'md:col-span-2' : ''}
            key={item.id ?? (typeof item.image === 'object' ? item.image.id : String(item.image))}
          >
            <div
              className={`relative overflow-hidden bg-surface ${
                index % 3 === 0 ? 'aspect-[16/8]' : 'aspect-[4/3]'
              }`}
            >
              <PayloadImage
                fill
                className="object-cover"
                media={item.image}
                preferredSize={index % 3 === 0 ? 'large' : 'medium'}
                sizes={index % 3 === 0 ? '100vw' : '(max-width: 767px) 100vw, 50vw'}
              />
            </div>
            {item.caption || item.credit ? (
              <figcaption className="mt-3 flex flex-wrap justify-between gap-2 text-xs leading-5 text-muted">
                <span>{item.caption}</span>
                {item.credit ? <span>© {item.credit}</span> : null}
              </figcaption>
            ) : null}
          </figure>
        ))}
      </div>
    </section>
  )
}
