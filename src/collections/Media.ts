import { randomBytes } from 'node:crypto'
import path from 'node:path'

import {
  APIError,
  type CollectionBeforeOperationHook,
  type CollectionConfig,
} from 'payload'
import sharp from 'sharp'

import {
  authenticatedFieldAccess,
  canManageContent,
  contentEditorFieldAccess,
  contentEditors,
  publicRead,
} from '@/access/users'

const MAX_UPLOAD_BYTES = 15 * 1024 * 1024
const MAX_INPUT_PIXELS = 100_000_000

const allowedMimeTypes = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/avif',
] as const

type AllowedMimeType = (typeof allowedMimeTypes)[number]

const formatDetails: Record<
  Exclude<AllowedMimeType, 'image/avif'>,
  { extension: string; sharpFormat: string }
> = {
  'image/jpeg': { extension: 'jpg', sharpFormat: 'jpeg' },
  'image/png': { extension: 'png', sharpFormat: 'png' },
  'image/webp': { extension: 'webp', sharpFormat: 'webp' },
}

function getCanonicalFileType(
  metadata: Awaited<ReturnType<ReturnType<typeof sharp>['metadata']>>,
): { extension: string; mimeType: AllowedMimeType } | null {
  for (const [mimeType, details] of Object.entries(formatDetails)) {
    if (metadata.format === details.sharpFormat) {
      return {
        extension: details.extension,
        mimeType: mimeType as AllowedMimeType,
      }
    }
  }

  if (metadata.format === 'heif' && metadata.compression === 'av1') {
    return { extension: 'avif', mimeType: 'image/avif' }
  }

  return null
}

function getOriginalBaseName(filename: string): string {
  const basename = filename.replaceAll('\\', '/').split('/').pop() ?? 'image'
  const extensionIndex = basename.lastIndexOf('.')

  return extensionIndex > 0 ? basename.slice(0, extensionIndex) : basename
}

function slugifyFilename(value: string): string {
  const normalized = value
    .replaceAll('Đ', 'D')
    .replaceAll('đ', 'd')
    .normalize('NFKD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

  return normalized || 'image'
}

function getInternalTitle(value: string): string {
  return value.replace(/[-_]+/g, ' ').replace(/\s+/g, ' ').trim() || 'Image'
}

const validateAndPrepareUpload: CollectionBeforeOperationHook<'media'> = async ({
  args,
  operation,
  overrideAccess,
  req,
}) => {
  if (operation !== 'create' && operation !== 'update' && operation !== 'updateByID') {
    return args
  }

  const file = req.file

  if (!file) {
    return args
  }

  // Payload runs beforeOperation before collection access. Avoid decoding untrusted files
  // for REST requests that the collection access layer will reject immediately afterward.
  if (!overrideAccess && !canManageContent(req.user)) {
    return args
  }

  if (file.size > MAX_UPLOAD_BYTES) {
    throw new APIError('Image exceeds the 15 MiB upload limit.', 413)
  }

  if (!allowedMimeTypes.includes(file.mimetype as AllowedMimeType)) {
    throw new APIError('Only JPEG, PNG, WebP, and AVIF images are allowed.', 400)
  }

  const input = file.tempFilePath || file.data
  let metadata: Awaited<ReturnType<ReturnType<typeof sharp>['metadata']>>

  try {
    metadata = await sharp(input, {
      animated: false,
      failOn: 'warning',
      limitInputPixels: MAX_INPUT_PIXELS,
    }).metadata()
  } catch {
    throw new APIError('The uploaded file is not a valid supported image.', 400)
  }

  const canonicalType = getCanonicalFileType(metadata)

  if (!canonicalType || canonicalType.mimeType !== file.mimetype) {
    throw new APIError(
      'The detected image type does not match the declared MIME type.',
      400,
    )
  }

  const originalBaseName = getOriginalBaseName(file.name)
  const uniqueSuffix = randomBytes(4).toString('hex')

  file.name = `${slugifyFilename(originalBaseName)}-${uniqueSuffix}.${canonicalType.extension}`
  file.mimetype = canonicalType.mimeType

  if (!args.data.internalTitle) {
    args.data.internalTitle = getInternalTitle(originalBaseName)
  }

  return args
}

const imageSizeAdminOptions = {
  disableGroupBy: true,
  disableListColumn: true,
  disableListFilter: true,
}

export const Media: CollectionConfig<'media'> = {
  slug: 'media',
  labels: {
    singular: 'Media',
    plural: 'Media',
  },
  admin: {
    defaultColumns: [
      'thumbnailURL',
      'internalTitle',
      'filename',
      'folder',
      'filesize',
      'updatedAt',
    ],
    description: 'Upload and manage website images and bilingual image metadata.',
    group: 'Content',
    useAsTitle: 'internalTitle',
  },
  access: {
    create: contentEditors,
    read: publicRead,
    update: contentEditors,
    delete: contentEditors,
  },
  hooks: {
    beforeOperation: [validateAndPrepareUpload],
  },
  upload: {
    adminThumbnail: 'thumbnail',
    allowRestrictedFileTypes: false,
    bulkUpload: true,
    constructorOptions: {
      failOn: 'warning',
      limitInputPixels: MAX_INPUT_PIXELS,
    },
    crop: true,
    displayPreview: true,
    filesRequiredOnCreate: true,
    focalPoint: true,
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        withoutEnlargement: true,
        admin: imageSizeAdminOptions,
      },
      {
        name: 'small',
        width: 768,
        withoutEnlargement: true,
        admin: imageSizeAdminOptions,
      },
      {
        name: 'medium',
        width: 1280,
        withoutEnlargement: true,
        admin: imageSizeAdminOptions,
      },
      {
        name: 'large',
        width: 1920,
        withoutEnlargement: true,
        admin: imageSizeAdminOptions,
      },
    ],
    mimeTypes: [...allowedMimeTypes],
    modifyResponseHeaders: ({ headers }) => {
      headers.set('Cache-Control', 'public, max-age=31536000, immutable')
      headers.set('X-Content-Type-Options', 'nosniff')
      return headers
    },
    pasteURL: false,
    staticDir: path.resolve(process.cwd(), 'public/uploads'),
    withMetadata: false,
  },
  fields: [
    {
      name: 'internalTitle',
      type: 'text',
      admin: {
        description: 'Internal label used to identify this image in the Media Library.',
      },
      access: {
        create: contentEditorFieldAccess,
        read: authenticatedFieldAccess,
        update: contentEditorFieldAccess,
      },
    },
    {
      name: 'alt',
      type: 'text',
      localized: true,
      required: true,
      admin: {
        description:
          'Required for the currently selected locale. Describe the image for accessibility; do not repeat decorative text.',
      },
    },
    {
      name: 'caption',
      type: 'textarea',
      localized: true,
      admin: {
        description: 'Optional public-facing caption for the selected locale.',
      },
    },
    {
      name: 'credit',
      type: 'text',
      admin: {
        description: 'Photographer, creator, or source credit.',
      },
    },
    {
      name: 'tags',
      type: 'array',
      maxRows: 30,
      fields: [
        {
          name: 'tag',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'folder',
      type: 'select',
      defaultValue: 'general',
      options: [
        { label: 'Homepage', value: 'homepage' },
        { label: 'Projects', value: 'projects' },
        { label: 'Clients', value: 'clients' },
        { label: 'Stories', value: 'stories' },
        { label: 'Team', value: 'team' },
        { label: 'General', value: 'general' },
      ],
    },
    {
      name: 'usageNotes',
      type: 'textarea',
      admin: {
        description: 'Internal notes about licensing, approved usage, or replacement.',
        position: 'sidebar',
      },
      access: {
        create: contentEditorFieldAccess,
        read: authenticatedFieldAccess,
        update: contentEditorFieldAccess,
      },
    },
  ],
  timestamps: true,
  versions: false,
}
