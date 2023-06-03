import bodyParser from 'body-parser'
import type { Express } from 'express'
import express from 'express'
import path from 'path'

import { fileStorageRegister } from '@/base'
import { internalServerErrorHandler, morganLogger, notFoundHandler, validateToken } from '@/middlewares'
import routes from '@/routes'
import { GlobalFileStorageConfig } from '@/shared'

const app: Express = express()

app.use(morganLogger)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const storageFolder = GlobalFileStorageConfig.FILE_STORAGE_PATH

fileStorageRegister(storageFolder)

// Static files setup
app.use('/static', express.static(path.join(__dirname, './static')))
app.use(`/${storageFolder}`, express.static(path.join(__dirname, `../${storageFolder}`)))

// Init routes
routes.forEach((route) => {
  // Auth routes
  if (route.auth) {
    app.use(route.path, validateToken, route.router)
  } else {
    app.use(route.path, route.router)
  }
})

// 404 handler
app.use(notFoundHandler)

// Error handler
app.use(internalServerErrorHandler)

export default app
