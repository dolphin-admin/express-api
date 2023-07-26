import type { UserTraffic } from '@prisma/pg'
import { Request } from 'express'

import { Auth, Controller, Get, Post } from '@/decorators'
import type { UserTrafficCreateInputModel } from '@/models'
import { UserTrafficsService } from '@/services'
import type { PageRequestModel } from '@/types'
import { BasePageResponse } from '@/types'

@Controller('/userTraffics')
@Auth()
class UserTrafficController {
  /**
   * 用户流量列表
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

    const { userTraffics, ...pageResult } = await UserTrafficsService.getUserTraffics(pageModel)

    response.status(200).json({
      data: userTraffics,
      ...pageResult
    })
  }

  /**
   * 用户流量上报
   */
  @Post('/')
  async createUserTraffic(request: Request, response: BasePageResponse<UserTraffic>) {
    const { t, currentUser } = request
    const data = request.body as UserTrafficCreateInputModel

    console.log(currentUser)
    try {
      const userTraffic = await UserTrafficsService.createUserTraffic(data, { currentUser })

      response.status(201).json({
        data: userTraffic,
        message: t('Common.Created')
      })
    } catch (error) {
      console.log(error)
      response.status(500).json({
        message: t('Common.CreateFailed')
      })
    }
  }
}

export default new UserTrafficController()
