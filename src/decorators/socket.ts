import type { Socket } from 'socket.io'
/**
 * Socket 命名空间装饰器
 * @param namespace 命名空间
 */
export function Namespace(namespace: string): ClassDecorator {
  return function (target: any) {
    target.prototype.namespace = namespace
  }
}

export type SocketMiddlewareNextFunction = (err?: any) => void

export type ISocketMiddleware = (socket: Socket, next: SocketMiddlewareNextFunction) => void

/**
 * Socket 中间件装饰器
 */
export function SocketMiddleware(...middlewares: ISocketMiddleware[]) {
  return function (target: any, propertyKey?: string) {
    if (propertyKey) {
      if (!Array.isArray(target.middlewares)) {
        target.middlewares = []
      }
      // 方法装饰器
      target.middlewares.push(target[propertyKey])
    } else {
      // 类装饰器
      target.prototype.classMiddlewares = middlewares
    }
  }
}

/**
 * Socket 事件装饰器
 * @param event 事件名
 */
export function Event(event: string) {
  return function (target: any, propertyKey: string) {
    if (!Array.isArray(target.events)) {
      target.events = []
    }
    target.events.push({
      event,
      handler: target[propertyKey]
    })
  }
}
