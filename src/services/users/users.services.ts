import { compare, hash } from '@node-rs/bcrypt'
import type { User } from '@prisma/client'
import { Role } from '@prisma/client'

import { generateUUID, PrismaAction, PrismaQuery } from '@/shared'
import type { PageRequestModel, ServiceOptions } from '@/types'

import type { UserExistModel, UserSafeModel, UserSignupModel, UsersModel, UserUpdateModel } from './users.models'

export const getUsers = async (pageModel: PageRequestModel): Promise<UsersModel> => {
  const { pageNum, pageSize } = pageModel

  const users = await PrismaQuery.user.findMany({
    where: {
      verified: true,
      enabled: true,
      ...PrismaAction.notDeleted()
    },
    skip: (pageNum - 1) * pageSize,
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

export const createUser = async (user: UserSignupModel, options?: ServiceOptions): Promise<User> => {
  const { request } = options || {}
  const currentUsername = request?.currentUser?.username
  return PrismaQuery.user.create({
    data: {
      ...user,
      uuid: generateUUID(),
      verified: true,
      enabled: true,
      roles: [Role.USER],
      createdBy: currentUsername
    }
  })
}

export const updateUser = async (id: number, user: UserUpdateModel, options?: ServiceOptions): Promise<User | null> => {
  const { request } = options || {}
  const currentUsername = request?.currentUser?.username
  return PrismaQuery.user.update({
    where: {
      id
    },
    data: {
      ...user,
      updatedBy: currentUsername
    }
  })
}

export const deleteUser = async (id: number, options?: ServiceOptions): Promise<User | null> => {
  const { request } = options || {}
  const currentUsername = request?.currentUser?.username
  return PrismaQuery.user.update({
    where: {
      id
    },
    data: {
      updatedBy: currentUsername,
      deletedAt: new Date().toISOString(),
      deletedBy: currentUsername
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

export const passwordHash = async (password: string) => hash(password, 10)

export const passwordEquals = async (password: string, hashedPassword: string) => compare(password, hashedPassword)

export const verifyUser = async (id: number, options?: ServiceOptions): Promise<User | null> => {
  const { request } = options || {}
  const currentUsername = request?.currentUser?.username
  return PrismaQuery.user.update({
    where: {
      id
    },
    data: {
      verified: true,
      updatedBy: currentUsername
    }
  })
}

export const banUser = async (id: number, options?: ServiceOptions): Promise<User | null> => {
  const { request } = options || {}
  const currentUsername = request?.currentUser?.username
  return PrismaQuery.user.update({
    where: {
      id
    },
    data: {
      enabled: false,
      updatedBy: currentUsername
    }
  })
}

export const enableUser = async (id: number, options?: ServiceOptions): Promise<User | null> => {
  const { request } = options || {}
  const currentUsername = request?.currentUser?.username
  return PrismaQuery.user.update({
    where: {
      id
    },
    data: {
      enabled: true,
      updatedBy: currentUsername
    }
  })
}

export const authorizeUse = async (id: number, options?: ServiceOptions): Promise<User | null> => {
  const { request } = options || {}
  const currentUsername = request?.currentUser?.username
  return PrismaQuery.user.update({
    where: {
      id
    },
    data: {
      roles: [Role.USER, Role.ADMIN],
      updatedBy: currentUsername
    }
  })
}
