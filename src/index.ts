import figlet from 'figlet'
import gradient from 'gradient-string'
import http from 'http'

import { batchPrimaryLog, getCurrentTime, GlobalAppConfig, GlobalConfig } from '@/shared'

import app from './app'

const { PORT } = GlobalConfig

app.set('port', PORT)

const Server = http.createServer(app)

const showAppInitLog = (port: string) => {
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

Server.listen(PORT, () => {
  const serverInfo = Server.address()
  let port = ''
  if (serverInfo) {
    if (typeof serverInfo !== 'string') {
      port = serverInfo.port.toString()
    } else {
      port = serverInfo
    }
  }

  showAppInitLog(port)
})
