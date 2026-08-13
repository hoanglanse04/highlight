import NextLink from 'next/link'

import { Link } from '@/i18n/navigation'
import type { AppLocale } from '@/i18n/routing'

type LanguageSwitcherProps = {
  className?: string
  label: string
  languagePaths?: Record<AppLocale, string>
  locale: AppLocale
  onNavigate?: () => void
}

export function LanguageSwitcher({
  className = '',
  label,
  languagePaths,
  locale,
  onNavigate,
}: LanguageSwitcherProps) {
  return (
    <nav
      aria-label={label}
      className={`flex items-center gap-1 text-xs font-bold tracking-[0.16em] ${className}`}
    >
      {(['vi', 'en'] as const).map((targetLocale) => {
        const className = `rounded px-2 py-2 uppercase transition-colors hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${
          targetLocale === locale ? 'text-brand' : 'text-muted'
        }`
        return languagePaths ? (
          <NextLink
            aria-current={targetLocale === locale ? 'page' : undefined}
            className={className}
            href={languagePaths[targetLocale]}
            key={targetLocale}
            onClick={onNavigate}
          >
            {targetLocale}
          </NextLink>
        ) : (
          <Link
            aria-current={targetLocale === locale ? 'page' : undefined}
            className={className}
            href="/"
            key={targetLocale}
            locale={targetLocale}
            onClick={onNavigate}
          >
            {targetLocale}
          </Link>
        )
      })}
    </nav>
  )
}
