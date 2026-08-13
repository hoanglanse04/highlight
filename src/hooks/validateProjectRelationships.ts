import { APIError, type CollectionBeforeValidateHook, type PayloadRequest } from 'payload'

function relationID(value: unknown): number | string | null {
  if (typeof value === 'number' || typeof value === 'string') return value
  if (value && typeof value === 'object') {
    if ('id' in value) return relationID((value as { id?: unknown }).id)
    if ('value' in value) return relationID((value as { value?: unknown }).value)
  }
  return null
}

function assertNoSelfReference(values: unknown, projectID: unknown, label: string): void {
  if (!Array.isArray(values) || projectID === undefined || projectID === null) return
  if (values.some((value) => String(relationID(value)) === String(projectID))) {
    throw new APIError(`${label} cannot include the current project.`, 400)
  }
}

function assertRelationshipLimit(values: unknown, limit: number, label: string): void {
  if (Array.isArray(values) && values.length > limit) {
    throw new APIError(`${label} accepts no more than ${limit} items.`, 400)
  }
}

function assertNoDuplicateRelationships(values: unknown, label: string): void {
  if (!Array.isArray(values)) return
  const ids = values.map(relationID).filter((id) => id !== null).map(String)
  if (new Set(ids).size !== ids.length) {
    throw new APIError(`${label} cannot contain duplicate documents.`, 400)
  }
}

async function assertCategoriesExist(
  values: unknown[],
  req: PayloadRequest,
): Promise<void> {
  const ids = values.map(relationID).filter((id): id is number | string => id !== null)
  for (const id of ids) {
    try {
      await req.payload.findByID({
        collection: 'project-categories',
        id,
        depth: 0,
        overrideAccess: true,
      })
    } catch {
      throw new APIError(`Project category ${String(id)} does not exist.`, 400)
    }
  }
}

export const validateProjectRelationships: CollectionBeforeValidateHook = ({
  data,
  originalDoc,
  req,
}) => {
  if (!data) return data

  const projectID = originalDoc?.id
  const primaryCategory = relationID(
    data.primaryCategory ?? originalDoc?.primaryCategory,
  )
  const secondaryCategories =
    data.secondaryCategories ?? originalDoc?.secondaryCategories

  if (
    primaryCategory !== null &&
    Array.isArray(secondaryCategories) &&
    secondaryCategories.some(
      (category) => String(relationID(category)) === String(primaryCategory),
    )
  ) {
    throw new APIError('Secondary categories cannot include the primary category.', 400)
  }

  assertRelationshipLimit(secondaryCategories, 5, 'Secondary categories')
  assertNoDuplicateRelationships(secondaryCategories, 'Secondary categories')

  const directRelated = data.relatedProjects ?? originalDoc?.relatedProjects
  assertRelationshipLimit(directRelated, 8, 'Related projects')
  assertNoDuplicateRelationships(directRelated, 'Related projects')
  assertNoSelfReference(directRelated, projectID, 'Related projects')

  const content = data.content ?? originalDoc?.content
  if (Array.isArray(content)) {
    for (const block of content) {
      if (
        block &&
        typeof block === 'object' &&
        (block as { blockType?: unknown }).blockType === 'relatedProjects'
      ) {
        assertNoSelfReference(
          (block as { manualProjects?: unknown }).manualProjects,
          projectID,
          'Manual related projects',
        )
        const manualProjects = (block as { manualProjects?: unknown }).manualProjects
        assertRelationshipLimit(manualProjects, 8, 'Manual related projects')
        assertNoDuplicateRelationships(manualProjects, 'Manual related projects')
      }
    }
  }

  const categories: unknown[] = []
  if (primaryCategory !== null) categories.push(primaryCategory)
  if (Array.isArray(secondaryCategories)) categories.push(...secondaryCategories)

  return assertCategoriesExist(categories, req).then(() => data)
}
