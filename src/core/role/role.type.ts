import type { BuiltInPermission } from '../permission'

export enum BuiltInRole {
  Super_Admin = 'SUPER_ADMIN',
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

export type BuiltInRolePermission = Record<BuiltInRole, BuiltInPermission[]>
