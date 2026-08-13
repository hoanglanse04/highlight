import type { GeneratePreviewURL } from 'payload'

import { isSafeProjectSlug } from '@/fields/projectSlug'

function previewPath(
  kind: 'category' | 'project',
  slug: unknown,
  locale: unknown,
): string | null {
  if (!isSafeProjectSlug(slug)) {
    return null
  }

  const language = locale === 'en' ? 'en' : 'vi'
  const listing = language === 'en' ? '/en/projects' : '/vi/du-an'

  return kind === 'project'
    ? `${listing}/${slug}`
    : `${listing}?${new URLSearchParams({ category: slug }).toString()}`
}

function generateProjectPreview(kind: 'category' | 'project'): GeneratePreviewURL {
  return (doc, { locale }) => {
    const secret = process.env.PREVIEW_SECRET
    const path = previewPath(kind, doc.slug, locale)
    if (!secret || !path) return null

    return `/api/preview?${new URLSearchParams({
      path,
      previewSecret: secret,
    }).toString()}`
  }
}

export const projectPreview = generateProjectPreview('project')
export const projectCategoryPreview = generateProjectPreview('category')
