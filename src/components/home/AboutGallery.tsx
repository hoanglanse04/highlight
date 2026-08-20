'use client'

import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useEffect, useMemo, useState } from 'react'

import { PayloadImage } from '@/components/media/PayloadImage'
import type { Media } from '@/payload-types'

function relationID(media: Media | number): string {
  return String(typeof media === 'object' ? media.id : media)
}

export function AboutGallery({
  images,
}: {
  images: Array<Media | number>
}) {
  const reducedMotion = useReducedMotion()
  const [groupIndex, setGroupIndex] = useState(0)
  const groupCount = images.length > 3 ? Math.ceil(images.length / 3) : 1
  const visibleImages = useMemo(() => {
    if (images.length <= 3) return images
    const start = groupIndex * 3
    return Array.from(
      { length: 3 },
      (_, offset) => images[(start + offset) % images.length],
    ).filter((image): image is Media | number => image !== undefined)
  }, [groupIndex, images])

  useEffect(() => {
    if (groupCount <= 1 || reducedMotion) return
    const timer = window.setInterval(
      () => setGroupIndex((current) => (current + 1) % groupCount),
      5200,
    )
    return () => window.clearInterval(timer)
  }, [groupCount, reducedMotion])

  if (!images.length) {
    return <div className="h-[36rem] rounded-xl bg-surface lg:h-[60rem]" />
  }

  return (
    <div className="cinematic-gallery-container">
      {/* Top Film Status Bar */}
      <div className="mb-2 flex items-center justify-between px-2 py-1 text-[0.65rem] font-bold tracking-widest text-white/60 uppercase">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-red-500 shadow-[0_0_8px_#ef4444] animate-pulse" />
          <span className="font-mono text-white/90">REC 00:24:18:02</span>
        </div>
        <span className="font-mono text-white/50">{'4K DCI // 24.00 FPS'}</span>
      </div>

      <div className="relative h-[36rem] overflow-hidden rounded-lg sm:h-[46rem] lg:h-[58rem]">
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className={`absolute inset-0 grid gap-2.5 ${
              visibleImages.length === 1
                ? 'grid-rows-1'
                : visibleImages.length === 2
                  ? 'grid-rows-2'
                  : 'grid-rows-3'
            }`}
            exit={reducedMotion ? undefined : { opacity: 0, y: -12 }}
            initial={reducedMotion ? false : { opacity: 0, y: 12 }}
            key={groupIndex}
            transition={{ duration: reducedMotion ? 0 : 0.48 }}
          >
            {visibleImages.map((image, index) => (
              <div
                className="cinematic-image-wrapper group relative min-h-0 bg-surface shadow-inner"
                key={`${relationID(image)}-${index}`}
              >
                {/* Viewfinder corner crop marks */}
                <span className="cinematic-corner-mark top-2 left-2 border-t-2 border-l-2 border-white/60" />
                <span className="cinematic-corner-mark top-2 right-2 border-t-2 border-r-2 border-white/60" />
                <span className="cinematic-corner-mark bottom-2 left-2 border-b-2 border-l-2 border-white/60" />
                <span className="cinematic-corner-mark bottom-2 right-2 border-b-2 border-r-2 border-white/60" />

                {/* Scene badge overlay on hover */}
                <div className="absolute top-3 right-3 z-10 rounded bg-black/60 px-2 py-0.5 font-mono text-[0.625rem] font-bold text-white/80 opacity-0 backdrop-blur-md transition-opacity duration-300 group-hover:opacity-100">
                  {`SCENE 0${index + 1} // TAKE ${groupIndex + 1}`}
                </div>

                <PayloadImage
                  fill
                  className="object-cover transition-all duration-700 group-hover:scale-[1.035] group-hover:brightness-105"
                  fallbackClassName="h-full w-full bg-surface"
                  media={image}
                  preferredSize={visibleImages.length === 1 ? 'large' : 'medium'}
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {groupCount > 1 ? (
        <div className="mt-4 flex items-center justify-between px-2">
          <span className="text-[0.65rem] font-mono tracking-wider text-white/50 uppercase">
            FRAME {groupIndex + 1} OF {groupCount}
          </span>
          <div className="flex gap-2">
            {Array.from({ length: groupCount }, (_, index) => (
              <button
                aria-label={`Gallery frame ${index + 1}`}
                aria-pressed={groupIndex === index}
                className={`h-2 rounded-full transition-all ${
                  groupIndex === index
                    ? 'w-6 bg-brand shadow-[0_0_8px_rgba(255,92,0,0.6)]'
                    : 'w-2 bg-white/25 hover:bg-white/50'
                }`}
                key={index}
                onClick={() => setGroupIndex(index)}
                type="button"
              />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  )
}
