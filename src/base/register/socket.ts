import type http from 'http'
import type https from 'http'
import type { Socket } from 'socket.io'
import { Server } from 'socket.io'

import type { ISocketMiddleware } from '@/decorators'

/**
 *  注册 socket
 */
const socketRegister = (httpServer: http.Server, httpsServer: https.Server, controllers: any[]) => {
  // 分别以 HTTP、HTTPS 服务初始化 socket
  const httpIO = new Server(httpServer, {
    cors: {
      origin: '*'
    }
  })

  const httpsIO = new Server(httpsServer, {
    cors: {
      origin: '*'
    }
  })

  // 将 socket 注入 HTTP、HTTPS 服务
  controllers.forEach((ControllerClass) => {
    const controller = new ControllerClass()
    const prototype = Object.getPrototypeOf(controller)
    const { classMiddlewares, namespace } = prototype
    const middlewares = (classMiddlewares || []).concat(controller.middlewares || [])

    const httpNamespace = httpIO.of(namespace)
    const httpsNamespace = httpsIO.of(namespace)

    middlewares.forEach((middleware: ISocketMiddleware) => {
      httpNamespace.use(middleware)
      httpsNamespace.use(middleware)
    })

    httpNamespace.on('connection', (socket: Socket) => {
      controller.events.forEach((event: any) => {
        socket.on(event.event, (data: any) => event.handler(socket, data))
      })
    })
    httpsNamespace.on('connection', (socket: Socket) => {
      controller.events.forEach((event: any) => {
        socket.on(event.event, (data: any) => event.handler(socket, data))
      })
    })
  })
}

export default socketRegister
