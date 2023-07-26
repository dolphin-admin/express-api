import type { NextFunction, Request, Response } from 'express'

import { validateToken } from '@/middlewares'
import { baseUpload } from '@/utils'

type IMiddleware = (req: Request, res: Response, next: NextFunction) => void

/**
 * Controller 装饰器
 */
export function Controller(path: string): ClassDecorator {
  return function (target: any) {
    target.prototype.path = path
  }
}

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

/**
 * 上传文件装饰器
 */
export function UploadFile() {
  return Middleware(baseUpload.single('file'))
}

/**
 * 批量上传文件装饰器
 */
export function UploadFiles() {
  return Middleware(baseUpload.array('files'))
}

/**
 * 路由装饰器
 * @param method 请求方法
 * @param path 请求路径
 */
function Route(method: string, path: string) {
  return function (target: any, propertyKey: string) {
    if (!Array.isArray(target.routes)) {
      target.routes = []
    }
    target.routes.push({
      path,
      method,
      handler: target[propertyKey],
      middlewares: []
    })
  }
}

/**
 * GET 装饰器
 * @param path 请求路径
 */
export function Get(path: string) {
  return Route('get', path)
}

/**
 * POST 装饰器
 * @param path 请求路径
 */
export function Post(path: string) {
  return Route('post', path)
}

/**
 * PUT 装饰器
 * @param path 请求路径
 */
export function Put(path: string) {
  return Route('put', path)
}

/**
 * PATCH 装饰器
 * @param path 请求路径
 */
export function Patch(path: string) {
  return Route('patch', path)
}

/**
 * DELETE 装饰器
 * @param path 请求路径
 */
export function Delete(path: string) {
  return Route('delete', path)
}
