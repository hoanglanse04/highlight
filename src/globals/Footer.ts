import type { GlobalConfig } from 'payload'

import {
  groupedTab,
  mediaRelationship,
  navigationLinkFields,
} from '@/fields/shared'
import { validatePhone } from '@/fields/validation'
import {
  websiteGlobalAccess,
  websiteGlobalAdmin,
  websiteGlobalHooks,
  websiteGlobalVersions,
} from '@/globals/shared'

export const Footer: GlobalConfig<'footer'> = {
  slug: 'footer',
  label: 'Chân trang',
  admin: websiteGlobalAdmin(
    'Quản lý thương hiệu, điều hướng song ngữ, thông tin liên hệ và bản quyền ở chân trang.',
  ),
  access: websiteGlobalAccess,
  hooks: websiteGlobalHooks,
  versions: websiteGlobalVersions,
  fields: [
    {
      type: 'tabs',
      admin: {
        className: 'highlight-global-tabs',
      },
      tabs: [
        groupedTab('branding', 'Thương hiệu', [
          mediaRelationship('logo', 'Logo chân trang'),
          {
            name: 'shortDescription',
            type: 'textarea',
            label: 'Mô tả ngắn',
            localized: true,
            maxLength: 500,
          },
          mediaRelationship('backgroundImage', 'Ảnh nền'),
        ]),
        groupedTab('navigation', 'Các cột điều hướng', [
          {
            name: 'columns',
            type: 'array',
            label: 'Cột điều hướng',
            maxRows: 6,
            admin: { initCollapsed: true },
            fields: [
              {
                name: 'title',
                type: 'text',
                label: 'Tiêu đề cột',
                localized: true,
                maxLength: 100,
                required: true,
              },
              {
                name: 'links',
                type: 'array',
                label: 'Liên kết',
                maxRows: 12,
                admin: { initCollapsed: true },
                fields: navigationLinkFields(),
              },
            ],
          },
        ]),
        groupedTab('contact', 'Liên hệ & Bản đồ', [
          {
            name: 'email',
            type: 'email',
            label: 'Email',
          },
          {
            name: 'phone',
            type: 'text',
            label: 'Số điện thoại',
            maxLength: 32,
            validate: validatePhone,
          },
          {
            name: 'address',
            type: 'textarea',
            label: 'Địa chỉ',
            localized: true,
            maxLength: 500,
          },
          {
            name: 'mapEmbedUrl',
            type: 'text',
            label: 'Link nhúng Google Maps tùy chỉnh (tùy chọn)',
            admin: {
              description:
                'Nếu để trống, hệ thống sẽ tự động hiển thị Google Maps theo trường Địa chỉ ở trên.',
            },
          },
        ]),
        groupedTab('legal', 'Pháp lý', [
          {
            name: 'copyright',
            type: 'text',
            label: 'Bản quyền',
            localized: true,
            maxLength: 240,
          },
        ]),
      ],
    },
  ],
}
