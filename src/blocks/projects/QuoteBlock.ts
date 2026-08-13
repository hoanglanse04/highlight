import type { Block } from 'payload'

import { mediaRelationship } from '@/fields/shared'

import { enabledBlockField } from './shared'

export const QuoteBlock: Block = {
  slug: 'quote',
  labels: { singular: 'Trích dẫn', plural: 'Trích dẫn' },
  fields: [
    {
      name: 'quote',
      type: 'textarea',
      label: 'Nội dung trích dẫn',
      localized: true,
      required: true,
      maxLength: 1200,
    },
    { name: 'author', type: 'text', label: 'Tác giả', maxLength: 160 },
    { name: 'role', type: 'text', label: 'Vai trò', localized: true, maxLength: 200 },
    mediaRelationship('portrait', 'Ảnh chân dung'),
    enabledBlockField,
  ],
}
