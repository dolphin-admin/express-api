import type http from 'http'
import type https from 'http'
import { Server } from 'socket.io'

/**
 *  注册 Socket
 */
const socketRegister = (httpServer: http.Server, httpsServer: https.Server, sockets: any[]) => {
  const httpSocket = new Server(httpServer, {
    cors: {
      origin: '*'
    }
  })

  const httpsSocket = new Server(httpsServer, {
    cors: {
      origin: '*'
    }
  })

  sockets.forEach((socket) => {
    httpSocket.of(`/${socket.name}`).on('connection', socket)
    httpsSocket.of(`/${socket.name}`).on('connection', socket)
  })
}

export default socketRegister
