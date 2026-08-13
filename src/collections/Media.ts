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
    throw new APIError('Ảnh vượt quá giới hạn tải lên 15 MiB.', 413)
  }

  if (!allowedMimeTypes.includes(file.mimetype as AllowedMimeType)) {
    throw new APIError('Chỉ chấp nhận ảnh JPEG, PNG, WebP và AVIF.', 400)
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
    throw new APIError('Tệp tải lên không phải ảnh hợp lệ được hỗ trợ.', 400)
  }

  const canonicalType = getCanonicalFileType(metadata)

  if (!canonicalType || canonicalType.mimeType !== file.mimetype) {
    throw new APIError(
      'Định dạng ảnh phát hiện được không khớp với MIME type đã khai báo.',
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
    singular: 'Hình ảnh',
    plural: 'Thư viện ảnh',
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
    description: 'Tải lên và quản lý ảnh website cùng metadata song ngữ.',
    group: 'Nội dung',
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
      label: 'Tên nội bộ',
      admin: {
        description: 'Nhãn nội bộ giúp nhận diện ảnh trong thư viện.',
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
      label: 'Văn bản thay thế (alt)',
      localized: true,
      required: true,
      admin: {
        description:
          'Bắt buộc cho ngôn ngữ đang chọn. Mô tả nội dung ảnh để hỗ trợ khả năng tiếp cận; không lặp lại chữ trang trí.',
      },
    },
    {
      name: 'caption',
      type: 'textarea',
      label: 'Chú thích',
      localized: true,
      admin: {
        description: 'Chú thích hiển thị công khai cho ngôn ngữ đang chọn, không bắt buộc.',
      },
    },
    {
      name: 'credit',
      type: 'text',
      label: 'Nguồn/Tác giả',
      admin: {
        description: 'Tên nhiếp ảnh gia, người sáng tạo hoặc nguồn ảnh.',
      },
    },
    {
      name: 'tags',
      type: 'array',
      label: 'Thẻ',
      maxRows: 30,
      fields: [
        {
          name: 'tag',
          type: 'text',
          label: 'Thẻ',
          required: true,
        },
      ],
    },
    {
      name: 'folder',
      type: 'select',
      label: 'Thư mục nội dung',
      defaultValue: 'general',
      options: [
        { label: 'Trang chủ', value: 'homepage' },
        { label: 'Dự án', value: 'projects' },
        { label: 'Khách hàng', value: 'clients' },
        { label: 'Câu chuyện', value: 'stories' },
        { label: 'Đội ngũ', value: 'team' },
        { label: 'Chung', value: 'general' },
      ],
    },
    {
      name: 'usageNotes',
      type: 'textarea',
      label: 'Ghi chú sử dụng',
      admin: {
        description: 'Ghi chú nội bộ về bản quyền, phạm vi sử dụng hoặc việc thay thế ảnh.',
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
