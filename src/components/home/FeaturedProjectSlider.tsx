'use client'

import { useReducedMotion } from 'motion/react'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

import { PayloadImage } from '@/components/media/PayloadImage'
import { isSafeProjectSlug } from '@/fields/projectSlug'
import type { AppLocale } from '@/i18n/routing'
import { detectExternalVideo } from '@/lib/media/video'
import type { ProjectCard } from '@/lib/payload/projects'
import { getProjectPath } from '@/lib/projects/routes'
import type { ProjectCategory } from '@/payload-types'

function categoryTitle(
  value: number | ProjectCategory,
): string | null {
  return typeof value === 'object' ? value.title : null
}

export function FeaturedProjectSlider({
  locale,
  projects,
  videoLabel,
  viewLabel,
}: {
  locale: AppLocale
  projects: ProjectCard[]
  videoLabel: string
  viewLabel: string
}) {
  const viewportRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [hoverCapable, setHoverCapable] = useState(false)
  const reducedMotion = useReducedMotion()
  const labels =
    locale === 'vi'
      ? {
          carousel: 'Dự án nổi bật',
          next: 'Dự án tiếp theo',
          previous: 'Dự án trước',
          slide: 'Dự án',
        }
      : {
          carousel: 'Featured projects',
          next: 'Next project',
          previous: 'Previous project',
          slide: 'Project',
        }

  useEffect(() => {
    const query = window.matchMedia('(hover: hover) and (pointer: fine)')
    const update = () => setHoverCapable(query.matches)
    update()
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])

  const goTo = (index: number) => {
    const viewport = viewportRef.current
    if (!viewport || projects.length < 2) return
    const normalized = (index + projects.length) % projects.length
    viewport.scrollTo({
      behavior: reducedMotion ? 'auto' : 'smooth',
      left: normalized * viewport.clientWidth,
    })
    setActiveIndex(normalized)
    setHoveredIndex(null)
  }

  return (
    <div
      aria-label={labels.carousel}
      aria-roledescription="carousel"
      className="relative"
      role="region"
    >
      <div className="mb-5 flex items-center justify-between gap-5">
        <p
          aria-live="polite"
          className="font-heading text-sm font-semibold tracking-[0.14em] text-muted tabular-nums"
        >
          <span className="text-foreground">
            {String(activeIndex + 1).padStart(2, '0')}
          </span>
          <span className="mx-2 text-border">/</span>
          {String(projects.length).padStart(2, '0')}
        </p>

        {projects.length > 1 ? (
          <div className="flex gap-2">
            <button
              aria-label={labels.previous}
              className="project-slider-arrow"
              onClick={() => goTo(activeIndex - 1)}
              type="button"
            >
              <span aria-hidden="true">←</span>
            </button>
            <button
              aria-label={labels.next}
              className="project-slider-arrow"
              onClick={() => goTo(activeIndex + 1)}
              type="button"
            >
              <span aria-hidden="true">→</span>
            </button>
          </div>
        ) : null}
      </div>

      <div
        className="project-slider flex snap-x snap-mandatory overflow-x-auto"
        onScroll={(event) => {
          const viewport = event.currentTarget
          const index = Math.round(viewport.scrollLeft / viewport.clientWidth)
          setActiveIndex(Math.min(Math.max(index, 0), projects.length - 1))
        }}
        ref={viewportRef}
      >
        {projects.map((project, index) => {
          const category = categoryTitle(project.primaryCategory)
          const video =
            detectExternalVideo(project.hoverPreviewVideoURL) ??
            detectExternalVideo(project.externalVideoURL)
          const previewActive =
            hoverCapable &&
            !reducedMotion &&
            hoveredIndex === index &&
            Boolean(video)
          const card = (
            <article
              aria-label={`${labels.slide} ${index + 1}: ${project.title}`}
              aria-roledescription="slide"
              className="group relative min-h-[34rem] overflow-hidden bg-surface sm:min-h-[40rem] lg:min-h-[44rem]"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              role="group"
            >
              <PayloadImage
                fill
                className={`object-cover transition-[transform,opacity] duration-700 ${
                  previewActive
                    ? 'scale-[1.02] opacity-0'
                    : 'scale-100 opacity-100 group-hover:scale-[1.025]'
                }`}
                fallbackClassName="h-full w-full"
                media={
                  project.posterImage ??
                  project.videoPoster ??
                  project.coverImage
                }
                preferredSize="large"
                priority={index === 0}
                sizes="(max-width: 1024px) 100vw, 92vw"
              />

              {previewActive && video?.kind === 'direct' ? (
                <video
                  aria-hidden="true"
                  autoPlay
                  className="pointer-events-none absolute inset-0 h-full w-full object-cover"
                  loop
                  muted
                  playsInline
                  preload="metadata"
                  src={video.url}
                />
              ) : null}

              {previewActive &&
              (video?.kind === 'youtube' || video?.kind === 'vimeo') ? (
                <iframe
                  allow="autoplay; encrypted-media"
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 h-full w-full scale-[1.01] border-0"
                  src={video.embedURL}
                  tabIndex={-1}
                  title=""
                />
              ) : null}

              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(5,5,5,0.12)_0%,rgba(5,5,5,0.06)_42%,rgba(5,5,5,0.92)_100%)]" />
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(5,5,5,0.58)_0%,transparent_58%)]" />

              <div className="absolute inset-x-0 bottom-0 p-5 sm:p-8 lg:p-12">
                <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-[0.68rem] font-bold tracking-[0.16em] text-white/65 uppercase">
                  {category ? <span className="text-brand">{category}</span> : null}
                  {project.clientName ? <span>{project.clientName}</span> : null}
                  {project.artistName ? <span>{project.artistName}</span> : null}
                  {project.year ? <span>{project.year}</span> : null}
                  {video ? (
                    <span className="inline-flex items-center gap-2">
                      <span
                        aria-hidden="true"
                        className={`h-1.5 w-1.5 rounded-full ${
                          previewActive ? 'animate-pulse bg-brand' : 'bg-white/55'
                        }`}
                      />
                      {videoLabel}
                    </span>
                  ) : null}
                </div>

                <h3 className="max-w-[19ch] font-heading text-[clamp(2rem,3.5vw,4rem)] leading-[1.12] font-semibold tracking-[-0.025em] text-balance uppercase">
                  {project.title}
                </h3>
                {project.shortDescription ? (
                  <p className="mt-5 max-w-2xl text-sm leading-6 text-white/70 sm:text-base sm:leading-7">
                    {project.shortDescription}
                  </p>
                ) : null}
                <span className="mt-7 inline-flex items-center gap-4 text-xs font-bold tracking-[0.16em] uppercase">
                  {viewLabel}
                  <span
                    aria-hidden="true"
                    className="grid h-11 w-11 place-items-center rounded-full border border-white/40 transition-[transform,background-color,border-color,color] duration-300 group-hover:rotate-45 group-hover:border-brand group-hover:bg-brand"
                  >
                    ↗
                  </span>
                </span>
              </div>
            </article>
          )

          return (
            <div
              className="min-w-full snap-start"
              key={project.id}
            >
              {isSafeProjectSlug(project.slug) ? (
                <Link
                  className="block focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand"
                  href={getProjectPath(locale, project.slug)}
                >
                  {card}
                </Link>
              ) : (
                card
              )}
            </div>
          )
        })}
      </div>

      {projects.length > 1 ? (
        <div className="mt-5 flex gap-1.5" role="tablist">
          {projects.map((project, index) => (
            <button
              aria-label={`${labels.slide} ${index + 1}: ${project.title}`}
              aria-selected={activeIndex === index}
              className={`h-1 flex-1 transition-colors ${
                activeIndex === index ? 'bg-brand' : 'bg-border'
              }`}
              key={project.id}
              onClick={() => goTo(index)}
              role="tab"
              type="button"
            />
          ))}
        </div>
      ) : null}
    </div>
  )
}
