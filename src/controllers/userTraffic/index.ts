import { Request } from 'express'

import { Auth, Controller, Get, Post } from '@/decorators'
import type { UserTrafficCreateInputModel } from '@/models'
import type { UserTraffic } from '@/prisma/generated/mongo'
import { UserTrafficService } from '@/services'
import type { PageRequestModel } from '@/types'
import { BasePageResponse } from '@/types'

@Controller('/userTraffics')
@Auth()
class UserTrafficController {
  /**
   * 用户流量记录列表
   */
  @Get('/')
  async getUserTraffics(request: Request, response: BasePageResponse) {
    const { t } = request
    const { page, pageSize, startDate, endDate } = request.query

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
      pageSize: Number(pageSize),
      startDate: startDate?.toString() ? new Date(startDate.toString()) : undefined,
      endDate: endDate?.toString() ? new Date(endDate.toString()) : undefined
    }

    const { userTraffics, ...pageResult } = await UserTrafficService.getUserTraffics(pageModel)

    response.status(200).json({
      data: userTraffics,
      ...pageResult
    })
  }

  /**
   * 创建用户流量记录
   */
  @Post('/')
  async createUserTraffic(request: Request, response: BasePageResponse<UserTraffic>) {
    const { t, currentUser } = request
    const data = request.body as UserTrafficCreateInputModel

    try {
      const userTraffic = await UserTrafficService.createUserTraffic(data, { currentUser })

      response.status(201).json({
        data: userTraffic,
        message: t('UserTraffic.Created')
      })
    } catch (error) {
      console.log(error)
      response.status(500).json({
        message: t('UserTraffic.CreateFailed')
      })
    }
  }
}

export default new UserTrafficController()
