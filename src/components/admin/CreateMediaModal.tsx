'use client'

import React, { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

interface FileItem {
  id: string
  file: File
  preview: string
  name: string
  size: string
}

export function CreateMediaModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [fileList, setFileList] = useState<FileItem[]>([])
  const [internalTitle, setInternalTitle] = useState('')
  const [alt, setAlt] = useState('')
  const [caption, setCaption] = useState('')
  const [credit, setCredit] = useState('')
  const [folder, setFolder] = useState('general')
  const [usageNotes, setUsageNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Clean up object URLs on unmount or file list change
  useEffect(() => {
    return () => {
      fileList.forEach((item) => URL.revokeObjectURL(item.preview))
    }
  }, [fileList])

  // Intercept click on "Tạo mới" button on /admin/collections/media
  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null
      if (!target) return

      const createButton = target.closest(
        'a.list-create-new-doc__create-new-button, a[href$="/admin/collections/media/create"], .list-create-new-doc button',
      )

      if (createButton && window.location.pathname.includes('/collections/media')) {
        e.preventDefault()
        e.stopPropagation()
        setErrorMessage('')
        setSuccessMessage('')
        setUploadProgress('')
        setIsOpen(true)
      }
    }

    document.addEventListener('click', handleDocumentClick, true)
    return () => {
      document.removeEventListener('click', handleDocumentClick, true)
    }
  }, [])

  const processFiles = (incoming: FileList | File[]) => {
    const validImages = Array.from(incoming).filter((f) => f.type.startsWith('image/'))
    if (validImages.length === 0) return

    const newItems: FileItem[] = validImages.map((f) => ({
      id: `${f.name}-${f.size}-${Date.now()}-${Math.random()}`,
      file: f,
      preview: URL.createObjectURL(f),
      name: f.name,
      size: (f.size / 1024 / 1024).toFixed(2),
    }))

    setFileList((prev) => [...prev, ...newItems])

    // Auto-fill title & alt if first file
    if (fileList.length === 0 && newItems[0]) {
      const cleanName = newItems[0].name
        .replace(/\.[^/.]+$/, '')
        .replace(/[-_]+/g, ' ')
        .trim()
      if (!internalTitle) setInternalTitle(cleanName)
      if (!alt) setAlt(cleanName)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files)
      // Reset input value so same files can be re-selected if needed
      e.target.value = ''
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files)
    }
  }

  const handleRemoveFile = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setFileList((prev) => {
      const removed = prev.find((item) => item.id === id)
      if (removed) URL.revokeObjectURL(removed.preview)
      return prev.filter((item) => item.id !== id)
    })
  }

  const handleClose = () => {
    if (loading) return
    setIsOpen(false)
    setErrorMessage('')
    setSuccessMessage('')
    setUploadProgress('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage('')
    setSuccessMessage('')
    setUploadProgress('')

    if (fileList.length === 0) {
      setErrorMessage('Vui lòng chọn hoặc kéo thả ít nhất một hình ảnh')
      return
    }

    if (fileList.length === 1 && !alt.trim()) {
      setErrorMessage('Vui lòng nhập Văn bản thay thế (alt) cho ảnh')
      return
    }

    setLoading(true)
    const total = fileList.length
    let successfulCount = 0

    try {
      for (let i = 0; i < fileList.length; i++) {
        const item = fileList[i]
        if (!item) continue

        setUploadProgress(`Đang tải lên ${i + 1}/${total}: ${item.name}...`)

        const fileCleanName = item.name
          .replace(/\.[^/.]+$/, '')
          .replace(/[-_]+/g, ' ')
          .trim()

        const currentTitle =
          fileList.length === 1
            ? internalTitle.trim() || fileCleanName
            : internalTitle
              ? `${internalTitle.trim()} (${i + 1})`
              : fileCleanName

        const currentAlt =
          fileList.length === 1
            ? alt.trim() || fileCleanName
            : alt.trim()
              ? `${alt.trim()} ${i + 1}`
              : fileCleanName

        const formData = new FormData()
        formData.append('file', item.file)
        formData.append(
          '_payload',
          JSON.stringify({
            internalTitle: currentTitle,
            alt: currentAlt,
            caption: caption.trim() || undefined,
            credit: credit.trim() || undefined,
            folder: folder || 'general',
            usageNotes: usageNotes.trim() || undefined,
          }),
        )

        const res = await fetch('/api/media', {
          method: 'POST',
          body: formData,
        })

        if (!res.ok) {
          const data = await res.json()
          const errorDetail =
            data?.errors?.[0]?.message ||
            data?.message ||
            `Lỗi khi tải ảnh ${item.name}`
          throw new Error(errorDetail)
        }

        successfulCount++
      }

      setSuccessMessage(
        `Đã tải lên thành công ${successfulCount}/${total} hình ảnh vào thư viện!`,
      )
      setUploadProgress('')

      setTimeout(() => {
        setIsOpen(false)
        setFileList([])
        setInternalTitle('')
        setAlt('')
        setCaption('')
        setCredit('')
        setFolder('general')
        setUsageNotes('')
        window.location.reload()
      }, 1000)
    } catch (err: any) {
      setErrorMessage(err?.message || 'Có lỗi kết nối khi tải ảnh lên.')
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
              className="highlight-account-modal highlight-create-media-modal"
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
                    <rect height="18" rx="2" ry="2" width="18" x="3" y="3" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                  <span>
                    Thêm hình ảnh vào thư viện{' '}
                    {fileList.length > 1 && `(${fileList.length} ảnh đã chọn)`}
                  </span>
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
                <div className="highlight-account-modal__body highlight-create-media-modal__body">
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

                  {uploadProgress && (
                    <div className="highlight-modal-alert highlight-modal-alert--info">
                      <span className="highlight-modal-spinner" style={{ borderColor: 'rgba(255,90,31,0.3)', borderTopColor: '#ff5a1f' }} />
                      <span>{uploadProgress}</span>
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

                  {/* Dropzone upload file (Multiple) */}
                  <div
                    className="highlight-media-dropzone"
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                  >
                    <input
                      accept="image/jpeg,image/png,image/webp,image/avif"
                      className="highlight-media-dropzone__input"
                      disabled={loading}
                      multiple
                      onChange={handleFileChange}
                      ref={fileInputRef}
                      style={{ display: 'none' }}
                      type="file"
                    />

                    <div className="highlight-media-dropzone__placeholder">
                      <div className="highlight-media-dropzone__icon">
                        <svg
                          fill="none"
                          height="26"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                          width="26"
                        >
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                          <polyline points="17 8 12 3 7 8" />
                          <line x1="12" x2="12" y1="3" y2="15" />
                        </svg>
                      </div>
                      <p className="highlight-media-dropzone__title">
                        <strong>Chọn một hoặc nhiều file</strong> hoặc kéo thả tập tin vào đây
                      </p>
                      <p className="highlight-media-dropzone__hint">
                        Hỗ trợ chọn nhiều ảnh cùng lúc: JPG, PNG, WEBP, AVIF (Tối đa 15MB/ảnh)
                      </p>
                    </div>
                  </div>

                  {/* Multi-file preview thumbnails list */}
                  {fileList.length > 0 && (
                    <div className="highlight-media-multi-list">
                      <div className="highlight-media-multi-list__header">
                        <span>Danh sách ảnh đã chọn ({fileList.length})</span>
                        <button
                          className="highlight-media-multi-list__add-btn"
                          disabled={loading}
                          onClick={() => fileInputRef.current?.click()}
                          type="button"
                        >
                          + Thêm ảnh khác
                        </button>
                      </div>
                      <div className="highlight-media-multi-grid">
                        {fileList.map((item) => (
                          <div className="highlight-media-thumb-item" key={item.id}>
                            <img
                              alt={item.name}
                              className="highlight-media-thumb-item__img"
                              src={item.preview}
                            />
                            <div className="highlight-media-thumb-item__info">
                              <span className="highlight-media-thumb-item__name" title={item.name}>
                                {item.name}
                              </span>
                              <span className="highlight-media-thumb-item__size">
                                {item.size} MB
                              </span>
                            </div>
                            <button
                              aria-label="Xóa ảnh này"
                              className="highlight-media-thumb-item__del-btn"
                              disabled={loading}
                              onClick={(e) => handleRemoveFile(item.id, e)}
                              title="Xóa ảnh này"
                              type="button"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Form fields */}
                  <div className="highlight-modal-row-grid">
                    {/* Tên nội bộ */}
                    <div className="highlight-modal-field">
                      <label className="highlight-modal-field__label">
                        {fileList.length > 1 ? 'Tiền tố tên nội bộ' : 'Tên nội bộ'}
                      </label>
                      <input
                        className="highlight-modal-field__input"
                        disabled={loading}
                        onChange={(e) => setInternalTitle(e.target.value)}
                        placeholder={
                          fileList.length > 1
                            ? 'VD: Bộ ảnh dự án (Tự động kèm số)'
                            : 'VD: Banner chính trang chủ'
                        }
                        type="text"
                        value={internalTitle}
                      />
                    </div>

                    {/* Thư mục nội dung */}
                    <div className="highlight-modal-field">
                      <label className="highlight-modal-field__label">
                        Thư mục nội dung <span className="highlight-modal-field__required">*</span>
                      </label>
                      <select
                        className="highlight-modal-field__select"
                        disabled={loading}
                        onChange={(e) => setFolder(e.target.value)}
                        value={folder}
                      >
                        <option value="general">Chung</option>
                        <option value="homepage">Trang chủ</option>
                        <option value="projects">Dự án</option>
                        <option value="clients">Khách hàng</option>
                        <option value="stories">Câu chuyện</option>
                        <option value="team">Đội ngũ</option>
                      </select>
                    </div>
                  </div>

                  {/* Văn bản thay thế (alt) */}
                  <div className="highlight-modal-field">
                    <label className="highlight-modal-field__label">
                      Văn bản thay thế (alt){' '}
                      {fileList.length <= 1 && (
                        <span className="highlight-modal-field__required">*</span>
                      )}
                    </label>
                    <input
                      className="highlight-modal-field__input"
                      disabled={loading}
                      onChange={(e) => setAlt(e.target.value)}
                      placeholder={
                        fileList.length > 1
                          ? 'Mô tả chung (hoặc để trống để tự động lấy theo tên file)...'
                          : 'Mô tả nội dung ảnh để tối ưu SEO & tiếp cận...'
                      }
                      required={fileList.length <= 1}
                      type="text"
                      value={alt}
                    />
                  </div>

                  {/* Chú thích */}
                  <div className="highlight-modal-field">
                    <label className="highlight-modal-field__label">
                      Chú thích (Caption)
                    </label>
                    <textarea
                      className="highlight-modal-field__textarea"
                      disabled={loading}
                      onChange={(e) => setCaption(e.target.value)}
                      placeholder="Chú thích hiển thị công khai dưới ảnh (nếu có)..."
                      rows={2}
                      value={caption}
                    />
                  </div>

                  {/* Nguồn/Tác giả */}
                  <div className="highlight-modal-field">
                    <label className="highlight-modal-field__label">
                      Nguồn / Tác giả
                    </label>
                    <input
                      className="highlight-modal-field__input"
                      disabled={loading}
                      onChange={(e) => setCredit(e.target.value)}
                      placeholder="VD: Highlight Media / Studio team"
                      type="text"
                      value={credit}
                    />
                  </div>

                  {/* Ghi chú sử dụng */}
                  <div className="highlight-modal-field">
                    <label className="highlight-modal-field__label">
                      Ghi chú sử dụng nội bộ
                    </label>
                    <textarea
                      className="highlight-modal-field__textarea"
                      disabled={loading}
                      onChange={(e) => setUsageNotes(e.target.value)}
                      placeholder="Ghi chú bản quyền hoặc phạm vi dùng..."
                      rows={2}
                      value={usageNotes}
                    />
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
                        <span>Đang tải lên...</span>
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
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                          <polyline points="17 8 12 3 7 8" />
                          <line x1="12" x2="12" y1="3" y2="15" />
                        </svg>
                        <span>
                          {fileList.length > 1
                            ? `Tải lên ${fileList.length} hình ảnh`
                            : 'Tải lên & Lưu vào thư viện'}
                        </span>
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
