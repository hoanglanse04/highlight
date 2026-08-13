import type { Payload } from 'payload'

import type { Media } from '@/payload-types'

import type { CategorySeedDefinition, HeroMedia } from './data'
import type { SeedConfig } from './env'

export type ResolvedSeedMedia = {
  aboutMediaIDs: number[]
  categoryCoverIDs: Map<string, number>
  heroMedia: HeroMedia
}

type MissingAssetReporter = (message: string) => void

function isImageMedia(media: Media | null | undefined): media is Media {
  return Boolean(media?.mimeType?.startsWith('image/'))
}

async function resolveMediaByID(
  payload: Payload,
  id: number | undefined,
  label: string,
  reportMissing: MissingAssetReporter,
): Promise<Media | null> {
  if (!id) return null

  try {
    const media = await payload.findByID({
      collection: 'media',
      depth: 0,
      id,
      overrideAccess: true,
    })

    if (!isImageMedia(media)) {
      reportMissing(`${label}: Media ID ${id} không phải ảnh hợp lệ.`)
      return null
    }

    return media
  } catch {
    reportMissing(`${label}: không tìm thấy Media ID ${id}.`)
    return null
  }
}

function escapeRegularExpression(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function isExactCategoryCover(
  media: Media,
  definition: CategorySeedDefinition,
): boolean {
  const normalizedTitle = media.internalTitle?.trim().toLowerCase()
  const expectedTitles = new Set([
    `category ${definition.slug}`,
    `highlight category ${definition.slug}`,
    `highlight-category-${definition.slug}`,
  ])

  if (normalizedTitle && expectedTitles.has(normalizedTitle)) return true

  const filename = media.filename?.toLowerCase()
  if (!filename) return false
  const basename = filename.replace(/\.[a-z0-9]+$/i, '')
  return new RegExp(
    `^${escapeRegularExpression(definition.slug)}-cover(?:-[a-f0-9]{8})?$`,
  ).test(basename)
}

export async function resolveSeedMedia(
  payload: Payload,
  config: SeedConfig,
  categoryDefinitions: CategorySeedDefinition[],
  reportMissing: MissingAssetReporter,
): Promise<ResolvedSeedMedia> {
  const mediaResult = await payload.find({
    collection: 'media',
    depth: 0,
    limit: 100,
    overrideAccess: true,
    pagination: false,
    sort: 'createdAt',
    where: {
      or: [
        {
          folder: {
            equals: 'homepage',
          },
        },
        {
          folder: {
            equals: 'projects',
          },
        },
      ],
    },
  })
  const imageMedia = mediaResult.docs.filter(isImageMedia)
  const homepageMedia = imageMedia.filter((media) => media.folder === 'homepage')
  const projectMedia = imageMedia.filter((media) => media.folder === 'projects')
  const aboutMediaIDs = [...homepageMedia, ...projectMedia]
    .map((media) => media.id)
    .filter((id, index, ids) => ids.indexOf(id) === index)
    .slice(0, 8)
  const heroImage = await resolveMediaByID(
    payload,
    config.HIGHLIGHT_HERO_MEDIA_ID,
    'Hero image',
    reportMissing,
  )
  const heroPoster = await resolveMediaByID(
    payload,
    config.HIGHLIGHT_HERO_POSTER_MEDIA_ID,
    'Hero poster',
    reportMissing,
  )

  let heroMedia: HeroMedia = null

  if (config.HIGHLIGHT_HERO_VIDEO_URL && heroPoster) {
    heroMedia = {
      posterID: heroPoster.id,
      type: 'externalVideo',
      videoURL: config.HIGHLIGHT_HERO_VIDEO_URL,
    }
  } else if (heroImage) {
    heroMedia = {
      imageID: heroImage.id,
      type: 'image',
    }
  } else {
    reportMissing(
      'Homepage Hero: cần HIGHLIGHT_HERO_MEDIA_ID hoặc HIGHLIGHT_HERO_VIDEO_URL kèm HIGHLIGHT_HERO_POSTER_MEDIA_ID.',
    )
  }

  if (config.HIGHLIGHT_HERO_VIDEO_URL && !heroPoster) {
    reportMissing(
      'Homepage Hero video: URL đã có nhưng thiếu poster Media hợp lệ; seeder không dùng video này để publish.',
    )
  }

  if (aboutMediaIDs.length === 0) {
    reportMissing(
      'About gallery: chưa có ảnh trong Media folder homepage hoặc projects.',
    )
  }

  const categoryCoverIDs = new Map<string, number>()

  for (const definition of categoryDefinitions) {
    const cover = projectMedia.find((media) =>
      isExactCategoryCover(media, definition),
    )

    if (cover) {
      categoryCoverIDs.set(definition.slug, cover.id)
    } else {
      reportMissing(
        `Category ${definition.slug}: thiếu Media có internalTitle "Highlight category ${definition.slug}" hoặc filename "${definition.slug}-cover-<8hex>.<ext>".`,
      )
    }
  }

  return {
    aboutMediaIDs,
    categoryCoverIDs,
    heroMedia,
  }
}

