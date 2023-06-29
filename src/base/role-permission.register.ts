import { errorLog, PrismaQuery, SEED_SUPER_ADMIN_ROLE_KEY } from '@/shared'

const rolePermissionRegister = async () => {
  try {
    const superAdminRole = await PrismaQuery.role.findFirst({
      where: {
        key: SEED_SUPER_ADMIN_ROLE_KEY
      }
    })

    const allPermissions = await PrismaQuery.permission.findMany()

    if (superAdminRole) {
      await Promise.all(
        allPermissions.map(async (permission) => {
          const existingRolePermission = await PrismaQuery.rolePermission.findFirst({
            where: {
              roleId: superAdminRole.id,
              permissionId: permission.id
            }
          })

          if (!existingRolePermission) {
            await PrismaQuery.rolePermission.create({
              data: {
                role: { connect: { id: superAdminRole.id } },
                permission: { connect: { id: permission.id } }
              }
            })
          }
        })
      )
    }
  } catch (error) {
    errorLog(`Error in dbInjector middleware: ${error}`)
  }
}

export default rolePermissionRegister
