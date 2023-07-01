import type { Setting } from '@prisma/client'
import type { Request, Router } from 'express'
import express from 'express'

import { SettingsService } from '@/services'
import type { BasePageResponse, BaseResponse, PageRequestModel } from '@/types'

const router: Router = express.Router()

router.get('/', async (request: Request, response: BasePageResponse<Setting[]>) => {
  const { t } = request
  const { pageCount, pageSize } = request.query

  if (!pageCount || !pageSize) {
    response.status(400).json({
      message: t('Page.Require')
    })
    return
  }

  if (typeof Number(pageCount) !== 'number' || typeof Number(pageSize) !== 'number') {
    response.status(400).json({
      message: t('Page.Invalid')
    })
    return
  }

  const pageModel: PageRequestModel = {
    pageCount: Number(pageCount),
    pageSize: Number(pageSize)
  }

  const { settings, ...pageResult } = await SettingsService.getSettings(pageModel)

  response.status(200).json({
    data: settings,
    ...pageResult
  })
})

router.get('/batch', async (request: Request, response: BaseResponse<Setting[]>) => {
  const { t } = request
  const { keys } = request.body

  if (!keys || !Array.isArray(keys)) {
    response.status(400).json({
      message: t('Keys.Require')
    })
  }

  const settings = await SettingsService.getSettingsByKeys(keys)

  response.status(200).json({
    data: settings
  })
})

router.get('/:key', async (request: Request, response: BaseResponse<Setting>) => {
  const { t } = request
  const { key } = request.params

  const setting = await SettingsService.getSettingByKey(key)
  if (setting) {
    response.status(200).json({
      data: setting
    })
  } else {
    response.status(404).json({
      message: t('Key.NotExist')
    })
  }
})

router.post('/', async (request: Request, response: BaseResponse) => {
  const { t } = request
  const { key, value, description } = request.body as Setting

  if (!key) {
    response.status(400).json({
      message: t('Key.Require')
    })
    return
  }

  if (typeof key !== 'string') {
    response.status(400).json({
      message: t('Key.Invalid')
    })
    return
  }

  await SettingsService.createSetting(
    {
      key,
      value,
      description
    },
    { request }
  )

  response.status(201).json({
    message: t('Key.Created')
  })
})

router.post('/batch', async (request: Request, response: BaseResponse) => {
  const { t } = request
  const { settings } = request.body

  if (!settings || !Array.isArray(settings)) {
    response.status(400).json({
      message: t('Keys.Require')
    })
    return
  }

  try {
    settings.forEach((setting) => {
      if (!setting.key) {
        throw new Error(t('Key.Require'))
      }
      if (typeof setting.key !== 'string') {
        throw new Error(t('Key.Invalid'))
      }
    })
  } catch (error: any) {
    console.log(error)
    response.status(400).json({
      message: error.message
    })
    return
  }

  await SettingsService.createSettings(settings, { request })

  response.status(201).json({
    message: t('Key.Created')
  })
})

router.put('/:key', async (request: Request, response: BaseResponse) => {
  const { t } = request
  const { key } = request.params
  const { value, description } = request.body as Setting

  if (!key) {
    response.status(400).json({
      message: t('Key.Require')
    })
    return
  }

  if (typeof key !== 'string') {
    response.status(400).json({
      message: t('Key.Invalid')
    })
    return
  }

  try {
    await SettingsService.updateSettingByKey(
      {
        key,
        value,
        description
      },
      { request }
    )

    response.status(200).json({
      message: t('Key.Updated')
    })
  } catch (error: any) {
    console.log(error)
    response.status(500).json({
      message: t('Key.UpdateFailed')
    })
  }
})

router.delete('/:key', async (request: Request, response: BaseResponse) => {
  const { t } = request
  const { key } = request.params

  if (!key) {
    response.status(400).json({
      message: t('Key.Require')
    })
    return
  }

  if (typeof key !== 'string') {
    response.status(400).json({
      message: t('Key.Invalid')
    })
    return
  }

  try {
    await SettingsService.deleteSettingByKey(key, { request })
    response.status(200).json({
      message: t('Key.Deleted')
    })
  } catch (error: any) {
    console.log(error)
    response.status(500).json({
      message: t('Key.DeleteFailed')
    })
  }
})

export default router
