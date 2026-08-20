'use client'

import type { DefaultCellComponentProps } from 'payload'
import React, { useState, useSyncExternalStore } from 'react'
import { createPortal } from 'react-dom'

export function UserNameCell(props: DefaultCellComponentProps) {
  const { cellData, rowData } = props
  const [isModalOpen, setIsModalOpen] = useState(false)
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  )

  const name =
    typeof cellData === 'string' && cellData.trim() !== ''
      ? cellData
      : typeof rowData?.name === 'string' && rowData.name.trim() !== ''
        ? rowData.name
        : 'Highlight Admin'

  const email =
    typeof rowData?.email === 'string' ? rowData.email : 'admin@highlightmedia.vn'

  let roleLabel = 'Quản trị viên'
  if (
    rowData?.role === 'super-admin' ||
    (Array.isArray(rowData?.roles) && rowData.roles.includes('admin'))
  ) {
    roleLabel = 'Quản trị viên cấp cao'
  } else if (rowData?.role === 'editor') {
    roleLabel = 'Biên tập viên'
  } else if (rowData?.role === 'viewer') {
    roleLabel = 'Người xem'
  }

  const handleOpen = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsModalOpen(true)
  }

  const handleClose = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    setIsModalOpen(false)
  }

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsModalOpen(false)
    if (rowData?.id) {
      window.location.href = `/admin/collections/users/${rowData.id}`
    }
  }

  return (
    <div className="highlight-table-user-cell" onClick={(e) => e.stopPropagation()}>
      <button
        className="highlight-table-user-btn"
        onClick={handleOpen}
        title="Xem thông tin chi tiết tài khoản"
        type="button"
      >
        <span className="highlight-table-user-avatar">
          <svg
            fill="none"
            height="14"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            width="14"
          >
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </span>
        <span className="highlight-table-user-name">{name}</span>
      </button>

      {mounted &&
        isModalOpen &&
        createPortal(
          <div
            className="highlight-modal-overlay"
            onClick={handleClose}
            style={{ zIndex: 999999 }}
          >
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
                    <h3 className="highlight-account-modal__name">{name}</h3>
                    <p className="highlight-account-modal__email">{email}</p>
                    <span className="highlight-account-modal__role-badge">{roleLabel}</span>
                  </div>
                </div>

                {/* Info Table */}
                <div className="highlight-account-modal__table">
                  <div className="highlight-account-modal__row">
                    <span className="highlight-account-modal__col-label">Họ và tên</span>
                    <span className="highlight-account-modal__col-value">{name}</span>
                  </div>
                  <div className="highlight-account-modal__row">
                    <span className="highlight-account-modal__col-label">Email đăng nhập</span>
                    <span className="highlight-account-modal__col-value">{email}</span>
                  </div>
                  <div className="highlight-account-modal__row">
                    <span className="highlight-account-modal__col-label">Vai trò quản trị</span>
                    <span className="highlight-account-modal__col-value">
                      <span className="highlight-account-modal__role-pill">{roleLabel}</span>
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
                  onClick={handleEdit}
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
                  onClick={handleClose}
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
