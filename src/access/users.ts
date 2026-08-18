import type { Access, FieldAccess, PayloadRequest } from 'payload'

export const userRoles = ['super-admin', 'editor', 'viewer'] as const

export type UserRole = (typeof userRoles)[number]

type UserIdentity = NonNullable<PayloadRequest['user']>

function hasRole(user: PayloadRequest['user']): user is UserIdentity & { role: UserRole } {
  return Boolean(
    user &&
      'role' in user &&
      typeof user.role === 'string' &&
      userRoles.includes(user.role as UserRole),
  )
}

export const isSuperAdmin = (user: PayloadRequest['user']): boolean =>
  hasRole(user) && user.role === 'super-admin'

export const isViewer = (user: PayloadRequest['user']): boolean =>
  hasRole(user) && user.role === 'viewer'

export const isAuthenticated = (user: PayloadRequest['user']): boolean => Boolean(user)

export const canManageContent = (user: PayloadRequest['user']): boolean =>
  hasRole(user) && (user.role === 'super-admin' || user.role === 'editor')

// A query constraint remains public while making Payload verify the backing document
// before serving files from an upload collection.
export const publicRead: Access = () => ({
  id: {
    exists: true,
  },
})

export const contentEditors: Access = ({ req }) => canManageContent(req.user)

export const authenticatedOnly: Access = ({ req }) => isAuthenticated(req.user)

export const publishedOrAuthenticated: Access = ({ req }) =>
  isAuthenticated(req.user)
    ? true
    : {
        _status: {
          equals: 'published',
        },
      }

export const authenticatedFieldAccess: FieldAccess = ({ req }) =>
  isAuthenticated(req.user)

export const contentEditorFieldAccess: FieldAccess = ({ req }) =>
  canManageContent(req.user)

export const createUsers: Access = ({ req }) => isSuperAdmin(req.user)

export const readUsers: Access = ({ req }) => {
  return isAuthenticated(req.user)
}

export const updateUsers: Access = ({ req }) => {
  if (!req.user) {
    return false
  }

  if (isSuperAdmin(req.user)) {
    return true
  }

  return {
    id: {
      equals: req.user.id,
    },
  }
}

export const superAdminsOnly: Access = ({ req }) => isSuperAdmin(req.user)

export const superAdminFieldAccess: FieldAccess = ({ req }) => isSuperAdmin(req.user)

export const denyAccess: Access = () => false

export const denyFieldAccess: FieldAccess = () => false
