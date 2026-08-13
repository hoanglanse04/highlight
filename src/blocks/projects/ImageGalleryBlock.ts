import type { Block } from 'payload'

import { enabledBlockField, galleryImageFields } from './shared'

export const ImageGalleryBlock: Block = {
  slug: 'imageGallery',
  labels: { singular: 'Thư viện ảnh', plural: 'Thư viện ảnh' },
  fields: [
    { name: 'title', type: 'text', label: 'Tiêu đề', localized: true, maxLength: 180 },
    {
      name: 'description',
      type: 'textarea',
      label: 'Mô tả',
      localized: true,
      maxLength: 800,
    },
    {
      name: 'layout',
      type: 'select',
      label: 'Bố cục',
      defaultValue: 'grid',
      required: true,
      options: [
        { label: 'Lưới', value: 'grid' },
        { label: 'Masonry', value: 'masonry' },
        { label: 'Dải phim', value: 'filmstrip' },
      ],
    },
    {
      name: 'columns',
      type: 'select',
      label: 'Số cột',
      defaultValue: '3',
      required: true,
      options: ['2', '3', '4'],
    },
    {
      name: 'images',
      type: 'array',
      label: 'Hình ảnh',
      maxRows: 30,
      required: true,
      admin: { initCollapsed: true },
      fields: galleryImageFields(),
    },
    enabledBlockField,
  ],
}
