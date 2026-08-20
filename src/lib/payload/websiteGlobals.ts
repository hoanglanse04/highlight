import { headers } from 'next/headers'
import { getPayload, type PayloadRequest } from 'payload'
import { cache } from 'react'

import type {
  Config,
  Footer,
  Header,
  Homepage,
  SiteSetting,
} from '@/payload-types'
import config from '@payload-config'

export type WebsiteLocale = Config['locale']

type WebsiteGlobalSlug = 'footer' | 'header' | 'homepage' | 'site-settings'

const getWebsiteGlobal = cache(
  async <TSlug extends WebsiteGlobalSlug>(
    slug: TSlug,
    locale: WebsiteLocale,
    draft = false,
  ): Promise<Config['globals'][TSlug] | null> => {
    const payload = await getPayload({ config })
    let user: Config['user'] | null = null

    if (draft) {
      const requestHeaders = await headers()
      const auth = await payload.auth({
        headers: requestHeaders,
        req: { headers: requestHeaders } as unknown as PayloadRequest,
      })
      user = auth.user
    }

    const canReadDraft = draft && Boolean(user)
    const result = await payload.findGlobal({
      slug,
      locale,
      fallbackLocale: 'vi',
      draft: canReadDraft,
      disableErrors: true,
      overrideAccess: false,
      user: user ?? undefined,
    })

    if (!result || Object.keys(result).length === 0) {
      return null
    }

    return result
  },
)

export function getHomepage(locale: WebsiteLocale, draft = false): Promise<Homepage | null> {
  return getWebsiteGlobal('homepage', locale, draft)
}

export function getHeader(locale: WebsiteLocale, draft = false): Promise<Header | null> {
  return getWebsiteGlobal('header', locale, draft)
}

export function getFooter(locale: WebsiteLocale, draft = false): Promise<Footer | null> {
  return getWebsiteGlobal('footer', locale, draft)
}

export function getSiteSettings(
  locale: WebsiteLocale,
  draft = false,
): Promise<SiteSetting | null> {
  return getWebsiteGlobal('site-settings', locale, draft)
}
