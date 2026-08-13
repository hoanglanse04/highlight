import type { Block } from 'payload'

import { enabledBlockField, projectStatisticFields } from './shared'

export const StatisticsBlock: Block = {
  slug: 'statistics',
  labels: { singular: 'Thống kê', plural: 'Khối thống kê' },
  fields: [
    {
      name: 'source',
      type: 'select',
      label: 'Nguồn dữ liệu',
      defaultValue: 'useProjectStatistics',
      required: true,
      options: [
        { label: 'Dùng thống kê của dự án', value: 'useProjectStatistics' },
        { label: 'Nhập riêng cho khối này', value: 'custom' },
      ],
    },
    {
      name: 'customItems',
      type: 'array',
      label: 'Thống kê tùy chỉnh',
      maxRows: 20,
      admin: {
        condition: (_, siblingData) => siblingData?.source === 'custom',
        initCollapsed: true,
      },
      fields: projectStatisticFields(),
    },
    enabledBlockField,
  ],
}
