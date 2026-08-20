'use client'

import { useEffect } from 'react'

export function ConfirmationEnhancer() {
  useEffect(() => {
    const enhanceModal = () => {
      const modalWrapper = document.querySelector<HTMLElement>(
        '.confirmation-modal__wrapper:not(.highlight-delete-enhanced)',
      )
      if (!modalWrapper) return

      const modalContent = modalWrapper.querySelector<HTMLElement>(
        '.confirmation-modal__content',
      )
      if (!modalContent) return

      modalWrapper.classList.add('highlight-delete-enhanced')

      // Check if this is a delete confirmation
      const isDelete =
        modalWrapper.closest('.delete-documents__modal, .delete-document, .delete-many, [class*="delete"]') ||
        modalContent.textContent?.toLowerCase().includes('xóa') ||
        modalContent.textContent?.toLowerCase().includes('delete')

      if (!isDelete) return

      // Collect item names
      const itemNames: string[] = []

      // 1. Check for checked table rows
      const checkedRows = Array.from(
        document.querySelectorAll<HTMLTableRowElement>('tbody tr, .table tr, .table__row'),
      ).filter((tr) => {
        const checkbox = tr.querySelector<HTMLInputElement>('input[type="checkbox"]')
        return checkbox && checkbox.checked
      })

      if (checkedRows.length > 0) {
        checkedRows.forEach((row) => {
          // Look for title/name cells
          const textCell =
            row.querySelector('.cell-internalName, .cell-title, .cell-internalTitle, .cell-name, .cell-filename') ||
            row.querySelector('td:not(:first-child) a') ||
            row.querySelector('td:nth-child(2), td:nth-child(3)')

          if (textCell) {
            const cleanText = textCell.textContent?.trim()
            if (cleanText && cleanText !== '<Không có Tiêu đề>' && cleanText !== '<Không có Ảnh bìa>') {
              itemNames.push(cleanText)
            } else {
              // fallback to any meaningful text in the row
              const altText = row.querySelector('td a, td span')?.textContent?.trim()
              if (altText) itemNames.push(altText)
            }
          }
        })
      }

      // 2. If no checked table rows, look for single doc header / input
      if (itemNames.length === 0) {
        const docTitle =
          document.querySelector('.doc-header h1, h1.doc-header__title')?.textContent?.trim() ||
          document.querySelector<HTMLInputElement>('input[id="field-internalName"], input[id="field-title"]')?.value?.trim() ||
          document.querySelector<HTMLInputElement>('input[name="internalTitle"], input[name="title"]')?.value?.trim()

        if (docTitle && docTitle !== '[Chưa có tiêu đề]' && docTitle !== '[Untitled]') {
          itemNames.push(docTitle)
        }
      }

      // If we found item names, render the preview box
      if (itemNames.length > 0) {
        const existingPreview = modalContent.querySelector('.highlight-delete-preview-box')
        if (existingPreview) existingPreview.remove()

        const previewBox = document.createElement('div')
        previewBox.className = 'highlight-delete-preview-box'

        const headerSpan = document.createElement('div')
        headerSpan.className = 'highlight-delete-preview-header'
        headerSpan.textContent =
          itemNames.length === 1 ? 'Mục sẽ bị xóa:' : `Danh sách ${itemNames.length} mục sẽ bị xóa:`

        const listDiv = document.createElement('div')
        listDiv.className = 'highlight-delete-preview-list'

        itemNames.slice(0, 6).forEach((name) => {
          const itemBadge = document.createElement('div')
          itemBadge.className = 'highlight-delete-preview-item'
          itemBadge.innerHTML = `
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <span>${name}</span>
          `
          listDiv.appendChild(itemBadge)
        })

        if (itemNames.length > 6) {
          const moreBadge = document.createElement('div')
          moreBadge.className = 'highlight-delete-preview-more'
          moreBadge.textContent = `+ và ${itemNames.length - 6} mục khác...`
          listDiv.appendChild(moreBadge)
        }

        previewBox.appendChild(headerSpan)
        previewBox.appendChild(listDiv)

        modalContent.appendChild(previewBox)
      }
    }

    const observer = new MutationObserver(() => {
      enhanceModal()
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
