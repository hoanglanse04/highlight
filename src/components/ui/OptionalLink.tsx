import type { ReactNode } from 'react'

import { SmartLink } from '@/components/ui/SmartLink'
import type { AppLocale } from '@/i18n/routing'
import { resolveSafeHref } from '@/lib/urls'

export function OptionalLink({
  children,
  className,
  href,
  locale,
  openInNewTab,
}: {
  children: ReactNode
  className?: string
  href?: string | null
  locale: AppLocale
  openInNewTab?: boolean | null
}) {
  if (!resolveSafeHref(href, locale))
    return <div className={className}>{children}</div>

  return (
    <SmartLink
      className={className}
      href={href}
      locale={locale}
      openInNewTab={openInNewTab}
    >
      {children}
    </SmartLink>
  )
}
