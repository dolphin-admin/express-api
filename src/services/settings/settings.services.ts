import { Prisma } from '@prisma/client'

import { generateUUID, PrismaAction, PrismaQuery } from '@/shared'
import type { PageRequestModel, ServiceOptions } from '@/types'

import type { SettingsInputModel } from './settings.models'

export const getSettings = async (pageModel: PageRequestModel) => {
  const { pageCount, pageSize } = pageModel

  const settings = await PrismaQuery.setting.findMany({
    where: {
      ...PrismaAction.notDeleted()
    },
    skip: (pageCount - 1) * pageSize,
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
  const currentUser = request?.currentUser
  return PrismaQuery.setting.create({
    data: {
      ...setting,
      enabled: true,
      value: setting.value ?? Prisma.DbNull,
      createdBy: currentUser?.id
    }
  })
}

export const createSettings = async (settings: SettingsInputModel[], options?: ServiceOptions) => {
  const { request } = options || {}
  const currentUser = request?.currentUser
  return PrismaQuery.setting.createMany({
    data: settings.map((setting) => ({
      ...setting,
      uuid: generateUUID(),
      enabled: true,
      value: setting.value ?? Prisma.DbNull,
      createdBy: currentUser?.id
    }))
  })
}

export const updateSettingByKey = async (setting: SettingsInputModel, options?: ServiceOptions) => {
  const { key, value, description } = setting
  const { request } = options || {}
  const currentUser = request?.currentUser
  return PrismaQuery.setting.update({
    where: {
      key
    },
    data: {
      value: value ?? Prisma.DbNull,
      description,
      updatedBy: currentUser?.id
    }
  })
}

export const deleteSettingByKey = async (key: string, options?: ServiceOptions) => {
  const { request } = options || {}
  const currentUser = request?.currentUser
  return PrismaQuery.setting.update({
    where: {
      key
    },
    data: {
      updatedBy: currentUser?.id,
      deletedAt: new Date().toISOString(),
      deletedBy: currentUser?.id
    }
  })
}

export const banSettingByKey = async (key: string, options?: ServiceOptions) => {
  const { request } = options || {}
  const currentUser = request?.currentUser
  return PrismaQuery.setting.update({
    where: {
      key
    },
    data: {
      enabled: false,
      updatedBy: currentUser?.id
    }
  })
}

export const enableSettingByKey = async (key: string, options?: ServiceOptions) => {
  const { request } = options || {}
  const currentUser = request?.currentUser
  return PrismaQuery.setting.update({
    where: {
      key
    },
    data: {
      enabled: true,
      updatedBy: currentUser?.id
    }
  })
}
