import chalk from 'chalk'
import type { Request, Response } from 'express'
import morgan from 'morgan'

import { LOG_PREFIX } from '@/shared'

const getColoredStatusText = (text: string | undefined, status: number | undefined) => {
  if (!text) {
    return ''
  }
  let coloredStatusText = text
  if (!status) {
    coloredStatusText = chalk.white(status)
  } else if (status >= 500) {
    coloredStatusText = chalk.red(status)
  } else if (status >= 400) {
    coloredStatusText = chalk.yellow(status)
  } else if (status >= 300) {
    coloredStatusText = chalk.cyan(status)
  } else if (status >= 200) {
    coloredStatusText = chalk.green(status)
  }
  return coloredStatusText
}

export const morganLogger = morgan((tokens, req: Request, res: Response) => {
  const status = (typeof res.headersSent !== 'boolean' ? Boolean(res.header) : res.headersSent)
    ? res.statusCode
    : undefined

  return [
    LOG_PREFIX,
    tokens.method(req, res),
    tokens.url(req, res),
    getColoredStatusText(tokens.status(req, res), status),
    tokens.res(req, res, 'content-length'),
    '-',
    tokens['response-time'](req, res),
    'ms'
  ].join(' ')
})
