import { getTranslations } from 'next-intl/server'

export default async function Loading() {
  const t = await getTranslations('Loading')

  return (
    <main className="grid min-h-screen place-items-center" aria-live="polite">
      <p className="text-sm tracking-[0.2em] text-muted uppercase">{t('label')}</p>
    </main>
  )
}
