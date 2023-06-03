import type { Request } from 'express'

import type { BaseResponse } from '@/types'

export const internalServerErrorHandler = (error: any, request: Request, response: BaseResponse) => {
  console.error(error.stack)
  response.status(500).json({
    code: 500,
    message: 'Server Error!'
  })
}
