import type { BuiltInPermissionItem } from '../permission'

export enum BuiltInRole {
  SuperAdmin = 'SUPER:ADMIN',
  Admin = 'ADMIN',
  Guest = 'GUEST'
}

export interface BuiltInRoleItemMeta {
  nameEn: string
  nameZh: string
}

export interface BuiltInRoleItem extends BuiltInRoleItemMeta {
  key: BuiltInRole
}

export interface BuiltInRolePermission {
  role: BuiltInRoleItem
  permissions: BuiltInPermissionItem[]
}
