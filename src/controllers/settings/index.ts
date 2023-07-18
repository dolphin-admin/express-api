import type { Setting } from '@prisma/client'
import { Request } from 'express'

import { Auth, Controller, Delete, Get, Post, Put } from '@/decorators'
import { SettingsService } from '@/services'
import type { PageRequestModel } from '@/types'
import { BaseResponse } from '@/types'

@Controller('/settings')
@Auth()
class SettingsController {
  /**
   *  获取所有设置项
   */
  @Get('/')
  async getSettings(request: Request, response: BaseResponse<Setting[]>) {
    const { t } = request
    const { page, pageSize } = request.query

    if (!page || !pageSize) {
      response.status(400).json({
        message: t('Page.Require')
      })
      return
    }

    if (typeof Number(page) !== 'number' || typeof Number(pageSize) !== 'number') {
      response.status(400).json({
        message: t('Page.Invalid')
      })
      return
    }

    const pageModel: PageRequestModel = {
      page: Number(page),
      pageSize: Number(pageSize)
    }

    const { settings, ...pageResult } = await SettingsService.getSettings(pageModel)

    response.status(200).json({
      data: settings,
      ...pageResult
    })
  }

  /**
   * 批量获取指定设置项
   */
  @Get('/batch')
  async getSettingsByKeys(request: Request, response: BaseResponse<Setting[]>) {
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
  }

  /**
   * 获取设置项
   */
  @Get('/:key')
  async getSettingByKey(request: Request, response: BaseResponse<Setting>) {
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
  }

  /**
   * 创建设置项
   */
  @Post('/:key')
  async createSetting(request: Request, response: BaseResponse<Setting>) {
    const { t, currentUser } = request
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
      { currentUser }
    )

    response.status(201).json({
      message: t('Key.Created')
    })
  }

  /**
   * 批量创建设置项
   */
  @Post('/batch')
  async createSettings(request: Request, response: BaseResponse<Setting[]>) {
    const { t, currentUser } = request
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
      response.status(400).json({
        message: error.message
      })
      return
    }

    await SettingsService.createSettings(settings, { currentUser })

    response.status(201).json({
      message: t('Key.Created')
    })
  }

  /**
   * 更新设置项
   */
  @Put('/:key')
  async updateSetting(request: Request, response: BaseResponse<Setting>) {
    const { t, currentUser } = request
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
        { currentUser }
      )

      response.status(200).json({
        message: t('Key.Updated')
      })
    } catch (error: any) {
      response.status(500).json({
        message: t('Key.UpdateFailed')
      })
    }
  }

  /**
   * 删除设置项
   */
  @Delete('/:key')
  async deleteSetting(request: Request, response: BaseResponse) {
    const { t, currentUser } = request
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
      await SettingsService.deleteSettingByKey(key, { currentUser })
      response.status(200).json({
        message: t('Key.Deleted')
      })
    } catch (error: any) {
      response.status(500).json({
        message: t('Key.DeleteFailed')
      })
    }
  }
}

export default new SettingsController()
