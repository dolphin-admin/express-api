import type { Setting } from '@prisma/pg'

export type SettingsInputModel = Pick<Setting, 'key' | 'value' | 'description'>
