import controllerRegister from './register/controller'
import fileStorageRegister from './register/file-storage'
import rolePermissionRegister from './register/role-permission'
import socketRegister from './register/socket'

export const AppRegister = {
  fileStorageRegister,
  rolePermissionRegister,
  controllerRegister,
  socketRegister
}
