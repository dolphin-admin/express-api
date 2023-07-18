import type { User } from '@prisma/client'

export type JWTModel = Pick<User, 'id' | 'username'>
