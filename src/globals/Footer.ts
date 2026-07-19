import type { GlobalConfig } from 'payload'

import {
  collapsibleGroup,
  mediaRelationship,
  navigationLinkFields,
} from '@/fields/shared'
import { validatePhone } from '@/fields/validation'
import {
  websiteGlobalAccess,
  websiteGlobalAdmin,
  websiteGlobalVersions,
} from '@/globals/shared'

export const Footer: GlobalConfig<'footer'> = {
  slug: 'footer',
  label: 'Footer',
  admin: websiteGlobalAdmin(
    'Manage footer branding, localized navigation, contact details, and copyright.',
  ),
  access: websiteGlobalAccess,
  versions: websiteGlobalVersions,
  fields: [
    collapsibleGroup(
      'branding',
      'Branding',
      [
        mediaRelationship('logo', 'Footer logo'),
        {
          name: 'shortDescription',
          type: 'textarea',
          localized: true,
          maxLength: 500,
        },
        mediaRelationship('backgroundImage', 'Background image'),
      ],
      { initCollapsed: false },
    ),
    collapsibleGroup(
      'navigation',
      'Navigation columns',
      [
        {
          name: 'columns',
          type: 'array',
          maxRows: 6,
          admin: { initCollapsed: true },
          fields: [
            {
              name: 'title',
              type: 'text',
              localized: true,
              maxLength: 100,
              required: true,
            },
            {
              name: 'links',
              type: 'array',
              maxRows: 12,
              admin: { initCollapsed: true },
              fields: navigationLinkFields(),
            },
          ],
        },
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
    collapsibleGroup('legal', 'Legal', [
      {
        name: 'copyright',
        type: 'text',
        localized: true,
        maxLength: 240,
      },
    ]),
  ],
}
