import type { AppLocale } from '@/i18n/routing'
import {
  getProjectCategories,
  getProjectCategoriesByIDs,
  getProjectCardsByIDs,
  getProjects,
  type ProjectCard,
  type ProjectDraftOptions,
  type PublicProjectCategory,
} from '@/lib/payload/projects'
import type { Homepage } from '@/payload-types'

function collectionLimit(value: number | null | undefined, fallback = 8): number {
  if (!Number.isInteger(value)) return fallback
  return Math.min(Math.max(value ?? fallback, 1), 12)
}

export type HomepageProjectSources = {
  categories: PublicProjectCategory[]
  projects: ProjectCard[]
}

export async function getHomepageProjectSources(
  homepage: Homepage | null,
  locale: AppLocale,
  options: ProjectDraftOptions,
): Promise<HomepageProjectSources> {
  if (!homepage) return { categories: [], projects: [] }

  const projectsSection = homepage.featuredProjects
  const categoriesSection = homepage.projectCategories

  const projectsPromise = (async () => {
    if (projectsSection.sourceMode !== 'projectCollection') return []
    const limit = collectionLimit(projectsSection.collectionLimit)
    const selected = projectsSection.selectedProjects ?? []
    if (selected.length) {
      return (
        await getProjectCardsByIDs(selected, locale, options)
      ).slice(0, limit)
    }
    return (
      await getProjects({
        ...options,
        featured:
          projectsSection.collectionFilterFeatured !== false ? true : undefined,
        limit,
        locale,
        sort:
          projectsSection.collectionFilterFeatured !== false
            ? 'featuredOrder'
            : 'displayOrder',
      })
    ).docs
  })()

  const categoriesPromise = (async () => {
    if (categoriesSection.sourceMode !== 'categoryCollection') return []
    const limit = collectionLimit(categoriesSection.collectionLimit)
    const selected = categoriesSection.selectedCategories ?? []
    if (selected.length) {
      return (
        await getProjectCategoriesByIDs(selected, locale, options)
      ).slice(0, limit)
    }
    return (
      await getProjectCategories({
        ...options,
        featured: true,
        limit,
        locale,
      })
    ).docs
  })()

  const [projects, categories] = await Promise.all([
    projectsPromise,
    categoriesPromise,
  ])
  return { categories, projects }
}
