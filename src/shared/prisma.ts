import { PrismaClient } from '@prisma/client'

interface CustomNodeJSGlobal extends Global {
  PrismaQuery: PrismaClient
}

declare const global: CustomNodeJSGlobal

export const PrismaQuery: PrismaClient =
  global.PrismaQuery ||
  new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
    errorFormat: 'pretty'
  })

// Logging Middleware
PrismaQuery.$use(async (params, next) => {
  const before = Date.now()
  const result = await next(params)
  const after = Date.now()
  console.log(`Query ${params.model}.${params.action} took ${after - before}ms`)
  return result
})

if (process.env.NODE_ENV === 'development') {
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
