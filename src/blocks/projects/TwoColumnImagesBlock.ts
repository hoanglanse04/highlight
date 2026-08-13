import type { Block } from 'payload'

import { mediaRelationship } from '@/fields/shared'

import { enabledBlockField } from './shared'

export const TwoColumnImagesBlock: Block = {
  slug: 'twoColumnImages',
  labels: { singular: 'Ảnh hai cột', plural: 'Khối ảnh hai cột' },
  fields: [
    mediaRelationship('leftImage', 'Ảnh bên trái', { required: true }),
    mediaRelationship('rightImage', 'Ảnh bên phải', { required: true }),
    {
      name: 'leftCaption',
      type: 'textarea',
      label: 'Chú thích ảnh trái',
      localized: true,
      maxLength: 500,
    },
    {
      name: 'rightCaption',
      type: 'textarea',
      label: 'Chú thích ảnh phải',
      localized: true,
      maxLength: 500,
    },
    {
      name: 'ratio',
      type: 'select',
      label: 'Tỷ lệ hai cột',
      defaultValue: 'equal',
      required: true,
      options: [
        { label: 'Hai cột bằng nhau', value: 'equal' },
        { label: 'Cột trái lớn hơn', value: 'left-large' },
        { label: 'Cột phải lớn hơn', value: 'right-large' },
      ],
    },
    {
      name: 'mobileOrder',
      type: 'select',
      label: 'Thứ tự trên di động',
      defaultValue: 'left-first',
      required: true,
      options: [
        { label: 'Ảnh trái trước', value: 'left-first' },
        { label: 'Ảnh phải trước', value: 'right-first' },
      ],
    },
    enabledBlockField,
  ],
}
