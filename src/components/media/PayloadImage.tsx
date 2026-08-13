import Image, { type ImageProps } from 'next/image'

import { getMediaResource, type PayloadImageSize } from '@/lib/media'
import type { Media } from '@/payload-types'

type PayloadImageProps = {
  decorative?: boolean
  fallbackClassName?: string
  media?: Media | number | null
  preferredSize?: PayloadImageSize
} & Omit<ImageProps, 'alt' | 'height' | 'src' | 'width'> & {
    alt?: string
  }

export function PayloadImage({
  alt,
  decorative = false,
  fallbackClassName = '',
  fill,
  media,
  preferredSize = 'original',
  ...props
}: PayloadImageProps) {
  const resource = getMediaResource(media, preferredSize)

  if (!resource) {
    return (
      <span
        aria-hidden="true"
        className={`block bg-surface-elevated ${fallbackClassName}`}
      />
    )
  }

  const imageAlt = decorative ? '' : (alt ?? resource.alt)

  return fill ? (
    <Image {...props} alt={imageAlt} fill src={resource.src} />
  ) : (
    <Image
      {...props}
      alt={imageAlt}
      height={resource.height}
      src={resource.src}
      width={resource.width}
    />
  )
}
