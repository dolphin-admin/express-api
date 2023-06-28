export enum BuiltInPermission {
  Login = 'SYSTEM:LOGIN',
  UserManagement = 'USER:MANAGEMENT',
  RoleManagement = 'ROLE:MANAGEMENT',
  PermissionManagement = 'PERMISSION:MANAGEMENT',
  MenuManagement = 'MENU:MANAGEMENT'
}

export interface BuiltInPermissionItemMeta {
  nameEn: string
  nameZh: string
}

export interface BuiltInPermissionItem extends BuiltInPermissionItemMeta {
  key: BuiltInPermission
}
