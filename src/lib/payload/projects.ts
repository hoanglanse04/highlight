import type { PaginatedDocs, PayloadRequest, Where } from 'payload'
import { getPayload } from 'payload'

import { isAuthenticated } from '@/access/users'
import type { AppLocale } from '@/i18n/routing'
import type { Project, ProjectCategory } from '@/payload-types'
import config from '@payload-config'

export type ProjectSort =
  | 'displayOrder'
  | 'featuredOrder'
  | 'newest'
  | 'oldest'
  | 'title'

export type ProjectCard = Pick<
  Project,
  | 'artistName'
  | 'clientName'
  | 'coverImage'
  | 'externalVideoURL'
  | 'featured'
  | 'featuredOrder'
  | 'heroMediaType'
  | 'hoverPreviewVideoURL'
  | 'id'
  | 'posterImage'
  | 'primaryCategory'
  | 'shortDescription'
  | 'slug'
  | 'title'
  | 'videoPoster'
  | 'year'
>

export type PublicProject = Omit<Project, 'adminNotes' | 'internalName'>
export type PublicProjectCategory = Omit<ProjectCategory, 'adminNotes' | 'internalName'>

export type ProjectDraftOptions = {
  draft?: boolean
  request?: PayloadRequest
}

export type GetProjectCategoriesOptions = ProjectDraftOptions & {
  featured?: boolean
  limit?: number
  locale: AppLocale
  page?: number
}

export type GetProjectsOptions = ProjectDraftOptions & {
  categorySlug?: string
  featured?: boolean
  limit?: number
  locale: AppLocale
  page?: number
  sort?: ProjectSort
  year?: number
}

const projectSort: Record<ProjectSort, string[]> = {
  displayOrder: ['displayOrder', '-projectDate', '-createdAt'],
  featuredOrder: ['featuredOrder', 'displayOrder', '-projectDate'],
  newest: ['-projectDate', '-createdAt'],
  oldest: ['projectDate', 'createdAt'],
  title: ['title'],
}

function limitBetween(value: number | undefined, fallback: number, maximum: number): number {
  if (!Number.isInteger(value) || !value) return fallback
  return Math.min(Math.max(value, 1), maximum)
}

function requireDraftRequest(options: ProjectDraftOptions): void {
  if (options.draft && !isAuthenticated(options.request?.user ?? null)) {
    throw new Error('Draft project queries require an authenticated Payload request.')
  }
}

function publicWhere(draft: boolean | undefined): Where[] {
  return draft
    ? []
    : [
        { _status: { equals: 'published' } },
        { enabled: { equals: true } },
      ]
}

function withoutInternalProject(doc: Project): PublicProject {
  const { adminNotes: _adminNotes, internalName: _internalName, ...project } = doc
  return project
}

function withoutInternalCategory(doc: ProjectCategory): PublicProjectCategory {
  const { adminNotes: _adminNotes, internalName: _internalName, ...category } = doc
  return category
}

function toProjectCard(doc: Project): ProjectCard {
  return {
    id: doc.id,
    title: doc.title,
    slug: doc.slug,
    shortDescription: doc.shortDescription,
    primaryCategory: doc.primaryCategory,
    coverImage: doc.coverImage,
    posterImage: doc.posterImage,
    heroMediaType: doc.heroMediaType,
    hoverPreviewVideoURL: doc.hoverPreviewVideoURL,
    externalVideoURL: doc.externalVideoURL,
    videoPoster: doc.videoPoster,
    clientName: doc.clientName,
    artistName: doc.artistName,
    year: doc.year,
    featured: doc.featured,
    featuredOrder: doc.featuredOrder,
  }
}

function mapCards(result: PaginatedDocs<Project>): PaginatedDocs<ProjectCard> {
  return { ...result, docs: result.docs.map(toProjectCard) }
}

export async function getProjectCategories(
  options: GetProjectCategoriesOptions,
): Promise<PaginatedDocs<PublicProjectCategory>> {
  requireDraftRequest(options)
  const payload = await getPayload({ config })
  const where: Where = {
    and: [
      ...publicWhere(options.draft),
      ...(options.featured === undefined
        ? []
        : [{ featured: { equals: options.featured } }]),
    ],
  }
  const result = await payload.find({
    collection: 'project-categories',
    locale: options.locale,
    fallbackLocale: 'vi',
    draft: options.draft ?? false,
    req: options.request,
    overrideAccess: false,
    depth: 1,
    page: options.page ?? 1,
    limit: limitBetween(options.limit, 20, 100),
    sort: ['displayOrder', 'title'],
    where,
  })

  return { ...result, docs: result.docs.map(withoutInternalCategory) }
}

export async function getProjectCategoryBySlug(
  slug: string,
  locale: AppLocale,
  options: ProjectDraftOptions = {},
): Promise<PublicProjectCategory | null> {
  requireDraftRequest(options)
  const payload = await getPayload({ config })
  const found = await payload.find({
    collection: 'project-categories',
    locale,
    fallbackLocale: 'vi',
    draft: options.draft ?? false,
    req: options.request,
    overrideAccess: false,
    depth: 1,
    limit: 1,
    where: { and: [...publicWhere(options.draft), { slug: { equals: slug } }] },
  })
  return found.docs[0] ? withoutInternalCategory(found.docs[0]) : null
}

async function categoryIDBySlug(
  slug: string,
  locale: AppLocale,
  options: ProjectDraftOptions,
): Promise<number | string | null> {
  const category = await getProjectCategoryBySlug(slug, locale, options)
  return category?.id ?? null
}

export async function getProjects(
  options: GetProjectsOptions,
): Promise<PaginatedDocs<ProjectCard>> {
  requireDraftRequest(options)
  const payload = await getPayload({ config })
  const categoryID = options.categorySlug
    ? await categoryIDBySlug(options.categorySlug, options.locale, options)
    : null

  if (options.categorySlug && categoryID === null) {
    return {
      docs: [],
      hasNextPage: false,
      hasPrevPage: false,
      limit: limitBetween(options.limit, 12, 100),
      nextPage: null,
      page: 1,
      pagingCounter: 1,
      prevPage: null,
      totalDocs: 0,
      totalPages: 0,
    }
  }

  const filters: Where[] = [...publicWhere(options.draft)]
  if (options.featured !== undefined) filters.push({ featured: { equals: options.featured } })
  if (options.year !== undefined) filters.push({ year: { equals: options.year } })
  if (categoryID !== null) {
    filters.push({
      or: [
        { primaryCategory: { equals: categoryID } },
        { secondaryCategories: { contains: categoryID } },
      ],
    })
  }

  const result = await payload.find({
    collection: 'projects',
    locale: options.locale,
    fallbackLocale: 'vi',
    draft: options.draft ?? false,
    req: options.request,
    overrideAccess: false,
    depth: 1,
    page: options.page ?? 1,
    limit: limitBetween(options.limit, 12, 100),
    sort: projectSort[options.sort ?? 'newest'],
    where: { and: filters },
    select: {
      id: true,
      title: true,
      slug: true,
      shortDescription: true,
      primaryCategory: true,
      coverImage: true,
      posterImage: true,
      heroMediaType: true,
      hoverPreviewVideoURL: true,
      externalVideoURL: true,
      videoPoster: true,
      clientName: true,
      artistName: true,
      year: true,
      featured: true,
      featuredOrder: true,
    },
  })

  return mapCards(result as unknown as PaginatedDocs<Project>)
}

export async function getProjectBySlug(
  slug: string,
  locale: AppLocale,
  options: ProjectDraftOptions = {},
): Promise<PublicProject | null> {
  requireDraftRequest(options)
  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'projects',
    locale,
    fallbackLocale: 'vi',
    draft: options.draft ?? false,
    req: options.request,
    overrideAccess: false,
    depth: 1,
    limit: 1,
    where: { and: [...publicWhere(options.draft), { slug: { equals: slug } }] },
  })
  return result.docs[0] ? withoutInternalProject(result.docs[0]) : null
}

export function getFeaturedProjects(
  locale: AppLocale,
  limit = 8,
): Promise<PaginatedDocs<ProjectCard>> {
  return getProjects({ locale, featured: true, limit, sort: 'featuredOrder' })
}

export function getProjectsByCategory(
  categorySlug: string,
  locale: AppLocale,
  options: Omit<GetProjectsOptions, 'categorySlug' | 'locale'> = {},
): Promise<PaginatedDocs<ProjectCard>> {
  return getProjects({ ...options, categorySlug, locale })
}

export async function getRelatedProjects(
  projectID: Project['id'],
  locale: AppLocale,
  limit = 4,
  options: ProjectDraftOptions = {},
): Promise<ProjectCard[]> {
  requireDraftRequest(options)
  const payload = await getPayload({ config })
  const project = await payload.findByID({
    collection: 'projects',
    id: projectID,
    locale,
    fallbackLocale: 'vi',
    draft: options.draft ?? false,
    req: options.request,
    overrideAccess: false,
    depth: 0,
    select: { relatedProjects: true },
  })
  const ids = (project.relatedProjects ?? [])
    .map((value) => (typeof value === 'object' ? value.id : value))
    .slice(0, limitBetween(limit, 4, 8))

  return getProjectCardsByIDs(ids, locale, options)
}

function relationID(value: number | Project | ProjectCategory): number {
  return typeof value === 'object' ? value.id : value
}

export async function getProjectCardsByIDs(
  ids: Array<number | Project>,
  locale: AppLocale,
  options: ProjectDraftOptions = {},
): Promise<ProjectCard[]> {
  requireDraftRequest(options)
  const orderedIDs = ids.map(relationID)
  if (!orderedIDs.length) return []

  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'projects',
    locale,
    fallbackLocale: 'vi',
    draft: options.draft ?? false,
    req: options.request,
    overrideAccess: false,
    depth: 1,
    limit: limitBetween(orderedIDs.length, 8, 100),
    where: {
      and: [...publicWhere(options.draft), { id: { in: orderedIDs } }],
    },
    select: {
      id: true,
      title: true,
      slug: true,
      shortDescription: true,
      primaryCategory: true,
      coverImage: true,
      posterImage: true,
      heroMediaType: true,
      hoverPreviewVideoURL: true,
      externalVideoURL: true,
      videoPoster: true,
      clientName: true,
      artistName: true,
      year: true,
      featured: true,
      featuredOrder: true,
    },
  })
  const cards = (result.docs as unknown as Project[]).map(toProjectCard)
  const byID = new Map(cards.map((card) => [String(card.id), card]))
  return orderedIDs
    .map((id) => byID.get(String(id)))
    .filter((card): card is ProjectCard => Boolean(card))
}

export async function getProjectCategoriesByIDs(
  ids: Array<number | ProjectCategory>,
  locale: AppLocale,
  options: ProjectDraftOptions = {},
): Promise<PublicProjectCategory[]> {
  requireDraftRequest(options)
  const orderedIDs = ids.map(relationID)
  if (!orderedIDs.length) return []

  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'project-categories',
    locale,
    fallbackLocale: 'vi',
    draft: options.draft ?? false,
    req: options.request,
    overrideAccess: false,
    depth: 1,
    limit: limitBetween(orderedIDs.length, 12, 100),
    where: {
      and: [...publicWhere(options.draft), { id: { in: orderedIDs } }],
    },
  })
  const categories = result.docs.map(withoutInternalCategory)
  const byID = new Map(categories.map((category) => [String(category.id), category]))
  return orderedIDs
    .map((id) => byID.get(String(id)))
    .filter((category): category is PublicProjectCategory => Boolean(category))
}

export type AutomaticRelatedStrategy =
  | 'featured'
  | 'samePrimaryCategory'
  | 'sharedCategories'

export async function getAutomaticRelatedProjects(
  project: PublicProject,
  locale: AppLocale,
  strategy: AutomaticRelatedStrategy,
  limit = 4,
  options: ProjectDraftOptions = {},
): Promise<ProjectCard[]> {
  requireDraftRequest(options)
  const payload = await getPayload({ config })
  const filters: Where[] = [
    ...publicWhere(options.draft),
    { id: { not_equals: project.id } },
  ]

  if (strategy === 'featured') {
    filters.push({ featured: { equals: true } })
  } else {
    const primaryID = relationID(project.primaryCategory)
    if (strategy === 'samePrimaryCategory') {
      filters.push({ primaryCategory: { equals: primaryID } })
    } else {
      const categoryIDs = [
        primaryID,
        ...(project.secondaryCategories ?? []).map(relationID),
      ]
      const categoryFilters: Where[] = []
      for (const categoryID of categoryIDs) {
        categoryFilters.push(
          { primaryCategory: { equals: categoryID } },
          { secondaryCategories: { contains: categoryID } },
        )
      }
      filters.push({ or: categoryFilters })
    }
  }

  const result = await payload.find({
    collection: 'projects',
    locale,
    fallbackLocale: 'vi',
    draft: options.draft ?? false,
    req: options.request,
    overrideAccess: false,
    depth: 1,
    limit: limitBetween(limit, 4, 8),
    sort:
      strategy === 'featured'
        ? projectSort.featuredOrder
        : projectSort.displayOrder,
    where: { and: filters },
    select: {
      id: true,
      title: true,
      slug: true,
      shortDescription: true,
      primaryCategory: true,
      coverImage: true,
      posterImage: true,
      heroMediaType: true,
      hoverPreviewVideoURL: true,
      externalVideoURL: true,
      videoPoster: true,
      clientName: true,
      artistName: true,
      year: true,
      featured: true,
      featuredOrder: true,
    },
  })

  return (result.docs as unknown as Project[]).map(toProjectCard)
}
