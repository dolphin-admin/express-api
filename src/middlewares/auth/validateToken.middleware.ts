import type { NextFunction } from 'express'

import { JWTManager } from '@/core'
import { UsersService } from '@/services'
import type { BaseRequest, BaseResponse } from '@/types'

export const validateToken = async (request: BaseRequest, response: BaseResponse, next: NextFunction) => {
  const { authorization } = request.headers

  if (!authorization) {
    response.status(401).json({ message: 'Token not found!' })
    return
  }

  const verifiedResult = JWTManager.validateAccessToken(authorization)
  if (!verifiedResult) {
    response.status(401).json({ message: 'Invalid token!' })
    return
  }

  // Get current user info
  const userId = verifiedResult.id

  const user = await UsersService.getUserById(userId)

  if (user) {
    request.currentUser = user
  }

  next()
}
