import type { GlobalConfig } from 'payload'

import {
  collapsibleGroup,
  ctaField,
  mediaRelationship,
  navigationLinkFields,
} from '@/fields/shared'
import {
  websiteGlobalAccess,
  websiteGlobalAdmin,
  websiteGlobalHooks,
  websiteGlobalVersions,
} from '@/globals/shared'

export const Header: GlobalConfig<'header'> = {
  slug: 'header',
  label: 'Đầu trang',
  admin: websiteGlobalAdmin(
    'Quản lý logo, điều hướng, nút chuyển ngôn ngữ và CTA ở đầu trang.',
  ),
  access: websiteGlobalAccess,
  hooks: websiteGlobalHooks,
  versions: websiteGlobalVersions,
  fields: [
    collapsibleGroup(
      'branding',
      'Thương hiệu và hành vi',
      [
        mediaRelationship('logoLight', 'Logo nền tối'),
        mediaRelationship('logoDark', 'Logo nền sáng'),
        {
          name: 'sticky',
          type: 'checkbox',
          label: 'Cố định khi cuộn trang',
          defaultValue: true,
        },
        {
          name: 'transparentOnHero',
          type: 'checkbox',
          label: 'Trong suốt trên Hero',
          defaultValue: false,
          admin: {
            hidden: true,
          },
        },
        {
          name: 'showLanguageSwitcher',
          type: 'checkbox',
          label: 'Hiển thị nút chuyển ngôn ngữ',
          defaultValue: true,
        },
      ],
      { initCollapsed: false },
    ),
    collapsibleGroup(
      'navigation',
      'Điều hướng',
      [
        {
          name: 'items',
          type: 'array',
          label: 'Mục điều hướng',
          maxRows: 10,
          admin: {
            initCollapsed: true,
            description: 'Dùng đường dẫn tương đối cho trang nội bộ và URL HTTP(S) cho liên kết ngoài.',
          },
          fields: navigationLinkFields({ includeInternalName: true }),
        },
      ],
      { initCollapsed: false },
    ),
    collapsibleGroup('cta', 'CTA đầu trang', [
      ctaField('button', 'Nút CTA', { includeEnabled: true }),
    ]),
  ],
}
