import type { BuiltInPermissionItemMeta } from './permission.type'
import { BuiltInPermission } from './permission.type'

export const builtInPermissionMetaMap = new Map<BuiltInPermission, BuiltInPermissionItemMeta>([
  [BuiltInPermission.Login, { nameEn: 'Login', nameZh: '登录' }],
  [BuiltInPermission.UserManagement, { nameEn: 'User Management', nameZh: '用户管理' }],
  [BuiltInPermission.RoleManagement, { nameEn: 'Role Management', nameZh: '角色管理' }],
  [BuiltInPermission.PermissionManagement, { nameEn: 'Permission Management', nameZh: '权限管理' }],
  [BuiltInPermission.MenuManagement, { nameEn: 'Menu Management', nameZh: '菜单管理' }]
])

export const getBuiltInPermissionItem = (key: BuiltInPermission) => ({
  key,
  ...(builtInPermissionMetaMap.get(key) as BuiltInPermissionItemMeta)
})

export const getBuiltInPermissionItems = (keys: BuiltInPermission[]) => keys.map((key) => getBuiltInPermissionItem(key))

export default {}
