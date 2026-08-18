import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { buildConfig } from 'payload'
import { vi } from 'payload/i18n/vi'
import sharp from 'sharp'

import { Media } from '@/collections/Media'
import { ProjectCategories } from '@/collections/ProjectCategories'
import { Projects } from '@/collections/Projects'
import { Users } from '@/collections/Users'
import { Footer } from '@/globals/Footer'
import { Header } from '@/globals/Header'
import { Homepage } from '@/globals/Homepage'
import { SiteSettings } from '@/globals/SiteSettings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
const serverURL = process.env.NEXT_PUBLIC_SERVER_URL ?? 'http://localhost:3000'

export default buildConfig({
  admin: {
    avatar: {
      Component: {
        path: '@/components/admin/AccountDropdown',
        exportName: 'AccountDropdown',
      },
    },
    components: {
      beforeLogin: [
        {
          path: '@/components/admin/PasswordToggle',
          exportName: 'PasswordToggle',
        },
      ],
      beforeNavLinks: [
        {
          path: '@/components/admin/DashboardNavLink',
          exportName: 'DashboardNavLink',
        },
        {
          path: '@/components/admin/ConfirmationEnhancer',
          exportName: 'ConfirmationEnhancer',
        },
      ],
      views: {
        dashboard: {
          Component: {
            path: '@/components/admin/AdminDashboard',
            exportName: 'AdminDashboard',
          },
        },
      },
    },
    meta: {
      titleSuffix: ' — Highlight Production',
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
    user: Users.slug,
  },
  collections: [Users, Media, Projects, ProjectCategories],
  globals: [Homepage, Header, Footer, SiteSettings],
  db: postgresAdapter({
    pool: {
      connectionString:
        process.env.DATABASE_URI ??
        'postgresql://highlight:highlight@localhost:5432/highlight',
    },
  }),
  editor: lexicalEditor(),
  i18n: {
    fallbackLanguage: 'vi',
    supportedLanguages: {
      vi,
    },
  },
  localization: {
    locales: [
      {
        code: 'vi',
        label: 'Tiếng Việt',
      },
      {
        code: 'en',
        label: 'English',
        fallbackLocale: 'vi',
      },
    ],
    defaultLocale: 'vi',
    fallback: true,
  },
  secret: process.env.PAYLOAD_SECRET ?? '',
  serverURL,
  cors: [serverURL],
  csrf: [serverURL],
  sharp,
  upload: {
    abortOnLimit: true,
    limits: {
      fileSize: 15 * 1024 * 1024,
      files: 1,
    },
  },
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
})
