import { BuiltInPermission, getAllBuiltInPermissions } from '../permission'
import type { BuiltInRoleItemMeta, BuiltInRolePermission } from './role.type'
import { BuiltInRole } from './role.type'

export const builtInRoleMetaMap = new Map<BuiltInRole, BuiltInRoleItemMeta>([
  [BuiltInRole.Super_Admin, { nameEn: 'Super Admin', nameZh: '超级管理员' }],
  [BuiltInRole.Admin, { nameEn: 'Admin', nameZh: '管理员' }],
  [BuiltInRole.Guest, { nameEn: 'Guest', nameZh: '访客' }]
])

export const getBuiltInRoleItem = (key: BuiltInRole) => ({
  key,
  ...(builtInRoleMetaMap.get(key) as BuiltInRoleItemMeta)
})

export const getAllBuiltInRoles = () => Object.values(BuiltInRole).map((key) => getBuiltInRoleItem(key))

export const builtInRolePermissions: BuiltInRolePermission = {
  [BuiltInRole.Super_Admin]: getAllBuiltInPermissions().map((permission) => permission.key),
  [BuiltInRole.Admin]: [
    BuiltInPermission.ENTER_SYSTEM,
    BuiltInPermission.User_Management,
    BuiltInPermission.Role_Management,
    BuiltInPermission.Permission_Management,
    BuiltInPermission.Menu_Management
  ],
  [BuiltInRole.Guest]: [BuiltInPermission.ENTER_SYSTEM]
}

export default {}
