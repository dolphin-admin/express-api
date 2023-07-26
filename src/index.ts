import figlet from 'figlet'
import fs from 'fs'
import gradient from 'gradient-string'
import http from 'http'
import https from 'https'
import path from 'path'

import { AppRegister } from '@/base'
import * as SocketControllers from '@/sockets'
import { batchPrimaryLog, getCurrentTime, GlobalAppConfig, GlobalConfig, GlobalDevConfig } from '@/utils'

import app from './app'

const { HTTP_PORT, HTTPS_PORT } = GlobalConfig

// localhost https 证书
const cred = {
  key: fs.readFileSync(path.resolve(__dirname, '../cert/key.local.pem')),
  cert: fs.readFileSync(path.resolve(__dirname, '../cert/cert.local.pem'))
}

const httpServer = http.createServer(app)
const httpsServer = https.createServer(cred, app)

const showAppInitLog = (port: string) => {
  if (GlobalDevConfig.DEV_SHOW_LOG) {
    console.clear()
  }
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
      `[${GlobalAppConfig.APP_NAME} - ${getCurrentTime('HH:mm:ss')}] HTTP Server is running on port ${port}`,
      `[${GlobalAppConfig.APP_NAME} - ${getCurrentTime('HH:mm:ss')}] HTTPS Server is running on port ${HTTPS_PORT}`
    ])
  })
}

// 注册 Socket
AppRegister.socketRegister(httpServer, httpsServer, Object.values(SocketControllers))

httpServer.listen(HTTP_PORT, async () => {
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

httpsServer.listen(HTTPS_PORT)
