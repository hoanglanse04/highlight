import type { Metadata } from 'next'
import { hasLocale, NextIntlClientProvider } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
import { Inter, Space_Grotesk } from 'next/font/google'
import { notFound } from 'next/navigation'
import type { ReactNode } from 'react'

import { routing, type AppLocale } from '@/i18n/routing'
import { getSiteURL } from '@/lib/seo/homepage'
import '@/styles/globals.css'

const inter = Inter({
  subsets: ['latin', 'vietnamese'],
  display: 'swap',
  variable: '--font-inter',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin', 'vietnamese'],
  display: 'swap',
  variable: '--font-space-grotesk',
})

type LocaleLayoutProps = {
  children: ReactNode
  params: Promise<{ locale: string }>
}

export const metadata: Metadata = {
  metadataBase: getSiteURL() ?? undefined,
  title: {
    default: 'Highlight Media',
    template: '%s | Highlight Media',
  },
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

function resolveLocale(locale: string): AppLocale {
  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  return locale
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const locale = resolveLocale((await params).locale)

  setRequestLocale(locale)

  return (
    <html
      lang={locale}
      className={`${inter.variable} ${spaceGrotesk.variable}`}
    >
      <body className="overflow-x-clip">
        <NextIntlClientProvider locale={locale}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
