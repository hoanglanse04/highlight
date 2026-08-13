import { getPayload, type Payload } from 'payload'

import configPromise from '@/payload.config'
import type {
  Footer,
  Header,
  Homepage,
  SiteSetting,
} from '@/payload-types'

import {
  buildFooterData,
  buildHeaderData,
  buildHomepageData,
  buildProjectCategoryData,
  buildSiteSettingsData,
  categorySeedDefinitions,
  type SeedStatus,
} from './data'
import { parseSeedConfig, type SeedConfig } from './env'
import { resolveSeedMedia, type ResolvedSeedMedia } from './mediaResolver'

type SeedSummary = {
  created: string[]
  drafts: string[]
  dryRun: boolean
  errors: string[]
  missingAssets: string[]
  published: string[]
  skipped: string[]
  updated: string[]
}

function createSummary(config: SeedConfig): SeedSummary {
  return {
    created: [],
    drafts: [],
    dryRun: config.SEED_DRY_RUN,
    errors: [],
    missingAssets: [],
    published: [],
    skipped: [],
    updated: [],
  }
}

function globalExists(
  document: Footer | Header | Homepage | SiteSetting | null | undefined,
): boolean {
  return Boolean(document?.createdAt || document?.updatedAt)
}

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

function targetStatus(config: SeedConfig, canPublish = true): SeedStatus {
  return config.SEED_PUBLISH && canPublish ? 'published' : 'draft'
}

function recordWrite(
  summary: SeedSummary,
  name: string,
  existed: boolean,
  status: SeedStatus,
): void {
  const suffix = summary.dryRun ? ' (dry-run)' : ''
  summary[existed ? 'updated' : 'created'].push(`${name}${suffix}`)
  summary[status === 'published' ? 'published' : 'drafts'].push(
    `${name}${suffix}`,
  )
}

function shouldSkipExisting(
  summary: SeedSummary,
  config: SeedConfig,
  name: string,
  exists: boolean,
): boolean {
  if (exists && !config.SEED_FORCE) {
    summary.skipped.push(`${name}: đã tồn tại; dùng SEED_FORCE=true để cập nhật.`)
    return true
  }

  return false
}

async function findSeedGlobal<TSlug extends 'footer' | 'header' | 'homepage' | 'site-settings'>(
  payload: Payload,
  slug: TSlug,
) {
  return payload.findGlobal({
    depth: 0,
    draft: true,
    fallbackLocale: false,
    locale: 'vi',
    overrideAccess: true,
    slug,
  })
}

async function seedSiteSettings(
  payload: Payload,
  config: SeedConfig,
  summary: SeedSummary,
): Promise<void> {
  const name = 'global:site-settings'
  const existing = await findSeedGlobal(payload, 'site-settings')
  const exists = globalExists(existing)
  const status = targetStatus(config)

  if (shouldSkipExisting(summary, config, name, exists)) return
  if (config.SEED_DRY_RUN) {
    recordWrite(summary, name, exists, status)
    return
  }

  const vietnamese = await payload.updateGlobal({
    data: buildSiteSettingsData('vi', config, status, existing),
    depth: 0,
    draft: status === 'draft',
    locale: 'vi',
    overrideAccess: true,
    slug: 'site-settings',
  })

  await payload.updateGlobal({
    data: buildSiteSettingsData('en', config, status, vietnamese),
    depth: 0,
    draft: status === 'draft',
    locale: 'en',
    overrideAccess: true,
    slug: 'site-settings',
  })
  recordWrite(summary, name, exists, status)
}

async function seedHeader(
  payload: Payload,
  config: SeedConfig,
  summary: SeedSummary,
): Promise<void> {
  const name = 'global:header'
  const existing = await findSeedGlobal(payload, 'header')
  const exists = globalExists(existing)
  const status = targetStatus(config)

  if (shouldSkipExisting(summary, config, name, exists)) return
  if (config.SEED_DRY_RUN) {
    recordWrite(summary, name, exists, status)
    return
  }

  const vietnamese = await payload.updateGlobal({
    data: buildHeaderData('vi', status, existing),
    depth: 0,
    draft: status === 'draft',
    locale: 'vi',
    overrideAccess: true,
    slug: 'header',
  })

  await payload.updateGlobal({
    data: buildHeaderData('en', status, vietnamese),
    depth: 0,
    draft: status === 'draft',
    locale: 'en',
    overrideAccess: true,
    slug: 'header',
  })
  recordWrite(summary, name, exists, status)
}

async function seedFooter(
  payload: Payload,
  config: SeedConfig,
  summary: SeedSummary,
): Promise<void> {
  const name = 'global:footer'
  const existing = await findSeedGlobal(payload, 'footer')
  const exists = globalExists(existing)
  const status = targetStatus(config)

  if (shouldSkipExisting(summary, config, name, exists)) return
  if (config.SEED_DRY_RUN) {
    recordWrite(summary, name, exists, status)
    return
  }

  const vietnamese = await payload.updateGlobal({
    data: buildFooterData('vi', config, status, existing),
    depth: 0,
    draft: status === 'draft',
    locale: 'vi',
    overrideAccess: true,
    slug: 'footer',
  })

  await payload.updateGlobal({
    data: buildFooterData('en', config, status, vietnamese),
    depth: 0,
    draft: status === 'draft',
    locale: 'en',
    overrideAccess: true,
    slug: 'footer',
  })
  recordWrite(summary, name, exists, status)
}

type CategorySeedResult = {
  allIDs: number[]
  publishedIDs: number[]
}

async function seedProjectCategories(
  payload: Payload,
  config: SeedConfig,
  summary: SeedSummary,
  media: ResolvedSeedMedia,
): Promise<CategorySeedResult> {
  const allIDs: number[] = []
  const publishedIDs: number[] = []

  for (const definition of categorySeedDefinitions) {
    const name = `category:${definition.slug}`

    try {
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
            equals: definition.slug,
          },
        },
      })
      const existing = existingResult.docs[0]
      const exists = Boolean(existing)

      if (existing && !config.SEED_FORCE) {
        summary.skipped.push(
          `${name}: đã tồn tại; dùng SEED_FORCE=true để cập nhật.`,
        )
        allIDs.push(existing.id)
        if (existing._status === 'published' && existing.enabled !== false) {
          publishedIDs.push(existing.id)
        }
        continue
      }

      const coverImage =
        media.categoryCoverIDs.get(definition.slug) ??
        relationshipID(existing?.coverImage)
      const status = targetStatus(config, Boolean(coverImage))

      if (config.SEED_DRY_RUN) {
        recordWrite(summary, name, exists, status)
        continue
      }

      const vietnameseData = buildProjectCategoryData(
        definition,
        'vi',
        coverImage,
        status,
      )
      const vietnamese = existing
        ? await payload.update({
            collection: 'project-categories',
            data: vietnameseData,
            depth: 0,
            draft: status === 'draft',
            id: existing.id,
            locale: 'vi',
            overrideAccess: true,
          })
        : status === 'published' && coverImage
          ? await payload.create({
              collection: 'project-categories',
              data: {
                ...vietnameseData,
                coverImage,
              },
              depth: 0,
              draft: false,
              locale: 'vi',
              overrideAccess: true,
            })
          : await payload.create({
              collection: 'project-categories',
              data: vietnameseData,
              depth: 0,
              draft: true,
              locale: 'vi',
              overrideAccess: true,
            })

      await payload.update({
        collection: 'project-categories',
        data: buildProjectCategoryData(
          definition,
          'en',
          coverImage,
          status,
        ),
        depth: 0,
        draft: status === 'draft',
        id: vietnamese.id,
        locale: 'en',
        overrideAccess: true,
      })

      recordWrite(summary, name, exists, status)
      allIDs.push(vietnamese.id)
      if (status === 'published') publishedIDs.push(vietnamese.id)
    } catch (error) {
      summary.errors.push(
        `${name}: ${error instanceof Error ? error.message : String(error)}`,
      )
    }
  }

  return { allIDs, publishedIDs }
}

async function findPublishedProjectIDs(payload: Payload): Promise<number[]> {
  const projects = await payload.find({
    collection: 'projects',
    depth: 0,
    limit: 8,
    overrideAccess: true,
    sort: ['displayOrder', '-projectDate', '-createdAt'],
    where: {
      and: [
        {
          _status: {
            equals: 'published',
          },
        },
        {
          enabled: {
            equals: true,
          },
        },
      ],
    },
  })

  return projects.docs.map((project) => project.id)
}

async function seedHomepage(
  payload: Payload,
  config: SeedConfig,
  summary: SeedSummary,
  media: ResolvedSeedMedia,
  categoryResult: CategorySeedResult,
  projectIDs: number[],
): Promise<void> {
  const name = 'global:homepage'
  const existing = await findSeedGlobal(payload, 'homepage')
  const exists = globalExists(existing)
  const status = targetStatus(config, Boolean(media.heroMedia))

  if (shouldSkipExisting(summary, config, name, exists)) return
  if (config.SEED_DRY_RUN) {
    recordWrite(summary, name, exists, status)
    return
  }

  const categoryIDs =
    status === 'published'
      ? categoryResult.publishedIDs
      : categoryResult.allIDs
  const vietnamese = await payload.updateGlobal({
    data: buildHomepageData({
      aboutMediaIDs: media.aboutMediaIDs,
      categoryIDs,
      config,
      existing,
      heroMedia: media.heroMedia,
      locale: 'vi',
      projectIDs,
      status,
    }),
    depth: 0,
    draft: status === 'draft',
    locale: 'vi',
    overrideAccess: true,
    slug: 'homepage',
  })

  await payload.updateGlobal({
    data: buildHomepageData({
      aboutMediaIDs: media.aboutMediaIDs,
      categoryIDs,
      config,
      existing: vietnamese,
      heroMedia: media.heroMedia,
      locale: 'en',
      projectIDs,
      status,
    }),
    depth: 0,
    draft: status === 'draft',
    locale: 'en',
    overrideAccess: true,
    slug: 'homepage',
  })
  recordWrite(summary, name, exists, status)
}

async function runSeed(): Promise<void> {
  const config = parseSeedConfig()
  const summary = createSummary(config)
  const payload = await getPayload({ config: configPromise })

  try {
    const media = await resolveSeedMedia(
      payload,
      config,
      categorySeedDefinitions,
      (message) => {
        if (!summary.missingAssets.includes(message)) {
          summary.missingAssets.push(message)
        }
      },
    )
    const projectIDs = await findPublishedProjectIDs(payload)

    if (projectIDs.length === 0) {
      summary.skipped.push(
        'projects: không có input dự án thật; seeder không tạo project giả.',
      )
    }

    const operations = [
      () => seedSiteSettings(payload, config, summary),
      () => seedHeader(payload, config, summary),
      () => seedFooter(payload, config, summary),
    ]

    for (const operation of operations) {
      try {
        await operation()
      } catch (error) {
        summary.errors.push(
          error instanceof Error ? error.message : String(error),
        )
      }
    }

    const categories = await seedProjectCategories(
      payload,
      config,
      summary,
      media,
    )

    try {
      await seedHomepage(
        payload,
        config,
        summary,
        media,
        categories,
        projectIDs,
      )
    } catch (error) {
      summary.errors.push(
        `global:homepage: ${error instanceof Error ? error.message : String(error)}`,
      )
    }

    console.log(JSON.stringify(summary, null, 2))

    if (summary.errors.length > 0) {
      throw new Error(
        `Content seed hoàn tất với ${summary.errors.length} lỗi. Xem báo cáo phía trên.`,
      )
    }
  } finally {
    await payload.destroy()
  }
}

await runSeed()
