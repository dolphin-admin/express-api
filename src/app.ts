import bodyParser from 'body-parser'
import type { Express, Request } from 'express'
import express from 'express'
import path from 'path'

import { AppRegister } from '@/base'
import * as Controllers from '@/controllers'
import { internalServerErrorHandler, morganLogger, notFoundHandler, processLang, validateToken } from '@/middlewares'
import routes from '@/routes'
import { GlobalFileStorageConfig } from '@/shared'

const storageFolder = GlobalFileStorageConfig.FILE_STORAGE_PATH

const app: Express = express()

// 注册文件存储
AppRegister.fileStorageRegister(storageFolder)
app.use(morganLogger)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
// 处理多语言，需要在路由注册之前
app.use(processLang)
app.use(`/${storageFolder}`, express.static(path.resolve(__dirname, `../${storageFolder}`)))

// 注册 Controller
AppRegister.controllerRegister(app, Object.values(Controllers))

routes.forEach((route) => {
  if (route.auth) {
    app.use(route.path, validateToken, route.router)
  } else {
    app.use(route.path, route.router)
  }
})

app.get('/', (req: Request, res) => {
  const { t } = req
  res.status(200).send(t('Welcome'))
})

app.use(notFoundHandler)
app.use(internalServerErrorHandler)

export default app
