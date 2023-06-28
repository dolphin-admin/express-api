import { BuiltInPermission, getBuiltInPermissionItem, getBuiltInPermissionItems } from '../permission'
import type { BuiltInRoleItemMeta, BuiltInRolePermission } from './role.type'
import { BuiltInRole } from './role.type'

export const builtInRoleMetaMap = new Map<BuiltInRole, BuiltInRoleItemMeta>([
  [BuiltInRole.SuperAdmin, { nameEn: 'Super Admin', nameZh: '超级管理员' }],
  [BuiltInRole.Admin, { nameEn: 'Admin', nameZh: '管理员' }],
  [BuiltInRole.Guest, { nameEn: 'Guest', nameZh: '访客' }]
])

export const getBuiltInRoleItem = (key: BuiltInRole) => ({
  key,
  ...(builtInRoleMetaMap.get(key) as BuiltInRoleItemMeta)
})

const getAllPermissionItems = () => Object.values(BuiltInPermission).map((key) => getBuiltInPermissionItem(key))

export const builtInRolePermissions: BuiltInRolePermission[] = [
  {
    role: getBuiltInRoleItem(BuiltInRole.SuperAdmin),
    permissions: getAllPermissionItems()
  },
  {
    role: getBuiltInRoleItem(BuiltInRole.Admin),
    permissions: getBuiltInPermissionItems([
      BuiltInPermission.Login,
      BuiltInPermission.UserManagement,
      BuiltInPermission.RoleManagement,
      BuiltInPermission.PermissionManagement,
      BuiltInPermission.MenuManagement
    ])
  },
  {
    role: getBuiltInRoleItem(BuiltInRole.Guest),
    permissions: getBuiltInPermissionItems([BuiltInPermission.Login])
  }
]

export default {}
