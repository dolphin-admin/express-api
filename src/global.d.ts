import type { User } from '@/prisma/generated/pg'
import type { Lang, MessageSchema } from '@/types'

declare global {
  namespace Express {
    interface Request {
      currentUser: User
      lang: Lang
      t(key: MessageSchema, lang?: Lang): string
    }
  }
}
