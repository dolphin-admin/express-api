import figlet from 'figlet'
import fs from 'fs'
import gradient from 'gradient-string'
import http from 'http'
import https from 'https'
import path from 'path'
import { Server } from 'socket.io'

import { AppRegister } from '@/base'
import { batchPrimaryLog, getCurrentTime, GlobalAppConfig, GlobalConfig } from '@/shared'

import app from './app'

const { PORT } = GlobalConfig

app.set('port', PORT)

const cred = {
  key: fs.readFileSync(path.resolve(__dirname, '../cert/dolphin.admin-key.pem')),
  cert: fs.readFileSync(path.resolve(__dirname, '../cert/dolphin.admin.pem'))
}

const httpServer = http.createServer(app)
const httpsServer = https.createServer(cred, app)

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

const showAppInitLog = (port: string) => {
  console.clear()
  figlet(GlobalAppConfig.APP_NAME, (err, data) => {
    if (err) {
      console.log('Something went wrong...')
      console.dir(err)
      return
    }

    batchPrimaryLog([
      '',
      gradient.rainbow(data),
      '',
      `[${GlobalAppConfig.APP_NAME} - ${getCurrentTime('HH:mm:ss')}] ${GlobalAppConfig.APP_NAME} v${
        GlobalAppConfig.APP_VERSION
      }`,
      `[${GlobalAppConfig.APP_NAME} - ${getCurrentTime('HH:mm:ss')}] Author: ${GlobalAppConfig.APP_AUTHOR.name}`,
      `[${GlobalAppConfig.APP_NAME} - ${getCurrentTime('HH:mm:ss')}] Server is running on port ${port}`
    ])
  })
}

httpSocket.of('/websocket').on('connection', (socket) => {
  console.log('Connected')
  socket.on('disconnect', () => {
    console.log('Disconnected')
  })
  socket.on('message', (data) => {
    console.log(data)
    socket.broadcast.emit('message', data)
  })
})

httpsSocket.of('/websocket').on('connection', (socket) => {
  console.log('Connected')
  socket.on('disconnect', () => {
    console.log('Disconnected')
  })
  socket.on('message', (data) => {
    console.log(data)
    socket.broadcast.emit('message', data)
  })
})

httpServer.listen(PORT, async () => {
  const serverInfo = httpServer.address()
  let port = ''
  if (serverInfo) {
    if (typeof serverInfo !== 'string') {
      port = serverInfo.port.toString()
    } else {
      port = serverInfo
    }
  }

  await AppRegister.rolePermissionRegister()
  showAppInitLog(port)
})

httpsServer.listen(3001)
