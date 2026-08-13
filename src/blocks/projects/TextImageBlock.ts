import type { Block } from 'payload'

import { mediaRelationship } from '@/fields/shared'

import { enabledBlockField } from './shared'

export const TextImageBlock: Block = {
  slug: 'textImage',
  labels: { singular: 'Văn bản và hình ảnh', plural: 'Khối văn bản và hình ảnh' },
  fields: [
    { name: 'eyebrow', type: 'text', label: 'Dòng dẫn', localized: true, maxLength: 100 },
    { name: 'title', type: 'text', label: 'Tiêu đề', localized: true, maxLength: 180 },
    {
      name: 'content',
      type: 'richText',
      label: 'Nội dung',
      localized: true,
      required: true,
    },
    mediaRelationship('image', 'Hình ảnh', { required: true }),
    {
      name: 'imagePosition',
      type: 'select',
      label: 'Vị trí ảnh',
      defaultValue: 'right',
      required: true,
      options: [
        { label: 'Bên trái', value: 'left' },
        { label: 'Bên phải', value: 'right' },
      ],
    },
    {
      name: 'verticalAlignment',
      type: 'select',
      label: 'Căn chỉnh dọc',
      defaultValue: 'center',
      required: true,
      options: [
        { label: 'Phía trên', value: 'top' },
        { label: 'Chính giữa', value: 'center' },
        { label: 'Phía dưới', value: 'bottom' },
      ],
    },
    {
      name: 'backgroundStyle',
      type: 'select',
      label: 'Kiểu nền',
      defaultValue: 'default',
      required: true,
      options: [
        { label: 'Mặc định', value: 'default' },
        { label: 'Bề mặt', value: 'surface' },
        { label: 'Điểm nhấn thương hiệu', value: 'brand-accent' },
      ],
    },
    enabledBlockField,
  ],
}
