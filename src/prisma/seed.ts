import { randAvatar } from '@ngneat/falso'
import { hash } from '@node-rs/bcrypt'
import type { Prisma, Role, User } from '@prisma/client'
import { PrismaClient } from '@prisma/client'

import {
  errorLog,
  getCurrentTime,
  primaryLog,
  SEED_ENTER_SYSTEM_PERMISSION_KEY,
  SEED_ENTER_SYSTEM_PERMISSION_NAME_EN,
  SEED_ENTER_SYSTEM_PERMISSION_NAME_ZH,
  SEED_SUPER_ADMIN_PASSWORD,
  SEED_SUPER_ADMIN_ROLE_KEY,
  SEED_SUPER_ADMIN_ROLE_NAME_EN,
  SEED_SUPER_ADMIN_ROLE_NAME_ZH,
  SEED_SUPER_ADMIN_USERNAME
} from '@/shared'

const prisma = new PrismaClient()

const getCurrentDate = () => new Date().toISOString()

const seed = async () => {
  const defaultUser: Prisma.UserCreateInput = {
    username: SEED_SUPER_ADMIN_USERNAME,
    password: await hash(SEED_SUPER_ADMIN_PASSWORD, 10),
    avatarUrl: randAvatar(),
    verified: true,
    enabled: true,
    createdAt: getCurrentDate()
  }

  const existingSuperAdminUser = await prisma.user.findUnique({
    where: { username: SEED_SUPER_ADMIN_USERNAME }
  })

  let superAdminUser: User
  let superAdminRole: Role

  if (!existingSuperAdminUser) {
    superAdminUser = await prisma.user.create({
      data: {
        ...defaultUser
      }
    })
    primaryLog(`[prisma - ${getCurrentTime('HH:mm:ss')}] 🚀 Created the default user: ${SEED_SUPER_ADMIN_USERNAME}.`)
  } else {
    superAdminUser = existingSuperAdminUser
    primaryLog(
      `[prisma - ${getCurrentTime('HH:mm:ss')}] 🚀 The default user: ${SEED_SUPER_ADMIN_USERNAME} already exists!`
    )
  }

  const existingEnterSystemPermission = await prisma.permission.findFirst({
    where: { key: SEED_ENTER_SYSTEM_PERMISSION_KEY }
  })

  if (!existingEnterSystemPermission) {
    await prisma.permission.create({
      data: {
        key: SEED_ENTER_SYSTEM_PERMISSION_KEY,
        nameEn: SEED_ENTER_SYSTEM_PERMISSION_NAME_EN,
        nameZh: SEED_ENTER_SYSTEM_PERMISSION_NAME_ZH,
        isBuiltIn: true,
        enabled: true,
        createdAt: getCurrentDate(),
        createdBy: superAdminUser.id
      }
    })
    primaryLog(
      `[prisma - ${getCurrentTime('HH:mm:ss')}] 🚀 Created the default permission: ${SEED_ENTER_SYSTEM_PERMISSION_KEY}.`
    )
  } else {
    primaryLog(
      `[prisma - ${getCurrentTime(
        'HH:mm:ss'
      )}] 🚀 The default permission: ${SEED_ENTER_SYSTEM_PERMISSION_KEY} already exists!`
    )
  }

  const allPermissions = await prisma.permission.findMany()

  const existingSuperAdminRole = await prisma.role.findUnique({
    where: { key: SEED_SUPER_ADMIN_ROLE_KEY }
  })

  if (!existingSuperAdminRole) {
    superAdminRole = await prisma.role.create({
      data: {
        key: SEED_SUPER_ADMIN_ROLE_KEY,
        nameEn: SEED_SUPER_ADMIN_ROLE_NAME_EN,
        nameZh: SEED_SUPER_ADMIN_ROLE_NAME_ZH,
        isBuiltIn: true,
        enabled: true,
        createdAt: getCurrentDate(),
        createdBy: superAdminUser.id
      }
    })
    primaryLog(`[prisma - ${getCurrentTime('HH:mm:ss')}] 🚀 Created the default role: ${SEED_SUPER_ADMIN_ROLE_KEY}.`)
  } else {
    superAdminRole = existingSuperAdminRole
    primaryLog(
      `[prisma - ${getCurrentTime('HH:mm:ss')}] 🚀 The default role: ${SEED_SUPER_ADMIN_ROLE_KEY} already exists!`
    )
  }

  const existingSuperAdminUserRole = await prisma.userRole.findFirst({
    where: {
      userId: superAdminUser.id,
      roleId: superAdminRole.id
    }
  })

  if (!existingSuperAdminUserRole) {
    await prisma.userRole.create({
      data: {
        user: { connect: { id: superAdminUser.id } },
        role: { connect: { id: superAdminRole.id } },
        createdAt: getCurrentDate(),
        createdBy: superAdminUser.id
      }
    })
    primaryLog(
      `[prisma - ${getCurrentTime(
        'HH:mm:ss'
      )}] 🚀 Created the missing [User]-[Role] association for user: ${SEED_SUPER_ADMIN_USERNAME} and role: ${SEED_SUPER_ADMIN_ROLE_KEY}`
    )
  } else {
    primaryLog(
      `[prisma - ${getCurrentTime(
        'HH:mm:ss'
      )}] 🚀 The [User]-[Role] association for user: ${SEED_SUPER_ADMIN_USERNAME} and role: ${SEED_SUPER_ADMIN_ROLE_KEY} already exists!`
    )
  }

  try {
    await Promise.all(
      allPermissions.map(async (permissionToConnect) => {
        const existingRolePermission = await prisma.rolePermission.findFirst({
          where: {
            roleId: superAdminRole.id,
            permissionId: permissionToConnect.id
          }
        })

        if (!existingRolePermission) {
          await prisma.rolePermission.create({
            data: {
              role: { connect: { id: superAdminRole.id } },
              permission: { connect: { id: permissionToConnect.id } },
              createdAt: getCurrentDate(),
              createdBy: superAdminUser.id
            }
          })

          primaryLog(
            `[prisma - ${getCurrentTime(
              'HH:mm:ss'
            )}] 🚀 Created the missing [Role]-[Permission] association for role: ${
              superAdminRole.key
            } and permission: ${permissionToConnect.key}.`
          )
        } else {
          primaryLog(
            `[prisma - ${getCurrentTime('HH:mm:ss')}] 🚀 The [Role]-[Permission] association for role: ${
              superAdminRole.key
            } and permission: ${permissionToConnect.key} already exists!`
          )
        }
      })
    )
  } catch (error) {
    errorLog(`Error creating [Role]-[Permission] associations!`)
    errorLog(error as string)
  }
}

seed()
  .then(async () => primaryLog(`[prisma - ${getCurrentTime('HH:mm:ss')}] 🍀 Seed your db successfully!`))
  .catch(async (e) => {
    errorLog(`[prisma - ${getCurrentTime('HH:mm:ss')}] 🐞 Error occurred when seed your db!`)
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
