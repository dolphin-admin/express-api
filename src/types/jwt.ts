import type { User } from '@/prisma/generated/pg'

export type JWTModel = Pick<User, 'id' | 'username'>
