import type { UserTraffic } from '@prisma/pg'
import { Request } from 'express'

import { JWTManager } from '@/core'
import { Auth, Controller, Get, Post } from '@/decorators'
import type { UserTrafficCreateInputModel } from '@/models'
import { UsersService, UserTrafficsService } from '@/services'
import type { PageRequestModel } from '@/types'
import { BasePageResponse } from '@/types'

@Controller('/userTraffics')
class UserTrafficController {
  /**
   * 用户流量列表
   */
  @Auth()
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
   * @description 前端发出的 sendBeacon 请求，只能发送 POST 请求，切无法携带 token，故要手动验证
   */
  @Post('/')
  async createUserTraffic(request: Request, response: BasePageResponse<UserTraffic>) {
    const { t, body } = request
    let bodyParsedData
    try {
      bodyParsedData = JSON.parse(body) as {
        data: UserTrafficCreateInputModel
        authorization: string
      }
    } catch {
      response.status(400).json({
        message: t('Common.JSONParseFailed')
      })
      return
    }
    const { data, authorization } = bodyParsedData
    if (!authorization) {
      response.status(401).json({ message: t('Token.NotFound') })
      return
    }

    // 验证 token 是否有效
    const verifiedResult = JWTManager.validateAccessToken(authorization)
    if (!verifiedResult) {
      response.status(401).json({ message: t('Token.Invalid') })
      return
    }

    // 获取当前用户信息
    const userId = verifiedResult.id
    const user = await UsersService.getUserById(userId)

    if (!user) {
      response.status(401).json({ message: t('Token.Invalid') })
      return
    }

    try {
      const userTraffic = await UserTrafficsService.createUserTraffic(data, { currentUser: user })

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
