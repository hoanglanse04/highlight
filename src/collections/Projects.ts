import type { CollectionConfig, Field } from 'payload'

import {
  authenticatedFieldAccess,
  authenticatedOnly,
  contentEditorFieldAccess,
  contentEditors,
  publishedOrAuthenticated,
} from '@/access/users'
import { projectContentBlocks } from '@/blocks/projects'
import { galleryImageFields, projectFactFields, projectStatisticFields } from '@/blocks/projects/shared'
import { internalNameField, populateProjectSlug, projectSlugField } from '@/fields/projectSlug'
import { displayOrderField, enabledField, mediaRelationship, seoFields } from '@/fields/shared'
import {
  requireMediaForProjectHeroType,
  validateNonNegativeInteger,
  validateProjectHeroVideoURL,
  validateProjectRelationshipList,
  validateSupportedVideoURL,
  validateYear,
} from '@/fields/validation'
import {
  revalidateProjectAfterChange,
  revalidateProjectAfterDelete,
} from '@/hooks/revalidateProjects'
import { validateProjectRelationships } from '@/hooks/validateProjectRelationships'
import { projectPreview } from '@/lib/payload/projectPreview'

const categoryFields: Field[] = [
  {
    name: 'primaryCategory',
    type: 'relationship',
    label: 'Danh mục chính',
    relationTo: 'project-categories',
    required: true,
  },
  {
    name: 'secondaryCategories',
    type: 'relationship',
    label: 'Danh mục phụ',
    relationTo: 'project-categories',
    hasMany: true,
    maxRows: 5,
    maxDepth: 1,
    admin: { description: 'Tối đa 5; không chọn lại danh mục chính.' },
  },
  {
    name: 'services',
    type: 'array',
    label: 'Dịch vụ',
    maxRows: 10,
    admin: { initCollapsed: true },
    fields: [
      internalNameField(),
      {
        name: 'label',
        type: 'text',
        label: 'Tên dịch vụ',
        localized: true,
        required: true,
        maxLength: 140,
      },
    ],
  },
]

const heroFields: Field[] = [
  mediaRelationship('coverImage', 'Ảnh bìa', { required: true }),
  mediaRelationship('posterImage', 'Ảnh poster thẻ dự án'),
  {
    name: 'hoverPreviewVideoURL',
    type: 'text',
    label: 'Video hover trên thẻ dự án',
    maxLength: 500,
    validate: validateSupportedVideoURL,
    admin: {
      description:
        'Dán URL YouTube, Vimeo hoặc tệp .mp4/.webm. Trên desktop video sẽ tự chạy, tắt tiếng và lặp lại khi rê chuột; nên ưu tiên MP4/WebM ngắn, đã tối ưu.',
    },
  },
  {
    name: 'heroMediaType',
    type: 'select',
    label: 'Loại media hero',
    required: true,
    defaultValue: 'image',
    options: [
      { label: 'Hình ảnh', value: 'image' },
      { label: 'Video bên ngoài', value: 'externalVideo' },
    ],
  },
  {
    name: 'heroImage',
    type: 'relationship',
    label: 'Ảnh hero',
    relationTo: 'media',
    validate: requireMediaForProjectHeroType(
      'image',
      'Bắt buộc chọn ảnh hero khi loại media là hình ảnh.',
    ),
    admin: { condition: (_, siblingData) => siblingData?.heroMediaType === 'image' },
  },
  {
    name: 'externalVideoURL',
    type: 'text',
    label: 'URL video bên ngoài',
    maxLength: 500,
    validate: validateProjectHeroVideoURL,
    admin: {
      condition: (_, siblingData) => siblingData?.heroMediaType === 'externalVideo',
      description: 'Chỉ dùng URL YouTube, Vimeo, tệp .mp4 hoặc .webm.',
    },
  },
  {
    name: 'videoPoster',
    type: 'relationship',
    label: 'Ảnh poster video',
    relationTo: 'media',
    validate: requireMediaForProjectHeroType(
      'externalVideo',
      'Bắt buộc chọn poster khi loại media hero là video bên ngoài.',
    ),
    admin: {
      condition: (_, siblingData) => siblingData?.heroMediaType === 'externalVideo',
    },
  },
]

export const Projects: CollectionConfig<'projects'> = {
  slug: 'projects',
  labels: { singular: 'Dự án', plural: 'Dự án' },
  access: {
    create: contentEditors,
    read: publishedOrAuthenticated,
    readVersions: authenticatedOnly,
    update: contentEditors,
    delete: contentEditors,
  },
  admin: {
    components: {
      beforeListTable: [
        {
          path: '@/components/admin/CreateProjectModal',
          exportName: 'CreateProjectModal',
        },
      ],
    },
    group: 'Dự án',
    useAsTitle: 'internalName',
    defaultColumns: [
      'coverImage',
      'title',
      'primaryCategory',
      'clientName',
      'year',
      'featured',
      '_status',
      'updatedAt',
    ],
    preview: projectPreview,
    description: 'Nội dung dự án có cấu trúc và hỗ trợ song ngữ cho website.',
  },
  hooks: {
    beforeValidate: [populateProjectSlug, validateProjectRelationships],
    afterChange: [revalidateProjectAfterChange],
    afterDelete: [revalidateProjectAfterDelete],
  },
  versions: {
    drafts: {
      autosave: { interval: 2000, showSaveDraftButton: true },
      validate: false,
    },
    maxPerDoc: 50,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Thông tin cơ bản',
          fields: [
            internalNameField(),
            {
              name: 'title',
              type: 'text',
              label: 'Tiêu đề',
              localized: true,
              required: true,
              maxLength: 200,
            },
            projectSlugField(),
            {
              name: 'subtitle',
              type: 'text',
              label: 'Tiêu đề phụ',
              localized: true,
              maxLength: 240,
            },
            {
              name: 'shortDescription',
              type: 'textarea',
              label: 'Mô tả ngắn',
              localized: true,
              required: true,
              maxLength: 700,
            },
            {
              name: 'introduction',
              type: 'richText',
              label: 'Giới thiệu',
              localized: true,
            },
            { name: 'clientName', type: 'text', label: 'Khách hàng', maxLength: 160 },
            { name: 'artistName', type: 'text', label: 'Nghệ sĩ', maxLength: 160 },
            {
              name: 'year',
              type: 'number',
              label: 'Năm',
              min: 1900,
              max: 2100,
              validate: validateYear,
            },
            {
              name: 'projectDate',
              type: 'date',
              label: 'Ngày thực hiện',
              admin: { date: { pickerAppearance: 'dayOnly' } },
            },
            {
              name: 'location',
              type: 'text',
              label: 'Địa điểm',
              localized: true,
              maxLength: 240,
            },
          ],
        },
        { label: 'Phân loại', fields: categoryFields },
        { label: 'Media hero và thẻ', fields: heroFields },
        {
          label: 'Thư viện ảnh',
          fields: [
            {
              name: 'gallery',
              type: 'array',
              label: 'Ảnh dự án',
              maxRows: 50,
              admin: { initCollapsed: true },
              fields: [
                ...galleryImageFields(),
                { name: 'credit', type: 'text', label: 'Nguồn/Tác giả', maxLength: 160 },
              ],
            },
          ],
        },
        {
          label: 'Thông tin và thống kê',
          fields: [
            {
              name: 'projectFacts',
              type: 'array',
              label: 'Thông tin dự án',
              maxRows: 20,
              admin: { initCollapsed: true },
              fields: projectFactFields(),
            },
            {
              name: 'statistics',
              type: 'array',
              label: 'Thống kê',
              maxRows: 20,
              admin: { initCollapsed: true },
              fields: projectStatisticFields(),
            },
          ],
        },
        {
          label: 'Nội dung',
          fields: [
            {
              name: 'content',
              type: 'blocks',
              label: 'Các khối nội dung',
              blocks: projectContentBlocks,
              maxRows: 40,
              admin: { initCollapsed: true },
            },
          ],
        },
        {
          label: 'Liên kết',
          fields: [
            {
              name: 'relatedProjects',
              type: 'relationship',
              label: 'Dự án liên quan',
              relationTo: 'projects',
              hasMany: true,
              maxRows: 8,
              maxDepth: 0,
              validate: validateProjectRelationshipList,
              filterOptions: ({ id }) =>
                id
                  ? { id: { not_equals: id } }
                  : true,
              admin: { description: 'Chỉ dùng dữ liệu thẻ; dự án hiện tại đã được loại trừ.' },
            },
          ],
        },
        { label: 'SEO', fields: [{ name: 'seo', type: 'group', label: false, fields: seoFields() }] },
        {
          label: 'Xuất bản',
          fields: [
            {
              name: 'featured',
              type: 'checkbox',
              label: 'Dự án nổi bật',
              defaultValue: false,
            },
            {
              name: 'featuredOrder',
              type: 'number',
              label: 'Thứ tự nổi bật',
              min: 0,
              validate: validateNonNegativeInteger,
            },
            enabledField(true),
            displayOrderField(),
          ],
        },
        {
          label: 'Ghi chú nội bộ',
          fields: [
            {
              name: 'adminNotes',
              type: 'textarea',
              label: 'Ghi chú quản trị',
              maxLength: 4000,
              access: {
                read: authenticatedFieldAccess,
                update: contentEditorFieldAccess,
              },
              admin: { description: 'Chỉ dùng nội bộ; không trả về qua helper public.' },
            },
          ],
        },
      ],
    },
  ],
}
