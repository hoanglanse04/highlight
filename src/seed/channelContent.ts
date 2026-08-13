import { mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'

import { getPayload, type Payload } from 'payload'

import configPromise from '@/payload.config'
import type {
  Footer,
  Header,
  Homepage,
  Media,
  Project,
  ProjectCategory,
  SiteSetting,
} from '@/payload-types'

type SeedLocale = 'en' | 'vi'

type ChannelProjectSeed = {
  categorySlug: 'events' | 'tvc-corporate'
  clientName: string
  date: string
  description: Record<SeedLocale, string>
  slug: string
  title: Record<SeedLocale, string>
  videoID: string
}

type CategorySeed = {
  description: Record<SeedLocale, string>
  displayOrder: number
  iconKey: 'corporate' | 'event'
  internalName: string
  slug: ChannelProjectSeed['categorySlug']
  title: Record<SeedLocale, string>
}

const YOUTUBE_CHANNEL_URL = 'https://www.youtube.com/@HighlightMediaFilm'
const FACEBOOK_PAGE_URL = 'https://www.facebook.com/Highlight.mediateam'
const MAX_REMOTE_IMAGE_BYTES = 15 * 1024 * 1024
const PROJECT_LIMIT = 8

const categorySeeds: CategorySeed[] = [
  {
    description: {
      en: 'Commercial and corporate films produced around a clear brand or business message.',
      vi: 'TVC và phim doanh nghiệp được sản xuất từ thông điệp thương hiệu hoặc mục tiêu kinh doanh rõ ràng.',
    },
    displayOrder: 10,
    iconKey: 'corporate',
    internalName: 'TVC & Corporate',
    slug: 'tvc-corporate',
    title: { en: 'TVC & Corporate', vi: 'TVC & Doanh nghiệp' },
  },
  {
    description: {
      en: 'Event films focused on people, atmosphere and the moments that define each experience.',
      vi: 'Phim sự kiện tập trung vào con người, không khí và những khoảnh khắc tạo nên trải nghiệm.',
    },
    displayOrder: 20,
    iconKey: 'event',
    internalName: 'Events',
    slug: 'events',
    title: { en: 'Events', vi: 'Sự kiện' },
  },
]

const channelProjects: ChannelProjectSeed[] = [
  {
    categorySlug: 'tvc-corporate',
    clientName: 'Đông Á Japan',
    date: '2024-08-16',
    description: {
      en: 'A corporate film produced by Highlight Media for Đông Á Japan.',
      vi: 'Phim doanh nghiệp do Highlight Media thực hiện cho Đông Á Japan.',
    },
    slug: 'tvc-dong-a-japan',
    title: {
      en: 'Đông Á Japan Corporate Film',
      vi: 'TVC Đông Á Japan',
    },
    videoID: 'AhMp0MzV-6g',
  },
  {
    categorySlug: 'tvc-corporate',
    clientName: 'Vietcombank',
    date: '2024-08-16',
    description: {
      en: 'A customer-experience film produced by Highlight Media for Vietcombank.',
      vi: 'Phim trải nghiệm khách hàng do Highlight Media thực hiện cho Vietcombank.',
    },
    slug: 'vietcombank-customer-experience',
    title: {
      en: 'Vietcombank Customer Experience',
      vi: 'Trải nghiệm khách hàng Vietcombank',
    },
    videoID: '8jgpDUiu1sc',
  },
  {
    categorySlug: 'tvc-corporate',
    clientName: 'SHB',
    date: '2024-03-19',
    description: {
      en: 'A recruitment film produced by Highlight Media for SHB Bank.',
      vi: 'Phim tuyển dụng do Highlight Media thực hiện cho Ngân hàng SHB.',
    },
    slug: 'shb-recruitment-film',
    title: {
      en: 'SHB Recruitment Film',
      vi: 'TVC tuyển dụng Ngân hàng SHB',
    },
    videoID: 'E2AEQlU4QLI',
  },
  {
    categorySlug: 'events',
    clientName: 'GELEX',
    date: '2024-03-19',
    description: {
      en: 'The 2023 GELEX year-end event film produced by Highlight Media.',
      vi: 'Phim sự kiện Year End Party 2023 của Tập đoàn GELEX do Highlight Media thực hiện.',
    },
    slug: 'gelex-year-end-party-2023',
    title: {
      en: 'GELEX 2023 Year-End Party',
      vi: 'Year End Party Tập đoàn GELEX 2023',
    },
    videoID: 'iciZRUDkcr0',
  },
  {
    categorySlug: 'events',
    clientName: 'Sisley Paris',
    date: '2024-02-27',
    description: {
      en: 'A grand-opening event film produced by Highlight Media for Sisley Paris.',
      vi: 'Phim sự kiện khai trương do Highlight Media thực hiện cho Sisley Paris.',
    },
    slug: 'sisley-paris-grand-opening',
    title: {
      en: 'Sisley Paris Grand Opening',
      vi: 'Khai trương Sisley Paris',
    },
    videoID: '-hZsdCaDykY',
  },
  {
    categorySlug: 'events',
    clientName: 'GELEX',
    date: '2024-01-11',
    description: {
      en: 'A leadership workshop film produced by Highlight Media for GELEX.',
      vi: 'Phim hội thảo lãnh đạo do Highlight Media thực hiện cho GELEX.',
    },
    slug: 'gelex-leadership-workshop',
    title: {
      en: 'GELEX Leadership Workshop',
      vi: 'GELEX — Hội thảo Lãnh đạo và Thách thức',
    },
    videoID: 'kUxfPu8cJPY',
  },
  {
    categorySlug: 'events',
    clientName: 'AEON Mall Hải Phòng',
    date: '2024-01-03',
    description: {
      en: 'A summer-decoration event film produced by Highlight Media for AEON Mall Hai Phong.',
      vi: 'Phim sự kiện Summer Decoration do Highlight Media thực hiện cho AEON Mall Hải Phòng.',
    },
    slug: 'aeon-mall-hai-phong-summer-decoration-2023',
    title: {
      en: 'AEON Mall Hai Phong Summer Decoration 2023',
      vi: 'Summer Decoration AEON Mall Hải Phòng 2023',
    },
    videoID: '0NOPY7H_p_c',
  },
  {
    categorySlug: 'tvc-corporate',
    clientName: 'Srithai Việt Nam',
    date: '2023-06-06',
    description: {
      en: 'A factory profile film produced by Highlight Media for Srithai Vietnam.',
      vi: 'Phim giới thiệu nhà máy do Highlight Media thực hiện cho Srithai Việt Nam.',
    },
    slug: 'srithai-vietnam-factory-film',
    title: {
      en: 'Srithai Vietnam Factory Film',
      vi: 'TVC Nhà máy nhựa Srithai Việt Nam',
    },
    videoID: 'tzUmjqSOD7M',
  },
]

function relationshipID(value: unknown): number | undefined {
  if (typeof value === 'number') return value
  if (
    value &&
    typeof value === 'object' &&
    'id' in value &&
    typeof value.id === 'number'
  ) {
    return value.id
  }
  return undefined
}

function youtubeVideoURL(videoID: string): string {
  return `https://www.youtube.com/watch?v=${videoID}`
}

function youtubeThumbnailURLs(videoID: string): string[] {
  return [
    `https://i.ytimg.com/vi/${videoID}/maxresdefault.jpg`,
    `https://i.ytimg.com/vi/${videoID}/hqdefault.jpg`,
  ]
}

async function findMediaByInternalTitle(
  payload: Payload,
  internalTitle: string,
): Promise<Media | null> {
  const result = await payload.find({
    collection: 'media',
    depth: 0,
    limit: 1,
    overrideAccess: true,
    where: {
      internalTitle: {
        equals: internalTitle,
      },
    },
  })

  return result.docs[0] ?? null
}

async function localizeMedia(
  payload: Payload,
  mediaID: number,
  alt: Record<SeedLocale, string>,
  caption?: Record<SeedLocale, string>,
): Promise<void> {
  for (const locale of ['vi', 'en'] as const) {
    await payload.update({
      collection: 'media',
      data: {
        alt: alt[locale],
        caption: caption?.[locale],
      },
      depth: 0,
      id: mediaID,
      locale,
      overrideAccess: true,
    })
  }
}

async function importImage({
  alt,
  caption,
  credit,
  filePath,
  folder,
  internalTitle,
  payload,
  tags,
  usageNotes,
}: {
  alt: Record<SeedLocale, string>
  caption?: Record<SeedLocale, string>
  credit: string
  filePath: string
  folder: 'general' | 'homepage' | 'projects'
  internalTitle: string
  payload: Payload
  tags: string[]
  usageNotes: string
}): Promise<Media> {
  const existing = await findMediaByInternalTitle(payload, internalTitle)

  if (existing) {
    await localizeMedia(payload, existing.id, alt, caption)
    return existing
  }

  const media = await payload.create({
    collection: 'media',
    data: {
      alt: alt.vi,
      caption: caption?.vi,
      credit,
      folder,
      internalTitle,
      tags: tags.map((tag) => ({ tag })),
      usageNotes,
    },
    depth: 0,
    filePath,
    locale: 'vi',
    overrideAccess: true,
  })

  await localizeMedia(payload, media.id, alt, caption)
  return media
}

async function downloadThumbnail(
  seed: ChannelProjectSeed,
  destination: string,
): Promise<string> {
  let lastError: Error | null = null

  for (const url of youtubeThumbnailURLs(seed.videoID)) {
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'HighlightMediaContentSeeder/1.0',
        },
        redirect: 'follow',
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      const contentType = response.headers.get('content-type')?.split(';')[0]
      if (contentType !== 'image/jpeg') {
        throw new Error(`MIME type không hợp lệ: ${contentType ?? 'unknown'}`)
      }

      const contentLength = Number(response.headers.get('content-length') ?? 0)
      if (contentLength > MAX_REMOTE_IMAGE_BYTES) {
        throw new Error('Ảnh thumbnail vượt giới hạn 15 MiB.')
      }

      const image = Buffer.from(await response.arrayBuffer())
      if (image.length === 0 || image.length > MAX_REMOTE_IMAGE_BYTES) {
        throw new Error('Kích thước ảnh thumbnail không hợp lệ.')
      }

      const filePath = path.join(destination, `${seed.slug}.jpg`)
      await writeFile(filePath, image, { mode: 0o600 })
      return filePath
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))
    }
  }

  throw new Error(
    `Không tải được thumbnail cho ${seed.slug}: ${lastError?.message ?? 'unknown error'}`,
  )
}

async function ensureProjectCategory(
  payload: Payload,
  seed: CategorySeed,
  coverImageID: number,
  heroVideoURL: string,
): Promise<ProjectCategory> {
  const existingResult = await payload.find({
    collection: 'project-categories',
    depth: 0,
    draft: true,
    fallbackLocale: false,
    limit: 1,
    locale: 'vi',
    overrideAccess: true,
    where: {
      slug: {
        equals: seed.slug,
      },
    },
  })
  const existing = existingResult.docs[0]
  const vietnameseData = {
    _status: 'published' as const,
    coverImage: coverImageID,
    displayOrder: seed.displayOrder,
    enabled: true,
    featured: true,
    heroImage: coverImageID,
    heroVideoURL,
    iconKey: seed.iconKey,
    internalName: seed.internalName,
    seo: {
      metaDescription: seed.description.vi,
      metaTitle: seed.title.vi,
      noIndex: false,
      ogImage: coverImageID,
    },
    shortDescription: seed.description.vi,
    slug: seed.slug,
    title: seed.title.vi,
  }

  const category = existing
    ? await payload.update({
        collection: 'project-categories',
        data: vietnameseData,
        depth: 0,
        draft: false,
        id: existing.id,
        locale: 'vi',
        overrideAccess: true,
      })
    : await payload.create({
        collection: 'project-categories',
        data: vietnameseData,
        depth: 0,
        draft: false,
        locale: 'vi',
        overrideAccess: true,
      })

  await payload.update({
    collection: 'project-categories',
    data: {
      seo: {
        metaDescription: seed.description.en,
        metaTitle: seed.title.en,
        noIndex: false,
        ogImage: coverImageID,
      },
      shortDescription: seed.description.en,
      title: seed.title.en,
    },
    depth: 0,
    draft: false,
    id: category.id,
    locale: 'en',
    overrideAccess: true,
  })

  return category
}

async function ensureProject(
  payload: Payload,
  seed: ChannelProjectSeed,
  coverImageID: number,
  categoryID: number,
  index: number,
): Promise<Project> {
  const videoURL = youtubeVideoURL(seed.videoID)
  const existingResult = await payload.find({
    collection: 'projects',
    depth: 0,
    draft: true,
    fallbackLocale: false,
    limit: 1,
    locale: 'vi',
    overrideAccess: true,
    where: {
      slug: {
        equals: seed.slug,
      },
    },
  })
  const existing = existingResult.docs[0]
  const displayOrder = (index + 1) * 10
  const year = Number(seed.date.slice(0, 4))
  const vietnameseData = {
    _status: 'published' as const,
    adminNotes: `Được import từ kênh YouTube chính thức của Highlight Media: ${videoURL}`,
    clientName: seed.clientName,
    coverImage: coverImageID,
    displayOrder,
    enabled: true,
    externalVideoURL: videoURL,
    featured: true,
    featuredOrder: displayOrder,
    heroMediaType: 'externalVideo' as const,
    hoverPreviewVideoURL: videoURL,
    internalName: `YouTube ${seed.videoID} — ${seed.clientName}`,
    posterImage: coverImageID,
    primaryCategory: categoryID,
    projectDate: `${seed.date}T00:00:00.000Z`,
    seo: {
      metaDescription: seed.description.vi,
      metaTitle: seed.title.vi,
      noIndex: false,
      ogImage: coverImageID,
    },
    shortDescription: seed.description.vi,
    slug: seed.slug,
    title: seed.title.vi,
    videoPoster: coverImageID,
    year,
  }

  const project = existing
    ? await payload.update({
        collection: 'projects',
        data: vietnameseData,
        depth: 0,
        draft: false,
        id: existing.id,
        locale: 'vi',
        overrideAccess: true,
      })
    : await payload.create({
        collection: 'projects',
        data: vietnameseData,
        depth: 0,
        draft: false,
        locale: 'vi',
        overrideAccess: true,
      })

  await payload.update({
    collection: 'projects',
    data: {
      seo: {
        metaDescription: seed.description.en,
        metaTitle: seed.title.en,
        noIndex: false,
        ogImage: coverImageID,
      },
      shortDescription: seed.description.en,
      title: seed.title.en,
    },
    depth: 0,
    draft: false,
    id: project.id,
    locale: 'en',
    overrideAccess: true,
  })

  return project
}

async function updateWebsiteBranding(
  payload: Payload,
  logoID: number,
): Promise<void> {
  const header = (await payload.findGlobal({
    depth: 0,
    draft: true,
    fallbackLocale: false,
    locale: 'vi',
    overrideAccess: true,
    slug: 'header',
  })) as Header
  await payload.updateGlobal({
    data: {
      _status: 'published',
      branding: {
        ...header.branding,
        logoDark: logoID,
        logoLight: logoID,
      },
    },
    depth: 0,
    draft: false,
    locale: 'vi',
    overrideAccess: true,
    slug: 'header',
  })

  const footer = (await payload.findGlobal({
    depth: 0,
    draft: true,
    fallbackLocale: false,
    locale: 'vi',
    overrideAccess: true,
    slug: 'footer',
  })) as Footer
  await payload.updateGlobal({
    data: {
      _status: 'published',
      branding: {
        ...footer.branding,
        logo: logoID,
      },
    },
    depth: 0,
    draft: false,
    locale: 'vi',
    overrideAccess: true,
    slug: 'footer',
  })

  const settings = (await payload.findGlobal({
    depth: 0,
    draft: true,
    fallbackLocale: false,
    locale: 'vi',
    overrideAccess: true,
    slug: 'site-settings',
  })) as SiteSetting
  await payload.updateGlobal({
    data: {
      _status: 'published',
      brand: {
        ...settings.brand,
        defaultLocale: settings.brand?.defaultLocale ?? 'vi',
        fallbackLocale: 'vi',
        favicon: logoID,
        logoMark: logoID,
        siteName: settings.brand?.siteName || 'Highlight Media',
      },
    },
    depth: 0,
    draft: false,
    locale: 'vi',
    overrideAccess: true,
    slug: 'site-settings',
  })
}

async function updateHomepage(
  payload: Payload,
  projectIDs: number[],
  projectMediaIDs: number[],
): Promise<void> {
  const homepage = (await payload.findGlobal({
    depth: 0,
    draft: true,
    fallbackLocale: false,
    locale: 'vi',
    overrideAccess: true,
    slug: 'homepage',
  })) as Homepage
  const existingGallery = homepage.about?.gallery ?? []
  const retainedGallery = existingGallery
    .filter((item) => {
      const id = relationshipID(item.image)
      return id !== undefined && !projectMediaIDs.includes(id)
    })
    .slice(0, Math.max(0, 8 - projectMediaIDs.length))
  const gallery = [
    ...projectMediaIDs.map((image) => ({ image })),
    ...retainedGallery.map((item) => ({
      id: item.id,
      image: relationshipID(item.image) ?? item.image,
    })),
  ].slice(0, 8)

  await payload.updateGlobal({
    data: {
      _status: 'published',
      about: {
        ...homepage.about,
        enabled: true,
        gallery,
        mainImage: projectMediaIDs[0] ?? homepage.about?.mainImage,
      },
      featuredProjects: {
        ...homepage.featuredProjects,
        collectionFilterFeatured: false,
        collectionLimit: PROJECT_LIMIT,
        enabled: projectIDs.length > 0,
        selectedProjects: projectIDs,
        sourceMode: 'projectCollection',
      },
    },
    depth: 0,
    draft: false,
    locale: 'vi',
    overrideAccess: true,
    slug: 'homepage',
  })
}

async function runSeed(): Promise<void> {
  const payload = await getPayload({ config: configPromise })
  const temporaryDirectory = await mkdtemp(
    path.join(tmpdir(), 'highlight-channel-seed-'),
  )
  const summary = {
    categories: [] as string[],
    logo: '',
    media: [] as string[],
    projects: [] as string[],
    sources: [YOUTUBE_CHANNEL_URL, FACEBOOK_PAGE_URL],
  }

  try {
    const logoPath = path.resolve(
      process.cwd(),
      'seed-assets/highlight-media-logo-orange.png',
    )
    const logo = await importImage({
      alt: {
        en: 'Highlight Media orange logo',
        vi: 'Logo màu cam của Highlight Media',
      },
      caption: {
        en: 'Highlight Media',
        vi: 'Highlight Media',
      },
      credit: 'Highlight Media',
      filePath: logoPath,
      folder: 'general',
      internalTitle: 'Highlight Media Logo Orange',
      payload,
      tags: ['highlight-media', 'logo', 'brand'],
      usageNotes:
        'Logo cam được tạo từ logo_highligh.png theo yêu cầu của chủ sở hữu website. Dùng cho Header, Footer, favicon và nhận diện thương hiệu.',
    })
    summary.logo = `${logo.id}:${logo.filename ?? 'unknown'}`

    const mediaByVideoID = new Map<string, Media>()
    for (const seed of channelProjects) {
      const thumbnailPath = await downloadThumbnail(seed, temporaryDirectory)
      const videoURL = youtubeVideoURL(seed.videoID)
      const media = await importImage({
        alt: {
          en: `Frame from ${seed.title.en}`,
          vi: `Khung hình từ dự án ${seed.title.vi}`,
        },
        caption: seed.title,
        credit: 'Highlight Media / YouTube',
        filePath: thumbnailPath,
        folder: 'projects',
        internalTitle: `YouTube ${seed.videoID} — ${seed.title.vi}`,
        payload,
        tags: ['highlight-media', 'youtube', 'project', seed.categorySlug],
        usageNotes: `Thumbnail từ video do Highlight Media công bố tại ${videoURL}. Chủ website đã xác nhận quyền sử dụng cho website Highlight Media.`,
      })
      mediaByVideoID.set(seed.videoID, media)
      summary.media.push(`${media.id}:${media.filename ?? seed.slug}`)
    }

    const categoryBySlug = new Map<string, ProjectCategory>()
    for (const categorySeed of categorySeeds) {
      const firstProject = channelProjects.find(
        (project) => project.categorySlug === categorySeed.slug,
      )
      if (!firstProject) continue
      const cover = mediaByVideoID.get(firstProject.videoID)
      if (!cover) continue

      const category = await ensureProjectCategory(
        payload,
        categorySeed,
        cover.id,
        youtubeVideoURL(firstProject.videoID),
      )
      categoryBySlug.set(categorySeed.slug, category)
      summary.categories.push(`${category.id}:${category.slug}`)
    }

    const projects: Project[] = []
    for (const [index, seed] of channelProjects.entries()) {
      const cover = mediaByVideoID.get(seed.videoID)
      const category = categoryBySlug.get(seed.categorySlug)
      if (!cover || !category) {
        throw new Error(`Thiếu Media hoặc category cho project ${seed.slug}.`)
      }

      const project = await ensureProject(
        payload,
        seed,
        cover.id,
        category.id,
        index,
      )
      projects.push(project)
      summary.projects.push(`${project.id}:${project.slug}`)
    }

    await updateWebsiteBranding(payload, logo.id)
    await updateHomepage(
      payload,
      projects.map((project) => project.id),
      channelProjects
        .map((seed) => mediaByVideoID.get(seed.videoID)?.id)
        .filter((id): id is number => id !== undefined),
    )

    console.log(JSON.stringify(summary, null, 2))
  } finally {
    await rm(temporaryDirectory, { force: true, recursive: true })
    await payload.destroy()
  }
}

await runSeed()
