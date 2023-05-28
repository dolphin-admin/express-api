import chalk from 'chalk'
import http from 'http'

import { GlobalAppConfig, GlobalConfig } from '@/shared'

import App from './app'

const { PORT } = GlobalConfig

App.set('port', PORT)

const Server = http.createServer(App)

Server.listen(PORT, () => {
  const serverInfo = Server.address()
  let port
  if (serverInfo) {
    if (typeof serverInfo !== 'string') {
      port = serverInfo.port
    } else {
      port = serverInfo
    }
  }

  console.log(
    chalk.green(`
[${GlobalAppConfig.APP_NAME}] Server is running on port ${port}
[${GlobalAppConfig.APP_NAME}] v${GlobalAppConfig.APP_VERSION}
`)
  )
})
