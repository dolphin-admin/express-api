import { type User } from '@prisma/client'

import { AuthType, PrismaAction, PrismaQuery } from '@/shared'
import type { PageRequestModel, ServiceOptions } from '@/types'

import type { PageUsersModel, UserExistModel, UserInputBaseModel, UserUpdateModel } from './users.models'
import { genderLabelKeyMap } from './users.models'

export const filterSafeUserInfo = <T extends { password: string }>(user: T): Omit<T, 'password'> => {
  // eslint-disable-next-line unused-imports/no-unused-vars
  const { password, ...filteredUser } = user
  return filteredUser
}

export const getUsers = async (pageModel: PageRequestModel, options?: ServiceOptions): Promise<PageUsersModel> => {
  const { page, pageSize } = pageModel
  const { t, lang } = options || {}

  const users = await PrismaQuery.user.findMany({
    where: {
      ...PrismaAction.notDeleted()
    },
    orderBy: {
      createdAt: 'desc'
    },
    skip: (page - 1) * pageSize,
    take: pageSize,
    include: {
      userRoles: {
        select: {
          role: true
        },
        where: {
          ...PrismaAction.notDeleted()
        }
      },
      auths: {
        select: {
          authType: true
        }
      }
    }
  })

  const total = await PrismaQuery.user.count({
    where: {
      ...PrismaAction.notDeleted()
    }
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
        ...filterSafeUserInfo(restUser),
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

export const getUserById = async (id: number): Promise<User | null> =>
  PrismaQuery.user.findFirst({
    where: {
      id,
      ...PrismaAction.notDeleted()
    }
  })

export const createUser = async (user: UserInputBaseModel, options?: ServiceOptions): Promise<User> => {
  const { currentUser } = options || {}
  return PrismaQuery.user.create({
    data: {
      ...user,
      verified: true,
      enabled: true,
      createdBy: currentUser?.id
    }
  })
}

export const updateUser = async (id: number, user: UserUpdateModel, options?: ServiceOptions): Promise<User | null> => {
  const { currentUser } = options || {}
  const { birthDate } = user

  return PrismaQuery.user.update({
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

export const deleteUser = async (id: number, options?: ServiceOptions): Promise<User | null> => {
  const { currentUser } = options || {}
  return PrismaQuery.user.update({
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

export const alreadyExists = async (username: string): Promise<UserExistModel> => {
  const user = await PrismaQuery.user.findFirst({
    where: {
      username,
      ...PrismaAction.notDeleted()
    }
  })
  return { isExist: !!user, user }
}

export const verifyUser = async (id: number, options?: ServiceOptions): Promise<User | null> => {
  const { currentUser } = options || {}
  return PrismaQuery.user.update({
    where: {
      id
    },
    data: {
      verified: true,
      updatedBy: currentUser?.id
    }
  })
}

export const activateUser = async (id: number, options?: ServiceOptions): Promise<User | null> => {
  const { currentUser } = options || {}
  return PrismaQuery.user.update({
    where: {
      id
    },
    data: {
      enabled: true,
      updatedBy: currentUser?.id
    }
  })
}

export const deactivateUser = async (id: number, options?: ServiceOptions): Promise<User | null> => {
  const { currentUser } = options || {}
  return PrismaQuery.user.update({
    where: {
      id
    },
    data: {
      enabled: false,
      updatedBy: currentUser?.id
    }
  })
}
