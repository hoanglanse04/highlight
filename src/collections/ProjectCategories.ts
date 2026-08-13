import type { CollectionConfig } from 'payload'

import {
  authenticatedFieldAccess,
  authenticatedOnly,
  contentEditorFieldAccess,
  contentEditors,
  publishedOrAuthenticated,
} from '@/access/users'
import { internalNameField, populateProjectSlug, projectSlugField } from '@/fields/projectSlug'
import { displayOrderField, enabledField, mediaRelationship, seoFields } from '@/fields/shared'
import { validateSupportedVideoURL } from '@/fields/validation'
import {
  revalidateCategoryAfterChange,
  revalidateCategoryAfterDelete,
} from '@/hooks/revalidateProjects'
import { projectCategoryPreview } from '@/lib/payload/projectPreview'

export const ProjectCategories: CollectionConfig<'project-categories'> = {
  slug: 'project-categories',
  labels: { singular: 'Danh mục dự án', plural: 'Danh mục dự án' },
  access: {
    create: contentEditors,
    read: publishedOrAuthenticated,
    readVersions: authenticatedOnly,
    update: contentEditors,
    delete: contentEditors,
  },
  admin: {
    group: 'Dự án',
    useAsTitle: 'internalName',
    defaultColumns: ['title', 'slug', 'displayOrder', 'enabled', 'updatedAt'],
    preview: projectCategoryPreview,
    description:
      'Hệ thống phân loại dự án song ngữ. Trạng thái xuất bản dùng chung cho vi và en.',
  },
  hooks: {
    beforeValidate: [populateProjectSlug],
    afterChange: [revalidateCategoryAfterChange],
    afterDelete: [revalidateCategoryAfterDelete],
  },
  versions: {
    drafts: {
      autosave: { interval: 2000, showSaveDraftButton: true },
      validate: false,
    },
    maxPerDoc: 30,
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
              maxLength: 180,
            },
            projectSlugField(),
            {
              name: 'shortDescription',
              type: 'textarea',
              label: 'Mô tả ngắn',
              localized: true,
              maxLength: 700,
            },
            {
              name: 'fullDescription',
              type: 'richText',
              label: 'Mô tả đầy đủ',
              localized: true,
            },
            {
              name: 'iconKey',
              type: 'select',
              label: 'Biểu tượng',
              options: [
                { label: 'Sự kiện', value: 'event' },
                { label: 'Doanh nghiệp', value: 'corporate' },
                { label: 'Thể thao', value: 'sports' },
                { label: 'Mạng xã hội', value: 'social' },
                { label: 'Nghệ sĩ', value: 'artist' },
                { label: 'Ô tô', value: 'automotive' },
                { label: 'Du lịch', value: 'travel' },
                { label: 'Làm đẹp', value: 'beauty' },
                { label: 'Hậu trường', value: 'behind-the-scenes' },
              ],
            },
          ],
        },
        {
          label: 'Hình ảnh',
          fields: [
            mediaRelationship('coverImage', 'Ảnh bìa', { required: true }),
            mediaRelationship('heroImage', 'Ảnh hero'),
            {
              name: 'heroVideoURL',
              type: 'text',
              label: 'URL video hero',
              maxLength: 500,
              validate: validateSupportedVideoURL,
              admin: {
                description: 'URL YouTube, Vimeo, tệp .mp4 hoặc .webm; không bắt buộc.',
              },
            },
          ],
        },
        {
          label: 'SEO',
          fields: [{ name: 'seo', type: 'group', fields: seoFields() }],
        },
        {
          label: 'Xuất bản',
          fields: [
            enabledField(true),
            {
              name: 'featured',
              type: 'checkbox',
              label: 'Danh mục nổi bật',
              defaultValue: false,
            },
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
