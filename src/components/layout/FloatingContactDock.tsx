import type { ReactNode } from 'react'

import type { AppLocale } from '@/i18n/routing'
import { getEnabledItems } from '@/lib/content/homepage'
import { resolveExternalURL, toTelephoneHref } from '@/lib/urls'
import type { SiteSetting } from '@/payload-types'

type ContactLink = {
  external?: boolean
  href: string
  icon: ReactNode
  label: string
}

function PhoneIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        d="M7.2 3.5 4.5 4.8c-.8.4-1.2 1.3-.9 2.1 2.2 6.5 7.3 11.6 13.8 13.8.8.3 1.7-.1 2.1-.9l1.3-2.7c.4-.8.1-1.8-.7-2.2l-3.1-1.5c-.7-.3-1.5-.1-2 .5l-1.2 1.5a15.3 15.3 0 0 1-5.2-5.2L10.1 9c.6-.5.8-1.3.5-2L9.1 3.9c-.4-.8-1.3-1.1-1.9-.4Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  )
}

function EmailIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
    >
      <rect
        height="15"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.8"
        width="19"
        x="2.5"
        y="4.5"
      />
      <path
        d="m4 6 8 6 8-6"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  )
}

function SocialIcon({ platform }: { platform: string }) {
  if (platform === 'facebook') {
    return (
      <span
        aria-hidden="true"
        className="font-heading text-xl leading-none font-bold lowercase"
      >
        f
      </span>
    )
  }

  if (platform === 'youtube') {
    return (
      <svg
        aria-hidden="true"
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
      >
        <rect
          height="14"
          rx="4"
          stroke="currentColor"
          strokeWidth="1.8"
          width="20"
          x="2"
          y="5"
        />
        <path d="m10 9 5 3-5 3V9Z" fill="currentColor" />
      </svg>
    )
  }

  return (
    <span aria-hidden="true" className="text-xs font-bold uppercase">
      {platform.slice(0, 2)}
    </span>
  )
}

export function FloatingContactDock({
  locale,
  settings,
}: {
  locale: AppLocale
  settings: SiteSetting | null
}) {
  const links: ContactLink[] = []
  const phone = settings?.contact?.phone
  const phoneHref = toTelephoneHref(phone)
  const email = settings?.contact?.email

  if (phone && phoneHref) {
    links.push({
      href: `tel:${phoneHref}`,
      icon: <PhoneIcon />,
      label: locale === 'vi' ? `Gọi ${phone}` : `Call ${phone}`,
    })
  }

  if (email) {
    links.push({
      href: `mailto:${email}`,
      icon: <EmailIcon />,
      label: `Email ${email}`,
    })
  }

  for (const social of getEnabledItems(settings?.social?.socialLinks)) {
    const href = resolveExternalURL(social.url)
    if (!href) continue

    links.push({
      external: true,
      href,
      icon: <SocialIcon platform={social.platform} />,
      label: social.label || social.platform,
    })
  }

  if (!links.length) return null

  return (
    <nav
      aria-label={locale === 'vi' ? 'Liên hệ nhanh' : 'Quick contact'}
      className="fixed right-3 bottom-4 z-40 flex flex-col gap-2 sm:right-5 sm:bottom-5"
    >
      {links.map((link) => (
        <a
          aria-label={link.label}
          className="group relative grid h-11 w-11 place-items-center rounded-full border border-white/25 bg-brand text-white shadow-xl transition-[transform,background-color,color,border-color] duration-200 hover:scale-105 hover:border-brand hover:bg-white hover:text-brand focus-visible:scale-105 focus-visible:bg-white focus-visible:text-brand focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-brand sm:h-12 sm:w-12"
          href={link.href}
          key={link.href}
          rel={link.external ? 'noopener noreferrer' : undefined}
          target={link.external ? '_blank' : undefined}
        >
          {link.icon}
          <span className="pointer-events-none absolute top-1/2 right-[calc(100%+0.65rem)] -translate-y-1/2 translate-x-2 whitespace-nowrap rounded-sm bg-background/95 px-3 py-2 text-[0.68rem] font-bold tracking-[0.08em] text-white uppercase opacity-0 shadow-xl backdrop-blur transition-[opacity,transform] group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100">
            {link.label}
          </span>
        </a>
      ))}
    </nav>
  )
}
