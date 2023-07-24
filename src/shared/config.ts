import type { ENV } from '@/types'

import {
  getAppDescription,
  getAppName,
  getAppVersion,
  getAuthorInfo,
  getEnvBoolean,
  getEnvNumber,
  getEnvStr
} from './env'

/**
 * 全局配置
 */
export const GlobalConfig = Object.freeze({
  ENVIRONMENT: <ENV>getEnvStr('NODE_ENV', 'development'),
  IS_TEST: getEnvStr('NODE_ENV', 'development') === 'test',
  IS_DEVELOPMENT: getEnvStr('NODE_ENV', 'development') === 'development',
  IS_PRODUCTION: getEnvStr('NODE_ENV', 'development') === 'production',
  HTTP_PORT: getEnvNumber('HTTP_PORT', 3000),
  HTTPS_PORT: getEnvNumber('HTTPS_PORT', 3001)
})

/**
 * 全局开发配置
 */
export const GlobalDevConfig = Object.freeze({
  DEV_SHOW_LOG: getEnvBoolean('DEV_SHOW_LOG')
})

/**
 * 全局应用配置
 */
export const GlobalAppConfig = Object.freeze({
  APP_NAME: getEnvStr('APP_NAME', getAppName()),
  APP_VERSION: getAppVersion(),
  APP_AUTHOR: getAuthorInfo(),
  APP_DESCRIPTION: getAppDescription(),
  APP_BASE_URL: getEnvStr('APP_BASE_URL', 'http://localhost:3000')
})

/**
 * 全局 JWT 配置
 */
export const GlobalJWTConfig = Object.freeze({
  JWT_SECRET: getEnvStr('JWT_SECRET', 'jwtSecretPassphrase'),
  JWT_EXPIRATION: getEnvNumber('JWT_EXPIRATION', 1),
  JWT_REFRESH_EXPIRATION: getEnvNumber('JWT_REFRESH_EXPIRATION', 7)
})

/**
 * 全局数据库配置
 */
export const GlobalDBConfig = Object.freeze({
  PG_DB_USER: getEnvStr('PG_DB_USER', 'mars-user'),
  PG_DB_PASSWORD: getEnvStr('PG_DB_PASSWORD', 'est-password'),
  PG_DB_HOST: getEnvStr('PG_DB_HOST', 'localhost'),
  PG_DB_PORT: getEnvNumber('PG_DB_PORT', 5432),
  PG_DB_NAME: getEnvStr('PG_DB_NAME', 'est-db'),
  PG_DB_URL: getEnvStr('PG_DB_URL', 'postgresql://mars-user:mars-password@localhost:5432/dolphin-admin')
})

/**
 * 全局 OAuth2 配置
 */
export const GlobalAuthConfig = Object.freeze({
  GITHUB_CLIENT_ID: getEnvStr('GITHUB_CLIENT_ID', ''),
  GITHUB_CLIENT_SECRET: getEnvStr('GITHUB_CLIENT_SECRET', ''),
  GOOGLE_CLIENT_ID: getEnvStr('GOOGLE_CLIENT_ID', ''),
  GOOGLE_CLIENT_SECRET: getEnvStr('GOOGLE_CLIENT_SECRET', ''),
  GOOGLE_CLIENT_REDIRECT_URL: getEnvStr('GOOGLE_CLIENT_REDIRECT_URL', '')
})

/**
 * 全局文件存储配置
 */
export const GlobalFileStorageConfig = Object.freeze({
  FILE_STORAGE_PATH: getEnvStr('FILE_STORAGE_PATH', 'storage')
})
