import type { CollectionBeforeChangeHook, CollectionConfig } from 'payload'

import {
  createUsers,
  readUsers,
  superAdminFieldAccess,
  superAdminsOnly,
  updateUsers,
  userRoles,
} from '@/access/users'

const makeFirstUserSuperAdmin: CollectionBeforeChangeHook = async ({
  data,
  operation,
  req,
}) => {
  if (operation !== 'create') {
    return data
  }

  const { totalDocs } = await req.payload.count({
    collection: 'users',
    overrideAccess: true,
  })

  return totalDocs === 0 ? { ...data, role: 'super-admin' } : data
}

export const Users: CollectionConfig = {
  slug: 'users',
  labels: {
    singular: 'User',
    plural: 'Users',
  },
  admin: {
    defaultColumns: ['email', 'name', 'role', 'updatedAt'],
    group: 'System',
    useAsTitle: 'email',
  },
  auth: {
    maxLoginAttempts: 5,
    lockTime: 10 * 60 * 1000,
    tokenExpiration: 2 * 60 * 60,
  },
  access: {
    create: createUsers,
    read: readUsers,
    update: updateUsers,
    delete: superAdminsOnly,
  },
  hooks: {
    beforeChange: [makeFirstUserSuperAdmin],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'editor',
      options: userRoles.map((role) => ({
        label: role
          .split('-')
          .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
          .join(' '),
        value: role,
      })),
      access: {
        create: superAdminFieldAccess,
        update: superAdminFieldAccess,
      },
      saveToJWT: true,
    },
  ],
  timestamps: true,
  versions: false,
}
