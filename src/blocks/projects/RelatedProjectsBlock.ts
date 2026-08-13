import type { Block } from 'payload'

import {
  validateIntegerRange,
  validateProjectRelationshipList,
} from '@/fields/validation'

import { enabledBlockField } from './shared'

export const RelatedProjectsBlock: Block = {
  slug: 'relatedProjects',
  labels: { singular: 'Dự án liên quan', plural: 'Khối dự án liên quan' },
  fields: [
    { name: 'title', type: 'text', label: 'Tiêu đề', localized: true, maxLength: 180 },
    {
      name: 'mode',
      type: 'select',
      label: 'Chế độ chọn',
      defaultValue: 'automatic',
      required: true,
      options: [
        { label: 'Tự động', value: 'automatic' },
        { label: 'Thủ công', value: 'manual' },
      ],
    },
    {
      name: 'manualProjects',
      type: 'relationship',
      label: 'Dự án chọn thủ công',
      relationTo: 'projects',
      hasMany: true,
      maxRows: 8,
      maxDepth: 0,
      validate: validateProjectRelationshipList,
      admin: { condition: (_, siblingData) => siblingData?.mode === 'manual' },
    },
    {
      name: 'maxItems',
      type: 'number',
      label: 'Số dự án tối đa',
      min: 1,
      max: 8,
      defaultValue: 4,
      required: true,
      validate: validateIntegerRange(1, 8),
    },
    {
      name: 'automaticStrategy',
      type: 'select',
      label: 'Chiến lược tự động',
      defaultValue: 'samePrimaryCategory',
      required: true,
      options: [
        { label: 'Cùng danh mục chính', value: 'samePrimaryCategory' },
        { label: 'Có chung danh mục', value: 'sharedCategories' },
        { label: 'Dự án nổi bật', value: 'featured' },
      ],
      admin: { condition: (_, siblingData) => siblingData?.mode === 'automatic' },
    },
    enabledBlockField,
  ],
}
