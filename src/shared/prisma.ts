import { PrismaClient } from '@prisma/client'
import util from 'util'

import { GlobalConfig, GlobalDBConfig, GlobalDevConfig } from './config'

interface CustomNodeJSGlobal extends Global {
  pgClient: PrismaClient
  mongoClient: PrismaClient
}

declare const global: CustomNodeJSGlobal

console.log(GlobalDBConfig.PG_DB_URL)

export const prisma: PrismaClient =
  global.pgClient ||
  new PrismaClient({
    datasources: {
      db: {
        url: GlobalDBConfig.PG_DB_URL
      }
    },
    // eslint-disable-next-line no-nested-ternary
    log: GlobalConfig.IS_DEVELOPMENT
      ? GlobalDevConfig.DEV_SHOW_LOG
        ? ['warn', 'error']
        : []
      : ['query', 'info', 'warn', 'error'],
    errorFormat: 'pretty'
  })
    // 日志
    .$extends({
      query: {
        async $allOperations({ operation, model, args, query }) {
          const start = performance.now()
          const result = await query(args)
          const end = performance.now()
          const time = end - start
          if (GlobalDevConfig.DEV_SHOW_LOG) {
            console.log(
              util.inspect(
                {
                  model,
                  operation,
                  args,
                  time
                },
                {
                  showHidden: false,
                  depth: null,
                  colors: true
                }
              )
            )
            console.log(result)
          }
          return result
        },
        $allModels: {
          // 过滤软删除
          async findFirst({ args, query }) {
            args.where = { deletedAt: null, ...args.where }
            return query(args)
          },
          async findMany({ args, query }) {
            args.where = { deletedAt: null, ...args.where }
            return query(args)
          },
          async findFirstOrThrow({ args, query }) {
            args.where = { deletedAt: null, ...args.where }
            return query(args)
          },
          async findUnique({ args, query }) {
            args.where = { deletedAt: null, ...args.where }
            return query(args)
          },
          async findUniqueOrThrow({ args, query }) {
            args.where = { deletedAt: null, ...args.where }
            return query(args)
          },
          async count({ args, query }) {
            args.where = { deletedAt: null, ...args.where }
            return query(args)
          },
          // 自动更新修改时间
          async update({ args, query }) {
            args.data.updatedAt = new Date().toISOString()
            return query(args)
          },
          async updateMany({ args, query }) {
            args.data.updatedAt = new Date().toISOString()
            return query(args)
          }
        }
      }
    })

if (GlobalConfig.IS_DEVELOPMENT) {
  global.pgClient = prisma
}

export const SEED_SUPER_ADMIN_USERNAME = 'SuperAdmin'
export const SEED_SUPER_ADMIN_PASSWORD = '123456'

export const SEED_SUPER_ADMIN_ROLE_KEY = 'SUPER_ADMIN'
export const SEED_SUPER_ADMIN_ROLE_NAME_EN = 'Super Admin'
export const SEED_SUPER_ADMIN_ROLE_NAME_ZH = '超级管理员'

export const SEED_ENTER_SYSTEM_PERMISSION_KEY = 'ENTER_SYSTEM'
export const SEED_ENTER_SYSTEM_PERMISSION_NAME_EN = 'Enter System'
export const SEED_ENTER_SYSTEM_PERMISSION_NAME_ZH = '进入系统'
