'use client'

import { useDocumentDrawer } from '@payloadcms/ui'
import React, { useEffect } from 'react'

export function CreateCategoryModal() {
  const [DocumentDrawer, , { openDrawer }] = useDocumentDrawer({
    collectionSlug: 'project-categories',
  })

  // Intercept click on the "Tạo mới" button on /admin/collections/project-categories
  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null
      if (!target) return

      const createButton = target.closest(
        'a.list-create-new-doc__create-new-button, a[href$="/admin/collections/project-categories/create"], .list-create-new-doc button',
      )

      if (
        createButton &&
        window.location.pathname.includes('/collections/project-categories')
      ) {
        e.preventDefault()
        e.stopPropagation()
        openDrawer()
      }
    }

    document.addEventListener('click', handleDocumentClick, true)
    return () => {
      document.removeEventListener('click', handleDocumentClick, true)
    }
  }, [openDrawer])

  return (
    <DocumentDrawer
      onSave={() => {
        window.location.reload()
      }}
    />
  )
}
