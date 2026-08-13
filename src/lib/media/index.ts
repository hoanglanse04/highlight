import type { Media } from '@/payload-types'

export type PayloadImageSize =
  | 'large'
  | 'medium'
  | 'original'
  | 'small'
  | 'thumbnail'

export type ResolvedMedia = {
  alt: string
  height: number
  src: string
  width: number
}

export function isMedia(
  value: Media | number | null | undefined,
): value is Media {
  return Boolean(value && typeof value === 'object' && 'id' in value)
}

function configuredOrigins(): Set<string> {
  const origins = new Set<string>()

  for (const value of [
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.NEXT_PUBLIC_SERVER_URL,
  ]) {
    if (!value) continue
    try {
      origins.add(new URL(value).origin)
    } catch {
      // Invalid deployment configuration is handled by returning no media URL.
    }
  }

  return origins
}

export function resolveMediaURL(
  value: string | null | undefined,
): string | null {
  if (!value) return null

  if (value.startsWith('/api/media/file/') && !value.includes('\\')) {
    return value
  }

  try {
    const parsed = new URL(value)
    if (!['http:', 'https:'].includes(parsed.protocol)) return null
    if (!configuredOrigins().has(parsed.origin)) return null
    if (!parsed.pathname.startsWith('/api/media/file/')) return null
    return `${parsed.pathname}${parsed.search}`
  } catch {
    return null
  }
}

export function getMediaResource(
  value: Media | number | null | undefined,
  preferredSize: PayloadImageSize = 'original',
): ResolvedMedia | null {
  if (!isMedia(value)) return null

  const size =
    preferredSize === 'original' ? undefined : value.sizes?.[preferredSize]
  const sourceURL = resolveMediaURL(size?.url) ?? resolveMediaURL(value.url)
  const width = size?.width ?? value.width
  const height = size?.height ?? value.height

  if (!sourceURL || !width || !height) return null

  return {
    alt: value.alt ?? '',
    height,
    src: sourceURL,
    width,
  }
}

export function absoluteMediaURL(
  value: Media | number | null | undefined,
  preferredSize: PayloadImageSize = 'large',
  baseURL = process.env.NEXT_PUBLIC_SITE_URL,
): string | null {
  const media = getMediaResource(value, preferredSize)
  if (!media || !baseURL) return null

  try {
    return new URL(media.src, baseURL).toString()
  } catch {
    return null
  }
}
