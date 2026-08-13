'use client'

import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'

import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher'
import { PayloadImage } from '@/components/media/PayloadImage'
import { SmartLink } from '@/components/ui/SmartLink'
import type { AppLocale } from '@/i18n/routing'
import { getEnabledItems } from '@/lib/content/homepage'
import type { Header, Media } from '@/payload-types'

type SiteHeaderProps = {
  closeMenuLabel: string
  header: Header | null
  languagePaths?: Record<AppLocale, string>
  locale: AppLocale
  openMenuLabel: string
  primaryNavigationLabel: string
  siteName: string
  switchLanguageLabel: string
}

export function SiteHeader({
  closeMenuLabel,
  header,
  languagePaths,
  locale,
  openMenuLabel,
  primaryNavigationLabel,
  siteName,
  switchLanguageLabel,
}: SiteHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const dialogRef = useRef<HTMLDialogElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const reducedMotion = useReducedMotion()
  const branding = header?.branding
  const navigation = getEnabledItems(header?.navigation?.items)
  const cta = header?.cta?.button
  const sticky = branding?.sticky !== false
  const logo = branding?.logoLight ?? branding?.logoDark

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (menuOpen && !dialog.open) {
      dialog.showModal()
      document.body.style.overflow = 'hidden'
      requestAnimationFrame(() => closeButtonRef.current?.focus())
    } else if (!menuOpen && dialog.open) {
      dialog.close()
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  const closeMenu = () => {
    setMenuOpen(false)
    document.body.style.overflow = ''
  }

  return (
    <header
      className={`${sticky ? 'sticky' : 'relative'} inset-x-0 top-0 z-50 w-full border-b border-white/10 bg-background/95 backdrop-blur-xl`}
    >
      <div className="mx-auto flex h-[78px] w-full max-w-[92.5rem] items-center justify-between gap-5 px-5 md:h-[92px] md:px-10 xl:px-14">
        <SmartLink
          aria-label={siteName}
          className="relative z-10 flex min-w-0 items-center gap-3 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
          href="/"
          locale={locale}
        >
          {typeof logo === 'object' ? (
            <PayloadImage
              alt={siteName}
              className="h-12 w-auto object-contain md:h-14"
              media={logo as Media}
              preferredSize="thumbnail"
              sizes="(min-width: 768px) 80px, 68px"
            />
          ) : (
            <span className="truncate font-heading text-xl font-bold tracking-[-0.045em] uppercase md:text-2xl">
              {siteName}
            </span>
          )}
        </SmartLink>

        <nav
          aria-label={primaryNavigationLabel}
          className="hidden items-center gap-9 lg:flex xl:gap-12"
        >
          {navigation.map((item) => (
            <SmartLink
              className="nav-link"
              href={item.url}
              key={item.id ?? item.internalName}
              locale={locale}
              openInNewTab={item.openInNewTab}
            >
              {item.label}
            </SmartLink>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-4">
          {branding?.showLanguageSwitcher !== false ? (
            <LanguageSwitcher
              className="hidden sm:flex"
              label={switchLanguageLabel}
              languagePaths={languagePaths}
              locale={locale}
            />
          ) : null}
          {cta?.enabled !== false && cta?.label && cta.url ? (
            <SmartLink
              className="button button-primary hidden lg:inline-flex"
              href={cta.url}
              locale={locale}
              openInNewTab={cta.openInNewTab}
            >
              {cta.label}
            </SmartLink>
          ) : null}
          <button
            aria-expanded={menuOpen}
            aria-haspopup="dialog"
            aria-label={openMenuLabel}
            className="menu-button inline-flex lg:hidden"
            onClick={() => setMenuOpen(true)}
            type="button"
          >
            <span aria-hidden="true" className="h-px w-6 bg-current" />
            <span aria-hidden="true" className="h-px w-6 bg-current" />
          </button>
        </div>
      </div>

      <dialog
        aria-label={openMenuLabel}
        className="mobile-menu-dialog"
        onCancel={(event) => {
          event.preventDefault()
          closeMenu()
        }}
        onClose={closeMenu}
        ref={dialogRef}
      >
        <AnimatePresence>
          {menuOpen ? (
            <motion.div
              animate={{ opacity: 1, x: 0 }}
              className="cinematic-grain relative flex min-h-dvh flex-col overflow-hidden bg-background px-5 py-5 sm:px-8"
              exit={reducedMotion ? undefined : { opacity: 0, x: 24 }}
              initial={reducedMotion ? false : { opacity: 0, x: 24 }}
              transition={{ duration: reducedMotion ? 0 : 0.24 }}
            >
              <div className="flex h-14 items-start justify-between">
                {branding?.showLanguageSwitcher !== false ? (
                  <LanguageSwitcher
                    label={switchLanguageLabel}
                    languagePaths={languagePaths}
                    locale={locale}
                    onNavigate={closeMenu}
                  />
                ) : (
                  <span />
                )}
                <button
                  aria-label={closeMenuLabel}
                  className="menu-button inline-flex"
                  onClick={closeMenu}
                  ref={closeButtonRef}
                  type="button"
                >
                  <span
                    aria-hidden="true"
                    className="absolute h-px w-6 rotate-45 bg-current"
                  />
                  <span
                    aria-hidden="true"
                    className="absolute h-px w-6 -rotate-45 bg-current"
                  />
                </button>
              </div>
              <nav
                aria-label={primaryNavigationLabel}
                className="relative z-10 flex flex-1 flex-col justify-center gap-1 py-8"
              >
                {navigation.map((item, index) => (
                  <SmartLink
                    className="border-b border-white/12 py-3 font-heading text-[clamp(2.25rem,9vw,4rem)] leading-[1.15] font-semibold tracking-[-0.025em] uppercase"
                    href={item.url}
                    key={item.id ?? item.internalName}
                    locale={locale}
                    onClick={closeMenu}
                    openInNewTab={item.openInNewTab}
                  >
                    <span className="mr-4 align-middle text-xs text-brand">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    {item.label}
                  </SmartLink>
                ))}
              </nav>
              {cta?.enabled !== false && cta?.label && cta.url ? (
                <SmartLink
                  className="button button-primary w-full"
                  href={cta.url}
                  locale={locale}
                  onClick={closeMenu}
                  openInNewTab={cta.openInNewTab}
                >
                  {cta.label}
                </SmartLink>
              ) : null}
            </motion.div>
          ) : null}
        </AnimatePresence>
      </dialog>
    </header>
  )
}
