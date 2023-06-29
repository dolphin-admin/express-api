import { PrismaClient } from '@prisma/client'

import { GlobalConfig } from './config'

interface CustomNodeJSGlobal extends Global {
  PrismaQuery: PrismaClient
}

declare const global: CustomNodeJSGlobal

export const PrismaQuery: PrismaClient =
  global.PrismaQuery ||
  new PrismaClient({
    log: GlobalConfig.IS_DEVELOPMENT ? ['query', 'info', 'warn', 'error'] : ['query', 'info', 'warn', 'error'],
    errorFormat: 'pretty'
  })

// Logging Middleware
PrismaQuery.$use(async (params, next) => {
  if (params.action === 'update' || params.action === 'updateMany') {
    // eslint-disable-next-line no-param-reassign
    params.args.data.updatedAt = new Date().toISOString()
  }
  const before = Date.now()
  const result = await next(params)
  const after = Date.now()
  console.log(`Query ${params.model}.${params.action} took ${after - before}ms`)
  return result
})

if (GlobalConfig.IS_DEVELOPMENT) {
  global.PrismaQuery = PrismaQuery
}

export class PrismaAction {
  static deleted = () => ({
    deletedAt: {
      not: null
    }
  })

  static notDeleted = () => ({
    deletedAt: {
      equals: null
    }
  })
}

export const SEED_SUPER_ADMIN_USERNAME = 'SuperAdmin'
export const SEED_SUPER_ADMIN_PASSWORD = '123456'

export const SEED_SUPER_ADMIN_ROLE_KEY = 'SUPER_ADMIN'
export const SEED_SUPER_ADMIN_ROLE_NAME_EN = 'Super Admin'
export const SEED_SUPER_ADMIN_ROLE_NAME_ZH = '超级管理员'

export const SEED_ENTER_SYSTEM_PERMISSION_KEY = 'ENTER_SYSTEM'
export const SEED_ENTER_SYSTEM_PERMISSION_NAME_EN = 'Enter System'
export const SEED_ENTER_SYSTEM_PERMISSION_NAME_ZH = '进入系统'
