import { compare, hash } from '@node-rs/bcrypt'

export const passwordHash = async (password: string) => hash(password, 10)

export const passwordEquals = async (password: string, hashedPassword: string) => compare(password, hashedPassword)
