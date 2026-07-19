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
  websiteGlobalVersions,
} from '@/globals/shared'

export const Header: GlobalConfig<'header'> = {
  slug: 'header',
  label: 'Header',
  admin: websiteGlobalAdmin(
    'Manage website logos, navigation, language switcher, and header CTA.',
  ),
  access: websiteGlobalAccess,
  versions: websiteGlobalVersions,
  fields: [
    collapsibleGroup(
      'branding',
      'Branding and behavior',
      [
        mediaRelationship('logoLight', 'Light logo'),
        mediaRelationship('logoDark', 'Dark logo'),
        {
          name: 'sticky',
          type: 'checkbox',
          defaultValue: true,
        },
        {
          name: 'transparentOnHero',
          type: 'checkbox',
          defaultValue: true,
        },
        {
          name: 'showLanguageSwitcher',
          type: 'checkbox',
          defaultValue: true,
        },
      ],
      { initCollapsed: false },
    ),
    collapsibleGroup(
      'navigation',
      'Navigation',
      [
        {
          name: 'items',
          type: 'array',
          maxRows: 10,
          admin: {
            initCollapsed: true,
            description: 'Use relative paths for internal pages and HTTP(S) URLs externally.',
          },
          fields: navigationLinkFields({ includeInternalName: true }),
        },
      ],
      { initCollapsed: false },
    ),
    collapsibleGroup('cta', 'Header CTA', [
      ctaField('button', 'CTA button', { includeEnabled: true }),
    ]),
  ],
}
