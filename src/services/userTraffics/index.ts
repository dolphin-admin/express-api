import type { Prisma, UserTraffic } from '@prisma/pg'

import type { PageUserTrafficsModel, UserTrafficCreateInputModel } from '@/models'
import { pgClient } from '@/prisma'
import type { PageRequestModel, ServiceOptions } from '@/types'

class UserTrafficsService {
  /**
   * 用户流量记录列表
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

    const userTraffics: any = await pgClient.userTraffic.findMany({
      where,
      select: {
        id: true,
        app: true,
        version: true,
        env: true,
        source: true,
        userAgent: true,
        ip: true,
        area: true,
        longitude: true,
        latitude: true,
        altitude: true,
        enterAt: true,
        leaveAt: true,
        duration: true,
        user: {
          select: {
            id: true,
            username: true
          }
        },
        userTrafficRecords: {
          select: {
            id: true,
            title: true,
            url: true,
            path: true,
            enterAt: true,
            leaveAt: true,
            duration: true
          },
          orderBy: {
            enterAt: 'desc'
          }
        },
        _count: {
          select: {
            userTrafficRecords: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      skip: (page - 1) * pageSize,
      take: pageSize
    })

    const total = await pgClient.userTraffic.count({
      where
    })

    const data = userTraffics.map((userTraffic: any) => {
      const { user, userTrafficRecords, _count: count, ...userTrafficData } = userTraffic
      return {
        ...userTrafficData,
        userId: user.id,
        username: user.username,
        records: userTrafficRecords,
        recordsCount: count.userTrafficRecords
      }
    })

    return {
      userTraffics: data,
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
    const { records, ...trafficData } = userTraffic
    return pgClient.userTraffic.create({
      data: {
        ...trafficData,
        userId: currentUser!.id,
        createdBy: currentUser!.id,
        userTrafficRecords: {
          createMany: {
            data: records.map((record) => ({
              ...record,
              createdBy: currentUser!.id
            }))
          }
        }
      },
      include: {
        userTrafficRecords: true
      }
    })
  }
}

export default new UserTrafficsService()
