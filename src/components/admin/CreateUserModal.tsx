'use client'

import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

export function CreateUserModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [role, setRole] = useState('editor')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    setMounted(true)
  }, [])

  // Intercept clicks on the "Tạo mới" button in the collection list header
  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null
      if (!target) return

      // Look for the "Tạo mới" button on /admin/collections/users
      const createButton = target.closest(
        'a.list-create-new-doc__create-new-button, a[href$="/admin/collections/users/create"], .list-create-new-doc button',
      )

      if (createButton && window.location.pathname.includes('/collections/users')) {
        e.preventDefault()
        e.stopPropagation()
        setErrorMessage('')
        setSuccessMessage('')
        setIsOpen(true)
      }
    }

    document.addEventListener('click', handleDocumentClick, true)
    return () => {
      document.removeEventListener('click', handleDocumentClick, true)
    }
  }, [])

  const handleClose = () => {
    if (loading) return
    setIsOpen(false)
    setErrorMessage('')
    setSuccessMessage('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage('')
    setSuccessMessage('')

    if (!name.trim()) {
      setErrorMessage('Vui lòng nhập Họ và tên')
      return
    }

    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Vui lòng nhập địa chỉ Email hợp lệ')
      return
    }

    if (!password || password.length < 6) {
      setErrorMessage('Mật khẩu phải có ít nhất 6 ký tự')
      return
    }

    if (password !== confirmPassword) {
      setErrorMessage('Mật khẩu xác nhận không khớp')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password,
          role,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        const errorDetail =
          data?.errors?.[0]?.message ||
          data?.message ||
          'Không thể tạo tài khoản. Vui lòng thử lại.'
        setErrorMessage(errorDetail)
        setLoading(false)
        return
      }

      setSuccessMessage('Tạo tài khoản mới thành công!')
      setTimeout(() => {
        setIsOpen(false)
        setName('')
        setEmail('')
        setPassword('')
        setConfirmPassword('')
        setRole('editor')
        window.location.reload()
      }, 1000)
    } catch (err: any) {
      setErrorMessage(err?.message || 'Có lỗi kết nối xảy ra khi tạo tài khoản.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {mounted &&
        isOpen &&
        createPortal(
          <div
            className="highlight-modal-overlay"
            onClick={handleClose}
            style={{ zIndex: 999999 }}
          >
            <div
              aria-modal="true"
              className="highlight-account-modal highlight-create-user-modal"
              onClick={(e) => e.stopPropagation()}
              role="dialog"
            >
              {/* Modal Header */}
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
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <line x1="19" x2="19" y1="8" y2="14" />
                    <line x1="22" x2="16" y1="11" y2="11" />
                  </svg>
                  <span>Tạo mới tài khoản hệ thống</span>
                </div>
                <button
                  aria-label="Đóng"
                  className="highlight-account-modal__close"
                  disabled={loading}
                  onClick={handleClose}
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

              {/* Modal Form Body */}
              <form onSubmit={handleSubmit}>
                <div className="highlight-account-modal__body highlight-create-user-modal__body">
                  {errorMessage && (
                    <div className="highlight-modal-alert highlight-modal-alert--error">
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
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" x2="12" y1="8" y2="12" />
                        <line x1="12" x2="12.01" y1="16" y2="16" />
                      </svg>
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  {successMessage && (
                    <div className="highlight-modal-alert highlight-modal-alert--success">
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
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <polyline points="22 4 12 14.01 9 11.01" />
                      </svg>
                      <span>{successMessage}</span>
                    </div>
                  )}

                  {/* Họ và tên */}
                  <div className="highlight-modal-field">
                    <label className="highlight-modal-field__label">
                      Họ và tên <span className="highlight-modal-field__required">*</span>
                    </label>
                    <input
                      className="highlight-modal-field__input"
                      disabled={loading}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="VD: Nguyễn Văn A"
                      required
                      type="text"
                      value={name}
                    />
                  </div>

                  {/* Email */}
                  <div className="highlight-modal-field">
                    <label className="highlight-modal-field__label">
                      Email đăng nhập <span className="highlight-modal-field__required">*</span>
                    </label>
                    <input
                      className="highlight-modal-field__input"
                      disabled={loading}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="VD: admin@highlightmedia.vn"
                      required
                      type="email"
                      value={email}
                    />
                  </div>

                  {/* Mật khẩu */}
                  <div className="highlight-modal-field">
                    <label className="highlight-modal-field__label">
                      Mật khẩu mới <span className="highlight-modal-field__required">*</span>
                    </label>
                    <div className="highlight-modal-field__password-wrap">
                      <input
                        className="highlight-modal-field__input"
                        disabled={loading}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Tối thiểu 6 ký tự..."
                        required
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                      />
                      <button
                        className="highlight-modal-field__eye-btn"
                        onClick={() => setShowPassword((p) => !p)}
                        type="button"
                      >
                        {showPassword ? (
                          <svg fill="none" height="17" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="17">
                            <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                            <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                            <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                            <line x1="2" x2="22" y1="2" y2="22" />
                          </svg>
                        ) : (
                          <svg fill="none" height="17" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="17">
                            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Xác nhận mật khẩu */}
                  <div className="highlight-modal-field">
                    <label className="highlight-modal-field__label">
                      Xác nhận mật khẩu <span className="highlight-modal-field__required">*</span>
                    </label>
                    <div className="highlight-modal-field__password-wrap">
                      <input
                        className="highlight-modal-field__input"
                        disabled={loading}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Nhập lại mật khẩu..."
                        required
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={confirmPassword}
                      />
                      <button
                        className="highlight-modal-field__eye-btn"
                        onClick={() => setShowConfirmPassword((p) => !p)}
                        type="button"
                      >
                        {showConfirmPassword ? (
                          <svg fill="none" height="17" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="17">
                            <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                            <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                            <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                            <line x1="2" x2="22" y1="2" y2="22" />
                          </svg>
                        ) : (
                          <svg fill="none" height="17" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="17">
                            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Vai trò */}
                  <div className="highlight-modal-field">
                    <label className="highlight-modal-field__label">
                      Vai trò tài khoản <span className="highlight-modal-field__required">*</span>
                    </label>
                    <select
                      className="highlight-modal-field__select"
                      disabled={loading}
                      onChange={(e) => setRole(e.target.value)}
                      value={role}
                    >
                      <option value="super-admin">Quản trị viên cấp cao (Toàn quyền)</option>
                      <option value="editor">Biên tập viên (Chỉnh sửa nội dung)</option>
                      <option value="viewer">Người xem (Chỉ xem)</option>
                    </select>
                  </div>
                </div>

                {/* Modal Footer Actions */}
                <div className="highlight-account-modal__footer">
                  <button
                    className="highlight-account-modal__btn highlight-account-modal__btn--secondary"
                    disabled={loading}
                    onClick={handleClose}
                    type="button"
                  >
                    Hủy bỏ
                  </button>

                  <button
                    className="highlight-account-modal__btn highlight-account-modal__btn--primary"
                    disabled={loading}
                    type="submit"
                  >
                    {loading ? (
                      <>
                        <span className="highlight-modal-spinner" />
                        <span>Đang tạo...</span>
                      </>
                    ) : (
                      <>
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
                          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                          <circle cx="9" cy="7" r="4" />
                          <line x1="19" x2="19" y1="8" y2="14" />
                          <line x1="22" x2="16" y1="11" y2="11" />
                        </svg>
                        <span>Tạo tài khoản</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body,
        )}
    </>
  )
}
