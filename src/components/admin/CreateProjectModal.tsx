'use client'

import { useDocumentDrawer } from '@payloadcms/ui'
import React, { useEffect } from 'react'

export function CreateProjectModal() {
  const [DocumentDrawer, , { openDrawer }] = useDocumentDrawer({
    collectionSlug: 'projects',
  })

  // Intercept click on the "Tạo mới" button on /admin/collections/projects
  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null
      if (!target) return

      const createButton = target.closest(
        'a.list-create-new-doc__create-new-button, a[href$="/admin/collections/projects/create"], .list-create-new-doc button',
      )

      if (createButton && window.location.pathname.includes('/collections/projects')) {
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
