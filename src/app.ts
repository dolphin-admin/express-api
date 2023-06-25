import bodyParser from 'body-parser'
import type { Express, Request } from 'express'
import express from 'express'
import path from 'path'

import { fileStorageRegister } from '@/base'
import { internalServerErrorHandler, morganLogger, notFoundHandler, processLang, validateToken } from '@/middlewares'
import routes from '@/routes'
import { GlobalFileStorageConfig } from '@/shared'

const app: Express = express()

app.use(morganLogger)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(processLang)

const storageFolder = GlobalFileStorageConfig.FILE_STORAGE_PATH

fileStorageRegister(storageFolder)

// Static files setup
app.use(`/${storageFolder}`, express.static(path.resolve(__dirname, `../${storageFolder}`)))

// Init routes
routes.forEach((route) => {
  // Auth routes
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

// 404 handler
app.use(notFoundHandler)

// Error handler
app.use(internalServerErrorHandler)

export default app
