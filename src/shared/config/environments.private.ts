import dotenv from 'dotenv'

dotenv.config()

export const getEnvStr = (key: string, defaultValue: string): string => process.env[String(key)] || defaultValue

export const getEnvNumber = (key: string, defaultValue: number): number =>
  Number(process.env[String(key)]) || defaultValue
