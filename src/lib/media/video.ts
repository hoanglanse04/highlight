import { resolveExternalURL } from '@/lib/urls'

export type ExternalVideoSource =
  | { embedURL: string; kind: 'vimeo' | 'youtube' }
  | { kind: 'direct'; url: string }

const SAFE_VIDEO_ID = /^[A-Za-z0-9_-]+$/

export function detectExternalVideo(
  value: string | null | undefined,
): ExternalVideoSource | null {
  const safeURL = resolveExternalURL(value)
  if (!safeURL) return null

  const url = new URL(safeURL)
  const hostname = url.hostname.toLowerCase().replace(/^www\./, '')

  if (
    hostname === 'youtu.be' ||
    hostname === 'youtube.com' ||
    hostname === 'm.youtube.com'
  ) {
    const pathParts = url.pathname.split('/').filter(Boolean)
    const id =
      hostname === 'youtu.be'
        ? pathParts[0]
        : (url.searchParams.get('v') ??
          (['embed', 'shorts'].includes(pathParts[0] ?? '')
            ? pathParts[1]
            : null))

    if (!id || !SAFE_VIDEO_ID.test(id)) return null

    return {
      embedURL: `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&mute=1&playsinline=1&rel=0`,
      kind: 'youtube',
    }
  }

  if (hostname === 'vimeo.com' || hostname === 'player.vimeo.com') {
    const id = url.pathname
      .split('/')
      .filter(Boolean)
      .reverse()
      .find((part: string) => /^\d+$/.test(part))
    if (!id) return null

    return {
      embedURL: `https://player.vimeo.com/video/${id}?autoplay=1&muted=1&playsinline=1`,
      kind: 'vimeo',
    }
  }

  if (/\.(?:mp4|webm)$/i.test(url.pathname)) {
    return { kind: 'direct', url: safeURL }
  }

  return null
}
