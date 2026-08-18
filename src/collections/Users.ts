import type { CollectionConfig } from 'payload'

import {
  denyAccess,
  denyFieldAccess,
  readUsers,
  superAdminsOnly,
  updateUsers,
} from '@/access/users'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: {
    singular: 'Tài khoản',
    plural: 'Tài khoản hệ thống',
  },
  admin: {
    components: {
      beforeListTable: [
        {
          path: '@/components/admin/CreateUserModal',
          exportName: 'CreateUserModal',
        },
      ],
    },
    defaultColumns: ['name', 'email', 'role', 'updatedAt'],
    group: 'Hệ thống',
    hidden: false,
    useAsTitle: 'name',
  },
  auth: {
    maxLoginAttempts: 5,
    lockTime: 10 * 60 * 1000,
    tokenExpiration: 2 * 60 * 60,
  },
  access: {
    create: superAdminsOnly,
    read: readUsers,
    update: updateUsers,
    delete: denyAccess,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Họ và tên',
      required: true,
      admin: {
        components: {
          Cell: {
            path: '@/components/admin/UserNameCell',
            exportName: 'UserNameCell',
          },
        },
      },
    },
    {
      name: 'role',
      type: 'select',
      label: 'Vai trò',
      required: true,
      defaultValue: 'editor',
      options: [
        { label: 'Quản trị viên cấp cao', value: 'super-admin' },
        { label: 'Biên tập viên', value: 'editor' },
        { label: 'Người xem', value: 'viewer' },
      ],
      access: {
        create: denyFieldAccess,
        update: denyFieldAccess,
      },
      admin: {
        description: 'Vai trò cố định của tài khoản quản trị duy nhất.',
        readOnly: true,
      },
      saveToJWT: true,
    },
  ],
  timestamps: true,
  versions: false,
}
