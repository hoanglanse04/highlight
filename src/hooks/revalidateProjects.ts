import { revalidatePath, revalidateTag } from 'next/cache'
import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

type ProjectLike = {
  _status?: unknown
  primaryCategory?: unknown
  slug?: unknown
}

function relationID(value: unknown): number | string | null {
  if (typeof value === 'number' || typeof value === 'string') return value
  if (value && typeof value === 'object' && 'id' in value) {
    const id = (value as { id?: unknown }).id
    return typeof id === 'number' || typeof id === 'string' ? id : null
  }
  return null
}

async function resolveCategorySlug(
  category: unknown,
  req: Parameters<CollectionAfterChangeHook>[0]['req'],
): Promise<string | null> {
  if (category && typeof category === 'object' && 'slug' in category) {
    const slug = (category as { slug?: unknown }).slug
    if (typeof slug === 'string') return slug
  }

  const id = relationID(category)
  if (id === null) return null
  try {
    const doc = await req.payload.findByID({
      collection: 'project-categories',
      id,
      depth: 0,
      overrideAccess: true,
    })
    return typeof doc.slug === 'string' ? doc.slug : null
  } catch {
    return null
  }
}

function invalidateBasePaths(): void {
  for (const path of ['/vi', '/en', '/vi/du-an', '/en/projects']) {
    revalidatePath(path, 'page')
  }
  revalidateTag('projects', 'max')
  revalidateTag('project-categories', 'max')
  revalidateTag('homepage', 'max')
}

async function invalidateProject(
  doc: ProjectLike,
  previousDoc: ProjectLike | undefined,
  req: Parameters<CollectionAfterChangeHook>[0]['req'],
): Promise<void> {
  invalidateBasePaths()

  const slugs = new Set(
    [doc.slug, previousDoc?.slug].filter(
      (slug): slug is string => typeof slug === 'string' && slug.length > 0,
    ),
  )
  for (const slug of slugs) {
    revalidatePath(`/vi/du-an/${slug}`, 'page')
    revalidatePath(`/en/projects/${slug}`, 'page')
    revalidateTag(`project:${slug}`, 'max')
  }

  const categories = await Promise.all([
    resolveCategorySlug(doc.primaryCategory, req),
    resolveCategorySlug(previousDoc?.primaryCategory, req),
  ])
  for (const slug of categories) {
    if (slug) revalidateTag(`category:${slug}`, 'max')
  }
}

function warnRevalidation(
  req: Parameters<CollectionAfterChangeHook>[0]['req'],
  collection: string,
  error: unknown,
): void {
  req.payload.logger.warn({
    collection,
    err: error instanceof Error ? error.message : 'Unknown revalidation error',
    msg: 'Published project content changed, but cache revalidation failed.',
  })
}

export const revalidateProjectAfterChange: CollectionAfterChangeHook = async ({
  doc,
  previousDoc,
  req,
}) => {
  if ((doc as ProjectLike)._status !== 'published') return doc
  try {
    await invalidateProject(doc as ProjectLike, previousDoc as ProjectLike, req)
  } catch (error) {
    warnRevalidation(req, 'projects', error)
  }
  return doc
}

export const revalidateProjectAfterDelete: CollectionAfterDeleteHook = async ({
  doc,
  req,
}) => {
  try {
    await invalidateProject(doc as ProjectLike, undefined, req)
  } catch (error) {
    warnRevalidation(req, 'projects', error)
  }
  return doc
}

function invalidateCategory(doc: ProjectLike, previousDoc?: ProjectLike): void {
  invalidateBasePaths()
  for (const slug of [doc.slug, previousDoc?.slug]) {
    if (typeof slug === 'string' && slug) revalidateTag(`category:${slug}`, 'max')
  }
}

export const revalidateCategoryAfterChange: CollectionAfterChangeHook = ({
  doc,
  previousDoc,
  req,
}) => {
  if ((doc as ProjectLike)._status !== 'published') return doc
  try {
    invalidateCategory(doc as ProjectLike, previousDoc as ProjectLike)
  } catch (error) {
    warnRevalidation(req, 'project-categories', error)
  }
  return doc
}

export const revalidateCategoryAfterDelete: CollectionAfterDeleteHook = ({
  doc,
  req,
}) => {
  try {
    invalidateCategory(doc as ProjectLike)
  } catch (error) {
    warnRevalidation(req, 'project-categories', error)
  }
  return doc
}
