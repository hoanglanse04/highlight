'use client'

import { useTranslations } from 'next-intl'
import { useEffect } from 'react'

type ErrorPageProps = {
  error: Error & { digest?: string }
  reset: () => void
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  const t = useTranslations('Error')

  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <main className="grid min-h-screen place-items-center px-6">
      <section className="max-w-lg text-center">
        <h1 className="font-heading text-4xl font-bold uppercase">{t('title')}</h1>
        <p className="mt-4 text-muted">{t('description')}</p>
        <button className="button button-primary mt-8" onClick={reset} type="button">
          {t('retry')}
        </button>
      </section>
    </main>
  )
}
