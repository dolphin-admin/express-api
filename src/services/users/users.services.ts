import { compare, hash } from '@node-rs/bcrypt'
import type { User } from '@prisma/client'
import { Role } from '@prisma/client'

import { generateUUID, PrismaAction, PrismaQuery } from '@/shared'
import type { PageRequestModel } from '@/types'

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

export const createUser = async (user: UserSignupModel): Promise<User> =>
  PrismaQuery.user.create({
    data: {
      ...user,
      uuid: generateUUID(),
      verified: true,
      enabled: true,
      roles: [Role.USER]
    }
  })

// TODO: Add updateBy
export const updateUser = async (id: number, user: UserUpdateModel): Promise<User | null> =>
  PrismaQuery.user.update({
    where: {
      id
    },
    data: {
      ...user,
      updatedAt: new Date().toISOString()
    }
  })

// TODO: Add deletedBy
export const deleteUser = async (id: number): Promise<User | null> =>
  PrismaQuery.user.update({
    where: {
      id
    },
    data: {
      deletedAt: new Date().toISOString()
    }
  })

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

export const verifyUser = async (id: number): Promise<User | null> =>
  PrismaQuery.user.update({
    where: {
      id
    },
    data: {
      verified: true
    }
  })

export const banUser = async (id: number): Promise<User | null> =>
  PrismaQuery.user.update({
    where: {
      id
    },
    data: {
      enabled: false
    }
  })

export const enableUser = async (id: number): Promise<User | null> =>
  PrismaQuery.user.update({
    where: {
      id
    },
    data: {
      enabled: true
    }
  })

export const authorizeUse = async (id: number): Promise<User | null> =>
  PrismaQuery.user.update({
    where: {
      id
    },
    data: {
      roles: [Role.USER, Role.ADMIN]
    }
  })
