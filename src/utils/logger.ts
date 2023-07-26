import chalk from 'chalk'

import { GlobalAppConfig } from './config'
import { getCurrentTime } from './time'

const chalkPrimary = chalk.green
const chalkError = chalk.red

export const LOG_PREFIX = `[${GlobalAppConfig.APP_NAME} - ${getCurrentTime('HH:mm:ss')}]`

/**
 * 打印 Primary 日志
 */
export const primaryLog = (log: string) => console.log(chalkPrimary(log))

/**
 * 批量打印日志
 */
export const batchLog = (logs: string[]) => logs.map((log) => console.log(log))

/**
 * 批量打印 Primary 日志
 */
export const batchPrimaryLog = (logs: string[]) => logs.map((log) => primaryLog(log))

/**
 * 打印错误日志
 */
export const errorLog = (log: string) => console.log(chalkError(log))
