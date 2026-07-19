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
  websiteGlobalVersions,
} from '@/globals/shared'

export const SiteSettings: GlobalConfig<'site-settings'> = {
  slug: 'site-settings',
  label: 'Site Settings',
  admin: websiteGlobalAdmin(
    'Manage public brand defaults, contact information, social links, SEO defaults, and maintenance messaging. Never store secrets here.',
  ),
  access: websiteGlobalAccess,
  versions: websiteGlobalVersions,
  fields: [
    collapsibleGroup(
      'brand',
      'Brand',
      [
        {
          name: 'siteName',
          type: 'text',
          maxLength: 120,
          required: true,
        },
        {
          name: 'legalName',
          type: 'text',
          maxLength: 180,
        },
        {
          name: 'defaultLocale',
          type: 'select',
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
          defaultValue: 'vi',
          options: [{ label: 'Tiếng Việt', value: 'vi' }],
          required: true,
          admin: {
            description: 'Read-only mirror of the Payload fallback locale.',
            readOnly: true,
          },
        },
        mediaRelationship('favicon', 'Favicon'),
        mediaRelationship('defaultOGImage', 'Default Open Graph image'),
        mediaRelationship('logoMark', 'Logo mark'),
      ],
      { initCollapsed: false },
    ),
    collapsibleGroup('contact', 'Contact', [
      {
        name: 'email',
        type: 'email',
      },
      {
        name: 'phone',
        type: 'text',
        maxLength: 32,
        validate: validatePhone,
      },
      {
        name: 'address',
        type: 'textarea',
        localized: true,
        maxLength: 500,
      },
    ]),
    collapsibleGroup('social', 'Social links', [socialLinksField()]),
    collapsibleGroup('seoDefaults', 'SEO defaults', [
      {
        name: 'defaultMetaTitle',
        type: 'text',
        localized: true,
        maxLength: 70,
      },
      {
        name: 'defaultMetaDescription',
        type: 'textarea',
        localized: true,
        maxLength: 170,
      },
    ]),
    collapsibleGroup('system', 'System', [
      {
        name: 'maintenanceMode',
        type: 'checkbox',
        defaultValue: false,
      },
      {
        name: 'maintenanceMessage',
        type: 'textarea',
        localized: true,
        maxLength: 500,
      },
      {
        name: 'defaultContactCTAURL',
        type: 'text',
        maxLength: 500,
        validate: validateInternalOrExternalURL,
      },
    ]),
  ],
}
