import { PrismaClient as MongoPrismaClient } from '@prisma/mongo'
import { PrismaClient as PGPrismaClient } from '@prisma/pg'
import util from 'util'

import { GlobalConfig, GlobalDBConfig, GlobalDevConfig } from '@/shared'

interface CustomNodeJSGlobal extends Global {
  pgClient: PGPrismaClient
  mongoClient: MongoPrismaClient
}

declare const global: CustomNodeJSGlobal

// PostgreSQL Client
export const pgClient: PGPrismaClient =
  global.pgClient ||
  new PGPrismaClient({
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

// MongoDB Client NOTE: 暂时不启用 MongoDB
export const mongoClient: MongoPrismaClient =
  global.mongoClient ||
  new MongoPrismaClient({
    datasources: {
      db: {
        url: GlobalDBConfig.MONGO_DB_URL
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

if (GlobalConfig.IS_DEVELOPMENT) {
  global.pgClient = pgClient
  global.mongoClient = mongoClient
}

// Prisma Seed 使用到的常量
export const SEED_SUPER_ADMIN_USERNAME = 'SuperAdmin'
export const SEED_SUPER_ADMIN_PASSWORD = '123456'

export const SEED_SUPER_ADMIN_ROLE_KEY = 'SUPER_ADMIN'
export const SEED_SUPER_ADMIN_ROLE_NAME_EN = 'Super Admin'
export const SEED_SUPER_ADMIN_ROLE_NAME_ZH = '超级管理员'

export const SEED_ENTER_SYSTEM_PERMISSION_KEY = 'ENTER_SYSTEM'
export const SEED_ENTER_SYSTEM_PERMISSION_NAME_EN = 'Enter System'
export const SEED_ENTER_SYSTEM_PERMISSION_NAME_ZH = '进入系统'
