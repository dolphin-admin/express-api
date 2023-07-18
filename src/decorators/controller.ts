/**
 * Controller 装饰器
 */
export function Controller(path: string): ClassDecorator {
  return function (target: any) {
    target.prototype.path = path
  }
}

/**
 * 路由装饰器
 * @param method 请求方法
 * @param path 请求路径
 */
function Route(method: string, path: string) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    if (!target.routes) {
      target.routes = []
    }
    target.routes.push({
      method,
      path,
      handler: descriptor.value
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
