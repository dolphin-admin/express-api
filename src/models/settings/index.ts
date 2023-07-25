import type { Setting } from '@/prisma/generated/pg'

export type SettingsInputModel = Pick<Setting, 'key' | 'value' | 'description'>
