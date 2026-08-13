import Link from 'next/link'
import type { AnchorHTMLAttributes, ReactNode } from 'react'

import type { AppLocale } from '@/i18n/routing'
import { resolveSafeHref } from '@/lib/urls'

type SmartLinkProps = {
  children: ReactNode
  className?: string
  href?: string | null
  locale?: AppLocale
  openInNewTab?: boolean | null
} & Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  'children' | 'className' | 'href' | 'target'
>

export function SmartLink({
  children,
  className,
  href,
  locale,
  openInNewTab,
  ...props
}: SmartLinkProps) {
  const safe = resolveSafeHref(href, locale)
  if (!safe) return null

  const target = openInNewTab ? '_blank' : undefined
  const rel = openInNewTab ? 'noopener noreferrer' : undefined

  if (safe.external) {
    return (
      <a
        className={className}
        href={safe.href}
        rel={rel}
        target={target}
        {...props}
      >
        {children}
      </a>
    )
  }

  return (
    <Link
      className={className}
      href={safe.href}
      rel={rel}
      target={target}
      {...props}
    >
      {children}
    </Link>
  )
}
