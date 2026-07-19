import type {
  NumberFieldSingleValidation,
  RelationshipFieldSingleValidation,
  TextFieldValidation,
} from 'payload'

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

  return isHTTPURL(value) || 'Enter a relative path or a full HTTP(S) URL.'
}

export const validateExternalURL: TextFieldValidation = (value) =>
  !value || isHTTPURL(value) || 'Enter a valid HTTP(S) URL.'

export const validatePhone: TextFieldValidation = (value) => {
  if (!value) return true

  return (
    (/^[+()\d][+()\d\s.-]{5,30}$/.test(value) && /\d/.test(value)) ||
    'Enter a valid phone number.'
  )
}

export const validateNonNegativeInteger: NumberFieldSingleValidation = (value) =>
  value === undefined ||
  value === null ||
  (Number.isInteger(value) && value >= 0) ||
  'Enter a whole number greater than or equal to 0.'

export const validateYear: NumberFieldSingleValidation = (value) =>
  value === undefined ||
  value === null ||
  (Number.isInteger(value) && value >= 1900 && value <= 2100) ||
  'Enter a whole year between 1900 and 2100.'

export const validateHeroVideoURL: TextFieldValidation = (value, { siblingData }) => {
  const mediaType = (siblingData as { mediaType?: unknown } | undefined)?.mediaType

  if (mediaType !== 'externalVideo') {
    return !value || isHTTPURL(value) || 'Enter a valid HTTP(S) URL.'
  }

  return value
    ? isHTTPURL(value) || 'Enter a valid HTTP(S) URL.'
    : 'External video URL is required.'
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
