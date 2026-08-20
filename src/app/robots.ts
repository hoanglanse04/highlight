import type { MetadataRoute } from 'next'

import { getSiteURL } from '@/lib/seo/homepage'

export default function robots(): MetadataRoute.Robots {
  const siteURL = getSiteURL()?.origin || 'https://highlightmedia.vn'

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/admin/*', '/api/', '/api/*'],
      },
    ],
    sitemap: `${siteURL}/sitemap.xml`,
  }
}
