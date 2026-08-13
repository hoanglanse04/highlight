import Link from 'next/link'

import type { AppLocale } from '@/i18n/routing'

export function PreviewBanner({
  exitLabel,
  exitPath,
  label,
  locale,
}: {
  exitLabel: string
  exitPath?: string
  label: string
  locale: AppLocale
}) {
  return (
    <aside
      className="fixed inset-x-0 bottom-4 z-[70] mx-auto flex w-fit max-w-[calc(100%-2rem)] items-center gap-4 rounded-full border border-brand/60 bg-background/95 px-4 py-2 text-xs shadow-2xl backdrop-blur"
      role="status"
    >
      <span>{label}</span>
      <Link
        className="font-bold text-brand underline underline-offset-4"
        href={`/api/preview/exit?${new URLSearchParams({
          path: exitPath ?? `/${locale}`,
        }).toString()}`}
      >
        {exitLabel}
      </Link>
    </aside>
  )
}
