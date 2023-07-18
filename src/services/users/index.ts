import type { Prisma, User } from '@prisma/client'

import type {
  PageUsersModel,
  UserExistModel,
  UserInputBaseModel,
  UserPageRequestModel,
  UserUpdateModel
} from '@/models'
import { genderLabelKeyMap } from '@/models'
import { AuthType, prisma } from '@/shared'
import type { ServiceOptions } from '@/types'

class UsersService {
  /**
   * 过滤用户敏感信息
   */
  filterSafeUserInfo<T extends { password: string }>(user: T): Omit<T, 'password'> {
    // eslint-disable-next-line unused-imports/no-unused-vars
    const { password, ...filteredUser } = user
    return filteredUser
  }

  /**
   * 获取用户列表
   */
  async getUsers(pageModel: UserPageRequestModel, options?: ServiceOptions): Promise<PageUsersModel> {
    const { page, pageSize, searchText, startDate, endDate, sort, order, authTypes } = pageModel
    const { t, lang } = options || {}

    let searchTextNumber: number | undefined
    if (searchText && /^\d+$/.test(searchText)) {
      const tempNumber = BigInt(searchText)
      if (tempNumber <= BigInt(Number.MAX_SAFE_INTEGER) && tempNumber >= BigInt(Number.MIN_SAFE_INTEGER)) {
        searchTextNumber = Number(tempNumber)
      }
    }

    const sortFields = (sort ?? 'createdAt').split(',')
    const orderFields = (order ?? 'desc').split(',')

    const authTypesList = authTypes?.split(',').map((authType) => Number(authType))

    const where: Prisma.UserWhereInput = {
      AND: [
        {
          createdAt: {
            ...(startDate && { gte: startDate }),
            ...(endDate && { lte: endDate })
          }
        }
      ],
      OR: searchText
        ? [
            {
              username: {
                contains: searchText
              }
            },
            {
              phoneNumber: {
                contains: searchText
              }
            },
            {
              email: {
                contains: searchText
              }
            },
            {
              name: {
                contains: searchText
              }
            },
            {
              nickName: {
                contains: searchText
              }
            },
            ...(searchTextNumber ? [{ id: { equals: searchTextNumber } }] : [])
          ]
        : undefined,
      ...(authTypesList && {
        auths: {
          some: {
            authType: {
              in: authTypesList
            }
          }
        }
      })
    }

    const orderBy = sortFields.map((field: string, index) => ({
      [field]: orderFields[index]
    }))

    const users = await prisma.user.findMany({
      where,
      orderBy,
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        userRoles: {
          select: {
            role: true
          }
        },
        auths: {
          select: {
            authType: true
          }
        }
      }
    })

    const total = await prisma.user.count({
      where
    })

    return {
      users: users.map((user) => {
        const { userRoles, ...restUser } = user
        let genderLabel = ''
        if (typeof user.gender === 'number') {
          const genderLabelKey = genderLabelKeyMap.get(user.gender)
          if (genderLabelKey) {
            genderLabel = t ? t(genderLabelKeyMap.get(user.gender)!) : ''
          }
        }
        return {
          ...this.filterSafeUserInfo(restUser),
          roles: userRoles
            .map((userRole) => userRole.role)
            .map((role) => (lang === 'en_US' ? role.nameEn : role.nameZh))
            .filter((roleName) => roleName) as string[],
          genderLabel,
          authTypes: user.auths.map((auth) => AuthType[auth.authType])
        }
      }),
      total,
      ...pageModel
    }
  }

  /**
   * 获取用户详情
   */
  async getUserById(id: number): Promise<User | null> {
    return prisma.user.findFirst({
      where: {
        id
      }
    })
  }

  /**
   * 创建用户
   */
  async createUser(user: UserInputBaseModel, options?: ServiceOptions): Promise<User> {
    const { currentUser } = options || {}
    return prisma.user.create({
      data: {
        ...user,
        verified: true,
        enabled: true,
        createdBy: currentUser?.id
      }
    })
  }

  /**
   * 更新用户
   */
  async updateUser(id: number, user: UserUpdateModel, options?: ServiceOptions): Promise<User | null> {
    const { currentUser } = options || {}
    const { birthDate } = user

    return prisma.user.update({
      where: {
        id
      },
      data: {
        ...user,
        birthDate: birthDate ? new Date(birthDate) : null,
        updatedBy: currentUser?.id
      }
    })
  }

  /**
   * 删除用户
   */
  async deleteUser(id: number, options?: ServiceOptions): Promise<User | null> {
    const { currentUser } = options || {}
    return prisma.user.update({
      where: {
        id
      },
      data: {
        updatedBy: currentUser?.id,
        deletedAt: new Date().toISOString(),
        deletedBy: currentUser?.id
      }
    })
  }

  /**
   * 用户是否存在
   */
  async alreadyExists(username: string): Promise<UserExistModel> {
    const user = await prisma.user.findFirst({
      where: {
        username
      }
    })
    return { isExist: !!user, user }
  }

  /**
   * 验证用户
   */
  async verifyUser(id: number, options?: ServiceOptions): Promise<User | null> {
    const { currentUser } = options || {}
    return prisma.user.update({
      where: {
        id
      },
      data: {
        verified: true,
        updatedBy: currentUser?.id
      }
    })
  }

  /**
   * 启用用户
   */
  async activateUser(id: number, options?: ServiceOptions): Promise<User | null> {
    const { currentUser } = options || {}
    return prisma.user.update({
      where: {
        id
      },
      data: {
        enabled: true,
        updatedBy: currentUser?.id
      }
    })
  }

  /**
   * 禁用用户
   */
  async deactivateUser(id: number, options?: ServiceOptions): Promise<User | null> {
    const { currentUser } = options || {}
    return prisma.user.update({
      where: {
        id
      },
      data: {
        enabled: false,
        updatedBy: currentUser?.id
      }
    })
  }
}

export default new UsersService()
