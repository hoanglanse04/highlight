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
    label: 'Bật hiển thị',
    defaultValue,
    admin: {
      description: 'Nội dung bị tắt vẫn được giữ trong CMS nhưng không hiển thị ngoài website.',
    },
  }
}

export function displayOrderField(): Field {
  return {
    name: 'displayOrder',
    type: 'number',
    label: 'Thứ tự hiển thị',
    defaultValue: 0,
    min: 0,
    required: true,
    validate: validateNonNegativeInteger,
    admin: {
      description: 'Số nhỏ hơn hiển thị trước. Vẫn có thể kéo thả item trong danh sách.',
    },
  }
}

export function sectionHeadingFields(options: SectionHeadingOptions = {}): Field[] {
  return [
    enabledField(options.defaultEnabled ?? true),
    {
      name: 'eyebrow',
      type: 'text',
      label: 'Dòng dẫn',
      localized: true,
      maxLength: 100,
    },
    {
      name: 'title',
      type: 'text',
      label: 'Tiêu đề',
      localized: true,
      maxLength: 180,
      required: options.titleRequired,
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Mô tả',
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
      label: 'Nhãn nút',
      localized: true,
      maxLength: 80,
      required: options.requiredLabel,
    },
    {
      name: 'url',
      type: 'text',
      label: 'Đường dẫn',
      maxLength: 500,
      required: options.requiredURL,
      validate: validateInternalOrExternalURL,
    },
    {
      name: 'openInNewTab',
      type: 'checkbox',
      label: 'Mở trong tab mới',
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
      label: 'Tên nội bộ',
      maxLength: 120,
      required: true,
    })
  }

  fields.push(
    {
      name: 'label',
      type: 'text',
      label: 'Nhãn liên kết',
      localized: true,
      maxLength: 100,
      required: true,
    },
    {
      name: 'url',
      type: 'text',
      label: 'Đường dẫn',
      maxLength: 500,
      required: true,
      validate: validateInternalOrExternalURL,
    },
    {
      name: 'openInNewTab',
      type: 'checkbox',
      label: 'Mở trong tab mới',
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
      label: 'Tiêu đề SEO',
      localized: true,
      maxLength: 70,
      admin: {
        description: 'Khuyến nghị tối đa 60–70 ký tự.',
      },
    },
    {
      name: 'metaDescription',
      type: 'textarea',
      label: 'Mô tả SEO',
      localized: true,
      maxLength: 170,
      admin: {
        description: 'Khuyến nghị tối đa 155–170 ký tự.',
      },
    },
    {
      name: 'ogTitle',
      type: 'text',
      label: 'Tiêu đề Open Graph',
      localized: true,
      maxLength: 100,
    },
    {
      name: 'ogDescription',
      type: 'textarea',
      label: 'Mô tả Open Graph',
      localized: true,
      maxLength: 220,
    },
    mediaRelationship('ogImage', 'Ảnh Open Graph'),
    {
      name: 'noIndex',
      type: 'checkbox',
      label: 'Không cho công cụ tìm kiếm lập chỉ mục',
      defaultValue: false,
    },
    {
      name: 'canonicalURL',
      type: 'text',
      label: 'URL chính tắc',
      maxLength: 500,
      validate: validateExternalURL,
      admin: {
        description: 'URL HTTP(S) chính tắc đầy đủ, không bắt buộc.',
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
  { label: 'Khác', value: 'other' },
] as const

export function socialLinksField(): Field {
  return {
    name: 'socialLinks',
    type: 'array',
    maxRows: 12,
    admin: {
      initCollapsed: true,
      description: 'Danh sách mạng xã hội dùng chung. Không nhập trùng trong Header hoặc Footer.',
    },
    fields: [
      {
        name: 'platform',
        type: 'select',
        label: 'Nền tảng',
        options: [...socialPlatformOptions],
        required: true,
      },
      {
        name: 'label',
        type: 'text',
        label: 'Nhãn tùy chọn',
        maxLength: 80,
      },
      {
        name: 'url',
        type: 'text',
        label: 'Đường dẫn',
        maxLength: 500,
        required: true,
        validate: validateExternalURL,
      },
      enabledField(true),
      displayOrderField(),
    ],
  }
}
