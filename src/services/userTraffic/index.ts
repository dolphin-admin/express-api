import type { PageUserTrafficsModel, UserTrafficCreateInputModel } from '@/models'
import type { Prisma, UserTraffic } from '@/prisma/generated/mongo'
import { mongoClient } from '@/shared'
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

    const userTraffics = await mongoClient.userTraffic.findMany({})

    const total = await mongoClient.userTraffic.count({
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
    return mongoClient.userTraffic.create({
      data: {
        ...userTraffic,
        createdBy: currentUser?.id
      }
    })
  }
}

export default new UserTrafficService()
