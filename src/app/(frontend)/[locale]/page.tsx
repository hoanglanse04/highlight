import { getTranslations, setRequestLocale } from 'next-intl/server'
import NextLink from 'next/link'

import { Link } from '@/i18n/navigation'
import { routing } from '@/i18n/routing'

type HomePageProps = {
  params: Promise<{ locale: string }>
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('Foundation')
  const alternateLocale = locale === 'vi' ? 'en' : 'vi'

  return (
    <main className="flex min-h-screen items-center px-6 py-16 sm:px-10 lg:px-16">
      <section className="mx-auto w-full max-w-6xl">
        <p className="mb-6 text-sm font-semibold tracking-[0.24em] text-brand uppercase">
          {t('eyebrow')}
        </p>
        <h1 className="max-w-4xl font-heading text-5xl leading-[0.96] font-bold tracking-[-0.05em] uppercase sm:text-7xl lg:text-8xl">
          {t('title')}
        </h1>
        <p className="mt-8 max-w-2xl text-base leading-7 text-muted sm:text-lg">
          {t('description')}
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <NextLink className="button button-primary" href="/admin">
            {t('admin')}
          </NextLink>
          <Link
            className="button button-secondary"
            href="/"
            locale={alternateLocale}
          >
            {t('language')}
          </Link>
        </div>
        <p className="mt-16 text-xs tracking-[0.2em] text-muted uppercase">
          {routing.locales.join(' / ')}
        </p>
      </section>
    </main>
  )
}
