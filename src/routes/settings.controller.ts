import type { Setting } from '@prisma/client'
import type { Request, Router } from 'express'
import express from 'express'

import { SettingsService } from '@/services'
import type { BasePageResponse, BaseResponse, PageRequestModel } from '@/types'

const router: Router = express.Router()

router.get('/', async (request: Request, response: BasePageResponse<Setting[]>) => {
  const { pageNum, pageSize } = request.query

  if (!pageNum || !pageSize) {
    response.status(400).json({
      message: 'Page number and page size are required.'
    })
    return
  }

  if (typeof Number(pageNum) !== 'number' || typeof Number(pageSize) !== 'number') {
    response.status(400).json({
      message: 'Page number and page size must be numbers.'
    })
    return
  }

  const pageModel: PageRequestModel = {
    pageNum: Number(pageNum),
    pageSize: Number(pageSize)
  }

  const { settings, ...pageResult } = await SettingsService.getSettings(pageModel)

  response.status(200).json({
    data: settings,
    ...pageResult
  })
})

router.get('/batch', async (request: Request, response: BaseResponse<Setting[]>) => {
  const { keys } = request.body

  if (!keys || !Array.isArray(keys)) {
    response.status(400).json({
      message: 'Keys are required.'
    })
  }

  const settings = await SettingsService.getSettingsByKeys(keys)

  response.status(200).json({
    data: settings
  })
})

router.get('/:key', async (request: Request, response: BaseResponse<Setting>) => {
  const { key } = request.params
  const setting = await SettingsService.getSettingByKey(key)
  if (setting) {
    response.status(200).json({
      data: setting
    })
  } else {
    response.status(404).json({
      message: 'Setting not found.'
    })
  }
})

router.post('/', async (request: Request, response: BaseResponse) => {
  const { key, value, description } = request.body as Setting

  if (!key) {
    response.status(400).json({
      message: 'Key is required.'
    })
    return
  }

  if (typeof key !== 'string') {
    response.status(400).json({
      message: 'Key must be strings.'
    })
    return
  }

  await SettingsService.createSetting({
    key,
    value,
    description
  })

  response.status(201).json({
    message: 'Setting created.'
  })
})

router.post('/batch', async (request: Request, response: BaseResponse) => {
  const { settings } = request.body

  if (!settings || !Array.isArray(settings)) {
    response.status(400).json({
      message: 'Settings are required.'
    })
    return
  }

  try {
    settings.forEach((setting) => {
      if (!setting.key) {
        throw new Error('Key is required.')
      }
      if (typeof setting.key !== 'string') {
        throw new Error('Key must be strings.')
      }
    })
  } catch (error: any) {
    console.log(error)
    response.status(400).json({
      message: error.message
    })
    return
  }

  await SettingsService.createSettings(settings)

  response.status(201).json({
    message: 'Settings created.'
  })
})

router.put('/:key', async (request: Request, response: BaseResponse) => {
  const { key } = request.params
  const { value, description } = request.body as Setting

  if (!key) {
    response.status(400).json({
      message: 'Key is required.'
    })
    return
  }

  if (typeof key !== 'string') {
    response.status(400).json({
      message: 'Key must be strings.'
    })
    return
  }

  try {
    await SettingsService.updateSettingByKey({
      key,
      value,
      description
    })

    response.status(200).json({
      message: 'Setting updated.'
    })
  } catch (error: any) {
    console.log(error)
    response.status(500).json({
      message: 'Error updating setting.'
    })
  }
})

router.delete('/:key', async (request: Request, response: BaseResponse) => {
  const { key } = request.params

  if (!key) {
    response.status(400).json({
      message: 'Key is required.'
    })
    return
  }

  if (typeof key !== 'string') {
    response.status(400).json({
      message: 'Key must be strings.'
    })
    return
  }

  try {
    await SettingsService.deleteSettingByKey(key)
    response.status(200).json({
      message: 'Setting deleted.'
    })
  } catch (error: any) {
    console.log(error)
    response.status(500).json({
      message: 'Error deleting setting.'
    })
  }
})

export default router
