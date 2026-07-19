import type { GeneratePreviewURL, GlobalConfig } from 'payload'

import {
  authenticatedOnly,
  contentEditors,
  publishedOrAuthenticated,
} from '@/access/users'

export const websiteGlobalAccess: NonNullable<GlobalConfig['access']> = {
  read: publishedOrAuthenticated,
  readVersions: authenticatedOnly,
  update: contentEditors,
}

export const websiteGlobalVersions: NonNullable<GlobalConfig['versions']> = {
  drafts: {
    autosave: {
      interval: 2000,
      showSaveDraftButton: true,
    },
    validate: false,
  },
  max: 30,
}

export const websitePreview: GeneratePreviewURL = (_doc, { locale }) => {
  const secret = process.env.PREVIEW_SECRET

  if (!secret) {
    return null
  }

  const previewLocale = locale === 'en' ? 'en' : 'vi'
  const params = new URLSearchParams({
    path: `/${previewLocale}`,
    previewSecret: secret,
  })

  return `/api/preview?${params.toString()}`
}

export function websiteGlobalAdmin(description: string): GlobalConfig['admin'] {
  return {
    description,
    group: 'Website',
    preview: websitePreview,
  }
}
