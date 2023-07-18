import type { NextFunction, Request, Response } from 'express'

import { validateToken } from '@/middlewares'

type IMiddleware = (req: Request, res: Response, next: NextFunction) => void

/**
 * 中间件装饰器
 * @param middlewares 中间件
 */
export function Middleware(...middlewares: IMiddleware[]) {
  return function (target: any, propertyKey?: string) {
    if (propertyKey) {
      // 方法装饰器
      if (!Array.isArray(target.routes)) {
        target.routes = []
      }
      const currentRoute = target.routes.find((route: any) => route.handler === target[propertyKey])
      if (currentRoute) {
        currentRoute.middlewares = middlewares
      }
    } else {
      // 类装饰器
      target.prototype.classMiddlewares = middlewares
    }
  }
}

/**
 * 认证装饰器
 */
export function Auth() {
  return Middleware(validateToken)
}
