import type { Request } from 'express'

import type { BaseResponse } from '@/types'

export const notFoundHandler = (request: Request, response: BaseResponse) => {
  const { t } = request

  response.status(404).json({
    code: 404,
    message: t('Router.NotExist')
  })
}
