'use client'

import { useEffect } from 'react'

const EYE_OPEN_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>`
const EYE_OFF_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>`

export function PasswordToggle() {
  useEffect(() => {
    function attachToggleToInput(input: HTMLInputElement) {
      // Skip inputs inside custom modal forms that have their own React state toggle
      if (input.closest('.highlight-create-user-modal, .highlight-account-modal, .highlight-modal-field')) {
        return
      }

      // Find the immediate wrapper div or parent
      const parent = input.parentElement
      if (!parent) return

      // Don't re-attach if button already exists in this parent
      let btn = parent.querySelector<HTMLButtonElement>('.highlight-password-toggle-btn')
      if (btn) return

      // Ensure parent is relatively positioned
      parent.style.position = 'relative'
      parent.style.display = 'flex'
      parent.style.alignItems = 'center'
      parent.style.width = '100%'

      btn = document.createElement('button')
      btn.type = 'button'
      btn.className = 'highlight-password-toggle-btn'
      btn.setAttribute('tabindex', '-1')

      const syncState = () => {
        const isVisible = input.type === 'text'
        btn!.innerHTML = isVisible ? EYE_OFF_SVG : EYE_OPEN_SVG
        btn!.title = isVisible ? 'Ẩn mật khẩu' : 'Hiển thị mật khẩu'
        btn!.setAttribute('aria-label', isVisible ? 'Ẩn mật khẩu' : 'Hiển thị mật khẩu')
        btn!.setAttribute('aria-pressed', String(isVisible))
      }

      syncState()

      btn.addEventListener('click', (e) => {
        e.preventDefault()
        e.stopPropagation()
        input.type = input.type === 'password' ? 'text' : 'password'
        syncState()
        input.focus()
      })

      parent.appendChild(btn)
    }

    function scanInputs() {
      // Target password fields across login, reset password, and admin forms
      const selector = [
        'input[type="password"]',
        'input[name="password"]',
        'input#field-password',
        '.field-type.password input',
        '.password input',
      ].join(', ')

      const inputs = document.querySelectorAll<HTMLInputElement>(selector)
      inputs.forEach(attachToggleToInput)
    }

    // Initial scan
    scanInputs()

    // Observe DOM mutations to catch re-renders and modal openings
    const observer = new MutationObserver(() => {
      scanInputs()
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    })

    return () => {
      observer.disconnect()
    }
  }, [])

  return null
}
