'use client'

import { useAuth } from '@payloadcms/ui'
import { useRouter } from 'next/navigation'
import React, { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { createPortal } from 'react-dom'

export function AccountDropdown() {
  const { user, logOut } = useAuth()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  )
  const dropdownRef = useRef<HTMLDivElement>(null)

  const toggleDropdown = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsOpen((prev) => !prev)
  }

  const handleOpenModal = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsOpen(false)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  const handleUsersListClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsOpen(false)
    setIsModalOpen(false)
    router.push('/admin/collections/users')
  }

  const handleEditPageClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsOpen(false)
    setIsModalOpen(false)
    router.push('/admin/account')
  }

  const handleLogoutClick = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsOpen(false)
    setIsModalOpen(false)
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
    if (!isOpen && !isModalOpen) return

    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
        setIsModalOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, isModalOpen])

  const userEmail = typeof user?.email === 'string' ? user.email : 'admin@highlightmedia.vn'
  const userName =
    typeof user?.name === 'string' && user.name.trim() !== ''
      ? user.name
      : userEmail.split('@')[0] || 'Highlight Admin'

  const userRole =
    Array.isArray(user?.roles) && user.roles.includes('admin')
      ? 'Quản trị viên cấp cao'
      : 'Quản trị viên cấp cao'

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
            onClick={handleOpenModal}
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
              Xem thông tin (Modal)
            </span>
          </button>

          <button
            className="highlight-account-dropdown__item"
            onClick={handleUsersListClick}
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
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </span>
            <span className="highlight-account-dropdown__item-label">
              Bảng tài khoản hệ thống
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

      {/* Account Info Modal */}
      {mounted &&
        isModalOpen &&
        createPortal(
          <div className="highlight-modal-overlay" onClick={handleCloseModal}>
            <div
              aria-modal="true"
              className="highlight-account-modal"
              onClick={(e) => e.stopPropagation()}
              role="dialog"
            >
              <div className="highlight-account-modal__header">
                <div className="highlight-account-modal__title">
                  <svg
                    fill="none"
                    height="20"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    width="20"
                  >
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  <span>Thông tin tài khoản</span>
                </div>
                <button
                  aria-label="Đóng"
                  className="highlight-account-modal__close"
                  onClick={handleCloseModal}
                  type="button"
                >
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
                    <path d="M18 6 6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="highlight-account-modal__body">
                {/* Profile Card */}
                <div className="highlight-account-modal__profile">
                  <div className="highlight-account-modal__avatar">
                    <svg
                      fill="none"
                      height="32"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      width="32"
                    >
                      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </div>
                  <div className="highlight-account-modal__profile-info">
                    <h3 className="highlight-account-modal__name">{userName}</h3>
                    <p className="highlight-account-modal__email">{userEmail}</p>
                    <span className="highlight-account-modal__role-badge">{userRole}</span>
                  </div>
                </div>

                {/* Info Table */}
                <div className="highlight-account-modal__table">
                  <div className="highlight-account-modal__row">
                    <span className="highlight-account-modal__col-label">Họ và tên</span>
                    <span className="highlight-account-modal__col-value">{userName}</span>
                  </div>
                  <div className="highlight-account-modal__row">
                    <span className="highlight-account-modal__col-label">Email đăng nhập</span>
                    <span className="highlight-account-modal__col-value">{userEmail}</span>
                  </div>
                  <div className="highlight-account-modal__row">
                    <span className="highlight-account-modal__col-label">Vai trò quản trị</span>
                    <span className="highlight-account-modal__col-value">
                      <span className="highlight-account-modal__role-pill">{userRole}</span>
                    </span>
                  </div>
                  <div className="highlight-account-modal__row">
                    <span className="highlight-account-modal__col-label">Trạng thái</span>
                    <span className="highlight-account-modal__col-value highlight-account-modal__status-active">
                      <span className="highlight-account-modal__status-dot" />
                      Đang hoạt động
                    </span>
                  </div>
                </div>
              </div>

              <div className="highlight-account-modal__footer">
                <button
                  className="highlight-account-modal__btn highlight-account-modal__btn--secondary"
                  onClick={handleEditPageClick}
                  type="button"
                >
                  <svg
                    fill="none"
                    height="15"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    width="15"
                  >
                    <path d="M12 20h9" />
                    <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
                  </svg>
                  <span>Chỉnh sửa tài khoản</span>
                </button>

                <button
                  className="highlight-account-modal__btn highlight-account-modal__btn--primary"
                  onClick={handleCloseModal}
                  type="button"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  )
}
