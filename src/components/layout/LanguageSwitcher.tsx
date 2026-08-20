import NextLink from 'next/link'

import { Link } from '@/i18n/navigation'
import type { AppLocale } from '@/i18n/routing'

function VietnamFlag({ className = '' }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      viewBox="0 0 30 20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect fill="#DA251D" height="20" width="30" />
      <polygon
        fill="#FFFF00"
        points="15,4 16.85,9.7 22.84,9.7 18,13.2 19.85,18.9 15,15.4 10.15,18.9 12,13.2 7.16,9.7 13.15,9.7"
      />
    </svg>
  )
}

function UKFlag({ className = '' }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      viewBox="0 0 60 40"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect fill="#012169" height="40" width="60" />
      <path d="M0,0 L60,40 M60,0 L0,40" stroke="#FFFFFF" strokeWidth="8" />
      <path d="M0,0 L60,40 M60,0 L0,40" stroke="#C8102E" strokeWidth="4" />
      <path d="M30,0 v40 M0,20 h60" stroke="#FFFFFF" strokeWidth="12" />
      <path d="M30,0 v40 M0,20 h60" stroke="#C8102E" strokeWidth="7" />
    </svg>
  )
}

const LOCALES = [
  {
    code: 'vi' as const,
    label: 'VI',
    fullLabel: 'Tiếng Việt',
    Flag: VietnamFlag,
  },
  {
    code: 'en' as const,
    label: 'EN',
    fullLabel: 'English',
    Flag: UKFlag,
  },
]

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
      className={`inline-flex items-center gap-0.5 rounded-full border border-white/10 bg-white/[0.04] p-1 backdrop-blur-md transition-colors hover:border-white/20 ${className}`}
    >
      {LOCALES.map(({ code, label: codeLabel, fullLabel, Flag }) => {
        const isActive = code === locale
        const itemClass = `group relative inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.72rem] font-bold tracking-[0.08em] uppercase transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${
          isActive
            ? 'bg-white/15 text-white shadow-[0_1px_3px_rgba(0,0,0,0.5),0_0_12px_rgba(255,92,0,0.2)] ring-1 ring-brand/50'
            : 'text-white/60 hover:bg-white/[0.08] hover:text-white'
        }`

        const content = (
          <>
            <span
              className={`inline-flex h-3.5 w-4.5 shrink-0 items-center justify-center overflow-hidden rounded-[2px] shadow-sm ring-1 ring-black/40 transition-all duration-200 ${
                isActive
                  ? 'scale-100 opacity-100'
                  : 'opacity-70 group-hover:scale-105 group-hover:opacity-100'
              }`}
            >
              <Flag className="h-full w-full object-cover" />
            </span>
            <span className="leading-none">{codeLabel}</span>
          </>
        )

        return languagePaths ? (
          <NextLink
            aria-current={isActive ? 'page' : undefined}
            className={itemClass}
            href={languagePaths[code]}
            key={code}
            onClick={onNavigate}
            title={fullLabel}
          >
            {content}
          </NextLink>
        ) : (
          <Link
            aria-current={isActive ? 'page' : undefined}
            className={itemClass}
            href="/"
            key={code}
            locale={code}
            onClick={onNavigate}
            title={fullLabel}
          >
            {content}
          </Link>
        )
      })}
    </nav>
  )
}
