import type { User } from '@prisma/client'

export type JWTUserModel = Pick<User, 'id' | 'username' | 'roles'>
