import type { Field } from 'payload'

import {
  validateExternalURL,
  validateInternalOrExternalURL,
  validateNonNegativeInteger,
} from '@/fields/validation'

type CTAOptions = {
  includeEnabled?: boolean
  requiredLabel?: boolean
  requiredURL?: boolean
}

type SectionHeadingOptions = {
  defaultEnabled?: boolean
  descriptionRequired?: boolean
  titleRequired?: boolean
}

export function mediaRelationship(
  name: string,
  label: string,
  options: { description?: string; required?: boolean } = {},
): Field {
  return {
    name,
    type: 'relationship',
    relationTo: 'media',
    label,
    required: options.required,
    admin: options.description ? { description: options.description } : undefined,
  }
}

export function enabledField(defaultValue = true): Field {
  return {
    name: 'enabled',
    type: 'checkbox',
    defaultValue,
    admin: {
      description: 'Disabled content remains in the CMS but should not be rendered.',
    },
  }
}

export function displayOrderField(): Field {
  return {
    name: 'displayOrder',
    type: 'number',
    defaultValue: 0,
    min: 0,
    required: true,
    validate: validateNonNegativeInteger,
    admin: {
      description: 'Lower values appear first. Array drag order remains available in Admin.',
    },
  }
}

export function sectionHeadingFields(options: SectionHeadingOptions = {}): Field[] {
  return [
    enabledField(options.defaultEnabled ?? true),
    {
      name: 'eyebrow',
      type: 'text',
      localized: true,
      maxLength: 100,
    },
    {
      name: 'title',
      type: 'text',
      localized: true,
      maxLength: 180,
      required: options.titleRequired,
    },
    {
      name: 'description',
      type: 'textarea',
      localized: true,
      maxLength: 1200,
      required: options.descriptionRequired,
    },
  ]
}

export function collapsibleGroup(
  name: string,
  label: string,
  fields: Field[],
  options: { description?: string; initCollapsed?: boolean } = {},
): Field {
  return {
    name,
    type: 'group',
    label: false,
    admin: {
      hideGutter: true,
    },
    fields: [
      {
        type: 'collapsible',
        label,
        admin: {
          description: options.description,
          initCollapsed: options.initCollapsed ?? true,
        },
        fields,
      },
    ],
  }
}

export function ctaField(
  name: string,
  label: string,
  options: CTAOptions = {},
): Field {
  const fields: Field[] = [
    {
      name: 'label',
      type: 'text',
      localized: true,
      maxLength: 80,
      required: options.requiredLabel,
    },
    {
      name: 'url',
      type: 'text',
      maxLength: 500,
      required: options.requiredURL,
      validate: validateInternalOrExternalURL,
    },
    {
      name: 'openInNewTab',
      type: 'checkbox',
      defaultValue: false,
    },
  ]

  if (options.includeEnabled) {
    fields.unshift(enabledField(false))
  }

  return {
    name,
    type: 'group',
    label,
    fields,
  }
}

export function navigationLinkFields(options: { includeInternalName?: boolean } = {}): Field[] {
  const fields: Field[] = []

  if (options.includeInternalName) {
    fields.push({
      name: 'internalName',
      type: 'text',
      maxLength: 120,
      required: true,
    })
  }

  fields.push(
    {
      name: 'label',
      type: 'text',
      localized: true,
      maxLength: 100,
      required: true,
    },
    {
      name: 'url',
      type: 'text',
      maxLength: 500,
      required: true,
      validate: validateInternalOrExternalURL,
    },
    {
      name: 'openInNewTab',
      type: 'checkbox',
      defaultValue: false,
    },
    enabledField(true),
    displayOrderField(),
  )

  return fields
}

export function seoFields(): Field[] {
  return [
    {
      name: 'metaTitle',
      type: 'text',
      localized: true,
      maxLength: 70,
      admin: {
        description: 'Recommended maximum: 60–70 characters.',
      },
    },
    {
      name: 'metaDescription',
      type: 'textarea',
      localized: true,
      maxLength: 170,
      admin: {
        description: 'Recommended maximum: 155–170 characters.',
      },
    },
    {
      name: 'ogTitle',
      type: 'text',
      localized: true,
      maxLength: 100,
    },
    {
      name: 'ogDescription',
      type: 'textarea',
      localized: true,
      maxLength: 220,
    },
    mediaRelationship('ogImage', 'Open Graph image'),
    {
      name: 'noIndex',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'canonicalURL',
      type: 'text',
      maxLength: 500,
      validate: validateExternalURL,
      admin: {
        description: 'Optional absolute HTTP(S) canonical URL.',
      },
    },
  ]
}

export const socialPlatformOptions = [
  { label: 'Facebook', value: 'facebook' },
  { label: 'Instagram', value: 'instagram' },
  { label: 'TikTok', value: 'tiktok' },
  { label: 'YouTube', value: 'youtube' },
  { label: 'Vimeo', value: 'vimeo' },
  { label: 'LinkedIn', value: 'linkedin' },
  { label: 'Behance', value: 'behance' },
  { label: 'Other', value: 'other' },
] as const

export function socialLinksField(): Field {
  return {
    name: 'socialLinks',
    type: 'array',
    maxRows: 12,
    admin: {
      initCollapsed: true,
      description: 'Canonical social links. Do not duplicate these in Header or Footer.',
    },
    fields: [
      {
        name: 'platform',
        type: 'select',
        options: [...socialPlatformOptions],
        required: true,
      },
      {
        name: 'label',
        type: 'text',
        maxLength: 80,
      },
      {
        name: 'url',
        type: 'text',
        maxLength: 500,
        required: true,
        validate: validateExternalURL,
      },
      enabledField(true),
      displayOrderField(),
    ],
  }
}
