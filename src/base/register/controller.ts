import type { Express } from 'express'

type RouteMethod = 'get' | 'post' | 'put' | 'delete' | 'patch' | 'options' | 'head'

/**
 *  注册 Controller
 */
const controllerRegister = (app: Express, controllers: any[]) => {
  controllers.forEach((controller) => {
    const prototype = Object.getPrototypeOf(controller)
    const { path, routes, classMiddlewares } = prototype
    routes.forEach((route: any) => {
      app[route.method as RouteMethod](
        path + route.path,
        ...(classMiddlewares || []),
        ...(route.middlewares || []),
        route.handler
      )
    })
  })
}

export default controllerRegister
