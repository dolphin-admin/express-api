import { Prisma } from '@prisma/client'

import { generateUUID, PrismaAction, PrismaQuery } from '@/shared'
import type { PageRequestModel, ServiceOptions } from '@/types'

import type { SettingsInputModel } from './settings.models'

export const getSettings = async (pageModel: PageRequestModel) => {
  const { pageNum, pageSize } = pageModel

  const settings = await PrismaQuery.setting.findMany({
    where: {
      ...PrismaAction.notDeleted()
    },
    skip: (pageNum - 1) * pageSize,
    take: pageSize
  })

  const total = await PrismaQuery.setting.count({
    where: {
      ...PrismaAction.notDeleted()
    }
  })

  return {
    settings,
    total,
    ...pageModel
  }
}

export const getSettingByKey = async (key: string) =>
  PrismaQuery.setting.findFirst({
    where: {
      key,
      ...PrismaAction.notDeleted()
    }
  })

export const getSettingsByKeys = async (keys: string[]) =>
  PrismaQuery.setting.findMany({
    where: {
      key: {
        in: keys
      },
      ...PrismaAction.notDeleted()
    }
  })

export const createSetting = async (setting: SettingsInputModel, options?: ServiceOptions) => {
  const { request } = options || {}
  const currentUsername = request?.currentUser?.username
  return PrismaQuery.setting.create({
    data: {
      ...setting,
      uuid: generateUUID(),
      enabled: true,
      value: setting.value ?? Prisma.DbNull,
      createdBy: currentUsername
    }
  })
}

export const createSettings = async (settings: SettingsInputModel[], options?: ServiceOptions) => {
  const { request } = options || {}
  const currentUsername = request?.currentUser?.username
  return PrismaQuery.setting.createMany({
    data: settings.map((setting) => ({
      ...setting,
      uuid: generateUUID(),
      enabled: true,
      value: setting.value ?? Prisma.DbNull,
      createdBy: currentUsername
    }))
  })
}

export const updateSettingByKey = async (setting: SettingsInputModel, options?: ServiceOptions) => {
  const { key, value, description } = setting
  const { request } = options || {}
  const currentUsername = request?.currentUser?.username
  return PrismaQuery.setting.update({
    where: {
      key
    },
    data: {
      value: value ?? Prisma.DbNull,
      description,
      updatedBy: currentUsername
    }
  })
}

export const deleteSettingByKey = async (key: string, options?: ServiceOptions) => {
  const { request } = options || {}
  const currentUsername = request?.currentUser?.username
  return PrismaQuery.setting.update({
    where: {
      key
    },
    data: {
      updatedBy: currentUsername,
      deletedAt: new Date().toISOString(),
      deletedBy: currentUsername
    }
  })
}

export const banSettingByKey = async (key: string, options?: ServiceOptions) => {
  const { request } = options || {}
  const currentUsername = request?.currentUser?.username
  return PrismaQuery.setting.update({
    where: {
      key
    },
    data: {
      enabled: false,
      updatedBy: currentUsername
    }
  })
}

export const enableSettingByKey = async (key: string, options?: ServiceOptions) => {
  const { request } = options || {}
  const currentUsername = request?.currentUser?.username
  return PrismaQuery.setting.update({
    where: {
      key
    },
    data: {
      enabled: true,
      updatedBy: currentUsername
    }
  })
}
