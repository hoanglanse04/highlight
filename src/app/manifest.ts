import type { MetadataRoute } from 'next'

import { getSiteSettings } from '@/lib/payload/websiteGlobals'

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const settings = await getSiteSettings('vi', false)
  const siteName = settings?.brand.siteName || 'Highlight Media'
  const description =
    settings?.seoDefaults?.defaultMetaDescription ||
    'Highlight Media - Creative Production House & Event Marketing'

  return {
    name: siteName,
    short_name: siteName,
    description,
    start_url: '/vi',
    display: 'standalone',
    background_color: '#0a0a0a',
    theme_color: '#ff5c00',
    icons: [
      {
        src: '/admin-login-logo.jpg',
        sizes: 'any',
        type: 'image/jpeg',
      },
    ],
  }
}
