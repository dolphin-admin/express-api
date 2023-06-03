import { chalkError, chalkPrimary } from './chalk.private'

export const primaryLog = (log: string) => console.log(chalkPrimary(log))

export const batchLog = (logs: string[]) => logs.map((log) => console.log(log))

export const batchPrimaryLog = (logs: string[]) => logs.map((log) => primaryLog(log))

export const errorLog = (log: string) => console.log(chalkError(log))
