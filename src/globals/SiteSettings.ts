import type { GlobalConfig } from 'payload'

import {
  collapsibleGroup,
  mediaRelationship,
  socialLinksField,
} from '@/fields/shared'
import {
  validateInternalOrExternalURL,
  validatePhone,
} from '@/fields/validation'
import {
  websiteGlobalAccess,
  websiteGlobalAdmin,
  websiteGlobalHooks,
  websiteGlobalVersions,
} from '@/globals/shared'

export const SiteSettings: GlobalConfig<'site-settings'> = {
  slug: 'site-settings',
  label: 'Cài đặt website',
  admin: websiteGlobalAdmin(
    'Quản lý thương hiệu, liên hệ, mạng xã hội, SEO mặc định và thông báo bảo trì. Không lưu secret tại đây.',
  ),
  access: websiteGlobalAccess,
  hooks: websiteGlobalHooks,
  versions: websiteGlobalVersions,
  fields: [
    collapsibleGroup(
      'brand',
      'Thương hiệu',
      [
        {
          name: 'siteName',
          type: 'text',
          label: 'Tên website',
          maxLength: 120,
          required: true,
        },
        {
          name: 'legalName',
          type: 'text',
          label: 'Tên pháp lý',
          maxLength: 180,
        },
        {
          name: 'defaultLocale',
          type: 'select',
          label: 'Ngôn ngữ mặc định',
          defaultValue: 'vi',
          options: [
            { label: 'Tiếng Việt', value: 'vi' },
            { label: 'English', value: 'en' },
          ],
          required: true,
        },
        {
          name: 'fallbackLocale',
          type: 'select',
          label: 'Ngôn ngữ dự phòng',
          defaultValue: 'vi',
          options: [{ label: 'Tiếng Việt', value: 'vi' }],
          required: true,
          admin: {
            description: 'Giá trị chỉ đọc, phản ánh locale dự phòng của Payload.',
            readOnly: true,
          },
        },
        mediaRelationship('favicon', 'Favicon'),
        mediaRelationship('defaultOGImage', 'Ảnh Open Graph mặc định'),
        mediaRelationship('logoMark', 'Biểu trưng logo'),
      ],
      { initCollapsed: false },
    ),
    collapsibleGroup('contact', 'Liên hệ', [
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
    ]),
    collapsibleGroup('social', 'Mạng xã hội', [socialLinksField()]),
    collapsibleGroup('seoDefaults', 'SEO mặc định', [
      {
        name: 'defaultMetaTitle',
        type: 'text',
        label: 'Tiêu đề SEO mặc định',
        localized: true,
        maxLength: 70,
      },
      {
        name: 'defaultMetaDescription',
        type: 'textarea',
        label: 'Mô tả SEO mặc định',
        localized: true,
        maxLength: 170,
      },
    ]),
    collapsibleGroup('system', 'Hệ thống', [
      {
        name: 'maintenanceMode',
        type: 'checkbox',
        label: 'Chế độ bảo trì',
        defaultValue: false,
      },
      {
        name: 'maintenanceMessage',
        type: 'textarea',
        label: 'Thông báo bảo trì',
        localized: true,
        maxLength: 500,
      },
      {
        name: 'defaultContactCTAURL',
        type: 'text',
        label: 'URL CTA liên hệ mặc định',
        maxLength: 500,
        validate: validateInternalOrExternalURL,
      },
    ]),
  ],
}
