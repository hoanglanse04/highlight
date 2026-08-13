import type {
  CheckboxFieldValidation,
  NumberFieldSingleValidation,
  RelationshipFieldManyValidation,
  RelationshipFieldSingleValidation,
  TextFieldValidation,
} from 'payload'

import { detectExternalVideo } from '@/lib/media/video'

const HTTP_PROTOCOLS = new Set(['http:', 'https:'])

function isHTTPURL(value: string): boolean {
  try {
    return HTTP_PROTOCOLS.has(new URL(value).protocol)
  } catch {
    return false
  }
}

export const validateInternalOrExternalURL: TextFieldValidation = (value) => {
  if (!value) return true

  if (value.startsWith('/') && !value.startsWith('//')) {
    return true
  }

  return isHTTPURL(value) || 'Nhập đường dẫn nội bộ hoặc URL HTTP(S) đầy đủ.'
}

export const validateExternalURL: TextFieldValidation = (value) =>
  !value || isHTTPURL(value) || 'Nhập URL HTTP(S) hợp lệ.'

export const validateSupportedVideoURL: TextFieldValidation = (value) =>
  !value ||
  Boolean(detectExternalVideo(value)) ||
  'Dùng URL HTTP(S) của YouTube, Vimeo, tệp .mp4 hoặc .webm được hỗ trợ.'

export const validateRequiredSupportedVideoURL: TextFieldValidation = (value) =>
  value
    ? Boolean(detectExternalVideo(value)) ||
      'Dùng URL HTTP(S) của YouTube, Vimeo, tệp .mp4 hoặc .webm được hỗ trợ.'
    : 'Bắt buộc nhập URL video bên ngoài.'

export const validateAutoplayMuted: CheckboxFieldValidation = (
  value,
  { siblingData },
) =>
  !value ||
  (siblingData as { muted?: unknown } | undefined)?.muted === true ||
  'Chỉ được tự động phát khi đã bật chế độ tắt tiếng.'

export const validatePhone: TextFieldValidation = (value) => {
  if (!value) return true

  return (
    (/^[+()\d][+()\d\s.-]{5,30}$/.test(value) && /\d/.test(value)) ||
    'Nhập số điện thoại hợp lệ.'
  )
}

export const validateNonNegativeInteger: NumberFieldSingleValidation = (value) =>
  value === undefined ||
  value === null ||
  (Number.isInteger(value) && value >= 0) ||
  'Nhập số nguyên lớn hơn hoặc bằng 0.'

export const validateYear: NumberFieldSingleValidation = (value) =>
  value === undefined ||
  value === null ||
  (Number.isInteger(value) && value >= 1900 && value <= 2100) ||
  'Nhập năm nguyên trong khoảng 1900–2100.'

export function validateIntegerRange(
  minimum: number,
  maximum: number,
): NumberFieldSingleValidation {
  return (value) =>
    value === undefined ||
    value === null ||
    (Number.isInteger(value) && value >= minimum && value <= maximum) ||
    `Nhập số nguyên trong khoảng ${minimum}–${maximum}.`
}

export const validateHeroVideoURL: TextFieldValidation = (value, { siblingData }) => {
  const mediaType = (siblingData as { mediaType?: unknown } | undefined)?.mediaType

  if (mediaType !== 'externalVideo') {
    return !value || isHTTPURL(value) || 'Nhập URL HTTP(S) hợp lệ.'
  }

  return value
    ? isHTTPURL(value) || 'Nhập URL HTTP(S) hợp lệ.'
    : 'Bắt buộc nhập URL video bên ngoài.'
}

export const validateProjectHeroVideoURL: TextFieldValidation = (
  value,
  { siblingData },
) => {
  const mediaType = (siblingData as { heroMediaType?: unknown } | undefined)
    ?.heroMediaType

  if (mediaType !== 'externalVideo') {
    return (
      !value ||
      Boolean(detectExternalVideo(value)) ||
      'Dùng URL HTTP(S) của YouTube, Vimeo, tệp .mp4 hoặc .webm được hỗ trợ.'
    )
  }

  return value
    ? Boolean(detectExternalVideo(value)) ||
        'Dùng URL HTTP(S) của YouTube, Vimeo, tệp .mp4 hoặc .webm được hỗ trợ.'
    : 'Bắt buộc nhập URL video bên ngoài.'
}

function relationshipID(value: unknown): number | string | null {
  if (typeof value === 'number' || typeof value === 'string') return value
  if (value && typeof value === 'object' && 'value' in value) {
    const nested = (value as { value?: unknown }).value
    if (typeof nested === 'number' || typeof nested === 'string') return nested
  }
  return null
}

export const validateProjectRelationshipList: RelationshipFieldManyValidation = (
  value,
  { id },
) => {
  if (value && value.length > 8) return 'Chọn tối đa 8 dự án liên quan.'
  if (!value || id === undefined) return true
  return (
    !value.some((item) => String(relationshipID(item)) === String(id)) ||
    'Dự án không thể liên kết với chính nó.'
  )
}

export function requireMediaForHeroType(
  expectedType: 'externalVideo' | 'image',
  message: string,
): RelationshipFieldSingleValidation {
  return (value, { siblingData }) => {
    const mediaType = (siblingData as { mediaType?: unknown } | undefined)?.mediaType

    return mediaType !== expectedType || Boolean(value) || message
  }
}

export function requireMediaForProjectHeroType(
  expectedType: 'externalVideo' | 'image',
  message: string,
): RelationshipFieldSingleValidation {
  return (value, { siblingData }) => {
    const mediaType = (siblingData as { heroMediaType?: unknown } | undefined)
      ?.heroMediaType

    return mediaType !== expectedType || Boolean(value) || message
  }
}
