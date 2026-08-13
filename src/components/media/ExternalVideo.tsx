'use client'

import { useEffect, useMemo, useRef, useState } from 'react'

import { PayloadImage } from '@/components/media/PayloadImage'
import { detectExternalVideo } from '@/lib/media/video'
import type { Media } from '@/payload-types'

type ExternalVideoProps = {
  autoplay?: boolean
  controls?: boolean
  loadingLabel: string
  loop?: boolean
  muted?: boolean
  playLabel: string
  poster?: Media | number | null
  priority?: boolean
  unavailableLabel: string
  url?: string | null
}

export function ExternalVideo({
  autoplay = true,
  controls = false,
  loadingLabel,
  loop = true,
  muted = true,
  playLabel,
  poster,
  priority = false,
  unavailableLabel,
  url,
}: ExternalVideoProps) {
  const source = useMemo(() => detectExternalVideo(url), [url])
  const [active, setActive] = useState(false)
  const [failed, setFailed] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!source || !rootRef.current) return
    if (source.kind !== 'direct' && !autoplay) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setActive(true)
          observer.disconnect()
        }
      },
      { rootMargin: '200px' },
    )

    observer.observe(rootRef.current)
    return () => observer.disconnect()
  }, [autoplay, source])

  return (
    <div
      ref={rootRef}
      className="absolute inset-0 overflow-hidden bg-background"
    >
      <PayloadImage
        fill
        media={poster}
        preferredSize="large"
        priority={priority}
        sizes="100vw"
        className="object-cover"
        fallbackClassName="h-full w-full"
      />

      {source?.kind === 'direct' && active && !failed ? (
        <video
          aria-label={playLabel}
          autoPlay={autoplay}
          className="absolute inset-0 h-full w-full object-cover"
          controls={controls}
          loop={loop}
          muted={muted}
          onError={() => setFailed(true)}
          playsInline
          preload="metadata"
          src={source.url}
        />
      ) : null}

      {(source?.kind === 'youtube' || source?.kind === 'vimeo') && active ? (
        <iframe
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 h-full w-full border-0"
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          src={source.embedURL}
          title={playLabel}
        />
      ) : null}

      {(source?.kind === 'youtube' || source?.kind === 'vimeo') && !active ? (
        <button
          aria-label={playLabel}
          className="video-play-button"
          onClick={() => setActive(true)}
          type="button"
        >
          <span
            aria-hidden="true"
            className="ml-1 block h-0 w-0 border-y-[10px] border-y-transparent border-l-[16px] border-l-current"
          />
          <span className="sr-only">{loadingLabel}</span>
        </button>
      ) : null}

      {!source || failed ? (
        <p className="absolute right-5 bottom-5 rounded-full bg-background/80 px-4 py-2 text-xs text-muted backdrop-blur">
          {unavailableLabel}
        </p>
      ) : null}
    </div>
  )
}
