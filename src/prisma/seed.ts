import { randAvatar } from '@ngneat/falso'
import { hash } from '@node-rs/bcrypt'
import type { Prisma } from '@prisma/client'
import { PrismaClient } from '@prisma/client'

import { BuiltInRole, builtInRolePermissions } from '@/core'
import { batchPrimaryLog, errorLog, getCurrentTime } from '@/shared'

const prisma = new PrismaClient()

const CURRENT_DATE = new Date().toISOString()
const SEED_USERNAME = 'Admin'
const SEED_PASSWORD = '123456'

const seed = async () => {
  const defaultUser: Prisma.UserCreateInput = {
    username: SEED_USERNAME,
    password: await hash(SEED_PASSWORD, 10),
    avatarUrl: randAvatar(),
    verified: true,
    enabled: true,
    createdAt: CURRENT_DATE
  }

  // const role = await prisma.role.create({
  //   data: {
  //     name: 'Moderator',
  //     permissions: {
  //       // 将 Moderators 角色分配给两个现有权限："CreatePost" 和 "EditPost"。
  //       connectOrCreate: [
  //         { where: { name: 'CreatePost' }, create: { name: 'CreatePost' } },
  //         { where: { name: 'EditPost' }, create: { name: 'EditPost' } }
  //       ]
  //     }
  //   }
  // })

  builtInRolePermissions.reduce(async (prevPromise, rolePermission) => {
    await prevPromise
    const { role, permissions } = rolePermission

    await prisma.role.create({
      data: {
        key: role.key,
        permissions: {
          connectOrCreate: permissions.map((permission) => ({
            where: { name: permission },
            create: { name: permission }
          }))
        }
      }
    })
  }, Promise.resolve())

  const user = await prisma.user.create({
    data: {
      ...defaultUser,
      userRoles: {
        connectOrCreate: [
          {
            where: {
              key: BuiltInRole.SuperAdmin
            },
            create: {
              key: BuiltInRole.SuperAdmin
            }
          }
        ]
      }
    }
  })
}

seed()
  .then(async () => {
    batchPrimaryLog([
      `[prisma - ${getCurrentTime('HH:mm:ss')}] 🍀 Seed your db successfully!`,
      `[prisma - ${getCurrentTime('HH:mm:ss')}] 🔒 Created the default user: ${SEED_USERNAME}`
    ])
  })
  .catch(async (e) => {
    errorLog(`[prisma - ${getCurrentTime('HH:mm:ss')}] 🐞 Error occurred when seed your db!`)
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
