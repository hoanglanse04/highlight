import type { Block } from 'payload'

import { authenticatedFieldAccess } from '@/access/users'

import { enabledBlockField } from './shared'

export const RichTextBlock: Block = {
  slug: 'richText',
  labels: { singular: 'Văn bản định dạng', plural: 'Khối văn bản định dạng' },
  fields: [
    {
      name: 'internalName',
      type: 'text',
      label: 'Tên nội bộ',
      maxLength: 120,
      access: { read: authenticatedFieldAccess },
    },
    {
      name: 'content',
      type: 'richText',
      label: 'Nội dung',
      localized: true,
      required: true,
    },
    {
      name: 'maxWidth',
      type: 'select',
      label: 'Chiều rộng tối đa',
      defaultValue: 'normal',
      required: true,
      options: [
        { label: 'Hẹp', value: 'narrow' },
        { label: 'Tiêu chuẩn', value: 'normal' },
        { label: 'Rộng', value: 'wide' },
      ],
    },
    {
      name: 'textAlign',
      type: 'select',
      label: 'Căn chỉnh văn bản',
      defaultValue: 'left',
      required: true,
      options: [
        { label: 'Căn trái', value: 'left' },
        { label: 'Căn giữa', value: 'center' },
      ],
    },
    enabledBlockField,
  ],
}
