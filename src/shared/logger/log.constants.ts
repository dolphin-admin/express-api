import { GlobalAppConfig } from '../config'
import { getCurrentTime } from '../time'

export const LOG_PREFIX = `[${GlobalAppConfig.APP_NAME} - ${getCurrentTime('HH:mm:ss')}]`
