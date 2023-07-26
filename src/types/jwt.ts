import type { User } from '@prisma/pg'

export type JWTModel = Pick<User, 'id' | 'username'>
