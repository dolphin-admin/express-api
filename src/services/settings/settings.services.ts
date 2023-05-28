import { Prisma } from '@prisma/client'

import { generateUUID, PrismaAction, PrismaQuery } from '@/shared'
import type { PageRequestModel } from '@/types'

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

export const createSetting = async (setting: SettingsInputModel) =>
  PrismaQuery.setting.create({
    data: {
      ...setting,
      uuid: generateUUID(),
      enabled: true,
      value: setting.value ?? Prisma.DbNull
    }
  })

export const createSettings = async (settings: SettingsInputModel[]) =>
  PrismaQuery.setting.createMany({
    data: settings.map((setting) => ({
      ...setting,
      uuid: generateUUID(),
      enabled: true,
      value: setting.value ?? Prisma.DbNull
    }))
  })

// TODO: Add updateBy
export const updateSettingByKey = async (setting: SettingsInputModel) => {
  const { key, value, description } = setting
  return PrismaQuery.setting.update({
    where: {
      key
    },
    data: {
      value: value ?? Prisma.DbNull,
      description,
      updatedAt: new Date().toISOString()
    }
  })
}

// TODO: Add deletedBy
export const deleteSettingByKey = async (key: string) =>
  PrismaQuery.setting.update({
    where: {
      key
    },
    data: {
      deletedAt: new Date().toISOString()
    }
  })

export const banSettingByKey = async (key: string) =>
  PrismaQuery.setting.update({
    where: {
      key
    },
    data: {
      enabled: false,
      updatedAt: new Date().toISOString()
    }
  })

export const enableSettingByKey = async (key: string) =>
  PrismaQuery.setting.update({
    where: {
      key
    },
    data: {
      enabled: true,
      updatedAt: new Date().toISOString()
    }
  })
