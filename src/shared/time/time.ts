import dayjs from 'dayjs'

import type { TimeFormatter } from './time.type'

export const getCurrentTime = (formatter: TimeFormatter = 'YYYY-MM-DD HH:mm:ss') => dayjs(Date.now()).format(formatter)
