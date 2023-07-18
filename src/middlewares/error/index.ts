import type { Request } from 'express'

import type { BaseResponse } from '@/types'

/**
 * 404 错误处理
 */
export const notFoundHandler = (request: Request, response: BaseResponse) => {
  const { t } = request

  response.status(404).json({
    code: 404,
    message: t('Router.NotExist')
  })
}

/**
 * 500 错误处理
 */
export const internalServerErrorHandler = (error: any, _: Request, response: BaseResponse) => {
  console.error(error.stack)
  response.status(500).json({
    code: 500,
    message: 'Server Error!'
  })
}
