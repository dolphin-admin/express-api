import type { Prisma, UserTraffic } from '@prisma/pg'

import type { PageUserTrafficsModel, UserTrafficCreateInputModel } from '@/models'
import { pgClient } from '@/prisma'
import type { PageRequestModel, ServiceOptions } from '@/types'

class UserTrafficService {
  /**
   * 获取用户流量记录列表
   */
  async getUserTraffics(pageModel: PageRequestModel, _?: ServiceOptions): Promise<PageUserTrafficsModel> {
    const { page, pageSize, startDate, endDate } = pageModel

    const where: Prisma.UserTrafficWhereInput = {
      AND: [
        {
          createdAt: {
            ...(startDate && { gte: startDate }),
            ...(endDate && { lte: endDate })
          }
        }
      ]
    }

    const userTraffics = await pgClient.userTraffic.findMany({})

    const total = await pgClient.userTraffic.count({
      where,
      orderBy: {
        createdAt: 'desc'
      },
      skip: (page - 1) * pageSize,
      take: pageSize
    })

    return {
      userTraffics,
      total,
      page,
      pageSize
    }
  }

  /**
   * 创建用户流量记录
   */
  async createUserTraffic(userTraffic: UserTrafficCreateInputModel, options?: ServiceOptions): Promise<UserTraffic> {
    const { currentUser } = options || {}
    return pgClient.userTraffic.create({
      data: {
        ...userTraffic,
        createdBy: currentUser?.id
      }
    })
  }
}

export default new UserTrafficService()
