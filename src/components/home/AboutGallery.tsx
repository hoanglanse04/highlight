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
    return <div className="h-[36rem] bg-surface lg:h-[60rem]" />
  }

  return (
    <div>
      <div className="relative h-[36rem] overflow-hidden sm:h-[46rem] lg:h-[60rem]">
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className={`absolute inset-0 grid gap-2 ${
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
                className="relative min-h-0 overflow-hidden bg-surface"
                key={`${relationID(image)}-${index}`}
              >
                <PayloadImage
                  fill
                  className="object-cover transition-transform duration-700 hover:scale-[1.025]"
                  fallbackClassName="h-full w-full"
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
        <div className="mt-5 flex justify-center gap-2">
          {Array.from({ length: groupCount }, (_, index) => (
            <button
              aria-label={`Gallery ${index + 1}`}
              aria-pressed={groupIndex === index}
              className={`h-2.5 w-2.5 rounded-full transition-colors ${
                groupIndex === index ? 'bg-brand' : 'bg-white/30'
              }`}
              key={index}
              onClick={() => setGroupIndex(index)}
              type="button"
            />
          ))}
        </div>
      ) : null}
    </div>
  )
}
