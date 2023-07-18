import type { Setting } from '@prisma/client'

export type SettingsInputModel = Pick<Setting, 'key' | 'value' | 'description'>
