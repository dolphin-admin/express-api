import type { BuiltInPermission, BuiltInRole } from '@/core'
import { builtInRolePermissions, getAllBuiltInPermissions, getAllBuiltInRoles } from '@/core'
import {
  errorLog,
  getCurrentTime,
  primaryLog,
  PrismaQuery,
  SEED_SUPER_ADMIN_ROLE_KEY,
  SEED_SUPER_ADMIN_USERNAME
} from '@/shared'

const rolePermissionRegister = async () => {
  try {
    const superAdminUser = await PrismaQuery.user.findUnique({
      where: {
        username: SEED_SUPER_ADMIN_USERNAME
      }
    })

    const superAdminRole = await PrismaQuery.role.findUnique({
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
            primaryLog(
              `[prisma - ${getCurrentTime(
                'HH:mm:ss'
              )}] 🚀 Created the missing [Role]-[Permission] association for role: ${
                superAdminRole.key
              } and permission: ${permission.key}.`
            )
          }
        })
      )
    }

    const builtInRoleItems = getAllBuiltInRoles()

    await Promise.all(
      builtInRoleItems.map(async (builtInRoleItem) => {
        const existingRole = await PrismaQuery.role.findUnique({
          where: {
            key: builtInRoleItem.key
          }
        })

        if (!existingRole) {
          await PrismaQuery.role.create({
            data: {
              key: builtInRoleItem.key,
              nameEn: builtInRoleItem.nameEn,
              nameZh: builtInRoleItem.nameZh,
              isBuiltIn: true,
              enabled: true,
              createdBy: superAdminUser!.id
            }
          })
        }
      })
    )

    const builtInPermissionItems = getAllBuiltInPermissions()

    await Promise.all(
      builtInPermissionItems.map(async (builtInPermissionItem) => {
        const existingPermission = await PrismaQuery.permission.findUnique({
          where: {
            key: builtInPermissionItem.key
          }
        })

        if (!existingPermission) {
          await PrismaQuery.permission.create({
            data: {
              key: builtInPermissionItem.key,
              nameEn: builtInPermissionItem.nameEn,
              nameZh: builtInPermissionItem.nameZh,
              isBuiltIn: true,
              enabled: true,
              createdBy: superAdminUser!.id
            }
          })
        }
      })
    )

    const builtInRoleKeys = Object.keys(builtInRolePermissions) as BuiltInRole[]

    await Promise.all(
      builtInRoleKeys.map(async (builtInRoleKey) => {
        const builtInPermissions = builtInRolePermissions[builtInRoleKey] as BuiltInPermission[]

        const currentRole = await PrismaQuery.role.findUnique({
          where: {
            key: builtInRoleKey
          }
        })

        await Promise.all(
          builtInPermissions.map(async (builtInPermissionKey) => {
            const currentPermission = await PrismaQuery.permission.findUnique({
              where: {
                key: builtInPermissionKey
              }
            })

            const existingRolePermission = await PrismaQuery.rolePermission.findFirst({
              where: {
                roleId: currentRole!.id,
                permissionId: currentPermission!.id
              }
            })

            if (!existingRolePermission) {
              await PrismaQuery.rolePermission.create({
                data: {
                  role: { connect: { id: currentRole!.id } },
                  permission: { connect: { id: currentPermission!.id } },
                  createdBy: superAdminUser!.id
                }
              })
              primaryLog(
                `[prisma - ${getCurrentTime(
                  'HH:mm:ss'
                )}] 🚀 Created the missing [Role]-[Permission] association for role: ${builtInRoleKey} and permission: ${builtInPermissionKey}.`
              )
            }
          })
        )
      })
    )
  } catch (error) {
    errorLog(`Error in dbInjector: ${error}`)
  }
}

export default rolePermissionRegister
