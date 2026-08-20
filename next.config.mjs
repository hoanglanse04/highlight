import { withPayload } from '@payloadcms/next/withPayload'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Project routes resolve publication state in generateMetadata so notFound()
  // can return an HTTP 404 before the document shell starts streaming.
  htmlLimitedBots: /.*/,
  reactStrictMode: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    localPatterns: [
      {
        pathname: '/api/media/file/**',
      },
      {
        pathname: '/images/**',
      },
      {
        pathname: '/**',
      },
    ],
  },
}

export default withPayload(withNextIntl(nextConfig))
