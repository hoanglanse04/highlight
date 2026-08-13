import type { Block } from 'payload'

import { mediaRelationship } from '@/fields/shared'

import { enabledBlockField } from './shared'

export const FullWidthImageBlock: Block = {
  slug: 'fullWidthImage',
  labels: { singular: 'Ảnh toàn chiều rộng', plural: 'Ảnh toàn chiều rộng' },
  fields: [
    mediaRelationship('image', 'Hình ảnh', { required: true }),
    {
      name: 'altOverride',
      type: 'text',
      label: 'Alt ghi đè',
      localized: true,
      maxLength: 300,
    },
    {
      name: 'caption',
      type: 'textarea',
      label: 'Chú thích',
      localized: true,
      maxLength: 500,
    },
    { name: 'credit', type: 'text', label: 'Nguồn/Tác giả', maxLength: 160 },
    {
      name: 'aspectRatio',
      type: 'select',
      label: 'Tỷ lệ khung hình',
      defaultValue: 'original',
      required: true,
      options: [
        { label: 'Nguyên bản', value: 'original' },
        { label: 'Ngang', value: 'landscape' },
        { label: 'Điện ảnh', value: 'cinematic' },
        { label: 'Dọc', value: 'portrait' },
      ],
    },
    {
      name: 'containOrCover',
      type: 'select',
      label: 'Cách đặt ảnh',
      defaultValue: 'cover',
      required: true,
      options: [
        { label: 'Phủ kín khung', value: 'cover' },
        { label: 'Hiển thị toàn ảnh', value: 'contain' },
      ],
    },
    enabledBlockField,
  ],
}
