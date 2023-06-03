import type { Request } from 'express'

import type { BaseResponse } from '@/types'

export const notFoundHandler = (request: Request, response: BaseResponse) => {
  response.status(404).json({
    code: 404,
    message: 'Not Found!'
  })
}
