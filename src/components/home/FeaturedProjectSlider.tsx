'use client'

import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import Image from 'next/image'
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

function LiveTimecode({ isInView }: { isInView: boolean }) {
  const [timecode, setTimecode] = useState('00:24:18:12')
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    if (reducedMotion || !isInView) return
    let frame = 12
    let sec = 18
    const timer = window.setInterval(() => {
      frame = (frame + 1) % 24
      if (frame === 0) sec = (sec + 1) % 60
      setTimecode(
        `00:24:${String(sec).padStart(2, '0')}:${String(frame).padStart(2, '0')}`,
      )
    }, 1000 / 24)
    return () => window.clearInterval(timer)
  }, [reducedMotion, isInView])

  return (
    <span className="font-mono text-[0.68rem] text-white/70 tabular-nums">
      {timecode}
    </span>
  )
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
  const containerRef = useRef<HTMLDivElement>(null)
  const thumbnailListRef = useRef<HTMLDivElement>(null)

  const [activeIndex, setActiveIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const [isInView, setIsInView] = useState(true)
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

  // Pause when out of viewport, resume when in viewport
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting)
      },
      { threshold: 0.2 },
    )

    observer.observe(container)
    return () => observer.disconnect()
  }, [])

  // Auto-advance every 8s (gentle & relaxed, paused when hovered, out of view, or reduced motion)
  useEffect(() => {
    if (projects.length < 2 || isHovered || !isInView || reducedMotion) return

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % projects.length)
    }, 8000)

    return () => window.clearInterval(timer)
  }, [projects.length, isHovered, isInView, reducedMotion])

  // Smooth scroll thumbnail strip when activeIndex changes
  useEffect(() => {
    const list = thumbnailListRef.current
    if (!list) return
    const activeThumb = list.children[activeIndex] as HTMLElement | undefined
    if (activeThumb) {
      activeThumb.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      })
    }
  }, [activeIndex])

  const goTo = (index: number) => {
    if (projects.length < 2) return
    const normalized = (index + projects.length) % projects.length
    setActiveIndex(normalized)
  }

  const activeProject = projects[activeIndex] ?? projects[0]
  if (!activeProject) return null

  const activeCategory = categoryTitle(activeProject.primaryCategory)
  const activeVideo =
    detectExternalVideo(activeProject.hoverPreviewVideoURL) ??
    detectExternalVideo(activeProject.externalVideoURL)
  const previewActive =
    hoverCapable && !reducedMotion && isHovered && Boolean(activeVideo)

  return (
    <div
      aria-label={labels.carousel}
      aria-roledescription="carousel"
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      ref={containerRef}
      role="region"
    >
      <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-12 lg:gap-8">
        {/* ── LEFT COLUMN: Cinema Camera Projector Rig ── */}
        <div className="cinematic-camera-stage flex flex-col justify-between lg:col-span-5 xl:col-span-5">
          {/* Top Camera Status Header */}
          <div className="relative z-10 flex items-center justify-between border-b border-white/10 bg-black/50 p-4 backdrop-blur-md">
            <div className="flex items-center gap-2.5">
              <span className="tally-rec-pulse h-2.5 w-2.5 rounded-full bg-red-500 shadow-[0_0_10px_#ef4444]" />
              <span className="font-mono text-[0.7rem] font-bold tracking-widest text-white/90 uppercase">
                REC ● LIVE
              </span>
              <LiveTimecode isInView={isInView} />
            </div>

            {/* Live Audio Equalizer Meter */}
            <div className="flex items-center gap-2">
              <div className="flex h-3.5 items-end gap-[2px]">
                <span
                  className="vu-bar"
                  style={{ animationDelay: '0.1s', animationDuration: '0.9s' }}
                />
                <span
                  className="vu-bar"
                  style={{ animationDelay: '0.35s', animationDuration: '1.2s' }}
                />
                <span
                  className="vu-bar"
                  style={{ animationDelay: '0.05s', animationDuration: '0.75s' }}
                />
                <span
                  className="vu-bar"
                  style={{ animationDelay: '0.45s', animationDuration: '1.1s' }}
                />
                <span
                  className="vu-bar"
                  style={{ animationDelay: '0.2s', animationDuration: '1.0s' }}
                />
              </div>
              <span className="font-mono text-[0.65rem] font-bold tracking-wider text-brand uppercase">
                ARRI 4K
              </span>
            </div>
          </div>

          {/* Center: Dynamic Cinema Camera with Gimbal Floating & Projector Beam */}
          <div className="group relative aspect-[3/4] w-full flex-1 overflow-hidden sm:min-h-[22rem] lg:min-h-[28rem]">
            {/* Animated Gimbal Floating Rig */}
            <div className="camera-gimbal-float relative h-full w-full">
              <Image
                alt="Cinema Camera Projector Rig"
                className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 40vw"
                src="/images/cinema-camera-projection.jpg"
              />
            </div>

            {/* Volumetric projector beam overlay */}
            <div className="projector-beam-overlay" />

            {/* Viewfinder crosshairs */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-40">
              <div className="relative h-16 w-16">
                <span className="absolute top-0 left-1/2 h-3 w-px -translate-x-1/2 bg-white" />
                <span className="absolute bottom-0 left-1/2 h-3 w-px -translate-x-1/2 bg-white" />
                <span className="absolute top-1/2 left-0 h-px w-3 -translate-y-1/2 bg-white" />
                <span className="absolute top-1/2 right-0 h-px w-3 -translate-y-1/2 bg-white" />
                <div className="h-full w-full rounded-full border border-dashed border-white/60" />
              </div>
            </div>

            {/* Camera Viewfinder Corner Marks */}
            <span className="cinematic-corner-mark top-3 left-3 border-t-2 border-l-2 border-white/70" />
            <span className="cinematic-corner-mark top-3 right-3 border-t-2 border-r-2 border-white/70" />
            <span className="cinematic-corner-mark bottom-3 left-3 border-b-2 border-l-2 border-white/70" />
            <span className="cinematic-corner-mark bottom-3 right-3 border-b-2 border-r-2 border-white/70" />
          </div>

          {/* Bottom Live Film Slate & Frame Selector */}
          <div className="relative z-10 border-t border-white/10 bg-black/60 p-4 backdrop-blur-md">
            <div className="flex items-center justify-between font-mono text-[0.65rem] text-white/60 uppercase">
              <span className="font-semibold text-white/90">
                SCENE 0{activeIndex + 1} / 0{projects.length}
              </span>
              <span className="text-brand">65mm T2.3 // ANAMORPHIC</span>
            </div>

            <p className="mt-1 truncate font-heading text-xs font-bold tracking-wide text-white uppercase">
              {activeProject.title}
            </p>

            {/* Quick Film Strip Thumbnail Selector */}
            {projects.length > 1 ? (
              <div
                className="mt-3 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none"
                ref={thumbnailListRef}
              >
                {projects.map((proj, idx) => (
                  <button
                    aria-label={`Select ${proj.title}`}
                    className={`group relative h-10 w-14 shrink-0 overflow-hidden rounded-[4px] border transition-all duration-300 ${activeIndex === idx
                        ? 'scale-105 border-brand ring-2 ring-brand/50 shadow-[0_0_10px_rgba(255,92,0,0.5)]'
                        : 'border-white/20 opacity-50 hover:opacity-100'
                      }`}
                    key={proj.id}
                    onClick={() => goTo(idx)}
                    type="button"
                  >
                    <PayloadImage
                      fill
                      className="object-cover"
                      fallbackClassName="h-full w-full bg-surface"
                      media={proj.coverImage ?? proj.posterImage}
                      preferredSize="thumbnail"
                      sizes="60px"
                    />
                    <span className="absolute right-0.5 bottom-0.5 rounded bg-black/70 px-1 font-mono text-[0.55rem] font-bold text-white">
                      0{idx + 1}
                    </span>
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        </div>

        {/* ── RIGHT COLUMN: Video Screen with Motion AnimatePresence ── */}
        <div className="flex flex-col justify-between lg:col-span-7 xl:col-span-7">
          {/* Top Counter and Arrow Navigation */}
          <div className="mb-4 flex items-center justify-between gap-5">
            <div className="flex items-center gap-3">
              <span className="cinematic-film-badge">
                <span className="cinematic-film-badge-dot" />
                <span>CINEMA PROJECTION SCREEN</span>
              </span>
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
            </div>

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

          {/* Cinema Screen Frame Container with AnimatePresence */}
          <div className="cinema-screen-card relative flex h-full min-h-[32rem] flex-1 flex-col overflow-hidden sm:min-h-[38rem] lg:min-h-[42rem]">
            <div className="cinema-screen-glow" />

            <AnimatePresence initial={false} mode="wait">
              <motion.div
                animate={{ opacity: 1, scale: 1 }}
                className="absolute inset-0 flex h-full w-full flex-col justify-end"
                exit={reducedMotion ? undefined : { opacity: 0, scale: 0.98 }}
                initial={reducedMotion ? false : { opacity: 0, scale: 1.02 }}
                key={activeProject.id}
                transition={{
                  duration: reducedMotion ? 0 : 0.7,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <article
                  aria-label={`${labels.slide} ${activeIndex + 1}: ${activeProject.title}`}
                  className="group relative flex h-full w-full flex-col justify-end overflow-hidden bg-surface"
                  role="group"
                >
                  {isSafeProjectSlug(activeProject.slug) ? (
                    <Link
                      className="absolute inset-0 z-0 block focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand"
                      href={getProjectPath(locale, activeProject.slug)}
                    >
                      <PayloadImage
                        fill
                        className={`object-cover transition-[transform,opacity] duration-700 ${previewActive
                            ? 'scale-[1.02] opacity-0'
                            : 'scale-100 opacity-100 group-hover:scale-[1.025]'
                          }`}
                        fallbackClassName="h-full w-full"
                        media={
                          activeProject.posterImage ??
                          activeProject.videoPoster ??
                          activeProject.coverImage
                        }
                        preferredSize="large"
                        priority
                        sizes="(max-width: 1024px) 100vw, 60vw"
                      />
                    </Link>
                  ) : (
                    <PayloadImage
                      fill
                      className={`object-cover transition-[transform,opacity] duration-700 ${previewActive
                          ? 'scale-[1.02] opacity-0'
                          : 'scale-100 opacity-100 group-hover:scale-[1.025]'
                        }`}
                      fallbackClassName="h-full w-full"
                      media={
                        activeProject.posterImage ??
                        activeProject.videoPoster ??
                        activeProject.coverImage
                      }
                      preferredSize="large"
                      priority
                      sizes="(max-width: 1024px) 100vw, 60vw"
                    />
                  )}

                  {/* Video Playback on hover */}
                  {previewActive && activeVideo?.kind === 'direct' ? (
                    <video
                      aria-hidden="true"
                      autoPlay
                      className="pointer-events-none absolute inset-0 h-full w-full object-cover"
                      loop
                      muted
                      playsInline
                      preload="metadata"
                      src={activeVideo.url}
                    />
                  ) : null}

                  {previewActive &&
                    (activeVideo?.kind === 'youtube' ||
                      activeVideo?.kind === 'vimeo') ? (
                    <iframe
                      allow="autoplay; encrypted-media"
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 h-full w-full scale-[1.01] border-0"
                      src={activeVideo.embedURL}
                      tabIndex={-1}
                      title=""
                    />
                  ) : null}

                  <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(5,5,5,0.08)_0%,rgba(5,5,5,0.18)_40%,rgba(5,5,5,0.94)_100%)]" />
                  <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(5,5,5,0.5)_0%,transparent_60%)]" />

                  <div className="pointer-events-none relative z-10 p-5 sm:p-7 lg:p-10">
                    <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-[0.68rem] font-bold tracking-[0.16em] text-white/70 uppercase">
                      {activeCategory ? (
                        <span className="text-brand">{activeCategory}</span>
                      ) : null}
                      {activeProject.clientName ? (
                        <span>{activeProject.clientName}</span>
                      ) : null}
                      {activeProject.year ? (
                        <span>{activeProject.year}</span>
                      ) : null}
                      {activeVideo ? (
                        <span className="inline-flex items-center gap-2 text-white/90">
                          <span
                            aria-hidden="true"
                            className={`h-1.5 w-1.5 rounded-full ${previewActive
                                ? 'animate-pulse bg-brand'
                                : 'bg-white/60'
                              }`}
                          />
                          {videoLabel}
                        </span>
                      ) : null}
                    </div>

                    <h3 className="max-w-[19ch] font-heading text-[clamp(1.75rem,3vw,3.25rem)] leading-[1.15] font-bold tracking-[-0.025em] text-balance uppercase">
                      {activeProject.title}
                    </h3>
                    {activeProject.shortDescription ? (
                      <p className="mt-4 line-clamp-2 max-w-2xl text-sm leading-6 text-white/75 sm:text-base">
                        {activeProject.shortDescription}
                      </p>
                    ) : null}
                    <span className="pointer-events-auto mt-6 inline-flex items-center gap-3 text-xs font-bold tracking-[0.16em] text-white uppercase">
                      {viewLabel}
                      <span
                        aria-hidden="true"
                        className="grid h-10 w-10 place-items-center rounded-full border border-white/40 transition-[transform,background-color,border-color,color] duration-300 group-hover:rotate-45 group-hover:border-brand group-hover:bg-brand"
                      >
                        ↗
                      </span>
                    </span>
                  </div>
                </article>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Bottom Progress Bars with 8s smooth fill */}
          {projects.length > 1 ? (
            <div className="mt-4 flex gap-1.5" role="tablist">
              {projects.map((project, index) => (
                <button
                  aria-label={`${labels.slide} ${index + 1}: ${project.title}`}
                  aria-selected={activeIndex === index}
                  className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-white/15 transition-all hover:bg-white/30"
                  key={project.id}
                  onClick={() => goTo(index)}
                  role="tab"
                  type="button"
                >
                  {activeIndex === index ? (
                    <span
                      className="absolute inset-y-0 left-0 bg-brand shadow-[0_0_8px_rgba(255,92,0,0.8)]"
                      style={{
                        animation:
                          !reducedMotion && !isHovered && isInView
                            ? 'slideProgressFill 8s linear infinite'
                            : 'none',
                        width:
                          isHovered || !isInView || reducedMotion
                            ? '100%'
                            : undefined,
                      }}
                    />
                  ) : (
                    <span
                      className={`absolute inset-y-0 left-0 transition-all ${index < activeIndex ? 'w-full bg-white/40' : 'w-0'
                        }`}
                    />
                  )}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
