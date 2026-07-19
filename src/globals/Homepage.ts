import type { Field, GlobalConfig } from 'payload'

import {
  collapsibleGroup,
  ctaField,
  displayOrderField,
  enabledField,
  mediaRelationship,
  sectionHeadingFields,
  seoFields,
} from '@/fields/shared'
import {
  requireMediaForHeroType,
  validateExternalURL,
  validateHeroVideoURL,
  validateInternalOrExternalURL,
  validateNonNegativeInteger,
  validatePhone,
  validateYear,
} from '@/fields/validation'
import {
  websiteGlobalAccess,
  websiteGlobalAdmin,
  websiteGlobalVersions,
} from '@/globals/shared'

const featuredProjectFields: Field[] = [
  {
    name: 'internalName',
    type: 'text',
    maxLength: 120,
    required: true,
  },
  {
    name: 'title',
    type: 'text',
    localized: true,
    maxLength: 180,
    required: true,
  },
  {
    name: 'subtitle',
    type: 'text',
    localized: true,
    maxLength: 220,
  },
  {
    name: 'categoryLabel',
    type: 'text',
    localized: true,
    maxLength: 100,
  },
  {
    name: 'clientName',
    type: 'text',
    maxLength: 140,
  },
  {
    name: 'year',
    type: 'number',
    min: 1900,
    max: 2100,
    validate: validateYear,
  },
  mediaRelationship('coverImage', 'Cover image', { required: true }),
  mediaRelationship('previewImage', 'Preview image'),
  {
    name: 'externalVideoURL',
    type: 'text',
    maxLength: 500,
    validate: validateExternalURL,
    admin: {
      description: 'Optional YouTube, Vimeo, or other external HTTP(S) video URL.',
    },
  },
  {
    name: 'link',
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
]

const projectCategoryFields: Field[] = [
  {
    name: 'internalName',
    type: 'text',
    maxLength: 120,
    required: true,
  },
  {
    name: 'title',
    type: 'text',
    localized: true,
    maxLength: 160,
    required: true,
  },
  {
    name: 'description',
    type: 'textarea',
    localized: true,
    maxLength: 600,
  },
  mediaRelationship('coverImage', 'Cover image', { required: true }),
  {
    name: 'link',
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
]

const serviceFields: Field[] = [
  {
    name: 'internalName',
    type: 'text',
    maxLength: 120,
    required: true,
  },
  {
    name: 'title',
    type: 'text',
    localized: true,
    maxLength: 160,
    required: true,
  },
  {
    name: 'description',
    type: 'textarea',
    localized: true,
    maxLength: 700,
  },
  {
    name: 'iconKey',
    type: 'select',
    options: [
      { label: 'Video', value: 'video' },
      { label: 'Camera', value: 'camera' },
      { label: 'Editing', value: 'editing' },
      { label: 'Drone', value: 'drone' },
      { label: 'Event', value: 'event' },
      { label: 'Creative', value: 'creative' },
      { label: 'Social', value: 'social' },
      { label: 'Livestream', value: 'livestream' },
    ],
  },
  mediaRelationship('image', 'Service image'),
  {
    name: 'link',
    type: 'text',
    maxLength: 500,
    validate: validateInternalOrExternalURL,
  },
  enabledField(true),
  displayOrderField(),
]

const statisticFields: Field[] = [
  {
    name: 'value',
    type: 'number',
    min: 0,
    required: true,
    validate: validateNonNegativeInteger,
  },
  {
    name: 'prefix',
    type: 'text',
    maxLength: 20,
  },
  {
    name: 'suffix',
    type: 'text',
    maxLength: 20,
  },
  {
    name: 'label',
    type: 'text',
    localized: true,
    maxLength: 140,
    required: true,
  },
  enabledField(true),
  displayOrderField(),
]

const clientFields: Field[] = [
  {
    name: 'name',
    type: 'text',
    maxLength: 140,
    required: true,
  },
  mediaRelationship('logo', 'Client logo', {
    description: 'Prefer a transparent PNG or WebP with sufficient contrast.',
    required: true,
  }),
  {
    name: 'websiteURL',
    type: 'text',
    maxLength: 500,
    validate: validateExternalURL,
  },
  enabledField(true),
  displayOrderField(),
]

const storyFields: Field[] = [
  {
    name: 'internalName',
    type: 'text',
    maxLength: 120,
    required: true,
  },
  {
    name: 'title',
    type: 'text',
    localized: true,
    maxLength: 180,
    required: true,
  },
  {
    name: 'excerpt',
    type: 'textarea',
    localized: true,
    maxLength: 500,
  },
  mediaRelationship('thumbnail', 'Thumbnail', { required: true }),
  {
    name: 'publishedDate',
    type: 'date',
    admin: {
      date: {
        pickerAppearance: 'dayOnly',
      },
    },
  },
  {
    name: 'link',
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
]

export const Homepage: GlobalConfig<'homepage'> = {
  slug: 'homepage',
  label: 'Homepage',
  admin: websiteGlobalAdmin(
    'Manage fixed homepage sections. Layout, styling, animation, and component types remain code-owned.',
  ),
  access: websiteGlobalAccess,
  versions: websiteGlobalVersions,
  fields: [
    collapsibleGroup('seo', 'SEO', seoFields(), {
      description: 'Localized search and social metadata for the homepage.',
      initCollapsed: false,
    }),
    collapsibleGroup(
      'hero',
      'Hero',
      [
        ...sectionHeadingFields({ titleRequired: true }),
        {
          name: 'mediaType',
          type: 'select',
          defaultValue: 'image',
          options: [
            { label: 'Image', value: 'image' },
            { label: 'External video', value: 'externalVideo' },
          ],
          required: true,
        },
        {
          name: 'backgroundImage',
          type: 'relationship',
          relationTo: 'media',
          label: 'Background image',
          validate: requireMediaForHeroType(
            'image',
            'Background image is required when media type is image.',
          ),
          admin: {
            condition: (_, siblingData) => siblingData?.mediaType === 'image',
          },
        },
        {
          name: 'posterImage',
          type: 'relationship',
          relationTo: 'media',
          label: 'Video poster image',
          validate: requireMediaForHeroType(
            'externalVideo',
            'Poster image is required for an external video.',
          ),
          admin: {
            condition: (_, siblingData) => siblingData?.mediaType === 'externalVideo',
          },
        },
        {
          name: 'externalVideoURL',
          type: 'text',
          maxLength: 500,
          validate: validateHeroVideoURL,
          admin: {
            condition: (_, siblingData) => siblingData?.mediaType === 'externalVideo',
            description: 'External HTTP(S) URL only. Video uploads are not supported.',
          },
        },
        ctaField('primaryCTA', 'Primary CTA'),
        ctaField('secondaryCTA', 'Secondary CTA'),
        {
          name: 'showScrollIndicator',
          type: 'checkbox',
          defaultValue: true,
        },
      ],
      { initCollapsed: false },
    ),
    collapsibleGroup('about', 'About', [
      ...sectionHeadingFields(),
      {
        name: 'highlightText',
        type: 'textarea',
        localized: true,
        maxLength: 400,
      },
      mediaRelationship('mainImage', 'Main image'),
      {
        name: 'gallery',
        type: 'array',
        maxRows: 8,
        admin: { initCollapsed: true },
        fields: [mediaRelationship('image', 'Image', { required: true })],
      },
      ctaField('cta', 'CTA'),
    ]),
    collapsibleGroup(
      'featuredProjects',
      'Featured Projects',
      [
        ...sectionHeadingFields(),
        {
          name: 'items',
          type: 'array',
          maxRows: 12,
          admin: {
            initCollapsed: true,
            description:
              'Temporary embedded project cards. A later phase can replace this source with Project relationships.',
          },
          fields: featuredProjectFields,
        },
      ],
    ),
    collapsibleGroup(
      'projectCategories',
      'Project Categories',
      [
        ...sectionHeadingFields(),
        {
          name: 'items',
          type: 'array',
          maxRows: 12,
          admin: {
            initCollapsed: true,
            description:
              'Temporary homepage category cards; this does not create a Categories collection.',
          },
          fields: projectCategoryFields,
        },
      ],
    ),
    collapsibleGroup('services', 'Services', [
      ...sectionHeadingFields(),
      {
        name: 'items',
        type: 'array',
        maxRows: 12,
        admin: { initCollapsed: true },
        fields: serviceFields,
      },
    ]),
    collapsibleGroup('statistics', 'Statistics', [
      ...sectionHeadingFields(),
      {
        name: 'items',
        type: 'array',
        maxRows: 12,
        admin: { initCollapsed: true },
        fields: statisticFields,
      },
    ]),
    collapsibleGroup('clients', 'Clients', [
      ...sectionHeadingFields(),
      {
        name: 'items',
        type: 'array',
        maxRows: 30,
        admin: { initCollapsed: true },
        fields: clientFields,
      },
    ]),
    collapsibleGroup('stories', 'Stories', [
      ...sectionHeadingFields(),
      {
        name: 'items',
        type: 'array',
        maxRows: 12,
        admin: {
          initCollapsed: true,
          description:
            'Temporary embedded stories. A later phase can replace this source with Post relationships.',
        },
        fields: storyFields,
      },
    ]),
    collapsibleGroup('contactCTA', 'Contact CTA', [
      ...sectionHeadingFields(),
      mediaRelationship('backgroundImage', 'Background image'),
      ctaField('cta', 'CTA'),
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
  ],
}
