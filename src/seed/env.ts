import { z } from 'zod'

const forbiddenSeedMarkers = [
  'alienmedia.vn',
  'alien.media.vietnam',
  'g-nvcddlnn5z',
] as const

function emptyToUndefined(value: unknown): unknown {
  return typeof value === 'string' && value.trim() === '' ? undefined : value
}

const optionalText = z.preprocess(
  emptyToUndefined,
  z.string().trim().min(1).optional(),
)

const optionalEmail = z.preprocess(
  emptyToUndefined,
  z.string().trim().email().optional(),
)

const optionalHTTPURL = z.preprocess(
  emptyToUndefined,
  z
    .string()
    .trim()
    .url()
    .refine((value) => {
      const protocol = new URL(value).protocol
      return protocol === 'http:' || protocol === 'https:'
    }, 'Chỉ chấp nhận URL HTTP(S).')
    .optional(),
)

const optionalPhone = z.preprocess(
  emptyToUndefined,
  z
    .string()
    .trim()
    .regex(
      /^[+()\d][+()\d\s.-]{5,30}$/,
      'HIGHLIGHT_PHONE không phải số điện thoại hợp lệ.',
    )
    .optional(),
)

const optionalNonNegativeInteger = z.preprocess(
  emptyToUndefined,
  z.coerce.number().int().nonnegative().optional(),
)

const optionalMediaID = z.preprocess(
  emptyToUndefined,
  z.coerce.number().int().positive().optional(),
)

const environmentBoolean = z
  .preprocess(
    emptyToUndefined,
    z.enum(['0', '1', 'false', 'true']).optional(),
  )
  .transform((value) => value === '1' || value === 'true')

const seedEnvironmentSchema = z
  .object({
    SEED_DRY_RUN: environmentBoolean,
    SEED_FORCE: environmentBoolean,
    SEED_PUBLISH: environmentBoolean,
    HIGHLIGHT_LEGAL_NAME: optionalText,
    HIGHLIGHT_EMAIL: optionalEmail,
    HIGHLIGHT_PHONE: optionalPhone,
    HIGHLIGHT_ADDRESS_VI: optionalText,
    HIGHLIGHT_ADDRESS_EN: optionalText,
    HIGHLIGHT_FACEBOOK_URL: optionalHTTPURL,
    HIGHLIGHT_INSTAGRAM_URL: optionalHTTPURL,
    HIGHLIGHT_TIKTOK_URL: optionalHTTPURL,
    HIGHLIGHT_YOUTUBE_URL: optionalHTTPURL,
    HIGHLIGHT_VIMEO_URL: optionalHTTPURL,
    HIGHLIGHT_LINKEDIN_URL: optionalHTTPURL,
    HIGHLIGHT_BEHANCE_URL: optionalHTTPURL,
    HIGHLIGHT_HERO_VIDEO_URL: optionalHTTPURL,
    HIGHLIGHT_HERO_MEDIA_ID: optionalMediaID,
    HIGHLIGHT_HERO_POSTER_MEDIA_ID: optionalMediaID,
    HIGHLIGHT_YEARS_EXPERIENCE: optionalNonNegativeInteger,
    HIGHLIGHT_PROJECTS_DELIVERED: optionalNonNegativeInteger,
    HIGHLIGHT_CLIENTS_COUNT: optionalNonNegativeInteger,
    NEXT_PUBLIC_SITE_URL: optionalHTTPURL,
  })
  .superRefine((value, context) => {
    for (const [key, rawValue] of Object.entries(value)) {
      if (typeof rawValue !== 'string') continue

      const normalized = rawValue.toLowerCase()
      const marker = forbiddenSeedMarkers.find((candidate) =>
        normalized.includes(candidate),
      )

      if (marker) {
        context.addIssue({
          code: 'custom',
          message: `${key} chứa domain hoặc identifier bị cấm: ${marker}.`,
          path: [key],
        })
      }
    }
  })

export type SeedConfig = z.infer<typeof seedEnvironmentSchema>

export function parseSeedConfig(
  environment: NodeJS.ProcessEnv = process.env,
): SeedConfig {
  return seedEnvironmentSchema.parse(environment)
}

