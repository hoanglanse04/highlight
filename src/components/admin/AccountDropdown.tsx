'use client'

import { useAuth } from '@payloadcms/ui'
import { useRouter } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'

export function AccountDropdown() {
  const { user, logOut } = useAuth()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const toggleDropdown = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsOpen((prev) => !prev)
  }

  const handleAccountClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsOpen(false)
    router.push('/admin/account')
  }

  const handleLogoutClick = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsOpen(false)
    try {
      if (typeof logOut === 'function') {
        await logOut()
      }
    } catch (error) {
      console.error('Logout error:', error)
    }
    window.location.href = '/admin/login'
  }

  useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  const userEmail = typeof user?.email === 'string' ? user.email : 'Tài khoản quản trị'
  const userName =
    typeof user?.name === 'string' && user.name.trim() !== ''
      ? user.name
      : userEmail.split('@')[0] || 'Admin'

  const userRole =
    Array.isArray(user?.roles) && user.roles.includes('admin')
      ? 'Quản trị viên cấp cao'
      : 'Quản trị viên'

  return (
    <div className="highlight-account-dropdown" ref={dropdownRef}>
      <button
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="Tài khoản cá nhân"
        className={`highlight-account-dropdown__trigger${isOpen ? ' is-active' : ''}`}
        onClick={toggleDropdown}
        type="button"
      >
        <span className="highlight-account-dropdown__avatar">
          <svg
            fill="none"
            height="18"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            width="18"
          >
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </span>
        <svg
          className={`highlight-account-dropdown__chevron${isOpen ? ' is-open' : ''}`}
          fill="none"
          height="14"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          width="14"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {isOpen && (
        <div
          aria-label="Tùy chọn tài khoản"
          className="highlight-account-dropdown__menu"
          role="menu"
        >
          <div className="highlight-account-dropdown__header">
            <div className="highlight-account-dropdown__user-name">{userName}</div>
            <div className="highlight-account-dropdown__user-email">{userEmail}</div>
            <div className="highlight-account-dropdown__badge">{userRole}</div>
          </div>

          <div className="highlight-account-dropdown__divider" />

          <button
            className="highlight-account-dropdown__item"
            onClick={handleAccountClick}
            role="menuitem"
            type="button"
          >
            <span className="highlight-account-dropdown__item-icon">
              <svg
                fill="none"
                height="16"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                width="16"
              >
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </span>
            <span className="highlight-account-dropdown__item-label">
              Thông tin tài khoản
            </span>
          </button>

          <button
            className="highlight-account-dropdown__item highlight-account-dropdown__item--danger"
            onClick={handleLogoutClick}
            role="menuitem"
            type="button"
          >
            <span className="highlight-account-dropdown__item-icon">
              <svg
                fill="none"
                height="16"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                width="16"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" x2="9" y1="12" y2="12" />
              </svg>
            </span>
            <span className="highlight-account-dropdown__item-label">
              Đăng xuất
            </span>
          </button>
        </div>
      )}
    </div>
  )
}
