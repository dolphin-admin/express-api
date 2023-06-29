export enum BuiltInPermission {
  ENTER_SYSTEM = 'ENTER_SYSTEM',
  User_Management = 'USER_MANAGEMENT',
  Role_Management = 'ROLE_MANAGEMENT',
  Permission_Management = 'PERMISSION_MANAGEMENT',
  Menu_Management = 'MENU_MANAGEMENT'
}

export interface BuiltInPermissionItemMeta {
  nameEn: string
  nameZh: string
}

export interface BuiltInPermissionItem extends BuiltInPermissionItemMeta {
  key: BuiltInPermission
}
