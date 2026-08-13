import type { Block } from 'payload'

import { mediaRelationship } from '@/fields/shared'
import { validateAutoplayMuted, validateSupportedVideoURL } from '@/fields/validation'

import { enabledBlockField } from './shared'

export const ExternalVideoBlock: Block = {
  slug: 'externalVideo',
  labels: { singular: 'Video bên ngoài', plural: 'Video bên ngoài' },
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
      name: 'videoURL',
      type: 'text',
      label: 'URL video',
      required: true,
      maxLength: 500,
      validate: validateSupportedVideoURL,
      admin: { description: 'URL YouTube, Vimeo, tệp .mp4 hoặc .webm.' },
    },
    mediaRelationship('posterImage', 'Ảnh poster', { required: true }),
    {
      name: 'autoplay',
      type: 'checkbox',
      label: 'Tự động phát',
      defaultValue: false,
      validate: validateAutoplayMuted,
    },
    { name: 'muted', type: 'checkbox', label: 'Tắt tiếng', defaultValue: true },
    { name: 'loop', type: 'checkbox', label: 'Phát lặp lại', defaultValue: false },
    { name: 'controls', type: 'checkbox', label: 'Hiển thị điều khiển', defaultValue: true },
    {
      name: 'aspectRatio',
      type: 'select',
      label: 'Tỷ lệ khung hình',
      defaultValue: '16:9',
      required: true,
      options: [
        { label: 'Ngang 16:9', value: '16:9' },
        { label: 'Dọc 9:16', value: '9:16' },
        { label: 'Vuông 1:1', value: '1:1' },
        { label: 'Điện ảnh', value: 'cinematic' },
      ],
    },
    enabledBlockField,
  ],
}
