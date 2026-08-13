import type { Block } from 'payload'

import { enabledBlockField, projectFactFields } from './shared'

export const ProjectFactsBlock: Block = {
  slug: 'projectFacts',
  labels: { singular: 'Thông tin dự án', plural: 'Khối thông tin dự án' },
  fields: [
    {
      name: 'source',
      type: 'select',
      label: 'Nguồn dữ liệu',
      defaultValue: 'useProjectFacts',
      required: true,
      options: [
        { label: 'Dùng thông tin của dự án', value: 'useProjectFacts' },
        { label: 'Nhập riêng cho khối này', value: 'custom' },
      ],
    },
    {
      name: 'customFacts',
      type: 'array',
      label: 'Thông tin tùy chỉnh',
      maxRows: 20,
      admin: {
        condition: (_, siblingData) => siblingData?.source === 'custom',
        initCollapsed: true,
      },
      fields: projectFactFields(),
    },
    enabledBlockField,
  ],
}
