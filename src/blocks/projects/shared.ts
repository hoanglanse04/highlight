import type { Field } from 'payload'

import { displayOrderField, mediaRelationship } from '@/fields/shared'
import { validateNonNegativeInteger } from '@/fields/validation'

export const enabledBlockField: Field = {
  name: 'enabled',
  type: 'checkbox',
  label: 'Bật hiển thị',
  defaultValue: true,
}

export function projectFactFields(): Field[] {
  return [
    {
      name: 'label',
      type: 'text',
      label: 'Nhãn',
      localized: true,
      required: true,
      maxLength: 120,
    },
    {
      name: 'value',
      type: 'text',
      label: 'Giá trị',
      localized: true,
      required: true,
      maxLength: 300,
    },
    displayOrderField(),
  ]
}

export function projectStatisticFields(): Field[] {
  return [
    {
      name: 'value',
      type: 'number',
      label: 'Giá trị',
      required: true,
      min: 0,
      validate: validateNonNegativeInteger,
    },
    { name: 'prefix', type: 'text', label: 'Tiền tố', maxLength: 20 },
    { name: 'suffix', type: 'text', label: 'Hậu tố', maxLength: 20 },
    {
      name: 'label',
      type: 'text',
      label: 'Nhãn',
      localized: true,
      required: true,
      maxLength: 140,
    },
    displayOrderField(),
  ]
}

export function galleryImageFields(): Field[] {
  return [
    mediaRelationship('image', 'Hình ảnh', { required: true }),
    {
      name: 'caption',
      type: 'textarea',
      label: 'Chú thích',
      localized: true,
      maxLength: 500,
    },
    displayOrderField(),
  ]
}
