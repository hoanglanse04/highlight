import { randomBytes } from 'node:crypto'

import {
  APIError,
  type CollectionBeforeValidateHook,
  type Field,
  type TextFieldValidation,
} from 'payload'

import { authenticatedFieldAccess } from '@/access/users'

export const RESERVED_PROJECT_SLUGS = new Set([
  'admin',
  'api',
  'du-an',
  'edit',
  'en',
  'health',
  'login',
  'new',
  'preview',
  'projects',
  'uploads',
  'vi',
])

const SAFE_SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const TEMPORARY_SLUG = /^draft-[a-f0-9]{12}$/

function createTemporarySlug(): string {
  return `draft-${randomBytes(6).toString('hex')}`
}

export function slugifyProjectValue(value: unknown): string {
  if (typeof value !== 'string') return ''

  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 120)
    .replace(/-+$/g, '')
}

export function isSafeProjectSlug(value: unknown): value is string {
  return (
    typeof value === 'string' &&
    value.length <= 120 &&
    SAFE_SLUG.test(value) &&
    !RESERVED_PROJECT_SLUGS.has(value)
  )
}

export const validateProjectSlug: TextFieldValidation = (value) => {
  if (!value) return 'Bắt buộc nhập slug.'
  if (value.length > 120) return 'Slug không được vượt quá 120 ký tự.'
  if (!SAFE_SLUG.test(value)) return 'Chỉ dùng chữ thường không dấu và dấu gạch ngang.'
  if (RESERVED_PROJECT_SLUGS.has(value)) return 'Slug này đã được dành riêng.'
  return true
}

export const populateProjectSlug: CollectionBeforeValidateHook = ({
  data,
  originalDoc,
}) => {
  if (!data) return data

  const existingSlug = typeof originalDoc?.slug === 'string' ? originalDoc.slug : ''
  const submittedSlug = typeof data.slug === 'string' ? data.slug : ''

  if (submittedSlug && /[./\\%?#\0]/.test(submittedSlug)) {
    throw new APIError('Slug chứa ký tự đường dẫn không an toàn.', 400)
  }

  const source =
    (submittedSlug && !TEMPORARY_SLUG.test(submittedSlug)
      ? submittedSlug
      : '') ||
    (existingSlug && !TEMPORARY_SLUG.test(existingSlug) ? existingSlug : '') ||
    (typeof data.internalName === 'string' ? data.internalName : '') ||
    (typeof data.title === 'string' ? data.title : '')

  data.slug =
    slugifyProjectValue(source) ||
    (TEMPORARY_SLUG.test(submittedSlug) ? submittedSlug : '') ||
    (TEMPORARY_SLUG.test(existingSlug) ? existingSlug : '') ||
    createTemporarySlug()
  return data
}

export function projectSlugField(): Field {
  return {
    name: 'slug',
    type: 'text',
    label: 'Slug đường dẫn',
    unique: true,
    index: true,
    required: true,
    maxLength: 120,
    validate: validateProjectSlug,
    admin: {
      description:
        'Dùng chung cho URL tiếng Việt và tiếng Anh. Được tạo khi thêm mới và không tự đổi về sau. Sửa slug đã xuất bản có thể làm hỏng liên kết cũ.',
      position: 'sidebar',
    },
  }
}

export function internalNameField(): Field {
  return {
    name: 'internalName',
    type: 'text',
    label: 'Tên nội bộ',
    required: true,
    maxLength: 120,
    access: {
      read: authenticatedFieldAccess,
    },
    admin: {
      description: 'Nhãn dùng trong CMS; không hiển thị trên website public.',
    },
  }
}
