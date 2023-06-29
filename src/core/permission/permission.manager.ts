import type { BuiltInPermissionItemMeta } from './permission.type'
import { BuiltInPermission } from './permission.type'

export const builtInPermissionMetaMap = new Map<BuiltInPermission, BuiltInPermissionItemMeta>([
  [BuiltInPermission.ENTER_SYSTEM, { nameEn: 'Login', nameZh: '登录' }],
  [BuiltInPermission.User_Management, { nameEn: 'User Management', nameZh: '用户管理' }],
  [BuiltInPermission.Role_Management, { nameEn: 'Role Management', nameZh: '角色管理' }],
  [BuiltInPermission.Permission_Management, { nameEn: 'Permission Management', nameZh: '权限管理' }],
  [BuiltInPermission.Menu_Management, { nameEn: 'Menu Management', nameZh: '菜单管理' }]
])

export const getBuiltInPermissionItem = (key: BuiltInPermission) => ({
  key,
  ...(builtInPermissionMetaMap.get(key) as BuiltInPermissionItemMeta)
})

export const getAllBuiltInPermissions = () =>
  Object.values(BuiltInPermission).map((key) => getBuiltInPermissionItem(key))

export const builtInPermissions = Object.values(BuiltInPermission).map((key) => getBuiltInPermissionItem(key))

export default {}
