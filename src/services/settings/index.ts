import { Prisma } from '@prisma/client'

import type { SettingsInputModel } from '@/models'
import { generateUUID, prisma } from '@/shared'
import type { PageRequestModel, ServiceOptions } from '@/types'

class SettingsService {
  /**
   * 获取配置项列表
   */
  async getSettings(pageModel: PageRequestModel) {
    const { page, pageSize } = pageModel

    const settings = await prisma.setting.findMany({
      skip: (page - 1) * pageSize,
      take: pageSize
    })

    const total = await prisma.setting.count()

    return {
      settings,
      total,
      ...pageModel
    }
  }

  /**
   * 获取指定配置项
   */
  async getSettingByKey(key: string) {
    return prisma.setting.findFirst({
      where: {
        key
      }
    })
  }

  /**
   * 批量获取指定配置项
   */
  async getSettingsByKeys(keys: string[]) {
    return prisma.setting.findMany({
      where: {
        key: {
          in: keys
        }
      }
    })
  }

  /**
   * 创建配置项
   */
  async createSetting(setting: SettingsInputModel, options?: ServiceOptions) {
    const { currentUser } = options || {}
    return prisma.setting.create({
      data: {
        ...setting,
        enabled: true,
        value: setting.value ?? Prisma.DbNull,
        createdBy: currentUser?.id
      }
    })
  }

  /**
   * 批量创建配置项
   */
  async createSettings(settings: SettingsInputModel[], options?: ServiceOptions) {
    const { currentUser } = options || {}
    return prisma.setting.createMany({
      data: settings.map((setting) => ({
        ...setting,
        uuid: generateUUID(),
        enabled: true,
        value: setting.value ?? Prisma.DbNull,
        createdBy: currentUser?.id
      }))
    })
  }

  /**
   * 更新配置项
   */
  async updateSettingByKey(setting: SettingsInputModel, options?: ServiceOptions) {
    const { key, value, description } = setting
    const { currentUser } = options || {}
    return prisma.setting.update({
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

  /**
   * 删除配置项
   */
  async deleteSettingByKey(key: string, options?: ServiceOptions) {
    const { currentUser } = options || {}
    return prisma.setting.update({
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

  /**
   * 启用配置项
   */
  async enableSettingByKey(key: string, options?: ServiceOptions) {
    const { currentUser } = options || {}
    return prisma.setting.update({
      where: {
        key
      },
      data: {
        enabled: true,
        updatedBy: currentUser?.id
      }
    })
  }

  /**
   * 禁用配置项
   */
  async banSettingByKey(key: string, options?: ServiceOptions) {
    const { currentUser } = options || {}
    return prisma.setting.update({
      where: {
        key
      },
      data: {
        enabled: false,
        updatedBy: currentUser?.id
      }
    })
  }
}

export default new SettingsService()
