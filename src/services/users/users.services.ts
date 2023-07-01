import type { User } from '@prisma/client'

import { PrismaAction, PrismaQuery } from '@/shared'
import type { PageRequestModel, ServiceOptions } from '@/types'

import type { UserExistModel, UserInputBaseModel, UserSafeModel, UsersModel, UserUpdateModel } from './users.models'

export const getUsers = async (pageModel: PageRequestModel): Promise<UsersModel> => {
  const { pageCount, pageSize } = pageModel

  const users = await PrismaQuery.user.findMany({
    where: {
      verified: true,
      enabled: true,
      ...PrismaAction.notDeleted()
    },
    skip: (pageCount - 1) * pageSize,
    take: pageSize
  })

  const total = await PrismaQuery.user.count({
    where: {
      verified: true,
      enabled: true,
      ...PrismaAction.notDeleted()
    }
  })

  return {
    users,
    total,
    ...pageModel
  }
}

export const getUserById = async (id: number): Promise<User | null> =>
  PrismaQuery.user.findFirst({
    where: {
      id,
      verified: true,
      enabled: true,
      ...PrismaAction.notDeleted()
    }
  })

export const createUser = async (user: UserInputBaseModel, options?: ServiceOptions): Promise<User> => {
  const { request } = options || {}
  const currentUser = request?.currentUser
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
  const { request } = options || {}
  const currentUser = request?.currentUser
  return PrismaQuery.user.update({
    where: {
      id
    },
    data: {
      ...user,
      updatedBy: currentUser?.id
    }
  })
}

export const deleteUser = async (id: number, options?: ServiceOptions): Promise<User | null> => {
  const { request } = options || {}
  const currentUser = request?.currentUser
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
      verified: true,
      enabled: true,
      ...PrismaAction.notDeleted()
    }
  })
  return { isExist: !!user, user }
}

export const filterSafeUserInfo = (user: User): UserSafeModel => {
  // eslint-disable-next-line unused-imports/no-unused-vars
  const { password, ...filteredUser } = user
  return filteredUser
}

export const verifyUser = async (id: number, options?: ServiceOptions): Promise<User | null> => {
  const { request } = options || {}
  const currentUser = request?.currentUser
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

export const banUser = async (id: number, options?: ServiceOptions): Promise<User | null> => {
  const { request } = options || {}
  const currentUser = request?.currentUser
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

export const enableUser = async (id: number, options?: ServiceOptions): Promise<User | null> => {
  const { request } = options || {}
  const currentUser = request?.currentUser
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
