import type { Field, GlobalConfig } from 'payload'

import {
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
  validateIntegerRange,
  validateNonNegativeInteger,
  validatePhone,
  validateYear,
} from '@/fields/validation'
import {
  websiteGlobalAccess,
  websiteGlobalAdmin,
  websiteGlobalHooks,
  websiteGlobalVersions,
} from '@/globals/shared'

const featuredProjectFields: Field[] = [
  {
    name: 'internalName',
    type: 'text',
    label: 'Tên nội bộ',
    maxLength: 120,
    required: true,
  },
  {
    name: 'title',
    type: 'text',
    label: 'Tiêu đề',
    localized: true,
    maxLength: 180,
    required: true,
  },
  {
    name: 'subtitle',
    type: 'text',
    label: 'Tiêu đề phụ',
    localized: true,
    maxLength: 220,
  },
  {
    name: 'categoryLabel',
    type: 'text',
    label: 'Nhãn danh mục',
    localized: true,
    maxLength: 100,
  },
  {
    name: 'clientName',
    type: 'text',
    label: 'Khách hàng',
    maxLength: 140,
  },
  {
    name: 'year',
    type: 'number',
    label: 'Năm',
    min: 1900,
    max: 2100,
    validate: validateYear,
  },
  mediaRelationship('coverImage', 'Ảnh bìa', { required: true }),
  mediaRelationship('previewImage', 'Ảnh xem trước'),
  {
    name: 'externalVideoURL',
    type: 'text',
    label: 'URL video bên ngoài',
    maxLength: 500,
    validate: validateExternalURL,
    admin: {
      description: 'URL HTTP(S) của YouTube, Vimeo hoặc nguồn video khác; không bắt buộc.',
    },
  },
  {
    name: 'link',
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
]

const projectCategoryFields: Field[] = [
  {
    name: 'internalName',
    type: 'text',
    label: 'Tên nội bộ',
    maxLength: 120,
    required: true,
  },
  {
    name: 'title',
    type: 'text',
    label: 'Tiêu đề',
    localized: true,
    maxLength: 160,
    required: true,
  },
  {
    name: 'description',
    type: 'textarea',
    label: 'Mô tả',
    localized: true,
    maxLength: 600,
  },
  mediaRelationship('coverImage', 'Ảnh bìa', { required: true }),
  {
    name: 'link',
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
]

const serviceFields: Field[] = [
  {
    name: 'internalName',
    type: 'text',
    label: 'Tên nội bộ',
    maxLength: 120,
    required: true,
  },
  {
    name: 'title',
    type: 'text',
    label: 'Tiêu đề',
    localized: true,
    maxLength: 160,
    required: true,
  },
  {
    name: 'description',
    type: 'textarea',
    label: 'Mô tả',
    localized: true,
    maxLength: 700,
  },
  {
    name: 'iconKey',
    type: 'select',
    label: 'Biểu tượng',
    options: [
      { label: 'Video', value: 'video' },
      { label: 'Máy quay', value: 'camera' },
      { label: 'Hậu kỳ', value: 'editing' },
      { label: 'Flycam', value: 'drone' },
      { label: 'Sự kiện', value: 'event' },
      { label: 'Sáng tạo', value: 'creative' },
      { label: 'Mạng xã hội', value: 'social' },
      { label: 'Phát trực tiếp', value: 'livestream' },
    ],
  },
  mediaRelationship('image', 'Ảnh dịch vụ'),
  {
    name: 'link',
    type: 'text',
    label: 'Đường dẫn',
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
    label: 'Giá trị',
    min: 0,
    required: true,
    validate: validateNonNegativeInteger,
  },
  {
    name: 'prefix',
    type: 'text',
    label: 'Tiền tố',
    maxLength: 20,
  },
  {
    name: 'suffix',
    type: 'text',
    label: 'Hậu tố',
    maxLength: 20,
  },
  {
    name: 'label',
    type: 'text',
    label: 'Nhãn',
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
    label: 'Tên khách hàng',
    maxLength: 140,
    required: true,
  },
  mediaRelationship('logo', 'Logo khách hàng', {
    description: 'Ưu tiên PNG hoặc WebP nền trong suốt và có độ tương phản phù hợp.',
    required: true,
  }),
  {
    name: 'websiteURL',
    type: 'text',
    label: 'Website',
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
    label: 'Tên nội bộ',
    maxLength: 120,
    required: true,
  },
  {
    name: 'title',
    type: 'text',
    label: 'Tiêu đề',
    localized: true,
    maxLength: 180,
    required: true,
  },
  {
    name: 'excerpt',
    type: 'textarea',
    label: 'Tóm tắt',
    localized: true,
    maxLength: 500,
  },
  mediaRelationship('thumbnail', 'Ảnh thu nhỏ', { required: true }),
  {
    name: 'publishedDate',
    type: 'date',
    label: 'Ngày đăng',
    admin: {
      date: {
        pickerAppearance: 'dayOnly',
      },
    },
  },
  {
    name: 'link',
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
]

type HomepageTab = Extract<Field, { type: 'tabs' }>['tabs'][number]

function homepageTab(
  name: string,
  label: string,
  fields: Field[],
  options: { description?: string } = {},
): HomepageTab {
  return {
    label,
    admin: options.description ? { description: options.description } : undefined,
    fields: [
      {
        name,
        type: 'group',
        label: false,
        admin: {
          hideGutter: true,
        },
        fields,
      },
    ],
  }
}

export const Homepage: GlobalConfig<'homepage'> = {
  slug: 'homepage',
  label: 'Trang chủ',
  admin: websiteGlobalAdmin(
    'Quản lý nội dung các section cố định. Bố cục, giao diện, animation và loại component vẫn do source code kiểm soát.',
  ),
  access: websiteGlobalAccess,
  hooks: websiteGlobalHooks,
  versions: websiteGlobalVersions,
  fields: [
    {
      type: 'tabs',
      admin: {
        className: 'highlight-homepage-tabs',
      },
      tabs: [
        homepageTab('seo', 'SEO', seoFields(), {
          description: 'Metadata tìm kiếm và mạng xã hội song ngữ của trang chủ.',
        }),
        homepageTab('hero', 'Hero', [
        ...sectionHeadingFields({ enabledLabel: 'Hiển thị Hero', titleRequired: true }),
        {
          name: 'mediaType',
          type: 'select',
          label: 'Loại media',
          defaultValue: 'image',
          options: [
            { label: 'Hình ảnh', value: 'image' },
            { label: 'Video bên ngoài', value: 'externalVideo' },
          ],
          required: true,
        },
        {
          name: 'backgroundImage',
          type: 'relationship',
          relationTo: 'media',
          label: 'Ảnh nền',
          validate: requireMediaForHeroType(
            'image',
            'Bắt buộc chọn ảnh nền khi loại media là hình ảnh.',
          ),
          admin: {
            condition: (_, siblingData) => siblingData?.mediaType === 'image',
          },
        },
        {
          name: 'posterImage',
          type: 'relationship',
          relationTo: 'media',
          label: 'Ảnh poster video',
          validate: requireMediaForHeroType(
            'externalVideo',
            'Bắt buộc chọn poster cho video bên ngoài.',
          ),
          admin: {
            condition: (_, siblingData) => siblingData?.mediaType === 'externalVideo',
          },
        },
        {
          name: 'externalVideoURL',
          type: 'text',
          label: 'URL video bên ngoài',
          maxLength: 500,
          validate: validateHeroVideoURL,
          admin: {
            condition: (_, siblingData) => siblingData?.mediaType === 'externalVideo',
            description: 'Chỉ dùng URL HTTP(S) bên ngoài. Không hỗ trợ tải video lên.',
          },
        },
        ctaField('primaryCTA', 'CTA chính'),
        ctaField('secondaryCTA', 'CTA phụ'),
        {
          name: 'showScrollIndicator',
          type: 'checkbox',
          label: 'Hiển thị chỉ dẫn cuộn',
          defaultValue: true,
        },
      ]),
        homepageTab('about', 'Giới thiệu', [
      ...sectionHeadingFields({ enabledLabel: 'Hiển thị Giới thiệu' }),
      {
        name: 'highlightText',
        type: 'textarea',
        label: 'Nội dung nhấn mạnh',
        localized: true,
        maxLength: 400,
      },
      mediaRelationship('mainImage', 'Ảnh chính'),
      {
        name: 'gallery',
        type: 'array',
        label: 'Thư viện ảnh',
        maxRows: 8,
        admin: { initCollapsed: true },
        fields: [mediaRelationship('image', 'Hình ảnh', { required: true })],
      },
      ctaField('cta', 'CTA'),
    ]),
        homepageTab('featuredProjects', 'Dự án nổi bật', [
        ...sectionHeadingFields({ enabledLabel: 'Hiển thị Dự án nổi bật' }),
        {
          name: 'sourceMode',
          type: 'select',
          label: 'Nguồn dữ liệu',
          defaultValue: 'manualEmbedded',
          required: true,
          options: [
            { label: 'Nhập thẻ thủ công', value: 'manualEmbedded' },
            { label: 'Collection Dự án', value: 'projectCollection' },
          ],
          admin: {
            description:
              'Chọn nhập thẻ thủ công hoặc lấy dữ liệu từ collection Dự án.',
          },
        },
        {
          name: 'selectedProjects',
          type: 'relationship',
          label: 'Dự án đã chọn',
          relationTo: 'projects',
          hasMany: true,
          maxRows: 12,
          maxDepth: 0,
          admin: {
            condition: (_, siblingData) => siblingData?.sourceMode === 'projectCollection',
          },
        },
        {
          name: 'collectionLimit',
          type: 'number',
          label: 'Số dự án tối đa',
          min: 1,
          max: 12,
          defaultValue: 8,
          required: true,
          validate: validateIntegerRange(1, 12),
          admin: {
            condition: (_, siblingData) => siblingData?.sourceMode === 'projectCollection',
          },
        },
        {
          name: 'collectionFilterFeatured',
          type: 'checkbox',
          label: 'Chỉ lấy dự án nổi bật',
          defaultValue: true,
          admin: {
            condition: (_, siblingData) => siblingData?.sourceMode === 'projectCollection',
          },
        },
        {
          name: 'items',
          type: 'array',
          label: 'Thẻ dự án thủ công',
          maxRows: 12,
          admin: {
            initCollapsed: true,
            description:
              'Các thẻ dự án nhập trực tiếp; chỉ dùng khi nguồn dữ liệu là thủ công.',
          },
          fields: featuredProjectFields,
        },
      ]),
        homepageTab('projectCategories', 'Danh mục dự án', [
        ...sectionHeadingFields({ enabledLabel: 'Hiển thị Danh mục dự án' }),
        {
          name: 'sourceMode',
          type: 'select',
          label: 'Nguồn dữ liệu',
          defaultValue: 'manualEmbedded',
          required: true,
          options: [
            { label: 'Nhập thẻ thủ công', value: 'manualEmbedded' },
            { label: 'Collection Danh mục dự án', value: 'categoryCollection' },
          ],
          admin: {
            description:
              'Chọn nhập thẻ thủ công hoặc lấy dữ liệu từ collection Danh mục dự án.',
          },
        },
        {
          name: 'selectedCategories',
          type: 'relationship',
          label: 'Danh mục đã chọn',
          relationTo: 'project-categories',
          hasMany: true,
          maxRows: 12,
          maxDepth: 0,
          admin: {
            condition: (_, siblingData) => siblingData?.sourceMode === 'categoryCollection',
          },
        },
        {
          name: 'collectionLimit',
          type: 'number',
          label: 'Số danh mục tối đa',
          min: 1,
          max: 12,
          defaultValue: 9,
          required: true,
          validate: validateIntegerRange(1, 12),
          admin: {
            condition: (_, siblingData) => siblingData?.sourceMode === 'categoryCollection',
          },
        },
        {
          name: 'items',
          type: 'array',
          label: 'Thẻ danh mục thủ công',
          maxRows: 12,
          admin: {
            initCollapsed: true,
            description:
              'Các thẻ danh mục nhập trực tiếp; chỉ dùng khi nguồn dữ liệu là thủ công.',
          },
          fields: projectCategoryFields,
        },
      ]),
        homepageTab('services', 'Dịch vụ', [
      ...sectionHeadingFields({ enabledLabel: 'Hiển thị Dịch vụ' }),
      {
        name: 'items',
        type: 'array',
        label: 'Danh sách dịch vụ',
        maxRows: 12,
        admin: { initCollapsed: true },
        fields: serviceFields,
      },
    ]),
        homepageTab('statistics', 'Thống kê', [
      ...sectionHeadingFields({ enabledLabel: 'Hiển thị Thống kê' }),
      {
        name: 'items',
        type: 'array',
        label: 'Các chỉ số',
        maxRows: 12,
        admin: { initCollapsed: true },
        fields: statisticFields,
      },
    ]),
        homepageTab('clients', 'Khách hàng', [
      ...sectionHeadingFields({ enabledLabel: 'Hiển thị Khách hàng' }),
      {
        name: 'items',
        type: 'array',
        label: 'Danh sách khách hàng',
        maxRows: 30,
        admin: { initCollapsed: true },
        fields: clientFields,
      },
    ]),
        homepageTab('stories', 'Câu chuyện', [
      ...sectionHeadingFields({ enabledLabel: 'Hiển thị Câu chuyện' }),
      {
        name: 'items',
        type: 'array',
        label: 'Danh sách câu chuyện',
        maxRows: 12,
        admin: {
          initCollapsed: true,
          description:
            'Danh sách câu chuyện nhập trực tiếp; có thể chuyển sang collection Bài viết ở phase sau.',
        },
        fields: storyFields,
      },
    ]),
        homepageTab('contactCTA', 'CTA liên hệ', [
      ...sectionHeadingFields({ enabledLabel: 'Hiển thị CTA liên hệ' }),
      mediaRelationship('backgroundImage', 'Ảnh nền'),
      ctaField('cta', 'CTA'),
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
      ],
    },
  ],
}
